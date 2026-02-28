export function createFrameLoop(frame: (nowMs: number) => void): () => void {
  let rafId = 0;
  let stopped = false;

  const loop = (nowMs: number): void => {
    if (stopped) return;
    frame(nowMs);
    rafId = window.requestAnimationFrame(loop);
  };

  rafId = window.requestAnimationFrame(loop);
  return () => {
    stopped = true;
    window.cancelAnimationFrame(rafId);
  };
}
