export class ExpressiveRegistry {
  private readonly elements = new Set<HTMLElement>();

  scan(root: ParentNode = document): boolean {
    let changed = false;
    const found = root.querySelectorAll<HTMLElement>(
      ".expressive, [data-material], [style*='--expressive-material']",
    );
    for (const el of found) {
      if (this.isExpressive(el) && !this.elements.has(el)) {
        this.elements.add(el);
        changed = true;
      }
    }
    return changed;
  }

  removeDisconnected(): boolean {
    let changed = false;
    for (const el of this.elements) {
      if (!el.isConnected) {
        this.elements.delete(el);
        changed = true;
      }
    }
    return changed;
  }

  getElements(): readonly HTMLElement[] {
    return Array.from(this.elements);
  }

  private isExpressive(el: HTMLElement): boolean {
    if (el.classList.contains("expressive")) return true;
    if (el.dataset.material) return true;
    const computedMaterial = getComputedStyle(el).getPropertyValue(
      "--expressive-material",
    );
    return computedMaterial.trim().length > 0;
  }
}
