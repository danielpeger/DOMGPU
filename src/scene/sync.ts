import type { SceneNode } from "../core/types";
import { extractStyle } from "../dom/styleExtractor";
import { SceneGraph } from "./sceneGraph";

let idCounter = 0;
const ids = new WeakMap<HTMLElement, string>();

function getElementId(el: HTMLElement): string {
  const existing = ids.get(el);
  if (existing) return existing;
  idCounter += 1;
  const id = `expressive-${idCounter}`;
  ids.set(el, id);
  return id;
}

export function syncSceneGraph(
  registryElements: readonly HTMLElement[],
  graph: SceneGraph,
): SceneNode[] {
  const seen = new Set<string>();
  const nodes: SceneNode[] = [];

  for (const el of registryElements) {
    const id = getElementId(el);
    seen.add(id);
    const rect = el.getBoundingClientRect();
    const styles = extractStyle(el);
    const existing = graph.getNodes().find((node) => node.id === id);

    const node: SceneNode = {
      id,
      element: el,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
      borderRadius: styles.borderRadius,
      color: styles.color,
      material: styles.material,
      zIndex: styles.zIndex,
      interaction: existing?.interaction ?? { hover: 0, focus: 0, active: 0 },
    };
    graph.upsert(node);
    nodes.push(node);
  }

  for (const node of graph.getNodes()) {
    if (!seen.has(node.id)) graph.remove(node.id);
  }

  return nodes;
}
