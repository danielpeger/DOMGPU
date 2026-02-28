export interface GpuContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}

export async function initGpuContext(canvas: HTMLCanvasElement): Promise<GpuContext> {
  if (!("gpu" in navigator)) {
    throw new Error("WebGPU is not supported in this browser.");
  }
  const gpu = navigator.gpu;
  const adapter = await gpu.requestAdapter();
  if (!adapter) throw new Error("Unable to get WebGPU adapter.");
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu") as GPUCanvasContext | null;
  if (!context) throw new Error("Unable to get WebGPU canvas context.");

  const format = gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    alphaMode: "premultiplied",
  });

  return { adapter, device, context, format };
}
