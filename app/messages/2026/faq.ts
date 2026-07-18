import type { Locale } from "@/i18n/routing";

export type FaqCta = {
  label: string;
  href: string;
};

export type FaqItem = {
  question: string;
  // 답변은 문단 배열로 관리한다 — 일부 답변은 여러 문단으로 나뉜다.
  answer: string[];
  // 선택: 답변 아래 붙는 보조 링크(내부 경로 또는 mailto).
  cta?: FaqCta;
};

// 이메일 주소는 답변 본문에서 자동으로 mailto 링크로 렌더된다(FaqAccordion 참고).
const faq: Record<Locale, FaqItem[]> = {
  ko: [
    {
      question: "비트코인을 잘 몰라도 참석해도 되나요?",
      answer: [
        "네, 오히려 그런 분들을 위해 만든 행사입니다. 어려운 용어 없이 시작할 수 있는 입문 세션과 워크숍이 준비되어 있고, 해외 연사 강연은 번역이 제공됩니다. 지난 컨퍼런스에도 처음 비트코인을 접하는 참가자들이 함께했으며, 참가자 후기가 그 답입니다. 더불어 2026 비트코인 코리아에서는 트레저리 기업들의 세션도 제공할 예정입니다. 개인을 넘어 법인 이상의 규모에서 비트코인을 어떻게 바라보고 이용하는지, 업계 관계자에게 직접 들으실 수 있습니다.",
        "반대로 비트코인을 많이 아는 분들을 위한 세션도 존재합니다. 비트코인의 기본 이론과 내용을 이미 알고 계신다면, 현직 비트코인 코어 개발자의 강연을 통해 비트코인의 방향성과 어떤 사안이 뒤에서 다루어지고 있는지 확인하실 수 있습니다.",
      ],
    },
    {
      question: "컨퍼런스에 참석하면 무엇을 경험할 수 있나요?",
      answer: [
        "온라인에서는 절대 얻을 수 없는 두 가지가 있습니다.",
        "AI 시대에 가장 희소해진 것은 정보가 아니라 사람이며, 결국 남는 것은 누구와 연결되어 있는가입니다. 강연장과 파티에서 시작되는 교류는 희소한 인적 네트워크를 얻는 가장 확실한 자리이며, 이를 위해 주최측은 다양한 행사를 기획하고 있습니다.",
        "온라인에는 답이 넘치지만, 무엇이 맞는지는 아무도 책임지지 않으며 맞는지 틀린지 확신하기 어렵습니다. 하지만 컨퍼런스에서는 실제로 만들고, 연구하고, 운영해온 사람들이 직접 답합니다. 검색으로는 가려낼 수 없는 정보의 출처를, 눈앞에서 확인하세요.",
      ],
    },
    {
      question: "행사장에서 비트코인 결제를 해보고 싶은데, 지갑이 없어도 되나요?",
      answer: [
        "괜찮습니다. 라이트닝 마켓에서는 굿즈·음식·아트를 비트코인으로 직접 구매해볼 수 있고, 지갑 설치부터 첫 결제까지 현장 스태프가 도와드립니다. 미리 준비하고 싶다면 Wallet of Satoshi 라이트닝 지갑 하나만 설치해 오시면 충분합니다.",
      ],
    },
    {
      question: "이틀 장소가 다른데, 하루만 참석해도 되나요?",
      answer: [
        "티켓 한 장으로 이틀 모두 입장할 수 있으며, 하루만 참석하셔도 됩니다. Day 1(11월 7일)은 코엑스에서 메인 강연이, Day 2(11월 8일)는 명동에서 열립니다. 두 장소는 별도 티켓이 아니라 하나의 티켓으로 참석이 가능한 컨퍼런스입니다.",
      ],
    },
    {
      question: "환불·양도는 어떻게 되나요?",
      answer: [
        "행사 30일 전까지는 전액, 14일 전까지는 50% 환불되며, 이후에는 환불이 어렵습니다. 구매 당일 자정 이전 취소는 전액 환불됩니다. 자세한 내용은 환불 정책을 확인하세요.",
      ],
      cta: { label: "환불 정책 보기", href: "/policy/refund" },
    },
    {
      question: "티켓은 어떻게 받나요? 현장에서도 살 수 있나요?",
      answer: [
        "결제가 완료되면 등록하신 이메일로 티켓(QR)이 즉시 발송되며, 행사 당일 입구에서 QR을 보여주시면 입장권을 드립니다. 메일이 오지 않았다면 스팸함 확인 후 admin@bitomun.com으로 연락 주세요.",
      ],
    },
  ],
  en: [
    {
      question: "Can I attend even if I don't know much about Bitcoin?",
      answer: [
        "Absolutely — in fact, this event was built with exactly those people in mind. We've prepared beginner sessions and workshops you can follow without any jargon, and talks by international speakers come with translation. Newcomers encountering Bitcoin for the first time joined our past conferences, and their reviews say it best. On top of that, Bitcoin Korea 2026 will feature sessions from treasury companies, so you can hear directly from industry insiders how Bitcoin is viewed and used not just by individuals, but at the corporate scale and beyond.",
        "On the other end, there are sessions for those who know Bitcoin deeply. If you already understand the fundamentals, talks from working Bitcoin Core developers will show you where Bitcoin is heading and which issues are being worked through behind the scenes.",
      ],
    },
    {
      question: "What will I experience by attending the conference?",
      answer: [
        "There are two things you simply can't get online.",
        "In the age of AI, the scarcest thing is no longer information — it's people, and what ultimately remains is who you're connected to. The exchanges that begin in the lecture halls and at the parties are the surest place to build a rare human network, and the organizers are planning a range of events to make that happen.",
        "Online overflows with answers, but no one is accountable for which are right, and it's hard to be sure what's true. At the conference, the people who have actually built, researched, and operated in this space answer you directly. See for yourself, in person, the source behind information that search alone can never verify.",
      ],
    },
    {
      question:
        "I'd like to try paying with Bitcoin at the venue — is that okay if I don't have a wallet?",
      answer: [
        "No problem. At the Lightning Market you can buy goods, food, and art directly with Bitcoin, and our on-site staff will help you from installing a wallet to making your first payment. If you'd like to come prepared, just install one Lightning wallet — Wallet of Satoshi — and you're all set.",
      ],
    },
    {
      question: "The two days are at different venues — can I attend just one day?",
      answer: [
        "A single ticket gets you into both days, and you're welcome to come for just one. Day 1 (Nov 7) features the main talks at COEX, and Day 2 (Nov 8) takes place in Myeongdong. These aren't separate tickets — one ticket covers the entire conference across both venues.",
      ],
    },
    {
      question: "How do refunds and transfers work?",
      answer: [
        "You'll receive a full refund up to 30 days before the event, and 50% up to 14 days before; refunds aren't available after that. Cancellations before midnight on the day of purchase are fully refunded. See the refund policy for details.",
      ],
      cta: { label: "View refund policy", href: "/policy/refund" },
    },
    {
      question: "How do I receive my ticket? Can I buy one on-site?",
      answer: [
        "Once your payment is complete, your ticket (QR) is sent to your registered email right away. Show the QR at the entrance on the day of the event to receive your pass. If the email doesn't arrive, check your spam folder and contact us at admin@bitomun.com.",
      ],
    },
  ],
};

export default faq;
