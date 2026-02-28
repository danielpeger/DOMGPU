import fragmentShaderSource from "../shaders/rect.frag.wgsl?raw";
import vertexShaderSource from "../shaders/rect.vert.wgsl?raw";
import { instanceLayout } from "./buffers";

export function createPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
  globalsBindGroupLayout: GPUBindGroupLayout,
): GPURenderPipeline {
  const vertexModule = device.createShaderModule({ code: vertexShaderSource });
  const fragmentModule = device.createShaderModule({ code: fragmentShaderSource });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [globalsBindGroupLayout],
  });

  return device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: vertexModule,
      entryPoint: "vsMain",
      buffers: [
        {
          arrayStride: 8,
          stepMode: "vertex",
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
        },
        instanceLayout,
      ],
    },
    fragment: {
      module: fragmentModule,
      entryPoint: "fsMain",
      targets: [
        {
          format,
          blend: {
            color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
            alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
          },
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  });
}
