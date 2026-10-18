"use client";

import { useEffect } from "react";
import { saveUtmFromUrl } from "@/lib/utm";

/** 광고 링크로 들어온 순간의 UTM을 기억해 둔다. 루트 레이아웃에 한 번만 둔다. */
export default function UtmCapture() {
  useEffect(() => {
    saveUtmFromUrl();
  }, []);

  return null;
}
