import type { SceneNode } from "../core/types";

export class SceneGraph {
  private readonly nodesById = new Map<string, SceneNode>();
  private dirty = true;

  upsert(node: SceneNode): void {
    this.nodesById.set(node.id, node);
    this.dirty = true;
  }

  remove(id: string): void {
    if (this.nodesById.delete(id)) this.dirty = true;
  }

  getNodes(): SceneNode[] {
    return Array.from(this.nodesById.values()).sort((a, b) => a.zIndex - b.zIndex);
  }

  has(id: string): boolean {
    return this.nodesById.has(id);
  }

  markDirty(): void {
    this.dirty = true;
  }

  consumeDirty(): boolean {
    const wasDirty = this.dirty;
    this.dirty = false;
    return wasDirty;
  }
}
