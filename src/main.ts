import "./index.css";

import { createFrameLoop } from "./core/frameLoop";
import { InteractionTracker } from "./dom/interactionState";
import { DomObserver } from "./dom/observer";
import { ExpressiveRegistry } from "./dom/registry";
import { RendererBuffers } from "./renderer/buffers";
import { initGpuContext } from "./renderer/gpuContext";
import { createPipeline } from "./renderer/pipeline";
import { renderFrame } from "./renderer/renderPass";
import { SceneGraph } from "./scene/sceneGraph";
import { syncSceneGraph } from "./scene/sync";

async function bootstrap(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("#expressive-layer");
  if (!canvas) throw new Error("Missing #expressive-layer canvas.");

  fitCanvas(canvas);
  window.addEventListener("resize", () => fitCanvas(canvas), { passive: true });

  const context = await initGpuContext(canvas);
  const buffers = new RendererBuffers(context.device);
  const pipeline = createPipeline(
    context.device,
    context.format,
    buffers.globalsBindGroupLayout,
  );

  const registry = new ExpressiveRegistry();
  const graph = new SceneGraph();
  const interaction = new InteractionTracker();
  interaction.attach();

  let sceneDirty = true;
  const markDirty = (): void => {
    sceneDirty = true;
    graph.markDirty();
  };

  registry.scan(document);
  const observer = new DomObserver(registry, markDirty);
  observer.attach();

  let currentNodes = syncSceneGraph(registry.getElements(), graph);
  let instanceCount = buffers.uploadInstances(currentNodes);

  createFrameLoop((nowMs) => {
    interaction.updateTime(nowMs);
    interaction.updateElementStates(currentNodes);
    buffers.uploadGlobals(interaction.getState());

    if (sceneDirty || graph.consumeDirty()) {
      registry.scan(document);
      registry.removeDisconnected();
      fitCanvas(canvas);
      currentNodes = syncSceneGraph(registry.getElements(), graph);
      instanceCount = buffers.uploadInstances(currentNodes);
      sceneDirty = false;
    } else {
      // Interaction values are animated on the CPU each frame, so keep the instance
      // buffer fresh even when layout did not change.
      instanceCount = buffers.uploadInstances(currentNodes);
    }

    renderFrame(context.device, context.context, pipeline, buffers, instanceCount);
  });
}

function fitCanvas(canvas: HTMLCanvasElement): void {
  const viewport = getDocumentViewportSize();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(viewport.width * dpr));
  canvas.height = Math.max(1, Math.floor(viewport.height * dpr));
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
}

function getDocumentViewportSize(): { width: number; height: number } {
  const root = document.documentElement;
  const width = Math.max(window.innerWidth, root.clientWidth, root.scrollWidth);
  const height = Math.max(window.innerHeight, root.clientHeight, root.scrollHeight);
  return { width, height };
}

bootstrap().catch((error: unknown) => {
  // Keep user-facing fallback simple for browsers without WebGPU.
  const message = error instanceof Error ? error.message : String(error);
  const notice = document.createElement("div");
  notice.style.position = "fixed";
  notice.style.bottom = "16px";
  notice.style.left = "16px";
  notice.style.padding = "8px 12px";
  notice.style.borderRadius = "8px";
  notice.style.background = "#2d1f31";
  notice.style.color = "#ffd7e5";
  notice.style.zIndex = "10000";
  notice.textContent = `DOMGPU failed to initialize: ${message}`;
  document.body.appendChild(notice);
});
