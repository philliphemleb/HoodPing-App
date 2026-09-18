import { ref, onBeforeUnmount } from "vue";

interface UseDragDismissOptions {
  onDismiss: () => void;
  onDragProgress?: (progress: number) => void;
  onSnapBack?: () => void;
}

const DISMISS_THRESHOLD = 150;

export function useDragDismiss(options: UseDragDismissOptions) {
  const dragY = ref(0);
  const isDragging = ref(false);
  let startY = 0;
  let startX = 0;

  function cleanupDragListeners() {
    document.removeEventListener("touchmove", onDragMove);
    document.removeEventListener("touchend", onDragEnd);
  }

  function onDragStart(e: TouchEvent) {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    isDragging.value = true;
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  }

  function onDragMove(e: TouchEvent) {
    if (!isDragging.value) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - startY;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      isDragging.value = false;
      cleanupDragListeners();
      return;
    }

    if (deltaY <= 0) return;

    e.preventDefault();
    dragY.value = deltaY;

    if (options.onDragProgress) {
      const progress = Math.min(dragY.value / DISMISS_THRESHOLD, 1);
      options.onDragProgress(progress);
    }
  }

  function onDragEnd() {
    isDragging.value = false;
    cleanupDragListeners();

    if (dragY.value >= DISMISS_THRESHOLD) {
      dragY.value = window.innerHeight;
      setTimeout(() => {
        options.onDismiss();
        dragY.value = 0;
      }, 200);
    } else {
      dragY.value = 0;
      options.onSnapBack?.();
    }
  }

  onBeforeUnmount(() => {
    cleanupDragListeners();
  });

  return { dragY, isDragging, onDragStart, cleanupDragListeners };
}
