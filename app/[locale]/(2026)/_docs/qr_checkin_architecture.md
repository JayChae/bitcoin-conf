# QR 체크인 시스템 아키텍처

컨퍼런스 현장 입장을 위한 **QR 코드 발급 + 체크인 스캐너** 시스템 설계를 설명하는 문서입니다.
좌석 예매 시스템([tickets_architecture.md](tickets_architecture.md))의 확장으로, 결제 완료 후 이메일에 QR 코드를 포함하고 현장에서 스캔하여 입장을 처리합니다.

---

## 1. 전체 흐름

```
① 좌석 선택 + "구매하기" 클릭
   ↓
② 서버: 좌석 잠금 + Shopify 카트 생성
   이때 각 좌석에 HMAC 서명된 QR 토큰을 line item property로 추가
   ↓
③ Shopify 결제 완료
   ↓
④ Shopify가 주문 확인 이메일 발송
   이메일 내 QR 이미지: <img src="우리서버/api/qr/{토큰}">
   ↓
⑤ 현장 체크인
   스태프가 /admin/checkin 에서 카메라로 QR 스캔
   → 서명 검증 → 입장 처리
```

---

## 2. QR 코드 생성

> 코드: [lib/qr.ts](../../../../../lib/qr.ts)

### 페이로드 구조

```json
{
  "cid": "a1b2c3d4",    // 체크아웃 고유 ID (UUID 앞 8자리)
  "sec": "C",            // 좌석 섹션
  "seat": 5,             // 좌석 번호
  "tier": "vip",         // 티켓 등급 (vip | premium | general | mainday)
  "ap": true             // 애프터파티 포함 여부
}
```

### 서명 방식

**HMAC-SHA256** 서명을 사용합니다:

1. 페이로드를 JSON으로 직렬화
2. `CHECKIN_SECRET` 환경변수로 HMAC-SHA256 해시 생성
3. 해시의 앞 16자(hex)를 서명으로 사용
4. 최종 토큰: `base64url(JSON데이터).서명16자`

```
예시 토큰:
eyJjaWQiOiJhMWIyYzNkNCIsInNlYyI6IkMiLCJzZWF0Ijo1LCJ0aWVyIjoidmlwIiwiYXAiOnRydWV9.a1b2c3d4e5f6g7h8
```

### 왜 HMAC 서명인가?

- **Stateless 검증**: 체크인 시 Redis 조회 없이 서명만으로 진위 확인 가능
- **위조 방지**: `CHECKIN_SECRET` 없이는 유효한 토큰을 생성할 수 없음
- **컴팩트**: QR 코드에 충분히 들어가는 크기 (~120자)

---

## 3. QR 이미지 엔드포인트

> 코드: [app/api/qr/[token]/route.ts](../../../../../app/api/qr/[token]/route.ts)

| 항목 | 내용 |
|------|------|
| 경로 | `GET /api/qr/{토큰}` |
| 응답 | PNG 이미지 (300×300px) |
| 캐싱 | `Cache-Control: public, max-age=31536000, immutable` |
| 보안 | 서명 검증 실패 시 400 반환 (무효 토큰으로 이미지 생성 방지) |

Shopify 이메일 템플릿에서 이렇게 호출됩니다:
```html
<img src="https://bitcoin-conf-git-ticket-2026-03-21-jaychaes-projects.vercel.app/api/qr/eyJjaWQ..." width="200" height="200" />
```

---

## 4. QR 토큰이 이메일에 포함되는 과정

> 코드: [lib/shopify.ts](../../../../../lib/shopify.ts)

카트 생성(`createCheckoutCart`) 시 각 좌석의 line item에 `_qr_token` 속성을 추가합니다:

```typescript
attributes: [
  { key: "seat_section", value: "C" },
  { key: "seat_number", value: "5" },
  { key: "after_party", value: "true" },
  { key: "_qr_token", value: "eyJjaWQ..." },  // HMAC 서명된 QR 토큰
]
```

**밑줄 접두사(`_`)**: Shopify 체크아웃 UI에서는 숨겨지지만, Liquid 이메일 템플릿에서는 `line.properties["_qr_token"]`으로 접근 가능합니다.

---

## 5. 체크인 프로세스

> 코드: [lib/checkin.ts](../../../../../lib/checkin.ts), [app/api/checkin/verify/route.ts](../../../../../app/api/checkin/verify/route.ts)

### 체크인 API

| 항목 | 내용 |
|------|------|
| 경로 | `POST /api/checkin/verify` |
| 인증 | admin 쿠키 필요 (`isValidSession`) |
| 요청 | `{ "token": "eyJjaWQ..." }` |
| 응답 | 검증 결과 + 좌석 정보 |

### 처리 순서

```
QR 스캔
  ↓
HMAC 서명 검증
  ├─ 실패 → { valid: false, reason: "Invalid or tampered QR code" }
  └─ 성공 → 페이로드 추출 (섹션, 좌석, 티어, AP)
       ↓
     Redis에서 체크인 기록 확인
       ├─ 이미 체크인됨 → { valid: true, alreadyCheckedIn: true, checkedInAt: "시각" }
       └─ 최초 체크인 → Redis에 시각 기록 → { valid: true, alreadyCheckedIn: false }
```

### 화면 표시

| 상태 | 색상 | 표시 |
|------|------|------|
| 유효 (최초 입장) | 초록 | ✓ WELCOME + 좌석 정보 |
| 유효 · Main Day | 초록 + 시안 뱃지 | ✓ WELCOME + **MAIN DAY** + `NOV 7 ONLY · 11/7 전용` |
| 이미 체크인됨 | 노랑 | ⚠ ALREADY CHECKED IN + 체크인 시각 |
| 무효 (위조/오류) | 빨강 | ✗ INVALID + 사유 |

---

## 6. Redis 키 구조

체크인 시스템은 **1종류**의 Redis 키를 사용합니다:

| 키 형태 | 저장 내용 | TTL | 비유 |
|---------|----------|-----|------|
| `checkin:{cid}:{섹션}:{좌석번호}:{YYYY-MM-DD}` | ISO 8601 타임스탬프 | 없음 (영구) | 그날의 입장 도장 |

날짜(KST)가 키에 포함되므로 체크인은 **하루 1회**입니다. 이틀권(제너럴·프리미엄·VIP) 소지자는
11/7과 11/8에 각각 정상 입장 처리됩니다.

기존 좌석 시스템의 Redis 키(`seat:*`, `checkout:*`)와 독립적으로 운영됩니다.

---

## 7. 보안

### 위조 방지

- QR 토큰은 `CHECKIN_SECRET`으로 HMAC 서명됨
- 서명 없이는 유효한 QR 코드를 생성할 수 없음
- `/api/qr/{토큰}` 엔드포인트도 서명 검증 후에만 이미지 생성

### 중복 입장 방지

- 같은 날 같은 QR을 두 번 스캔하면 "이미 체크인됨" + 그날의 최초 체크인 시각 표시
- 스태프가 의도적 중복인지 부정 사용인지 판단 가능
- 날짜가 바뀌면 새 도장이므로, 이틀권 소지자는 Day 2에 중복 경고 없이 입장합니다

### Main Day 티켓의 날짜 통제

Main Day는 11/7 하루만 유효합니다. 유효 일자는 `TIER_VALID_DAYS`
([app/[locale]/(2026)/_constants/tickets.ts](../_constants/tickets.ts))에 선언하고,
`lib/checkin.ts`가 KST 기준 오늘 날짜와 대조해 **서버에서 차단**합니다 —
유효하지 않은 날에 스캔하면 빨간 `INVALID` + `Not valid today` 사유가 뜹니다.

스캐너의 시안색 `NOV 7 ONLY · 11/7 전용` 뱃지도 같은 상수에서 파생되며, 스태프 육안 확인용 보조
장치입니다. 통제 자체는 뱃지가 아니라 서버 검증이 담당합니다.

다른 티어에 날짜 제한을 추가하려면 `TIER_VALID_DAYS`에 항목만 추가하면 됩니다 —
Redis 키 구조나 이미 발급된 QR은 건드리지 않습니다.

### 체크인 API 접근 제한

- `/api/checkin/verify`는 admin 인증 필요
- 일반 사용자가 직접 호출 불가

---

## 8. 환경변수

| 변수명 | 용도 | 생성 방법 |
|--------|------|----------|
| `CHECKIN_SECRET` | QR 토큰 HMAC 서명 키 | `openssl rand -hex 32` |

---

## 9. 관련 파일

| 파일 | 역할 |
|------|------|
| [lib/qr.ts](../../../../../lib/qr.ts) | QR 토큰 서명/검증 + 이미지 생성 |
| [lib/checkin.ts](../../../../../lib/checkin.ts) | 체크인 로직 (Redis 기록) |
| [lib/shopify.ts](../../../../../lib/shopify.ts) | 카트 생성 시 QR 토큰 추가 |
| [app/api/qr/[token]/route.ts](../../../../../app/api/qr/[token]/route.ts) | QR 이미지 PNG 반환 |
| [app/api/checkin/verify/route.ts](../../../../../app/api/checkin/verify/route.ts) | 체크인 검증 API |
| [app/admin/checkin/page.tsx](../../../../../app/admin/checkin/page.tsx) | 카메라 QR 스캐너 UI |
| [_docs/email-bilingual](email-bilingual) | Shopify 이메일 템플릿 (QR 포함) |
