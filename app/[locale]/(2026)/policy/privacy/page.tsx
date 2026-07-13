import { getTranslations } from "next-intl/server";
import { pageMetadata } from "../../_utils/metadata";
import {
  PolicyHeading,
  PolicyList,
  PolicyParagraph,
  PolicyStrong,
  PolicyTitle,
} from "../_components/policy";

export async function generateMetadata() {
  const t = await getTranslations("Policy");
  return pageMetadata({
    pathname: "/policy/privacy",
    title: t("privacyTitle"),
    description: t("privacyDescription"),
  });
}

export default function PrivacyPolicyPage() {
  return (
    <main className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <article className="max-w-4xl mx-auto">
        <PolicyTitle>개인정보 처리방침</PolicyTitle>
        <PolicyParagraph>
          비토문(이하 “회사”)은 ‘비트코인 코리아 컨퍼런스(Bitcoin Korea
          Conference)’ 참가자의 개인정보 보호를 소중히 여기며, 대한민국
          「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한
          법률」 등 관련 법령을 준수하고 있습니다. 본 개인정보 처리방침은
          개인정보의 수집 목적, 이용 방법, 그리고 이를 보호하기 위해 취해지는
          조치들을 안내합니다. 동의 여부를 결정하시기 전에 다음 내용을 주의
          깊게 검토해 주시기 바랍니다.
        </PolicyParagraph>

        <PolicyHeading>1. 개인정보의 수집 및 이용 목적</PolicyHeading>
        <PolicyParagraph>
          이용자가 제공한 모든 정보는 오직 다음의 목적으로만 사용되며, 목적
          이외의 용도로는 사용되지 않습니다.
        </PolicyParagraph>
        <PolicyList>
          <li>
            <PolicyStrong>수집 주체:</PolicyStrong> 비토문
          </li>
          <li>
            <PolicyStrong>수집 및 이용 목적:</PolicyStrong> 비트코인 코리아
            컨퍼런스 참가자 관리, 행사 운영, 티켓 발권 및 확인(좌석 배정 포함),
            결제 및 환불 처리, 행사 관련 고지사항 전달, 뉴스레터 발송 및 기타
            홍보 자료 제공
          </li>
          <li>
            <PolicyStrong>수집하는 개인정보 항목:</PolicyStrong>
            <PolicyList nested>
              <li>
                필수 항목: 이름/닉네임, 이메일 주소, 결제 정보(카드 정보, 계좌
                정보 등), 주소
              </li>
              <li>선택 항목: 국적, 소속, 직책, 거주 국가, 전화번호</li>
              <li>
                학생 티켓 신청자: 생년월일, 학생증 또는 재학증명서 상의 확인
                정보(성명, 학교명) — 현장 확인 용도로만 사용하며 사본을
                보관하지 않습니다.
              </li>
              <li>
                자동 수집 항목: IP 주소, 쿠키, 방문 기록, 서비스 이용 기록
              </li>
            </PolicyList>
          </li>
          <li>
            <PolicyStrong>보유 및 이용 기간:</PolicyStrong> 이메일 구독자
            외에는 행사 종료 후 1년. 다만, 「전자상거래 등에서의 소비자보호에
            관한 법률」 등 관계 법령의 규정에 의하여 보존할 필요가 있는 경우,
            회사는 해당 법령에서 정한 기간 동안 정보를 보관합니다.
            <PolicyList nested>
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
            </PolicyList>
          </li>
        </PolicyList>

        <PolicyHeading>2. 이용자의 권리 및 그 영향</PolicyHeading>
        <PolicyList>
          <li>
            <PolicyStrong>동의 거부 권리:</PolicyStrong> 이용자는 개인정보
            제공에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우
            비트코인 코리아 컨퍼런스 참가 및 관련 활동에 제한이 있을 수
            있습니다.
          </li>
          <li>
            <PolicyStrong>동의 철회 권리:</PolicyStrong> 이용자는 개인정보를
            제공한 후 언제든지 동의를 철회할 수 있습니다. 다만, 동의 철회 시
            중요 행사 안내를 받지 못하거나 행사 참가에 제한이 따를 수 있습니다.
          </li>
          <li>
            <PolicyStrong>열람, 정정 및 삭제 권리:</PolicyStrong> 이용자는 행사
            진행에 지장이 가지 않는다면 언제든지 자신의 개인정보에 대한 열람,
            정정 또는 삭제를 요청할 수 있으며, 회사는 이에 대해 지체 없이
            조치합니다.
          </li>
          <li>
            <PolicyStrong>홍보성 정보 수신 거부:</PolicyStrong> 뉴스레터 및
            홍보 자료 수신에 대한 동의는 언제든지 철회할 수 있으며, 수신 거부
            시에도 결제·환불 등 거래 관련 필수 고지사항은 발송될 수 있습니다.
          </li>
        </PolicyList>

        <PolicyHeading>3. 개인정보의 제3자 제공</PolicyHeading>
        <PolicyParagraph>
          회사는 이용자의 개인정보를 본 방침에서 명시한 범위 내에서만 처리하며,
          이용자의 사전 동의 없이는 원래의 범위를 초과하여 처리하거나 제3자에게
          제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.
        </PolicyParagraph>
        <PolicyList>
          <li>
            <PolicyStrong>제공받는 자:</PolicyStrong> 엑심베이
          </li>
          <li>
            <PolicyStrong>제공 목적:</PolicyStrong> 결제 처리, 환불 처리 및
            결제 관련 분쟁 해결
          </li>
          <li>
            <PolicyStrong>제공하는 개인정보 항목:</PolicyStrong> 이름, 이메일
            주소, 결제 정보(카드 정보, 계좌 정보 등)
          </li>
          <li>
            <PolicyStrong>보유 및 이용 기간:</PolicyStrong> 결제 완료 후 5년
            (「전자상거래 등에서의 소비자보호에 관한 법률」에 따른 의무 보유
            기간)
          </li>
        </PolicyList>

        <PolicyHeading>4. 제3자 제공에 대한 이용자의 권리</PolicyHeading>
        <PolicyList>
          <li>
            <PolicyStrong>동의 거부 권리:</PolicyStrong> 이용자는 제3자 제공에
            대한 동의를 거부할 수 있습니다. 다만, 동의를 거부할 경우 결제가
            불가능하며, 이로 인해 행사 참가에 제한이 있을 수 있습니다.
          </li>
          <li>
            <PolicyStrong>동의 철회 영향:</PolicyStrong> 동의를 철회할 경우
            결제 처리 및 환불 처리에 제한이 발생할 수 있습니다.
          </li>
        </PolicyList>

        <PolicyHeading>5. 개인정보 처리 업무의 위탁</PolicyHeading>
        <PolicyParagraph>
          회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리 업무의
          일부를 외부 전문업체에 위탁하고 있습니다.
        </PolicyParagraph>
        <PolicyList>
          <li>Eximbay, OpenNode: 결제 처리 및 환불</li>
          <li>Shopify: 웹사이트 호스팅 및 운영</li>
          <li>Shopify, Google: 뉴스레터 및 안내 메일 발송</li>
          <li>주식회사 카카오: 카카오톡 채널을 통한 행사 안내 메시지 발송</li>
        </PolicyList>
        <PolicyParagraph>
          회사는 「개인정보 보호법」 제26조에 따라 위탁계약 체결 시 위탁업무
          수행 목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한,
          수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서에
          명시하고 있습니다. 또한, 수탁자가 개인정보를 안전하게 처리하는지
          감독하고 있습니다.
        </PolicyParagraph>
        <PolicyParagraph>
          ※ 국외 사업자(호스팅 등)에 위탁하는 경우, 이전되는 국가, 이전 일시 및
          방법, 이전받는 자의 성명 및 연락처, 이전 목적과 보유 기간은 각
          수탁사의 정책 페이지를 통해 확인하실 수 있습니다.
        </PolicyParagraph>

        <PolicyHeading>6. 개인정보의 안전성 확보 조치</PolicyHeading>
        <PolicyParagraph>
          회사는 이용자의 개인정보 안전성 확보를 위해 다음과 같은 조치를 취하고
          있습니다.
        </PolicyParagraph>
        <PolicyList>
          <li>
            <PolicyStrong>관리적 조치:</PolicyStrong> 내부관리계획의 수립 및
            시행, 개인정보 취급 인원의 최소화 및 정기적 교육 수행
          </li>
          <li>
            <PolicyStrong>기술적 조치:</PolicyStrong> 개인정보처리시스템 등의
            접근권한 관리, 접근통제시스템 설치, 개인정보의 암호화, 보안프로그램
            설치
          </li>
          <li>
            <PolicyStrong>물리적 조치:</PolicyStrong> 데이터 보관 장소 등
            비인가자에 대한 출입통제
          </li>
        </PolicyList>

        <PolicyHeading>7. 개인정보 보호책임자</PolicyHeading>
        <PolicyParagraph>
          회사는 이용자의 개인정보를 보호하고 관련 불만을 처리하기 위하여
          다음과 같이 개인정보 보호책임자를 지정하고 있습니다.
        </PolicyParagraph>
        <PolicyList>
          <li>
            <PolicyStrong>개인정보 보호책임자:</PolicyStrong> 박성현 (대표)
          </li>
          <li>
            <PolicyStrong>소속:</PolicyStrong> 비토문
          </li>
          <li>
            <PolicyStrong>이메일:</PolicyStrong> admin@bitomun.com
          </li>
        </PolicyList>

        <PolicyHeading>8. 권익침해 구제방법</PolicyHeading>
        <PolicyParagraph>
          이용자는 개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에
          문의하실 수 있습니다.
        </PolicyParagraph>
        <PolicyList>
          <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
          <li>개인정보 분쟁조정위원회 (kopico.go.kr / 1833-6972)</li>
          <li>대검찰청 사이버수사과 (spo.go.kr / 국번없이 1301)</li>
          <li>경찰청 사이버수사국 (ecrm.police.go.kr / 국번없이 182)</li>
        </PolicyList>

        <PolicyHeading>9. 개인정보 처리방침의 변경</PolicyHeading>
        <PolicyParagraph>
          본 개인정보 처리방침은 2026년 04월 11일부터 효력이 발생합니다. 법령
          및 방침 변경에 따른 내용의 추가, 삭제 또는 수정이 있을 시에는 변경
          사항 시행 최소 7일 전부터 웹사이트를 통해 공지할 예정입니다.
        </PolicyParagraph>
      </article>
    </main>
  );
}
