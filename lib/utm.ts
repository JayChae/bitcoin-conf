// 광고 링크로 들어온 순간의 UTM을 브라우저에 기억해 두었다가 Shopify 주문에 남긴다.
// 결제는 Shopify 도메인에서 끝나 GA가 따라가지 못하므로, 주문 자체에 유입 경로를 적어둔다.

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "bkc:utm";
// 광고를 누르고 한 달 안에 산 경우까지만 그 광고로 들어온 주문으로 본다.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
// 캠페인·광고 이름이 들어가니 넉넉히 두되, 임의의 긴 값이 장바구니 속성으로 흘러가지 않게 자른다.
const MAX_VALUE_LENGTH = 200;

/** 믿을 수 없는 입력(URL 쿼리, 요청 본문)에서 UTM 키만 골라 문자열로 정리한다. */
export function pickUtm(source: unknown): UtmParams {
  const utm: UtmParams = {};
  if (!source || typeof source !== "object") return utm;

  const record = source as Record<string, unknown>;
  for (const key of UTM_KEYS) {
    const value = record[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
    if (trimmed) utm[key] = trimmed;
  }
  return utm;
}

/**
 * 현재 URL에 UTM이 있으면 저장한다. 다른 광고로 다시 들어오면 덮어쓴다 —
 * 마지막으로 누른 광고를 기준으로 본다.
 */
export function saveUtmFromUrl(): void {
  const utm = pickUtm(
    Object.fromEntries(new URLSearchParams(window.location.search)),
  );
  if (Object.keys(utm).length === 0) return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ utm, savedAt: Date.now() }),
    );
  } catch {
    // 비공개 모드 등 저장소를 못 쓰는 환경 — 주문에 UTM이 빠질 뿐 구매에는 지장 없다.
  }
}

/** 저장된 UTM. 없거나 기간이 지났으면 빈 객체. */
export function getStoredUtm(): UtmParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const { utm, savedAt } = JSON.parse(raw);
    if (typeof savedAt !== "number" || Date.now() - savedAt > MAX_AGE_MS) {
      return {};
    }
    return pickUtm(utm);
  } catch {
    return {};
  }
}
