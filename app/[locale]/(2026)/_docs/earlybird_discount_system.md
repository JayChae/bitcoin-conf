# 얼리버드 할인 시스템

코드 재배포 없이 어드민 페이지에서 할인을 실시간 관리할 수 있는 2단계 얼리버드 할인 시스템입니다.

---

## 1. 개요

| 구분 | Phase 1 (earlybird1) | Phase 2 (earlybird2) | Regular |
|------|---------------------|---------------------|---------|
| **할인율** | 20% | 10% | 0% (정가) |
| **조건** | 기간 한정 | 갯수 한정 (티어별) | 기본값 |
| **적용 대상** | 티켓만 (AP 제외) | 티켓만 (AP 제외) | — |
| **Shopify 코드** | `EARLYBIRD20` | `EARLYBIRD10` | 없음 |

**가격 예시:**

| 티어 | 정가 | Phase 1 (20%) | Phase 2 (10%) |
|------|------|--------------|--------------|
| VIP | ₩3,000,000 | ₩2,400,000 | ₩2,700,000 |
| Premium | ₩330,000 | ₩264,000 | ₩297,000 |
| General | ₩210,000 | ₩168,000 | ₩189,000 |
| After Party | ₩50,000 | ₩50,000 | ₩50,000 |

---

## 2. 페이즈 결정 로직

> 코드: [lib/pricing.ts](lib/pricing.ts)

페이즈는 다음 우선순위로 결정됩니다:

```
① 수동 오버라이드 (override)
   → 설정되어 있으면 무조건 해당 페이즈 적용
   ↓ (null이면)
② Phase 1: 기간 한정
   → enabled && 현재 시각이 startDate~endDate 사이이면 "earlybird1"
   ↓ (조건 미충족)
③ Phase 2: 갯수 한정 (티어별)
   → enabled && 해당 티어의 판매수 < maxTickets이면 "earlybird2"
   ↓ (조건 미충족)
④ Regular (정가)
```

Phase 2는 **티어별로 독립** 판단합니다:
- VIP: 10장 할인 → 10장 팔리면 VIP만 정가 전환
- Premium: 100장 할인 → 100장 팔리면 Premium만 정가 전환
- General: 100장 할인 → General은 아직 할인 중일 수 있음

---

## 3. 시스템 구성

### 파일 구조

```
lib/
├── pricing.ts           ← 핵심: 페이즈 결정, Redis 설정 관리, 할인 계산
├── shopify-config.ts    ← Variant ID + 할인 코드 매핑
└── shopify.ts           ← Shopify 장바구니 생성 + 할인 코드 적용

app/api/
├── pricing/current/route.ts    ← 현재 페이즈 조회 (public)
├── admin/auth/route.ts         ← 어드민 로그인
├── admin/pricing/route.ts      ← 어드민 할인 설정 CRUD
├── checkout/create/route.ts    ← 체크아웃 시 할인 코드 적용
└── webhooks/shopify/route.ts   ← 결제 완료 시 Phase 2 카운터 증가

app/admin/
├── layout.tsx    ← 최소 레이아웃 (noindex)
└── page.tsx      ← 어드민 대시보드 UI
```

### 데이터 흐름

```
                        ┌──────────────────────┐
                        │   어드민 페이지        │
                        │   /admin              │
                        └──────────┬───────────┘
                                   │ PUT /api/admin/pricing
                                   ▼
                        ┌──────────────────────┐
                        │  Redis               │
                        │  pricing:config      │  ← 할인 설정
                        │  pricing:phase2_sold │  ← 판매 카운터
                        └──────────┬───────────┘
                                   │ getCurrentPhase(tier)
                          ┌────────┴────────┐
                          ▼                 ▼
                   프론트엔드            체크아웃 API
                   (가격 표시)          (할인 코드 적용)
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Shopify     │
                                    │  할인 코드    │ ← EARLYBIRD20 / EARLYBIRD10
                                    │  적용된 결제  │
                                    └──────┬───────┘
                                           │ Webhook (결제 완료)
                                           ▼
                                    Phase 2 카운터 증가
                                    (earlybird2일 때만)
```

---

## 4. Shopify 연동

### 할인 적용 방식

Shopify에서의 실제 할인은 **할인 코드(Discount Code)**로 처리합니다.
Shopify 상품 가격은 항상 **정가**로 설정되어 있습니다.

```
체크아웃 생성 흐름:
1. getCurrentPhase(tier) → 현재 페이즈 확인
2. cartCreate() → 장바구니 생성 (정가 기준 라인 아이템)
3. cartDiscountCodesUpdate() → 페이즈에 맞는 할인 코드 적용
```

### 할인 코드 설정 (Shopify Admin에서 수동 생성)

| 코드 | 할인율 | 대상 상품 | 제외 상품 |
|------|-------|----------|----------|
| `EARLYBIRD20` | 20% | VIP Ticket, Premium Ticket, General Ticket | After Party |
| `EARLYBIRD10` | 10% | VIP Ticket, Premium Ticket, General Ticket | After Party |

After Party를 별도 상품으로 분리한 이유:
Shopify 할인 코드는 상품 단위로 적용되므로, 티켓과 같은 상품의 Variant로 구성하면
AP에도 할인이 적용되는 문제가 발생합니다.

### 프론트엔드 가격 ↔ Shopify 가격 일치

프론트엔드에서 표시하는 할인 가격과 Shopify 체크아웃의 실제 결제 가격이 일치해야 합니다.
두 곳 모두 같은 `getCurrentPhase()` 함수를 사용하여 동일한 할인율을 적용합니다.

| 위치 | 가격 결정 방식 |
|------|--------------|
| 프론트엔드 (TicketsGrid, SelectionSummary) | `calcDiscountedPrice(basePrice, phase)` |
| Shopify 결제 | 정가 + 할인 코드 (`EARLYBIRD20` / `EARLYBIRD10`) |

---

## 5. 어드민 페이지

### 접속

- **URL**: `/admin` (i18n 라우팅 바깥, locale 없음)
- **인증**: `ADMIN_PASSWORD` 환경변수와 비밀번호 비교 → httpOnly 쿠키에 비밀번호 저장 (24시간)
- **세션 유지**: 쿠키 기반 — 배포/cold start 영향 없음

### UI 구성

어드민 페이지는 **라디오 버튼 1개**로 할인 모드를 선택하는 단순한 구조입니다.

**1) 현재 상태 대시보드:**
- 티어별 현재 적용 페이즈 표시
- Early Bird 2 선택 시 판매/잔여 현황 표시

**2) 할인 설정 (라디오 선택):**
- **Early Bird 1** — 기간 한정 할인 (20% 고정)
- **Early Bird 2** — 갯수 한정 할인 (10% 고정)
- **정가** — 할인 없음

**3) 선택에 따른 상세 설정:**
- Early Bird 1 선택 시: 시작일/종료일 (KST 기준)
- Early Bird 2 선택 시: 티어별 최대 할인 티켓 수

할인율은 EB1=20%, EB2=10%으로 고정이며 어드민에서 변경할 수 없습니다.

### 타임존

날짜 입출력은 항상 **KST (UTC+9)** 기준으로 처리됩니다.
해외에서 어드민에 접속해도 날짜는 한국 시간으로 표시/저장됩니다.

### 환경 변수

| 변수 | 설명 | 설정 위치 |
|------|------|----------|
| `ADMIN_PASSWORD` | 어드민 로그인 비밀번호 | `.env` + Vercel 환경변수 |

---

## 6. Phase 2 수량 추적

Phase 2 할인 티켓 판매 수는 **결제 완료 시점**에 카운트됩니다 (hold 시점이 아님).

```
결제 완료 웹훅 수신
  → confirmSeats() → 좌석 "sold"로 변경
  → getCurrentPhase(tier) 확인
  → earlybird2이면:
     → redis.incrby("pricing:phase2_sold:{tier}", seatCount)
```

**왜 hold 시점이 아니라 결제 완료 시점인가요?**

hold 후 결제를 안 하고 포기하는 경우가 있습니다.
hold 시점에 카운트하면 실제 판매되지 않은 수량이 포함되어
할인 티켓이 실제보다 빨리 소진됩니다.

---

## 7. 운영 시나리오

### 시나리오 1: 기간 한정 할인만 사용

1. 어드민에서 "Early Bird 1" 선택
2. 기간 설정 (예: 4/1~4/15)
3. 저장
4. 4/1~4/15: 자동으로 20% 할인 적용
5. 4/16부터: 자동으로 정가 전환

### 시나리오 2: 갯수 한정 할인만 사용

1. 어드민에서 "Early Bird 2" 선택
2. 티어별 최대 수량 설정 (예: VIP 10장, Premium 100장, General 100장)
3. 저장
4. 각 티어별 할당량까지 10% 할인
5. 할당량 소진된 티어부터 정가 전환

### 시나리오 3: EB1 → EB2 순차 전환

1. 먼저 "Early Bird 1" 선택 → 기간 설정 → 저장
2. EB1 기간 종료 후 어드민에서 "Early Bird 2" 선택 → 수량 설정 → 저장
3. EB2 수량 소진 후 어드민에서 "정가" 선택 → 저장

### 시나리오 4: 긴급 할인 중단

1. 어드민에서 "정가" 선택 → 저장
2. 즉시 모든 티어 정가 전환

### 시나리오 5: 특정 티어만 할인 종료 (EB2 자동)

Early Bird 2에서 VIP 10장이 먼저 소진되면:
- VIP: 정가 (자동)
- Premium: 여전히 10% 할인 (100장 미달)
- General: 여전히 10% 할인 (100장 미달)

---

## 8. 주의사항

### Phase 2 카운터 리셋

Phase 2 카운터(`pricing:phase2_sold:*`)는 자동으로 리셋되지 않습니다.
필요 시 Upstash 콘솔에서 수동 리셋:
```
SET pricing:phase2_sold:vip 0
SET pricing:phase2_sold:premium 0
SET pricing:phase2_sold:general 0
```
