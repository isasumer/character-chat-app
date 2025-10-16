import { RefObject } from "react";

export function scrollToElement(
  elementRef: RefObject<HTMLElement | null>,
  behavior: ScrollBehavior = "smooth"
): void {
  elementRef.current?.scrollIntoView({ behavior });
}

export function scrollToBottom(
  elementRef: RefObject<HTMLElement | null>,
  delay: number = 0,
  behavior: ScrollBehavior = "smooth"
): void {
  if (delay > 0) {
    setTimeout(() => {
      scrollToElement(elementRef, behavior);
    }, delay);
  } else {
    scrollToElement(elementRef, behavior);
  }
}

export function scrollToTop(
  elementRef: RefObject<HTMLElement | null>,
  behavior: ScrollBehavior = "smooth"
): void {
  if (elementRef.current) {
    elementRef.current.scrollTo({ top: 0, behavior });
  }
}

export function isScrolledToBottom(
  element: HTMLElement | null,
  threshold: number = 50
): boolean {
  if (!element) return false;
  const { scrollTop, scrollHeight, clientHeight } = element;
  return scrollHeight - scrollTop - clientHeight < threshold;
}

