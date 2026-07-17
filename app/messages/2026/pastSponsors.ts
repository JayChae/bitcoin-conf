import partners, { type Partner } from "./partners";

/**
 * 역대 후원사 — 지난 회차를 함께해준 후원사. 연도 구분 없이 한 목록으로 노출한다.
 *
 * 렌더는 PartnersGrid 를 그대로 재사용하므로 Sponsor 가 아니라 Partner 형태를 쓴다:
 *   - 로고 비율이 2:1~8.45:1 로 제각각이라 logoScale 의 체감 크기 보정이 필요하고,
 *   - 로고 폴라리티가 섞여 있어(검정/흰색 워드마크 혼재) 밝은 회색 타일이 필수다.
 * 그래서 로고도 /sponsors/*(다크 배경용 원본) 대신 트림된 /partners/*.webp 를 우선 쓴다.
 */

// /partners 세트에 이미 있는 로고는 이미지 경로로 찾아 치수·URL 을 단일 출처로 재사용한다.
// (트림/치수 갱신이 partners.ts 한 곳에서만 일어나 grid 비율이 어긋나지 않게.)
function fromPartners(image: string, altOverride?: string): Partner {
  const p = partners.find((x) => x.image === image);
  if (!p) throw new Error(`pastSponsors: ${image} not in partners.ts`);
  return altOverride ? { ...p, alt: altOverride } : p;
}

const pastSponsors: Partner[] = [
  fromPartners("/partners/2.webp"), // Human Rights Foundation
  fromPartners("/partners/1.webp"), // Wallet of Satoshi
  fromPartners("/partners/4.webp"), // Frostsnap
  fromPartners("/partners/6.webp"), // NonceLab
  fromPartners("/partners/3.webp"), // Blockstream
  // satoshi.fit / Saturday Block 은 /partners 세트에 없어 원본 PNG 사용.
  // 둘 다 알파 채널이 있어 회색 타일이 비쳐 보인다(흰 박스 아님).
  // 다만 satoshi.png 는 상하 투명 여백이 ~40% 남아 있어 이웃보다 작게 보인다.
  // logoScale 은 비율만 보정할 뿐 여백은 못 본다 → 트림 후 width/height 갱신이 근본 해결.
  { image: "/sponsors/satoshi.png", alt: "Satoshi.fit", width: 1181, height: 591, url: "https://www.satoshi.fit" },
  fromPartners("/partners/23.webp"), // Umbrel
  { image: "/sponsors/saturdayblock.png", alt: "Saturday Block", width: 9404, height: 3619, url: "https://www.saturdayblock.com" },
  fromPartners("/partners/8.webp", "Keystone Korea"), // partners.ts 는 "Keystone"
  fromPartners("/partners/5.webp"), // Seoul Bitcoin Meetup
];

export default pastSponsors;
