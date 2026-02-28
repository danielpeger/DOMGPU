import type { GlobalInteractionState, SceneNode } from "../core/types";

export class InteractionTracker {
  private state: GlobalInteractionState;
  private lastPointerTime = performance.now();
  private lastCursorX = 0;
  private lastCursorY = 0;
  private lastScrollY = window.scrollY;
  private lastScrollTime = performance.now();
  private activeElement: HTMLElement | null = null;

  constructor() {
    this.state = {
      cursorX: 0,
      cursorY: 0,
      cursorVelX: 0,
      cursorVelY: 0,
      scrollVelocity: 0,
      time: 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  }

  attach(): void {
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this.onPointerDown, { passive: true });
    window.addEventListener("pointerup", this.onPointerUp, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
  }

  detach(): void {
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
  }

  updateTime(nowMs: number): void {
    this.state.time = nowMs * 0.001;
  }

  getState(): GlobalInteractionState {
    return this.state;
  }

  updateElementStates(nodes: SceneNode[]): void {
    for (const node of nodes) {
      const hover = node.element.matches(":hover") ? 1 : 0;
      const focus = node.element.matches(":focus, :focus-visible") ? 1 : 0;
      const active = this.activeElement === node.element ? 1 : 0;
      node.interaction.hover = damp(node.interaction.hover, hover, 0.18);
      node.interaction.focus = damp(node.interaction.focus, focus, 0.25);
      node.interaction.active = damp(node.interaction.active, active, 0.2);
    }
  }

  private onPointerMove = (event: PointerEvent): void => {
    const now = performance.now();
    const dt = Math.max(1, now - this.lastPointerTime);
    const dx = event.clientX - this.lastCursorX;
    const dy = event.clientY - this.lastCursorY;
    this.state.cursorX = event.clientX;
    this.state.cursorY = event.clientY;
    this.state.cursorVelX = (dx / dt) * 1000;
    this.state.cursorVelY = (dy / dt) * 1000;
    this.lastPointerTime = now;
    this.lastCursorX = event.clientX;
    this.lastCursorY = event.clientY;
  };

  private onPointerDown = (event: PointerEvent): void => {
    this.activeElement = event.target instanceof HTMLElement ? event.target : null;
  };

  private onPointerUp = (): void => {
    this.activeElement = null;
  };

  private onScroll = (): void => {
    const now = performance.now();
    const dt = Math.max(1, now - this.lastScrollTime);
    const dy = window.scrollY - this.lastScrollY;
    this.state.scrollVelocity = (dy / dt) * 1000;
    this.lastScrollY = window.scrollY;
    this.lastScrollTime = now;
  };

  private onResize = (): void => {
    this.state.viewportWidth = window.innerWidth;
    this.state.viewportHeight = window.innerHeight;
  };
}

function damp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}
