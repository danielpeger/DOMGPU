import { RendererBuffers } from "./buffers";

export function renderFrame(
  device: GPUDevice,
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline,
  buffers: RendererBuffers,
  instanceCount: number,
): void {
  const encoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  pass.setPipeline(pipeline);
  pass.setBindGroup(0, buffers.globalsBindGroup);
  pass.setVertexBuffer(0, buffers.quadBuffer);
  pass.setVertexBuffer(1, buffers.instanceBuffer);
  pass.draw(6, instanceCount, 0, 0);
  pass.end();

  device.queue.submit([encoder.finish()]);
}
