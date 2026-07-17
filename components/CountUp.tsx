"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  // duration/bounce 로 스프링을 정의한다 — duration 이 실제 시간이 되어 아래 onEnd
  // 타이머와도 맞는다. stiffness/damping/mass 를 주면 motion 이 duration·bounce 를
  // 무시하므로 셋 다 주지 않는다.
  // 예전엔 damping=20+40/duration, stiffness=100/duration 을 파생시켰는데, 둘의 비가
  // 100/(20·duration+40) 으로 묶여 어떤 duration 을 줘도 심한 과감쇠(ζ≈3)였다.
  // 그래서 목표값이 클수록 마지막 자릿수가 기어갔다 (to=1000 이 1000 에 닿는 데 8초).
  //
  // ★ useSpring 의 duration 은 밀리초다 (motion-dom springDefaults.duration = 800).
  //   초로 주면 findSpring 이 최소값 0.01초로 clamp 해 애니메이션이 사라진다.
  //   이 컴포넌트의 duration prop 은 초이므로(호출부·onEnd 타이머 모두 초 기준)
  //   반드시 변환해서 넘긴다.
  // bounce=0: 오버슛하면 카운터가 목표값을 넘었다 되돌아와 오작동처럼 보인다.
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(() => {
        if (typeof onEnd === "function") {
          onEnd();
        }
      }, delay * 1000 + duration * 1000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;

        const options: Intl.NumberFormatOptions = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          latest
        );

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });

    return () => unsubscribe();
  }, [springValue, separator, maxDecimals]);

  // 서버 렌더링과 JS 비활성 환경에서도 최종 값이 보이도록 children으로 출력한다.
  // 마운트 후에는 위 이펙트들이 textContent를 덮어쓰며 애니메이션을 시작한다.
  return (
    <span className={className} ref={ref}>
      {String(direction === "down" ? from : to)}
    </span>
  );
}
