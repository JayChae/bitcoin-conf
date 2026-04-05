# 좌석 예매 시스템 아키텍처

비트코인 코리아 컨퍼런스 웹사이트의 **좌석 예매 + 결제 시스템** 전체 설계를 설명하는 문서입니다.
좌석 선택 UI, Redis 기반 임시 잠금, Shopify 결제 연동, 실시간 좌석 상태 폴링까지 전체 흐름을 다룹니다.

---

## 1. 왜 별도 시스템이 필요한가?

### 문제 상황

> 1,039석 규모 행사에 수천 명이 동시에 접속해서 좌석을 고릅니다.
> A와 B가 동시에 같은 좌석을 클릭하면 어떻게 되나요?

일반적인 웹사이트처럼 "클릭 → 결제"만 하면 **같은 좌석이 두 번 팔리는 사고**가 발생합니다.
이를 방지하려면 "누가 먼저 클릭했는지"를 0.001초 단위로 판별하는 시스템이 필요합니다.

### 해결 방법: "임시 잠금" 방식

영화관 예매와 같은 방식입니다:

1. 좌석을 고르고 "구매하기"를 누르면 → 해당 좌석이 **7분간 임시로 잠기고** Shopify 결제 페이지로 이동
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

> 코드: [lib/redis.ts](lib/redis.ts) (클라이언트), [lib/seat-lock.ts](lib/seat-lock.ts) (좌석 잠금 로직 + Lua 스크립트)

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

> 코드: [lib/shopify.ts](lib/shopify.ts) (API 호출), [lib/shopify-config.ts](lib/shopify-config.ts) (Variant ID 매핑)

**정의**: Shopify 쇼핑몰의 장바구니와 결제 기능을 외부에서 사용할 수 있게 해주는 인터페이스입니다.

**왜 사용하나요?**

- **PG(결제 대행) 직접 연동 불필요**: 카드 결제, 환불, 영수증 등을 Shopify가 모두 처리
- **보안**: 카드 정보를 우리 서버에 저장할 필요 없음 (PCI DSS 규정 자동 충족)
- **검증된 시스템**: 전 세계 수백만 쇼핑몰이 사용하는 안정적인 결제 시스템

**Shopify의 역할은 "결제만"입니다.** 좌석이 비었는지, 누가 잡았는지는 모릅니다.
"결제가 완료됐다"는 사실만 우리 서버에 알려줍니다(Webhook).

### Next.js API Routes (우리 서버)

> 코드: [app/api/seats/](app/api/seats/) (좌석 API), [app/api/checkout/](app/api/checkout/) (결제 API), [app/api/webhooks/](app/api/webhooks/) (웹훅)

**정의**: 웹사이트 내부에 만드는 작은 서버 프로그램. 별도의 백엔드 서버를 운영하지 않아도 됩니다.

**왜 사용하나요?**

- 현재 웹사이트가 이미 Next.js로 만들어져 있어서 추가 서버 불필요
- Vercel(호스팅 서비스)에서 자동으로 접속자 수에 따라 확장 (서버리스)
- 브라우저 → Redis, 브라우저 → Shopify를 직접 연결하지 않고, 서버를 거치는 이유:
  - Redis/Shopify 비밀 키를 브라우저에 노출하면 안 되기 때문

### 폴링 (3초 간격, 섹션 단위)

> 코드: [hooks/useSeatAvailability.ts](hooks/useSeatAvailability.ts)

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

> 가격 설정: [_constants/tickets.ts](app/[locale]/(2026)/_constants/tickets.ts) · Variant ID: [lib/shopify-config.ts](lib/shopify-config.ts)

Shopify에 **4개 상품**을 등록합니다. **재고 관리는 Shopify에서 하지 않습니다** (Redis가 관리).

모든 상품은 **정가(base price)**로 등록하고, 할인은 **Shopify 할인 코드**로 적용합니다.
애프터파티는 할인 대상에서 제외하기 위해 **별도 상품**으로 분리되어 있습니다.

| 상품명 | 타입 | 정가 | Variant ID |
|--------|------|------|-----------|
| VIP Ticket | Conference Ticket | ₩3,000,000 | `48806870352114` |
| Premium Ticket | Conference Ticket | ₩330,000 | `48892186296562` |
| General Ticket | Conference Ticket | ₩210,000 | `48806870450418` |
| After Party | Conference Add-on | ₩50,000 | `48892186329330` |

**할인 코드:**

| 코드명 | 할인율 | 대상 | 적용 페이즈 |
|--------|-------|------|------------|
| `EARLYBIRD20` | 20% | 티켓 상품만 (AP 제외) | Phase 1 (earlybird1) |
| `EARLYBIRD10` | 10% | 티켓 상품만 (AP 제외) | Phase 2 (earlybird2) |

**왜 After Party를 별도 상품으로 분리했나요?**

Shopify 할인 코드는 상품 단위로 적용됩니다. After Party가 티켓의 Variant로 포함되어 있으면
할인 코드가 AP에도 적용되어 의도치 않은 할인이 발생합니다.
별도 상품으로 분리하면 할인 코드 대상을 "티켓 상품만"으로 설정할 수 있습니다.

**장바구니 구성 예시** (Premium 2석, AP 1석, earlybird1 적용):
```
Line 1: Premium Ticket × 1    ₩264,000 (₩330,000 × 0.8)   seat: A-5
Line 2: Premium Ticket × 1    ₩264,000 (₩330,000 × 0.8)   seat: A-6
Line 3: After Party    × 1    ₩50,000  (할인 미적용)         seat: A-5
할인코드: EARLYBIRD20
총액: ₩578,000
```

좌석 정보는 장바구니 라인 아이템의 `attributes`에 첨부됩니다:
`seat_section: "A"`, `seat_number: "5"`, `after_party: "true"`

---

## 5. 좌석 상태 구분

> 타입 정의: [_types/seats.ts](app/[locale]/(2026)/_types/seats.ts) · 좌석 배치: [_constants/seats.ts](app/[locale]/(2026)/_constants/seats.ts)

좌석은 항상 아래 세 가지 중 하나의 상태입니다:

| 상태 | 의미 | 화면 표시 |
|------|------|----------|
| **available** (사용 가능) | 아무도 선택하지 않은 좌석 | 일반 색상, 클릭 가능 |
| **held** (임시 잠금) | 누군가 결제 중인 좌석 (7분 제한) | 회색 처리, 클릭 불가 |
| **sold** (판매 완료) | 결제 완료된 좌석 | 회색 + X 표시, 영구 비활성 |

---

## 6. 예매 흐름 (사용자 시점)

> UI 전체 플로우: [tickets/[tier]/_components/PurchaseFlow.tsx](app/[locale]/(2026)/tickets/[tier]/_components/PurchaseFlow.tsx)

```
① 좌석 선택 화면 입장
   ↓
   화면에 빈 좌석 / 잠긴 좌석 / 판매된 좌석이 표시됨
   (3초마다 자동 갱신 — 현재 보고 있는 섹션만)
   ↓
   섹션 전환 시 좌석 상태 로딩 중에는 로딩 오버레이 표시 (클릭 방지)
   ↓
② 섹션을 선택하고, 원하는 좌석을 클릭 (여러 개 가능)
   ↓
   이 단계에서는 서버에 요청하지 않음 — 화면에서만 선택 표시
   ↓
③ (Premium/General만) 좌석별로 애프터파티 참가 여부 선택
   ↓
④ "구매하기" 버튼 클릭 (로딩 스피너 표시)
   ↓
   서버가 한 번의 API 호출로 좌석 잠금 + Shopify 결제 페이지 생성
   ↓
   ┌─ 성공: 좌석 7분간 잠금 + 즉시 Shopify 결제 페이지로 이동
   └─ 실패: "이미 다른 분이 선택한 좌석입니다" 안내
   ↓
⑤ Shopify 결제 페이지
   ↓
   장바구니에 티켓 + 애프터파티(선택된 경우) 포함
   ↓
   ┌─ 결제 완료: 좌석이 "판매 완료"로 확정
   └─ 결제 포기/시간 초과: 7분 후 좌석 자동 해제 (Redis TTL)
```

> **설계 원칙**: 프론트엔드에 세션 ID나 타이머가 없습니다. 좌석 만료는 Redis TTL이 서버사이드에서 처리합니다.
> "구매하기" 클릭 시 단일 API 호출(`POST /api/checkout/create`)로 좌석 잠금과 결제 페이지 생성을 한 번에 처리합니다.

---

## 7. 동시성 제어 — 같은 좌석 충돌 방지

> Lua 스크립트: [lib/seat-lock.ts](lib/seat-lock.ts) (LUA_HOLD_SIMPLE, LUA_HOLD_WITH_SESSION)

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

한 요청에서 좌석을 독점하지 못하도록 제한을 둡니다:

| 티켓 종류 | 한 번에 최대 hold 가능 좌석 수 | 이유 |
|-----------|-------------------------------|------|
| VIP | 4석 | VIP 좌석이 전체 21석뿐이므로 엄격하게 제한 |
| Premium / General | 10석 | 단체 참가도 허용하되, 과도한 독점 방지 |

이 제한은 서버 API에서 검증합니다. 브라우저에서만 제한하면 우회 가능하기 때문입니다.

---

## 8. 데이터 저장 구조 (Redis)

> 키 생성 함수: [lib/seat-lock.ts](lib/seat-lock.ts) · TTL 상수: [lib/seat-lock.ts](lib/seat-lock.ts)

Redis에 저장되는 정보는 **3종류**입니다 (메인 구매 플로우 기준):

| 키 형태 | 저장 내용 | 자동 삭제 | 비유 |
|---------|----------|----------|------|
| `seat:{섹션}:{번호}` | 좌석 상태 (held/sold, 티어, 애프터파티 여부) | held: 7분 후 삭제 / sold: 삭제 안 됨 | 좌석에 붙인 "예약됨" 스티커 |
| `checkout:{장바구니ID}` | 결제 중인 좌석 목록 + 티어 + 구매 시점 페이즈 | 30분 후 삭제 | 매표소 대기표 |
| `webhook:order:{주문ID}` | `"1"` (처리 완료 표시) | 24시간 후 삭제 | 중복 처리 방지 도장 |

**예시) `seat:A:5` 키에 저장되는 정보:**
```json
{
  "status": "held",
  "tier": "premium",
  "afterParty": true
}
```

`webhook:order:{주문ID}` 키는 Shopify 웹훅의 **멱등성(idempotency)**을 보장합니다.
Shopify가 같은 주문 완료 알림을 여러 번 보내더라도, 이 키가 이미 존재하면 두 번째부터는 무시합니다.

> **레거시**: `/api/seats/hold` 엔드포인트(sessionId 기반)를 사용하면 `holds:{sessionId}` 키가 추가로 생성됩니다. 메인 구매 플로우에서는 사용하지 않습니다.

### 왜 `holds:{sessionId}` 키를 메인 플로우에서 제거했나요?

이전 설계에서는 사용자를 세션 ID로 추적하고, 재시도 시 이전 좌석을 자동 해제했습니다.
하지만 세션 ID 관리(생성, localStorage 저장, API 전달)와 프론트엔드 타이머가 불필요한 복잡도를 추가했습니다.
Redis TTL(7분)이 자동 만료를 처리하므로, 세션 추적 없이도 시스템이 정상 동작합니다.
재시도 시 이전 좌석이 최대 7분간 잠기는 트레이드오프가 있지만, 컨퍼런스 규모에서 영향이 미미합니다.

---

## 9. API 목록 (서버 끝점)

우리 서버가 제공하는 기능:

### 좌석/결제 API

| 기능 | 경로 | 코드 | 설명 |
|------|------|------|------|
| 좌석 상태 조회 | `GET /api/seats/status?section=A` | [route.ts](app/api/seats/status/route.ts) | "A 섹션 좌석들 상태 알려줘" |
| 좌석 잠금 + 결제 생성 | `POST /api/checkout/create` | [route.ts](app/api/checkout/create/route.ts) | 좌석 잠금 + Shopify 결제 페이지 생성 (통합) |
| 결제 완료 수신 | `POST /api/webhooks/shopify` | [route.ts](app/api/webhooks/shopify/route.ts) | Shopify가 "결제 완료됐어" 알림 |

### 레거시 좌석 API (어드민/테스트용)

| 기능 | 경로 | 코드 | 설명 |
|------|------|------|------|
| 좌석 임시 잠금 | `POST /api/seats/hold` | [route.ts](app/api/seats/hold/route.ts) | sessionId 기반 좌석 잠금 |
| 잠금 해제 | `POST /api/seats/release` | [route.ts](app/api/seats/release/route.ts) | sessionId 기반 좌석 해제 |

### 할인/어드민 API

| 기능 | 경로 | 코드 | 설명 |
|------|------|------|------|
| 현재 가격 조회 | `GET /api/pricing/current?tier=premium` | [route.ts](app/api/pricing/current/route.ts) | 현재 페이즈, 할인율, Phase 2 잔여 수량 |
| 어드민 로그인 | `POST /api/admin/auth` | [route.ts](app/api/admin/auth/route.ts) | 비밀번호 검증 → 세션 쿠키 발급 |
| 할인 설정 조회 | `GET /api/admin/pricing` | [route.ts](app/api/admin/pricing/route.ts) | 현재 할인 설정 + 티어별 상태 |
| 할인 설정 변경 | `PUT /api/admin/pricing` | [route.ts](app/api/admin/pricing/route.ts) | 할인 설정 저장 (Redis) |

### 각 API 상세

**좌석 상태 조회** `GET /api/seats/status?section=A`
- 지정한 섹션의 모든 좌석 상태를 반환합니다
- 브라우저가 3초마다 호출해서 화면을 갱신합니다
- 섹션을 지정하는 이유: 전체 1,039석을 매번 조회하면 낭비이므로, 현재 보고 있는 섹션만

**좌석 잠금 + 결제 생성 (통합)** `POST /api/checkout/create`
- 요청 예시: `{ seats: [{section: "A", seat: 5, afterParty: true}, ...], tier: "premium" }`
- 동작 순서:
  1. 좌석/티어 검증 (좌석 수 제한, 티어 매칭)
  2. Lua 스크립트로 원자적 좌석 잠금 (7분 TTL)
  3. `getCurrentPhase(tier)` 호출하여 현재 할인 페이즈 확인
  4. Shopify 장바구니 생성 (티켓 라인 아이템 + After Party 라인 아이템 분리)
  5. 페이즈에 따라 할인 코드 적용 (`cartDiscountCodesUpdate` mutation)
  6. Redis에 checkout 매핑 저장 (좌석 목록, 티어, 페이즈)
  7. Shopify 결제 페이지 URL 반환
- 좌석이 이미 잡혀있으면 → 409 응답 + `failedSeats` 배열
- Shopify API 실패 시 → 500 응답 (좌석은 7분 TTL 후 자동 해제, 재시도 가능)

**결제 완료 수신** `POST /api/webhooks/shopify`
- Shopify가 결제 완료 시 자동으로 호출하는 알림
- HMAC 서명 검증으로 위조된 요청 차단 (`crypto.timingSafeEqual()` 사용)
  - HMAC이란? → Shopify가 비밀 키로 만든 "전자 서명". 이걸로 진짜 Shopify가 보낸 건지 확인합니다.
- 장바구니 ID로 Redis에서 좌석 정보를 찾아 → 상태를 "sold"(판매 완료)로 변경
- Phase 2 수량 카운터 증가: 체크아웃 생성 시 저장된 페이즈가 `earlybird2`이면 해당 티어의 판매 카운터를 `INCRBY`로 증가 (웹훅 시점이 아닌 구매 시점의 페이즈 기준)
- 주문 ID를 `webhook:order:{주문ID}` 키에 저장해서 같은 주문이 중복 처리되지 않도록 방지 (24시간 TTL)

**현재 가격 조회** `GET /api/pricing/current?tier=premium`
- 현재 적용 중인 페이즈, 할인율 반환
- `tier` 파라미터 제공 시 Phase 2 잔여 수량도 포함
- 클라이언트 컴포넌트에서 동적 가격 표시에 사용

---

## 10. 알려진 문제 및 개선 과제

코드 리뷰에서 발견된 문제들을 심각도순으로 정리합니다.

### ~~[심각] 티어 검증 누락 — 가격 조작 가능~~ ✅ 해결됨

`holdSeats()`에서 각 좌석의 실제 tier를 [`getSeatTier()`](app/[locale]/(2026)/_utils/seats.ts)로 확인하여, 요청된 tier와 불일치하면 거부합니다.
예를 들어 VIP 좌석(C-1)을 "general" tier로 hold 요청하면 `"Seat C-1 is not a general seat"` 에러를 반환합니다.

### ~~[심각] SHOPIFY_WEBHOOK_SECRET 미설정~~ ✅ 해결됨

`.env`에 `SHOPIFY_WEBHOOK_SECRET`이 설정되어 Webhook HMAC 검증이 정상 동작합니다.

### ~~[높음] HMAC 비교가 타이밍 공격에 취약~~ ✅ 해결됨

`crypto.timingSafeEqual()`을 사용하여 HMAC 서명을 상수 시간으로 비교합니다.
맞든 틀리든 비교 시간이 동일하므로 타이밍 사이드채널이 차단됩니다.

### [높음] 좌석 독점 방지 미흡

현재 좌석 수 제한(VIP 4석, 일반 10석)은 요청 단위로만 검증됩니다.
같은 사람이 여러 브라우저/탭에서 반복 요청하면 제한을 우회할 수 있습니다.

```
같은 사람이:
  크롬 일반 모드     → VIP 4석 hold 요청 ✅
  크롬 시크릿 모드    → VIP 4석 hold 요청 ✅
  사파리             → VIP 4석 hold 요청 ✅
  ────────────────────────────────────────
  합계: VIP 12석을 혼자 독점 (전체 21석 중 57%)
```

**완화 방안**:
- IP 기반 추가 제한 (동일 IP에서 N개 이상 hold 차단)
- 또는 이메일/전화번호 인증 후 hold 허용

### [중간] sold 좌석의 영속성 보장 없음

**문제:**
결제가 완료된 좌석은 Redis에 `status: "sold"`로 저장되어 영구히 유지됩니다.
그런데 Redis가 **유일한 저장소**입니다. 즉, Redis에 문제가 생기면 판매 기록이 사라집니다.

```
정상 상태:
  Redis: seat:A:5 = { status: "sold" }  → A-5는 판매 완료, 아무도 선택 불가

Redis 장애 발생 시:
  Redis: (데이터 유실)                   → A-5 키가 사라짐
  시스템: "seat:A:5 키가 없네? → available" → 이미 팔린 좌석이 다시 빈 좌석으로 표시
  결과: 같은 좌석이 두 번 팔릴 수 있음
```

Upstash는 안정적인 서비스이지만, 어떤 서비스든 장애 가능성은 있습니다.
한편 Shopify 쪽에는 주문 기록이 남아 있으므로, 이를 활용해 복구할 수 있습니다.

**완화**: Shopify 주문 데이터(webhook payload)를 별도 DB에 백업하거나, sold 좌석 목록을 주기적으로 export해서 Redis 장애 시 복구할 수 있도록 준비.

### [중간] API Rate Limiting 없음

**Rate Limiting이란?**
"같은 사람이 1분에 몇 번까지 요청할 수 있는지" 제한하는 것입니다.
현재는 이 제한이 없어서, 봇(자동화 프로그램)이 무한히 빠르게 요청을 보낼 수 있습니다.

```
봇 공격 시나리오:
  1초에 100번 checkout/create 요청 → 좌석 대량 잠금
  → 7분 후 자동 해제
  → 다시 대량 잠금
  → 반복...
  결과: 진짜 사용자들이 항상 "이미 선택된 좌석입니다" 메시지만 보게 됨
```

**수정**: Vercel Edge Middleware 또는 `@upstash/ratelimit` 패키지로 "같은 IP에서 1분에 10번까지만 요청 가능" 같은 제한 추가.

---
