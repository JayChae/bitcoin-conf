# Main Day 티켓 출시 체크리스트

11/7 하루만 참석하는 **Main Day 티켓(₩140,000)** 출시를 위해 **코드 밖에서** 해야 하는 작업 목록입니다.
코드 변경은 `first-day-ticket` 브랜치에 완료되어 있습니다 (35개 파일, 타입 체크 통과).

> **가장 중요한 것 하나**: `SHOPIFY_VARIANT_MAINDAY` 환경변수가 없으면 **Main Day가 아예 안 팔립니다.**
> 티켓 카드가 처음부터 "마감"으로 표시되고, 결제 API도 좌석을 잡기 전에 거절합니다.
> 에러가 나거나 데이터가 깨지지는 않습니다 — **조용히 판매만 안 됩니다.**
> 타입 체크·빌드는 멀쩡히 통과하므로 배포 전에 눈으로 확인하는 수밖에 없습니다.

> 🔴 **Shopify 스토어가 두 개입니다** (2026-09-05 확인). Variant ID는 스토어마다 다릅니다.
>
> | 용도 | 스토어 도메인 | 환경변수 보관 |
> |---|---|---|
> | 운영 | `bitomun.myshopify.com` | `.env.main` · Vercel Production |
> | 테스트/로컬 | `bitcoin-korea-conference-2.myshopify.com` | `.env` |
>
> 한쪽 스토어의 variant ID를 다른 쪽 환경에 넣으면 **결제 마지막 단계에서 실패합니다.**
> 환경변수를 넣기 전에 그 환경이 어느 스토어를 보는지 반드시 확인하세요.

---

## 1. Shopify 상품 만들기 · 주최측

- [x] **운영 스토어(`bitomun`)에 생성 완료** — 2026-09-05
  - 제목 `Main Day Ticket` / handle `main-day-ticket` / ₩140,000 / `Conference Ticket`
  - 상태 활성 + 모든 채널 게시, 재고 추적 꺼짐, `requiresShipping: false`
  - **Variant ID: `43281527832670`**
  - Storefront API `cartCreate` 왕복 테스트 통과 (총액 ₩140,000)
- [ ] **테스트 스토어에는 아직 없습니다.** 로컬에서 Main Day를 확인하려면 같은 설정으로
      `bitcoin-korea-conference-2`에도 만들고, 그 스토어의 variant ID를 `.env`에 넣으세요.
      (안 만들면 로컬에서 Main Day 카드가 마감으로 표시됩니다 — 설계된 안전 동작)

> **product ID ≠ variant ID.** 관리자 상품 페이지 URL의 `.../products/7759921709150`은 product ID입니다.
> 단일 옵션 상품은 관리자 화면에 variant ID가 드러나지 않으므로, Storefront API로 조회하는 게 확실합니다:
>
> ```bash
> set -a; . ./.env.main; set +a
> curl -s -X POST "https://${NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json" \
>   -H "Content-Type: application/json" \
>   -H "X-Shopify-Storefront-Access-Token: ${SHOPIFY_STOREFRONT_ACCESS_TOKEN}" \
>   -d '{"query":"{ product(handle: \"main-day-ticket\") { variants(first:5){ nodes { id } } } }"}'
> ```
>
> `https://<스토어>.myshopify.com/products/<handle>.json`도 variant ID를 주지만 **ID 공간이 다릅니다.**
> 이 값을 환경변수에 넣으면 안 됩니다.

## 2. 환경변수 등록 · 개발 + 주최측

- [x] `.env.main`에 운영 값 등록 완료
  ```
  SHOPIFY_VARIANT_MAINDAY=43281527832670
  ```
- [ ] **Vercel Production에 추가**: `SHOPIFY_VARIANT_MAINDAY=43281527832670`
- [ ] **Vercel Preview / Development**: 먼저 이 환경들의 `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`이
      어느 스토어인지 확인하세요.
  - 운영(`bitomun`)을 본다면 → 위와 같은 값
  - 테스트 스토어를 본다면 → **위 값을 넣지 말 것.** 테스트 스토어에 상품을 만든 뒤 그쪽 variant ID 사용
  - 비워두면 Main Day만 마감으로 표시되고 나머지 티어는 정상 동작합니다 (안전한 기본값)
- [ ] 로컬 `.env` — 테스트 스토어에 상품을 만든 경우에만 추가
- [ ] 등록 후 재배포 (환경변수는 재배포해야 반영됩니다)

## 3. 주문 확인 이메일 템플릿 · 주최측

`_docs/email.html`은 이미 수정해 두었습니다. 이 파일 내용을 Shopify에 붙여넣기만 하면 됩니다.

- [x] Shopify Admin → Settings → Notifications → **Order confirmation**
- [x] `_docs/email.html` 전체를 복사해 붙여넣기
- [x] 반영 확인 — 2026-09-05 운영 스토어 템플릿에서 `main-day-ticket` **2곳(85행·173행)** 확인 완료
  ```liquid
  {% when 'general-ticket' %}General Ticket{% when 'main-day-ticket' %}Main Day Ticket
  ```

> 이걸 빼먹으면 이메일에 상품명이 Shopify 기본값으로 찍힙니다. 치명적이진 않지만 표기가 어긋납니다.

## 4. 할인코드 범위 확인 · 주최측

Main Day는 **얼리버드 할인 대상이 아닙니다** (항상 정가 ₩140,000).

- [x] `EARLYBIRD20` / `EARLYBIRD10`의 적용 대상에 **Main Day Ticket을 넣지 않기**
- [x] 할인코드가 **컬렉션 단위**로 걸려 있다면, 새 상품이 자동으로 포함되지 않는지 확인

> 검증 완료 (2026-09-05): 운영 스토어에서 Main Day 카트에 두 코드를 적용해본 결과
> 모두 `applicable: false`, 총액 ₩140,000 유지. Shopify 쪽 추가 작업 불필요.

> 코드 레벨에서 mainday는 항상 `regular` 페이즈라 할인코드가 붙지 않지만, Shopify 쪽도 맞춰두면 이중 안전장치가 됩니다.

## 5. 현장 스태프 브리핑 · 주최측

- [ ] **11/8(Day 2, 명동) 입구 스태프에게 전달**: QR 스캔 시 시안색 `NOV 7 ONLY · 11/7 전용` 뱃지가 뜨면 입장 거부
- [ ] 스캐너는 **날짜를 검증하지 않습니다** — 판단은 스태프 몫입니다 (아래 "남은 결정" 참고)

## 6. 판매 목표 재산정 · 주최측

- [ ] Main Day와 제너럴은 **같은 522석을 공유**합니다. Main Day가 팔리는 만큼 제너럴 잔여가 함께 줄어듭니다.
- [ ] 관리자 대시보드에서 제너럴과 Main Day의 **잔여석은 항상 같은 숫자**로 표시됩니다 — 합산하지 마세요 (화면에도 안내 문구를 넣어두었습니다)
- [ ] 필요하다면 Main Day 판매 상한을 별도로 논의 (현재 시스템은 Main Day가 522석을 다 가져가도 막지 않습니다)

## 7. 배포 후 스모크 테스트 · 개발 + 주최측

- [ ] 실제로 Main Day 좌석 1개 결제 → 결제 완료
- [ ] 주문 확인 이메일 수신, QR 이미지가 보이는지 확인
- [ ] `/admin/checkin`에서 그 QR을 스캔 → 초록 WELCOME + **MAIN DAY** + `NOV 7 ONLY · 11/7 전용` 뱃지
- [ ] 같은 QR 재스캔 → 노랑 ALREADY CHECKED IN
- [ ] 테스트 주문 환불 처리
- [ ] `/admin` 예약 현황 탭에서 MAIN DAY 타일에 판매 1건이 잡히는지 확인

---

## 확정된 운영 방침 · 스태프 브리핑에 반영해주세요

체크인은 **날짜를 보지 않습니다.** Main Day 구매자가 11/7에 체크인하면 11/8에는 "이미 체크인됨"으로 걸리지만,
**11/7을 건너뛰고 11/8에 처음 스캔하면 초록 WELCOME이 뜹니다.**

지금은 결정하신 대로 **뱃지 표시만** 하고 통제는 스태프 판단에 맡긴 상태입니다.
시스템으로 막고 싶으면 `lib/checkin.ts`에 두 줄이면 되고, Redis 키 구조나 이미 발급된 QR은 건드리지 않습니다.

- [x] **그대로 둔다** — 날짜 통제를 시스템에 넣는 것은 현 운영 규모에 과하다고 판단해 뱃지 표시만 유지합니다.
- [ ] ~~11/8 이후 Main Day 스캔을 거부하도록 막는다~~ (보류)

---

## 참고 — 코드 쪽에서 이미 끝난 것

손댈 필요 없습니다. 무엇이 바뀌었는지만 알아두시면 됩니다.

| 항목 | 내용 |
|---|---|
| 티켓 카드 | 학생 · **Main Day** · 제너럴 · 프리미엄 · VIP 5장. "11월 7일 행사만 참석" 설명 포함 |
| 구매 페이지 | `/tickets/mainday` — 구역 A·G·H·J·K·L·M·N·F로 제너럴과 완전히 동일 |
| 가격 | ₩140,000 정가 고정, 얼리버드 및 2차 수량 카운터에서 제외 |
| QR·체크인 | 발급·이메일·검증 파이프라인 **무변경**. 스캐너에 색상·라벨·뱃지만 추가 |
| 관리자 | 좌석 현황에 MAIN DAY 타일, 구매 내역 티어 필터, CSV에 `MAINDAY` |
| FAQ | "별도 티켓이 아니라 하나의 티켓" 문구를 ko/en 양쪽 수정 — **코드와 같은 배포에 나가야 합니다** |
| SEO | JSON-LD 최저가가 240,000 → 140,000으로 변경 |
| 약관 | 티켓 카테고리 목록에 Main Day 추가 |

검증 완료: 타입 체크 0 에러 / 구역·가격·좌석 도식 렌더 확인 / 서버측 좌석 티어 검증 동작 /
QR 서명·검증 왕복 성공 / 기존 판매 232석 집계 수치 변화 없음 (마이그레이션 불필요).
