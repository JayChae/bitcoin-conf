# Redis 데이터 구조 및 예매 플로우 문서

## 이 문서는 무엇인가요?

Redis에 저장되는 모든 데이터의 구조와, 예매 과정에서 데이터가 어떻게 생성/변경/삭제��는지를 설명합니다.

---

## 1. 저장되는 데이터 종류 (4가지)

Redis에는 **4종류**의 데이터가 저장됩니다.

### ① 좌석 상태 — `seat:{섹션}:{번호}`

> "이 좌석이 지금 어떤 상태인��?"

| 항목 | 설명 |
|------|------|
| **키 이름** | `seat:A:5` (A 섹��� 5번 좌석) |
| **비유** | 좌석에 붙은 스티커 — "예약됨" 또는 "판매완료" |
| **자동 삭제** | 임시 잠금(held): **7분 후 자동 삭제** / 판매 완료(sold): **삭제 안 됨** |

**저장되는 내용:**

```json
{
  "status": "held",
  "tier": "premium",
  "afterParty": true
}
```

| 필드 | 의미 | 예시 |
|------|------|------|
| `status` | 좌석 상태 | `"held"` (임시 잠금) 또는 `"sold"` (판매 완료) |
| `tier` | 티켓 종류 | `"vip"`, `"premium"`, `"general"` |
| `afterParty` | 애프터파티 포함 여부 | `true` 또는 `false` |

**키가 아예 없는 좌석 = 빈 좌석(available)**
Redis에 `seat:A:5` 키가 존재하지 않으면 → A 섹션 5번은 빈 좌석입니다.

---

### ② 결제 연결 정보 — `checkout:{장바구니ID}`

> "이 Shopify 장바구니가 어떤 좌석인가?"

| 항목 | 설명 |
|------|------|
| **키 이름** | `checkout:gid://shopify/Cart/abc123` |
| **비유** | 매표소 대기표 — 결제 번호와 좌석을 연결 |
| **자동 삭제** | **30분 후** |

**저장되는 내용:**

```json
{
  "seats": [
    { "section": "A", "seat": 5, "afterParty": true },
    { "section": "A", "seat": 6, "afterParty": false }
  ],
  "tier": "premium",
  "phase": "earlybird1"
}
```

`phase`는 체크아웃 생성 시점의 할인 페이즈입니다. 결제 완료 웹훅에서 Phase 2 카운터를
정확히 증가시키기 위해 저장합니다 (웹훅 시점에 페이즈가 바뀌었을 수 있으므로).

이 데이터는 **Shopify 결제 완료 알림(Webhook)이 왔을 때** 사용됩니다:
1. Shopify가 "결제 완료됐어" 알림을 보냄
2. 알림에 포함된 장바구니 ID로 이 데이터를 찾음
3. 해당 좌석들을 `"sold"` (판매 완료)로 변경
4. 저장된 `phase`가 `"earlybird2"`이면 Phase 2 판매 카운터 증가

---

### ③ 할인 설정 — `pricing:config`

> "현재 어떤 할인이 적용 중인가?"

| 항목 | 설명 |
|------|------|
| **키 이름** | `pricing:config` |
| **비유** | 할인 정책 설정표 — Phase 1/2 조건, 수동 오버라이드 |
| **자동 삭제** | **삭제 안 됨** (어드민이 관리) |

**저장되는 내용:**

```json
{
  "phase1": {
    "startDate": "2026-04-01T00:00:00+09:00",
    "endDate": "2026-04-30T23:59:59+09:00",
    "enabled": true
  },
  "phase2": {
    "maxTickets": { "vip": 10, "premium": 100, "general": 100 },
    "enabled": true
  },
  "override": null
}
```

| 필드 | 의미 |
|------|------|
| `phase1.startDate` / `endDate` | Phase 1 적용 기간 |
| `phase1.enabled` | Phase 1 활성화 여부 |
| `phase2.maxTickets` | 티어별 Phase 2 할인 최대 티켓 수 |
| `phase2.enabled` | Phase 2 활성화 여부 |
| `override` | 수동 오버라이드 (`null` = 자동, `"earlybird1"`, `"earlybird2"`, `"regular"`) |

할인율은 코드에 고정되어 있습니다 (EB1=20%, EB2=10%). config에는 할인율 필드가 없습니다.

이 데이터는 어드민 페이지(`/admin`)에서 조회/수정됩니다.

---

### ④ Phase 2 판매 카운터 — `pricing:phase2_sold:{티어}`

> "이 티어에서 할인 가격으로 몇 장 팔렸나?"

| 항목 | 설명 |
|------|------|
| **키 이름** | `pricing:phase2_sold:vip`, `pricing:phase2_sold:premium`, `pricing:phase2_sold:general` |
| **비유** | 할인 티켓 판매 계수기 |
| **자동 삭제** | **삭제 안 됨** |

**저장되는 내용:** 정수 (예: `15`)

Shopify 결제 완료 웹훅에서 현재 페이즈가 `earlybird2`일 때 `INCRBY`로 증가합니다.
`phase2.maxTickets[tier]`에 도달하면 해당 티어는 자동으로 `regular`(정가)로 전환됩니다.

---

## 2. 데이터 관계도

```
사용자 브라우저
  │
  └─ POST /api/checkout/create { seats, tier }
       │
       ├─ seat:A:5 ─────────── 개별 좌석 상태 (held → sold)
       ├─ seat:A:6
       │
       └─ checkout:{cartId} ── Shopify 결제와 좌석 연결
             │
             └─ (결제 완료 시) seat:A:5, A:6 → "sold"로 변경
```

> **참고**: 세션 ID 기반의 `holds:{sessionId}` 키는 레거시 `/api/seats/hold` 엔드포인트에서만 사용됩니다.
> 메인 구매 플로우(`/api/checkout/create`)는 세션 ID 없이 동작합니다.

---

## 3. 예매 플로우 — 시나리오별 데이터 변화

### 시나리오 1: 정상 예매 (좌석 선택 → 결제 완료)

> 김민수님이 Premium A 섹션 5번, 6번 좌석을 선택하고 결제를 완료하는 경우

**① 페이지 진입**

```
Redis 상태: (비어있음 — 모든 ��석 available)
```

**② "구매하기" 버튼 클릭**

서버가 좌석 잠금 + Shopify 결제 페이지 생성을 **한 번에** 처리합니다:

```
seat:A:5    → { status: "held", tier: "premium", afterParty: true }   ⏰ 7분 후 삭제
seat:A:6    → { status: "held", tier: "premium", afterParty: false }  ⏰ 7분 후 삭제
checkout:gid://shopify/Cart/xyz789 → { seats: [...], tier: "premium", phase: "earlybird1" }  ⏰ 30분 후 삭제
```

이 순간부터 다른 사람은 A-5, A-6을 선택할 수 없습니다.
사용자는 즉시 Shopify 결제 페이지로 리다이렉트됩니다.

**③ 결제 완료 (Shopify가 알림을 보냄)**

서버가 좌석을 판매 완료로 변경합니다:

```
seat:A:5    → { status: "sold", tier: "premium", afterParty: true }   ⏰ 삭제 안 됨 (영구 보존)
seat:A:6    → { status: "sold", tier: "premium", afterParty: false }  ⏰ 삭제 안 됨 (영구 보존)
checkout:gid://shopify/Cart/xyz789 → (삭제됨)
```

**최종 상태:** A-5, A-6은 영구적으로 `"sold"`. 아무도 이 좌석을 다시 선택할 수 없음.

---

### 시나리오 2: 결제 포기 (좌석 잡고 → 결제 안 함)

> 이영희님이 좌석을 잡았지만 7분 안에 결제를 완료하지 않은 경우

**① "구매하기" 버튼 클릭 → 좌석 잠금 + Shopify 리다이렉트**

```
seat:C:1    → { status: "held", tier: "general", ... }   ⏰ 7분 후 삭제
```

**② 7분 경과 — 아무 것도 하지 않아도 자동으로:**

```
seat:C:1    → (자동 삭제됨 → 다시 available)
```

**결과:** C-1 좌석이 자동으로 풀려서 다른 사람이 선택할 수 있게 됩니다. 별도의 정리 작업이 필요 없습니다.

---

### 시나리오 3: 좌석 변경 (잡았다가 다른 좌석으로 재시도)

> 박지훈님이 B-10을 잡았다가 결제를 포기하고, B-20으로 다시 시도하는 경우

**① 처음 B-10 잠금**

```
seat:B:10   → { status: "held", tier: "premium", ... }  ⏰ 7분 후 삭제
```

**② 결제 포기 후 B-20으로 재시도**

B-10의 7분 TTL이 아직 남아있어도, 새로운 구매 요청은 독립적으로 처리됩니다:

```
seat:B:10   → { status: "held", ... }  ⏰ 남은 TTL 후 자동 삭제 (기존 유지)
seat:B:20   → { status: "held", tier: "premium", ... }  ⏰ 7분 후 삭제 (새로 잠금)
```

**결과:** B-10은 남은 TTL 후 자동 해제, B-20은 새로 잠금.
> 세션 ID 기반 자동 해제가 없으므로, 재시도 시 이전 좌석이 최대 7분간 불필요하게 잠길 수 있습니다.
> 이는 의도된 트레이드오프입니다 (시스템 단순화 우선).

---

### 시나리오 4: 동시 접속 충돌 (같은 좌석을 두 사람이 동시에 선택)

> 김민수님과 이영희님이 동시에 A-5를 클릭하는 경우

**① 김민수님이 0.001초 먼저 요청**

```
seat:A:5    → { status: "held", tier: "premium", ... }  ✅ 성공
```

**② 이영희님의 요청 (0.001초 후 도착)**

```
서버: "seat:A:5 키가 이미 존재함 → 거절"
이영희님 화면: "일부 좌석이 이미 선택되었습니다" 표시
```

Redis가 보장하는 것:
- 두 요청이 아무리 가까운 시간에 도착해도, **반드시 한 명만 성공**
- 여러 좌석을 한꺼번에 잡는 경우에도 **전부 성공 아니면 전부 실패** (하나만 잡히는 일 없음)

---

### 시나리오 5: 여러 좌석 중 일부가 이미 잡힌 경우

> 김민수님이 A-5, A-6, A-7 세 자리를 한꺼번에 잡으려고 하는데, A-6은 이미 다른 사람이 잡은 경우

**현재 Redis 상태:**

```
seat:A:6    → { status: "held", ... }  ← 다른 사람이 이미 잡음
```

**김민수님의 요청 결과:**

```
전부 실패 — A-5, A-7도 잡히지 않음
김민수님 화면: "일부 좌석이 이미 선택되었습니다" 표시
```

**왜 부분 성공을 허용하지 않나요?**
"3자리 나란히 앉으려고 했는데 2자리만 잡혔다"는 원하지 않는 결과입니다.
전부 잡히거나, 전부 실패하는 것이 사용자에게 더 명확합니다.

---

## 4. 키 자동 삭제 시간표

| 키 | 자동 삭제 시간 | 이유 |
|----|--------------|------|
| `seat:*` (held) | **7분** | 결제하지 않은 사용자의 좌석을 자동 해제 |
| `seat:*` (sold) | **삭제 안 됨** | 판매된 좌석은 영구 보존 |
| `checkout:*` | **30분** | 결제 처리에 여유 시간 확보 (Shopify 알림이 늦을 수 있으므로) |
| `webhook:order:*` | **24시간** | Shopify 알림 중복 처리 방지용 |
| `pricing:config` | **삭제 안 됨** | 할인 설정은 어드민이 관리 |
| `pricing:phase2_sold:*` | **삭제 안 됨** | Phase 2 판매 카운터 |

> **레거시**: `/api/seats/hold` 엔드포인트를 사용하는 경우 `holds:{sessionId}` 키(7분 TTL)가 추가로 생성됩니다.

---

## 5. 좌석 수 제한

한 요청에서 좌석을 독점하지 못하도록 서버에서 제한합니다:

| 티켓 종류 | 한 번에 최대 잠금 가능 좌석 수 |
|-----------|-------------------------------|
| VIP | **4석** (전체 VIP 21석 중 약 19%) |
| Premium | **10석** |
| General | **10석** |

이 제한은 브라우저가 아니라 **서버에서 검증**하므로 우회할 수 없습니다.

---

## 6. 사용자 식별 방식

메인 구매 플로우에서는 **사용자 식별을 하지 않습니다**. 좌석 잠금은 요청 단위로 처리되며, 별도의 세션 ID나 로그인이 필요 없습니다.

좌석의 동시 접근 제어는 Redis Lua 스크립트의 원자적 연산으로 보장됩니다.

> **레거시**: `/api/seats/hold` + `/api/seats/release` 엔드포인트는 `sessionId` 기반으로 동작합니다.
> 어드민/테스트 용도로 유지되지만, 메인 구매 UI에서는 사용하지 않습니다.

---

## 7. Redis가 비어있을 때 (초기 상태)

행사 시작 전, Redis에는 **아무 데이터도 없습니다**.

```
Redis: (비어있음)
```

이 상태에서:
- `seat:*` 키가 없음 → **모든 좌석이 available**
- 누군가 좌석을 잡으면 그때 `seat:A:5` 같은 키가 **처음 생성**됨
- 결제가 완료되면 `"sold"` 상태로 **영구 보존**됨

즉, Redis에 존재하는 좌석 키 = held 또는 sold인 좌석. 나머지는 전부 빈 좌석입니다.

---

## 8. Upstash 콘솔에서 확인하는 방법

[Upstash Console](https://console.upstash.com)에서 Redis 데이터를 직접 조회할 수 있습니다.

**현재 잠긴/판매된 좌석 확인:**
```
CLI > KEYS seat:*
```

**특정 좌석 상태 확인:**
```
CLI > GET seat:A:5
```

**특정 좌석의 남은 잠금 시간 확인:**
```
CLI > TTL seat:A:5
```
→ 양수면 해당 초 후에 삭제됨, -1이면 영구 (sold), -2면 이미 삭제됨 (available)

**할인 설정 확인:**
```
CLI > GET pricing:config
```

**Phase 2 판�� 현황 확인:**
```
CLI > GET pricing:phase2_sold:vip
CLI > GET pricing:phase2_sold:premium
CLI > GET pricing:phase2_sold:general
```

**Phase 2 카운터 초기화 (주의: 할인 티켓 수 리셋):**
```
CLI > SET pricing:phase2_sold:vip 0
CLI > SET pricing:phase2_sold:premium 0
CLI > SET pricing:phase2_sold:general 0
```

**모든 데이터 초기화 (주의: 모든 예매 기록 + 할인 설정 삭제):**
```
CLI > FLUSHDB
```
