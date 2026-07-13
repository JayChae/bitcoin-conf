import { getTranslations } from "next-intl/server";
import { pageMetadata } from "../../_utils/metadata";
import {
  PolicyDivider,
  PolicyHeading,
  PolicyList,
  PolicyOrderedList,
  PolicyParagraph,
  PolicyStrong,
  PolicyTitle,
} from "../_components/policy";

export async function generateMetadata() {
  const t = await getTranslations("Policy");
  return pageMetadata({
    pathname: "/policy/refund",
    title: t("refundTitle"),
    description: t("refundDescription"),
  });
}

export default function RefundPolicyPage() {
  return (
    <main className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <article className="max-w-4xl mx-auto">
        <PolicyTitle>비트코인 코리아 컨퍼런스 환불 정책</PolicyTitle>
        <PolicyParagraph>
          주최: 비토문 | 행사: 비트코인 코리아 컨퍼런스 (2026년 11월 7일 ~
          8일, 코엑스·전국은행연합회·커뮤니티하우스마실)
        </PolicyParagraph>

        <PolicyDivider />

        <PolicyHeading>1. 기본 환불 일정</PolicyHeading>
        <PolicyParagraph>
          환불은 행사 시작일(2026년 11월 7일)을 기준으로 취소 요청을 하신
          날짜에 따라 차등 적용됩니다. 모든 기준 시간은 한국 표준시(KST)
          자정(00:00)을 기준으로 합니다.
        </PolicyParagraph>
        <PolicyParagraph>
          환불 진행시 결제 대행사 수수료가 차감될 수 있습니다.
        </PolicyParagraph>
        <PolicyList>
          <li>
            <PolicyStrong>
              행사 시작 30일 전까지 (2026년 10월 8일 23:59 KST 이전):
            </PolicyStrong>{" "}
            100% 전액 환불
          </li>
          <li>
            <PolicyStrong>
              행사 시작 14일 전까지 (2026년 10월 24일 23:59 KST 이전):
            </PolicyStrong>{" "}
            50% 반액 환불
          </li>
          <li>
            <PolicyStrong>
              행사 시작 14일 이내 (2026년 10월 25일 00:00 KST부터):
            </PolicyStrong>{" "}
            환불 불가
          </li>
        </PolicyList>

        <PolicyHeading>2. 특별 조건</PolicyHeading>
        <PolicyList>
          <li>
            <PolicyStrong>당일 취소:</PolicyStrong> 구매 당일 자정(00:00 KST)
            이전에 취소할 경우 전액 환불이 가능합니다. 단, 행사 시작일 기준
            14일 이내에 구매하신 티켓에는 이 규정이 적용되지 않습니다.
          </li>
          <li>
            <PolicyStrong>결제 수단별 수수료 공제:</PolicyStrong> 환불 시
            다음과 같이 결제 대행사 수수료가 차감될 수 있습니다.
            <PolicyList nested>
              <li>
                <PolicyStrong>국내 카드 결제:</PolicyStrong> 별도의 추가 수수료
                없이 기존 결제 수단을 통해 취소 처리됩니다.
              </li>
              <li>
                <PolicyStrong>해외 카드 결제:</PolicyStrong> 카드사에서
                부과하는 해외 결제/환전 수수료가 환불 금액에서 차감될 수
                있습니다.
              </li>
              <li>
                <PolicyStrong>
                  비트코인(Bitcoin) 및 라이트닝 네트워크 결제:
                </PolicyStrong>{" "}
                환불 금액은 결제 당시의 원화(KRW) 가치를 기준으로 산정됩니다.
                비토문은 비트코인 가격 변동으로 인한 손실에 대해 책임을 지지
                않습니다. 환불은 이용자의 선택에 따라 법정화폐(기존 결제 수단)
                또는 비트코인으로 지급될 수 있습니다.
              </li>
            </PolicyList>
          </li>
          <li>
            <PolicyStrong>옵션 상품(네트워킹 파티 등):</PolicyStrong> 티켓과
            함께 구매한 옵션 상품은 티켓과 동일한 환불 일정이 적용됩니다.
          </li>
        </PolicyList>

        <PolicyHeading>3. 행사 취소 및 연기</PolicyHeading>
        <PolicyList>
          <li>
            <PolicyStrong>
              비토문의 귀책 사유로 행사가 취소되는 경우:
            </PolicyStrong>{" "}
            결제 수수료를 포함하여 100% 전액 환불해 드립니다.
          </li>
          <li>
            <PolicyStrong>
              불가항력(자연재해, 전염병, 정부 규제 등)으로 인해 행사가 취소되는
              경우:
            </PolicyStrong>{" "}
            이용자의 선택에 따라 100% 전액 환불 또는 다음 회차(Next Edition)
            행사 티켓으로의 전환 중 하나를 선택하실 수 있습니다.
          </li>
          <li>
            <PolicyStrong>행사가 연기되는 경우:</PolicyStrong> 티켓은 변경된
            일정으로 자동 전환됩니다. 변경된 일정에 참석이 불가능한 경우 100%
            전액 환불해 드립니다.
          </li>
        </PolicyList>

        <PolicyHeading>4. 환불 절차</PolicyHeading>
        <PolicyList>
          <li>
            <PolicyStrong>환불 신청 방법:</PolicyStrong> 아래 정보를 작성하여{" "}
            <PolicyStrong>admin@bitomun.com</PolicyStrong>으로 이메일을
            보내주시거나 Contact의 카카오톡 채널로 문의 바랍니다.
            <PolicyOrderedList nested>
              <li>주문 번호 (Order number)</li>
              <li>결제자의 성함 및 이메일 주소</li>
              <li>환불 사유</li>
              <li>환불받으실 계좌 정보</li>
            </PolicyOrderedList>
          </li>
          <li>
            <PolicyStrong>처리 기간:</PolicyStrong> 영업일 기준 3~5일
            소요됩니다.
          </li>
          <li>
            <PolicyStrong>환불 방법:</PolicyStrong> 기존에 결제하신 수단과
            동일한 방법으로 환불이 진행됩니다. (신용카드 → 카드 승인 취소, 계좌
            이체 → 해당 계좌로 송금, 비트코인 → 이용자 선택 수단으로 지급)
          </li>
          <li>
            <PolicyStrong>환불 지연 시:</PolicyStrong> 환불 처리가 지연될 경우,
            비토문은 「전자상거래 등에서의 소비자보호에 관한 법률」 및 동법
            시행령에서 정한 이율에 따라 지연 이자를 지급합니다.
          </li>
        </PolicyList>

        <PolicyHeading>5. 환불 불가 사유</PolicyHeading>
        <PolicyParagraph>
          다음의 경우에는 환불이 제한될 수 있습니다.
        </PolicyParagraph>
        <PolicyList>
          <li>이벤트 참여로 획득한 티켓</li>
          <li>행사에 참석한 이후 환불을 요청하는 경우</li>
          <li>이미 타인에게 양도되었거나 재판매된 티켓</li>
          <li>
            행사 시작 전 14일 이내에 취소를 요청한 경우 (제1조 기본 환불 일정
            적용)
          </li>
          <li>
            참가자 행동 수칙(Visitors Code of Conduct) 위반으로 인해 입장이
            거부된 경우
          </li>
        </PolicyList>

        <PolicyHeading>6. 문의 및 고객 지원</PolicyHeading>
        <PolicyParagraph>
          환불 및 행사 관련 문의는 아래 연락처를 이용해 주시기 바랍니다.
        </PolicyParagraph>
        <PolicyParagraph>
          문의 답변 가능 시간: 매주 월 - 금 요일, 09:00 - 18:00 KST
        </PolicyParagraph>
        <PolicyList>
          <li>
            <PolicyStrong>환불 관련 문의:</PolicyStrong> admin@bitomun.com
          </li>
          <li>
            <PolicyStrong>일반 문의:</PolicyStrong> admin@bitomun.com | 카카오톡
            채널 | X @btckoreaconf
          </li>
          <li>
            <PolicyStrong>답변 소요 시간:</PolicyStrong> 영업일 기준 1~2일
          </li>
        </PolicyList>

        <PolicyHeading>7. 준거법 및 관할 법원</PolicyHeading>
        <PolicyParagraph>
          본 환불 규정은 대한민국 법률에 의거하여 해석되고 규율됩니다. 본
          규정과 관련하여 발생하는 모든 분쟁은 이용자의 주소지를 관할하는
          지방법원을 관할 법원으로 합니다. 다만, 이용자의 주소 또는 거처가
          분명하지 아니한 경우에는 대한민국 민사소송법에 따라 관할 법원을
          정합니다.
        </PolicyParagraph>

        <PolicyDivider />

        <PolicyParagraph>시행일: 2026년 04월 11일</PolicyParagraph>
      </article>
    </main>
  );
}
