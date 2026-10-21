import Script from "next/script";

const PIXEL_ID = "2900025777026743";

/**
 * Meta(인스타그램·페이스북) 광고용 픽셀 기본 코드. 루트 레이아웃에 한 번만 둔다.
 * 클라이언트 라우팅으로 페이지가 바뀔 때는 fbevents.js 가 history 변경을 감지해
 * PageView 를 자동으로 다시 보낸다 — 직접 보내면 중복 집계된다.
 */
export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
