# 좌석 예매 시스템 아키텍처

## 이 문서는 무엇인가요?

비트코인 코리아 컨퍼런스 웹사이트에 **좌석 예매 + 결제 시스템**을 구축하는 전체 설계도입니다.
현재 좌석 선택 화면(UI)은 만들어져 있지만, 실제로 좌석을 "예약"하거나 "결제"하는 기능은 아직 없습니다.

### 현재 완성된 것

| 구분 | 상태 | 설명 |
|------|------|------|
| 좌석 배치도 UI | ✅ 완성 | 섹션 선택(ZoneSelector), 좌석 선택(SeatSelector) 화면 |
| 애프터파티 애드온 UI | ✅ 완성 | Premium/General 티켓에 애프터파티 옵션 선택 가능 |
| 가격 계산 UI | ✅ 완성 | 얼리버드 할인, 합계 표시(SelectionSummary) |
| 좌석 잠금/예약 시스템 | ❌ 미구현 | "결제하기" 버튼이 console.log만 실행 |
| 결제 연동 | ❌ 미구현 | Shopify 결제 페이지로의 연결 없음 |
| 실시간 좌석 상태 | ❌ 미구현 | 다른 사람이 잡은 좌석이 화면에 반영 안 됨 |

---

## 1. 왜 별도 시스템이 필요한가?

### 문제 상황

> 1,039석 규모 행사에 수천 명이 동시에 접속해서 좌석을 고릅니다.
> A와 B가 동시에 같은 좌석을 클릭하면 어떻게 되나요?

일반적인 웹사이트처럼 "클릭 → 결제"만 하면 **같은 좌석이 두 번 팔리는 사고**가 발생합니다.
이를 방지하려면 "누가 먼저 클릭했는지"를 0.001초 단위로 판별하는 시스템이 필요합니다.

### 해결 방법: "임시 잠금" 방식

영화관 예매와 같은 방식입니다:

1. 좌석을 고르고 "결제하기"를 누르면 → 해당 좌석이 **7분간 임시로 잠깁니다**
2. 잠긴 동안 다른 사람은 그 좌석을 선택할 수 없습니다
3. 7분 안에 결제하면 → 좌석이 **확정** 됩니다
4. 7분이 지나면 → 잠금이 **자동 해제**되어 다른 사람이 선택할 수 있습니다

---

## 2. 전체 구조

```
사용자 브라우저
    ↕ (API 요청)
우리 서버 (Next.js, Vercel에서 운영)
    ↕                    ↕
Redis (좌석 상태 관리)    Shopify (결제 처리)
```

세 가지 역할이 명확히 분리됩니다:

| 역할 | 담당 | 비유 |
|------|------|------|
| **좌석 상태 관리** | Redis | 극장 안내원 — "이 좌석 비었나요?" 물어보면 즉시 답변 |
| **결제 처리** | Shopify | 매표소 — 돈을 받고 티켓을 발행 |
| **중간 연결** | 우리 서버 | 총괄 매니저 — 안내원과 매표소 사이에서 조율 |

---

## 3. 사용하는 기술과 선택 이유

### Redis (Upstash)

**정의**: 데이터를 메모리(RAM)에 저장하는 초고속 데이터베이스입니다.
일반 데이터베이스가 도서관이라면, Redis는 포스트잇 메모판 — 읽고 쓰는 데 0.001초면 충분합니다.

**왜 사용하나요?**

- **속도**: 수천 명이 동시에 "이 좌석 비었나요?" 물어봐도 밀리초 안에 응답
- **원자적 연산(SETNX)**: "이 좌석이 비어있으면 내 것으로 잡아줘"를 **한 번의 명령**으로 처리. 두 사람이 동시에 요청해도 Redis가 알아서 한 명만 성공시킵니다.
  - 원자적(Atomic)이란? → 중간에 끼어들 수 없는 작업. "확인 → 잠금"이 하나의 동작으로 일어나서 틈이 없습니다.
- **Lua 스크립트**: 여러 좌석을 한 번에 잠글 때 사용합니다. "3개 좌석 전부 비었으면 한꺼번에 잠그고, 하나라도 이미 잡혔으면 전부 취소해줘"를 한 번의 명령으로 처리합니다.
  - Lua 스크립트란? → Redis 안에서 실행되는 작은 프로그램. 여러 단계를 하나의 원자적 작업으로 묶어줍니다.
- **TTL (자동 만료)**: "7분 후 자동 삭제" 기능이 내장. 결제를 안 하고 나간 사용자의 좌석을 시스템이 자동으로 풀어줍니다.
- **Upstash**: Redis를 서버 없이(서버리스) 사용할 수 있게 해주는 클라우드 서비스. 도쿄 리전(`ap-northeast-1`)이 한국에서 가장 가까운 리전입니다 (약 30~50ms 지연).

### Shopify Storefront API

**정의**: Shopify 쇼핑몰의 장바구니와 결제 기능을 외부에서 사용할 수 있게 해주는 인터페이스입니다.

**왜 사용하나요?**

- **PG(결제 대행) 직접 연동 불필요**: 카드 결제, 환불, 영수증 등을 Shopify가 모두 처리
- **보안**: 카드 정보를 우리 서버에 저장할 필요 없음 (PCI DSS 규정 자동 충족)
- **검증된 시스템**: 전 세계 수백만 쇼핑몰이 사용하는 안정적인 결제 시스템

**Shopify의 역할은 "결제만"입니다.** 좌석이 비었는지, 누가 잡았는지는 모릅니다.
"결제가 완료됐다"는 사실만 우리 서버에 알려줍니다(Webhook).

### Next.js API Routes (우리 서버)

**정의**: 웹사이트 내부에 만드는 작은 서버 프로그램. 별도의 백엔드 서버를 운영하지 않아도 됩니다.

**왜 사용하나요?**

- 현재 웹사이트가 이미 Next.js로 만들어져 있어서 추가 서버 불필요
- Vercel(호스팅 서비스)에서 자동으로 접속자 수에 따라 확장 (서버리스)
- 브라우저 → Redis, 브라우저 → Shopify를 직접 연결하지 않고, 서버를 거치는 이유:
  - Redis/Shopify 비밀 키를 브라우저에 노출하면 안 되기 때문

### 폴링 (3초 간격, 섹션 단위)

**정의**: 브라우저가 3초마다 서버에 "이 섹션 좌석 상태 변했나요?"하고 물어보는 방식입니다.

**왜 사용하나요?**

- 실시간 통신(WebSocket, SSE) 대비 구현이 단순하고 서버리스 환경에서 안정적
- 3초면 충분히 빠름 — 다른 사람이 좌석을 잡으면 최대 3초 내 화면에 반영

**왜 섹션 단위인가요?**

- 전체 1,039석을 3초마다 매번 가져오면 낭비
- 사용자가 현재 보고 있는 섹션(예: "A 섹션")의 좌석만 가져오면 효율적
- 예) A 섹션을 보고 있으면 A 섹션의 95석 상태만 요청

---

## 4. Shopify 상품 구성

Shopify에 **3개 상품**을 등록합니다. **재고 관리는 Shopify에서 하지 않습니다** (Redis가 관리).

애프터파티는 별도 상품이 아니라 **각 티켓의 옵션(Variant)**으로 만듭니다.

| 상품명 | Variant | Early Bird 1 가격 | 정가 |
|--------|---------|-------------------|------|
| VIP Ticket | (단일 — 애프터파티 기본 포함) | ₩2,400,000 | ₩3,000,000 |
| Premium Ticket | Without After Party | ₩264,000 | ₩330,000 |
| Premium Ticket | With After Party | ₩314,000 | ₩380,000 |
| General Ticket | Without After Party | ₩168,000 | ₩210,000 |
| General Ticket | With After Party | ₩218,000 | ₩260,000 |

**왜 별도 상품이 아니라 옵션(Variant)인가요?**

별도 상품으로 만들면 장바구니에 "Premium Ticket × 2, After Party × 1"처럼 분리되어,
어떤 좌석이 애프터파티인지 주문 내역에서 바로 알 수 없습니다.

Variant 방식이면 **한 줄 = 한 좌석**이 되어 명확합니다:
```
Premium Ticket (With After Party)      × 1    ₩314,000   seat: A-5
Premium Ticket (Without After Party)   × 2    ₩528,000   seat: A-6, A-7
```

- 주문 관리가 쉬움 (좌석과 애프터파티 여부가 한눈에 보임)
- 코드에서 장바구니 생성 시 Variant ID만 바꾸면 됨
- 상품 3개로 관리가 단순

좌석 정보는 장바구니에 메모처럼 첨부됩니다:
예) `seat: "C-1"` → "C 섹션 1번 좌석"

---

## 5. 좌석 상태 구분

좌석은 항상 아래 세 가지 중 하나의 상태입니다:

| 상태 | 의미 | 화면 표시 |
|------|------|----------|
| **available** (사용 가능) | 아무도 선택하지 않은 좌석 | 일반 색상, 클릭 가능 |
| **held** (임시 잠금) | 누군가 결제 중인 좌석 (7분 제한) | 회색 처리, 클릭 불가 |
| **sold** (판매 완료) | 결제 완료된 좌석 | 회색 + X 표시, 영구 비활성 |

---

## 6. 예매 흐름 (사용자 시점)

```
① 좌석 선택 화면 입장
   ↓
   화면에 빈 좌석 / 잠긴 좌석 / 판매된 좌석이 표시됨
   (3초마다 자동 갱신 — 현재 보고 있는 섹션만)
   ↓
② 섹션을 선택하고, 원하는 좌석을 클릭 (여러 개 가능)
   ↓
   이 단계에서는 서버에 요청하지 않음 — 화면에서만 선택 표시
   ↓
③ (Premium/General만) 좌석별로 애프터파티 참가 여부 선택
   ↓
④ "결제하기" 버튼 클릭
   ↓
   서버에 "이 좌석들을 잡아주세요" 요청
   ↓
   ┌─ 성공: 좌석 7분간 잠금 → ⑤로 이동
   └─ 실패: "이미 다른 분이 선택한 좌석입니다" 안내
   ↓
⑤ Shopify 결제 페이지로 이동 (7분 타이머 시작)
   ↓
   장바구니에 티켓 + 애프터파티(선택된 경우) 포함
   ↓
   ┌─ 결제 완료: 좌석이 "판매 완료"로 확정
   └─ 결제 포기/시간 초과: 7분 후 좌석 자동 해제
```

---

## 7. 동시성 제어 — 같은 좌석 충돌 방지

### 시나리오: A와 B가 동시에 C-1 좌석을 선택

```
A: "C-1 잡아주세요"          B: "C-1 잡아주세요"
    ↓                           ↓
Redis: C-1 비었음 → A에게 OK   Redis: C-1 이미 잡힘 → B에게 거절
    ↓                           ↓
A: 결제 페이지로 이동          B: "이미 선택된 좌석입니다" 표시
```

이것이 가능한 이유:
- Redis의 SETNX 명령은 **"값이 없을 때만 저장"**을 보장합니다
- 두 요청이 0.001초 차이로 도착해도, Redis가 순서를 정해서 먼저 온 사람만 성공시킵니다
- 여러 좌석을 한꺼번에 선택한 경우, **Lua 스크립트**가 전체를 하나의 작업으로 처리합니다. 하나라도 실패하면 **전부 취소** (부분 예매 방지)

### 좌석 수 제한

한 사람이 좌석을 독점하지 못하도록 제한을 둡니다:

| 티켓 종류 | 한 번에 최대 hold 가능 좌석 수 | 이유 |
|-----------|-------------------------------|------|
| VIP | 4석 | VIP 좌석이 전체 21석뿐이므로 엄격하게 제한 |
| Premium / General | 10석 | 단체 참가도 허용하되, 과도한 독점 방지 |

이 제한은 서버 API(hold 요청 시)에서 검증합니다. 브라우저에서만 제한하면 우회 가능하기 때문입니다.

---

## 8. 데이터 저장 구조 (Redis)

Redis에 저장되는 정보는 **3종류**입니다:

| 키 형태 | 저장 내용 | 자동 삭제 | 비유 |
|---------|----------|----------|------|
| `seat:{섹션}:{번호}` | 좌석 상태 (held/sold, 누가, 언제, 애프터파티 여부) | held: 7분 후 삭제 / sold: 삭제 안 됨 | 좌석에 붙인 "예약됨" 스티커 |
| `holds:{세션ID}` | 해당 사용자가 잡은 좌석 목록 | 7분 후 삭제 | 사용자의 예매 메모장 |
| `checkout:{장바구니ID}` | 결제 중인 좌석과 사용자 연결 정보 | 30분 후 삭제 | 매표소 대기표 |

**예시) `seat:A:5` 키에 저장되는 정보:**
```json
{
  "status": "held",
  "sessionId": "abc123",
  "heldAt": "2026-03-01T10:00:00Z",
  "tier": "premium",
  "afterParty": true
}
```

### 왜 기존 문서의 `lock:seat:*` 키를 제거했나요?

기존 설계에서는 `lock:seat:C:1` (5초 TTL)이라는 별도의 "충돌 방지 잠금" 키가 있었습니다.
하지만 Redis의 SETNX 명령 자체가 이미 원자적(한 번에 하나만 성공)이고,
여러 좌석을 동시에 잠그는 경우에는 Lua 스크립트가 원자성을 보장하므로,
별도 lock 키 없이도 충돌이 완벽히 방지됩니다.
키가 적을수록 시스템이 단순하고 관리하기 쉽습니다.

---

## 9. API 목록 (서버 끝점)

우리 서버가 제공하는 기능 5개:

| 기능 | 경로 | 설명 |
|------|------|------|
| 좌석 상태 조회 | `GET /api/seats/status?section=A` | "A 섹션 좌석들 상태 알려줘" (섹션 단위로 조회) |
| 좌석 임시 잠금 | `POST /api/seats/hold` | "이 좌석들 7분간 잡아줘" (좌석 목록 + 애프터파티 정보 포함) |
| 잠금 해제 | `POST /api/seats/release` | "잡아둔 좌석 취소할게" |
| 결제 생성 | `POST /api/checkout/create` | "Shopify 결제 페이지 만들어줘" (티켓 + 애프터파티 장바구니 생성) |
| 결제 완료 수신 | `POST /api/webhooks/shopify` | Shopify가 "결제 완료됐어" 알림 |

### 각 API 상세

**좌석 상태 조회** `GET /api/seats/status?section=A`
- 지정한 섹션의 모든 좌석 상태를 반환합니다
- 브라우저가 3초마다 호출해서 화면을 갱신합니다
- 섹션을 지정하는 이유: 전체 1,039석을 매번 조회하면 낭비이므로, 현재 보고 있는 섹션만

**좌석 임시 잠금** `POST /api/seats/hold`
- 요청 예시: `{ sessionId: "abc123", seats: [{section: "A", seat: 5, afterParty: true}, ...] }`
- 모든 좌석이 비었으면 → 7분간 잠금, 성공 응답
- 하나라도 이미 잡혀있으면 → 전부 실패, 어떤 좌석이 문제인지 알려줌
- 좌석 수 제한도 여기서 검증 (VIP 최대 4석, 일반 최대 10석)

**잠금 해제** `POST /api/seats/release`
- 요청 예시: `{ sessionId: "abc123" }`
- 해당 사용자가 잡은 모든 좌석을 즉시 해제합니다
- 사용자가 "다시 선택할게요"를 눌렀을 때 호출

**결제 생성** `POST /api/checkout/create`
- 요청 예시: `{ sessionId: "abc123" }`
- 동작 순서:
  1. Redis에서 해당 사용자의 hold 좌석 확인
  2. Shopify 장바구니 생성 (티켓 상품 + 애프터파티 애드온)
  3. Shopify 결제 페이지 URL 반환
- 장바구니 ID를 Redis에 저장 (나중에 결제 완료 시 좌석과 연결하기 위해)

**결제 완료 수신** `POST /api/webhooks/shopify`
- Shopify가 결제 완료 시 자동으로 호출하는 알림
- HMAC 서명 검증으로 위조된 요청 차단
  - HMAC이란? → Shopify가 비밀 키로 만든 "전자 서명". 이걸로 진짜 Shopify가 보낸 건지 확인합니다.
- 장바구니 ID로 Redis에서 좌석 정보를 찾아 → 상태를 "sold"(판매 완료)로 변경

---

## 10. 만들거나 수정하는 파일 목록

### 새로 만드는 파일

**서버 (백엔드)**

| 파일 | 역할 |
|------|------|
| `lib/redis.ts` | Redis 연결 설정 (Upstash 클라이언트 초기화) |
| `lib/seat-lock.ts` | 좌석 잠금/해제/판매 확정 핵심 로직 (Lua 스크립트 포함) |
| `lib/shopify.ts` | Shopify 장바구니 생성/결제 URL 획득 로직 |
| `lib/shopify-config.ts` | Shopify 상품 ID ↔ 티켓 티어 매핑 테이블 |
| `app/api/seats/status/route.ts` | 좌석 상태 조회 API |
| `app/api/seats/hold/route.ts` | 좌석 잠금 API |
| `app/api/seats/release/route.ts` | 잠금 해제 API |
| `app/api/checkout/create/route.ts` | 결제 생성 API |
| `app/api/webhooks/shopify/route.ts` | Shopify 결제 완료 알림 수신 |

**클라이언트 (프론트엔드)**

| 파일 | 역할 |
|------|------|
| `hooks/useSeatAvailability.ts` | 3초마다 현재 섹션의 좌석 상태를 자동으로 가져오는 기능 |
| `hooks/useSessionId.ts` | 사용자 식별 ID 생성/저장 (새로고침해도 유지) |
| `hooks/useHoldTimer.ts` | 7분 카운트다운 타이머 |

### 수정하는 파일

| 파일 | 변경 내용 |
|------|----------|
| `_types/seats.ts` | `SeatStatus` 타입 추가 (available/held/sold, 기존 타입은 유지) |
| `PurchaseFlow.tsx` | 잠금 요청 + 결제 단계 추가, 세션/타이머 연동, 에러 처리 |
| `SeatSelector.tsx` | 실시간 좌석 상태 반영, 잠긴/판매된 좌석 비활성화 |
| `SelectionSummary.tsx` | "결제하기" 버튼이 hold → checkout 흐름 실행, 남은 시간 타이머 표시 |

---

## 11. 예외 상황 대비

| 상황 | 대응 |
|------|------|
| **잠금 시간(7분)이 지난 후 결제가 완료됨** | Shopify 결제 완료 알림이 오면 Redis 확인 → 좌석이 아직 비어있으면 자동으로 sold 처리 → 이미 다른 사람이 잡았으면 Shopify 환불 API 호출 + 관리자에게 알림 |
| **Shopify 결제 완료 알림이 안 옴** | 5분마다 자동으로 Shopify 주문을 확인해서 Redis와 동기화 |
| **Redis 서버 장애** | "서비스 일시 중단" 메시지 표시, 결제 불가 처리 |
| **사용자가 새로고침함** | 사용자 ID가 브라우저에 저장되어 있어서, 돌아왔을 때 잠금 상태 복원 |
| **봇이 좌석을 독점 시도** | 세션당 최대 hold 좌석 수 제한 (VIP 4석, 일반 10석). 이미 hold 중인 좌석이 있으면 추가 hold 불가 — 기존 hold를 해제하고 다시 선택해야 함 |
| **Shopify webhook이 중복 도착** | 같은 주문 ID의 webhook은 한 번만 처리 (멱등성 보장). 멱등성이란? → 같은 요청을 여러 번 보내도 결과가 한 번만 적용되는 것 |

---

## 12. 필요한 환경 변수

서비스 연동에 필요한 비밀 키들 (`.env` 파일에 저장):

```
# Redis (Upstash) — 좌석 상태 관리용
UPSTASH_REDIS_REST_URL=       # Redis 서버 주소
UPSTASH_REDIS_REST_TOKEN=     # Redis 접속 비밀 키

# Shopify — 결제 처리용 (도메인과 토큰은 이미 존재)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=bitcoin-korea-conference.myshopify.com  # (기존)
SHOPIFY_STOREFRONT_ACCESS_TOKEN=52de09f...                               # (기존)
SHOPIFY_WEBHOOK_SECRET=       # Shopify 결제 알림 검증용 비밀 키 (신규)
```

---

## 13. 코드 구현 순서

### Phase 1: 인프라 설정
Redis 연결, 환경 변수 확인, 좌석 상태 타입 추가

### Phase 2: 좌석 잠금 시스템
좌석 잠금/해제/상태조회 API 3개 + Lua 스크립트

### Phase 3: Shopify 결제 연동
Shopify 상품 ID 매핑, 장바구니 생성 API (티켓 + 애프터파티 애드온)

### Phase 4: 결제 완료 처리
Shopify webhook 수신, HMAC 검증, 좌석 판매 확정

### Phase 5: 화면 통합
실시간 좌석 상태 폴링, 잠금/타이머/결제 흐름 UI 연결

### Phase 6: 안전 강화
좌석 수 제한 검증, webhook 멱등성, 에러 시 사용자 안내 UI

---

## 14. 사전 준비 체크리스트 (코드 작성 전에 해야 할 일)

코드를 쓰기 전에 외부 서비스 설정이 먼저 필요합니다.

### ☐ 1. Upstash Redis 데이터베이스 생성

**왜?** 좌석 상태(빈 좌석 / 잠긴 좌석 / 판매된 좌석)를 저장하고, 동시 접속자 간 충돌을 방지하는 핵심 저장소입니다.

**어떻게?**
1. [Upstash Console](https://console.upstash.com) 접속
2. 새 Redis 데이터베이스 생성
   - **이름**: `bitcoin-conf-seats` (원하는 이름)
   - **리전**: `ap-northeast-1` (도쿄) — 한국에서 가장 가까운 리전입니다 (서울 리전은 Upstash에 없음)
   - **플랜**: Free 플랜으로 시작 가능 (일 10,000 요청)
3. 생성 후 **REST API** 탭에서:
   - `UPSTASH_REDIS_REST_URL` 복사
   - `UPSTASH_REDIS_REST_TOKEN` 복사
4. `.env` 파일에 추가:
   ```
   UPSTASH_REDIS_REST_URL=https://apn2-...upstash.io
   UPSTASH_REDIS_REST_TOKEN=AXxx...
   ```

### ☐ 2. Shopify 상품 3개 등록 (Variant 포함)

**왜?** 결제 시 장바구니에 담을 상품이 Shopify에 존재해야 합니다.
재고 관리는 Redis가 하므로, Shopify에서는 재고 추적을 끕니다.

**어떻게?**
1. [Shopify Admin](https://bitcoin-korea-conference.myshopify.com/admin) 접속
2. Products → Add product 로 3개 상품 생성:

**VIP Ticket** (Variant 없음)
| 가격 | 재고 추적 | 비고 |
|------|-----------|------|
| ₩2,400,000 | OFF | 애프터파티 기본 포함 |

**Premium Ticket** (옵션 추가: "After Party" → Yes / No)
| Variant | 가격 | 재고 추적 |
|---------|------|-----------|
| Without After Party | ₩264,000 | OFF |
| With After Party | ₩314,000 | OFF |

**General Ticket** (옵션 추가: "After Party" → Yes / No)
| Variant | 가격 | 재고 추적 |
|---------|------|-----------|
| Without After Party | ₩168,000 | OFF |
| With After Party | ₩218,000 | OFF |

3. 각 **Variant**의 **Storefront API Variant ID** 기록
   - Shopify Admin → 상품 상세 → 각 Variant의 ID 확인
   - 형태: `gid://shopify/ProductVariant/1234567890`
   - 총 5개 ID: VIP 1개 + Premium 2개 + General 2개
4. 이 ID들을 나중에 `lib/shopify-config.ts`에서 사용합니다

### ☐ 3. Shopify Webhook 설정

**왜?** 사용자가 Shopify에서 결제를 완료하면, Shopify가 "결제 완료됐어"라고 우리 서버에 자동으로 알려줘야 합니다.
이 알림이 와야 좌석 상태를 "판매 완료"로 바꿀 수 있습니다.

**어떻게?**
1. Shopify Admin → Settings → Notifications → Webhooks
2. "Create webhook" 클릭:
   - **Event**: `Order payment` (주문 결제 완료)
   - **Format**: JSON
   - **URL**: `https://{실제 도메인}/api/webhooks/shopify`
     - 개발 중에는 ngrok 등 터널링 도구로 로컬 테스트 가능
3. **Webhook signing secret** 복사
4. `.env` 파일에 추가:
   ```
   SHOPIFY_WEBHOOK_SECRET=whsec_...
   ```

### ☐ 4. 환경 변수 최종 확인

`.env` 파일에 아래가 모두 있는지 확인:

```env
# === Redis (신규 추가) ===
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=AX...

# === Shopify (기존 + 신규) ===
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=bitcoin-korea-conference.myshopify.com  # 기존
SHOPIFY_STOREFRONT_ACCESS_TOKEN=52de09f...                               # 기존
SHOPIFY_WEBHOOK_SECRET=whsec_...                                         # 신규
```

### ☐ 5. npm 패키지 설치

```bash
pnpm add @upstash/redis
```

**왜?** Upstash Redis와 통신하기 위한 공식 라이브러리입니다. Vercel 서버리스 환경에 최적화되어 있습니다.

---

## 15. 검증 체크리스트

- [ ] 두 브라우저에서 동시에 같은 좌석 선택 → 한 쪽만 성공, 다른 쪽은 "이미 선택됨" 표시
- [ ] 잠금 후 7분 대기 → 좌석 자동 해제 확인
- [ ] Shopify 결제 완료 → 좌석이 "판매 완료"로 전환 확인
- [ ] 판매 완료된 좌석이 화면에서 선택 불가 표시 확인
- [ ] 새로고침 후 잠금 상태가 유지되는지 확인
- [ ] VIP 5석 이상 선택 시도 → 서버에서 거부 확인
- [ ] 애프터파티 애드온 선택 → Shopify 장바구니에 정확히 반영 확인
- [ ] Shopify webhook 중복 수신 → 좌석 상태가 한 번만 변경되는지 확인
