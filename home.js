const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const wideScreen = window.matchMedia("(min-width: 821px)");
const stage = document.querySelector(".device-stage");
const features = document.querySelector(".feature-layout");
let frame = 0;

function updateParallax() {
  frame = 0;
  if (reduceMotion.matches || !wideScreen.matches) {
    stage.style.removeProperty("--shot-y");
    return;
  }
  const { top, height } = stage.getBoundingClientRect();
  if (top >= window.innerHeight || top + height <= 0) return;
  const offset = Math.min(26, Math.max(0, (80 - top) * 0.08));
  stage.style.setProperty("--shot-y", `${offset}px`);
}

function scheduleParallax() {
  if (!frame) frame = window.requestAnimationFrame(updateParallax);
}

window.addEventListener("scroll", scheduleParallax, { passive: true });
window.addEventListener("resize", scheduleParallax);
reduceMotion.addEventListener("change", scheduleParallax);
scheduleParallax();

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    features.classList.add("in-view");
    observer.disconnect();
  }, { threshold: 0.2 });
  observer.observe(features);
}
