// 탭 순서에 실제로 들어가는 요소들 — tabindex="-1" 은 제외(다이얼로그 컨테이너·장식용 중복본).
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// aria-modal 을 선언한 다이얼로그는 Tab 이 뒤 페이지로 새어 나가면 안 된다.
// 백드롭에 가려 보이지 않는 요소로 포커스가 넘어가 Enter 로 실행되는 것을 막는다.
const trapFocus = (e: KeyboardEvent, container: HTMLElement) => {
  const items = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  if (items.length === 0) {
    e.preventDefault();
    container.focus();
    return;
  }

  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  // Tab 은 마지막 → 첫 번째로, Shift+Tab 은 첫 번째 → 마지막으로 되감는다.
  const [edge, wrapTo] = e.shiftKey ? [first, last] : [last, first];

  if (!container.contains(active) || active === container || active === edge) {
    e.preventDefault();
    wrapTo.focus();
  }
};

type ModalOptions = {
  // ESC·Tab 외에 추가로 처리할 키 (예: 라이트박스의 좌우 화살표)
  onKeyDown?: (e: KeyboardEvent) => void;
  // 넘기면 포커스 트랩 + 마운트 시 포커스 이동까지 담당한다.
  container?: HTMLElement | null;
};

// 모달 공통 동작: body 스크롤 락, ESC 닫기, 포커스 트랩, 포커스 복원.
// 반환값은 정리 함수 — useEffect cleanup 이나 ref cleanup 으로 그대로 돌려주면 된다.
export const openModal = (
  onClose: () => void,
  { onKeyDown, container }: ModalOptions = {}
) => {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  document.body.style.overflow = "hidden";
  container?.focus();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Tab" && container) {
      trapFocus(e, container);
      return;
    }
    onKeyDown?.(e);
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    // layout 의 body 가 overflow-y-auto 이므로 "" 로 되돌리면 클래스 값이 복원된다.
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeyDown);
    previouslyFocused?.focus?.();
  };
};
