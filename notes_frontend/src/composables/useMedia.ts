import { onMounted, onUnmounted, ref } from "vue";

/**
 * PUBLIC_INTERFACE
 */
export function useMedia() {
  const isMobile = ref(false);

  function compute() {
    isMobile.value = window.matchMedia("(max-width: 900px)").matches;
  }

  onMounted(() => {
    compute();
    window.addEventListener("resize", compute);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", compute);
  });

  return { isMobile };
}
