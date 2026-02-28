import { ExpressiveRegistry } from "./registry";

export class DomObserver {
  private mutationObserver: MutationObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private readonly registry: ExpressiveRegistry,
    private readonly onDirty: () => void,
  ) {}

  attach(): void {
    this.mutationObserver = new MutationObserver((records) => {
      let changed = false;
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement) {
            changed = this.registry.scan(node) || changed;
          }
        }
      }
      changed = this.registry.removeDisconnected() || changed;
      if (changed) this.onDirty();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-material"],
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.onDirty();
    });
    this.resizeObserver.observe(document.body);
    window.addEventListener("resize", this.onDirty, { passive: true });
    window.addEventListener("scroll", this.onDirty, { passive: true });
  }

  detach(): void {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this.onDirty);
    window.removeEventListener("scroll", this.onDirty);
  }
}
