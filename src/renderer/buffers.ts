import type { GlobalInteractionState, SceneNode } from "../core/types";

const FLOATS_PER_INSTANCE = 13;
const BYTES_PER_FLOAT = 4;
const INSTANCE_STRIDE = FLOATS_PER_INSTANCE * BYTES_PER_FLOAT;

export const instanceLayout = {
  arrayStride: INSTANCE_STRIDE,
  stepMode: "instance" as const,
  attributes: [
    { shaderLocation: 1, offset: 0, format: "float32x2" as const },
    { shaderLocation: 2, offset: 8, format: "float32x2" as const },
    { shaderLocation: 3, offset: 16, format: "float32" as const },
    { shaderLocation: 4, offset: 20, format: "float32x4" as const },
    { shaderLocation: 5, offset: 36, format: "float32" as const },
    { shaderLocation: 6, offset: 40, format: "float32" as const },
    { shaderLocation: 7, offset: 44, format: "float32" as const },
    { shaderLocation: 8, offset: 48, format: "float32" as const },
  ],
};

export class RendererBuffers {
  readonly quadBuffer: GPUBuffer;
  readonly instanceBuffer: GPUBuffer;
  readonly globalsBuffer: GPUBuffer;
  readonly globalsBindGroupLayout: GPUBindGroupLayout;
  readonly globalsBindGroup: GPUBindGroup;
  private instanceCapacity = 512;

  constructor(private readonly device: GPUDevice) {
    const quadVertices = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

    this.quadBuffer = device.createBuffer({
      size: quadVertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.quadBuffer, 0, quadVertices);

    this.instanceBuffer = device.createBuffer({
      size: this.instanceCapacity * INSTANCE_STRIDE,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    this.globalsBuffer = device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.globalsBindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" },
        },
      ],
    });

    this.globalsBindGroup = device.createBindGroup({
      layout: this.globalsBindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: this.globalsBuffer } }],
    });
  }

  uploadInstances(nodes: SceneNode[]): number {
    if (nodes.length > this.instanceCapacity) {
      throw new Error(`Instance capacity exceeded: ${nodes.length}`);
    }
    const data = new Float32Array(nodes.length * FLOATS_PER_INSTANCE);
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const base = i * FLOATS_PER_INSTANCE;
      data[base + 0] = node.x;
      data[base + 1] = node.y;
      data[base + 2] = node.width;
      data[base + 3] = node.height;
      data[base + 4] = node.borderRadius;
      data[base + 5] = node.color[0];
      data[base + 6] = node.color[1];
      data[base + 7] = node.color[2];
      data[base + 8] = node.color[3];
      data[base + 9] =
        node.material === "ripple" ? 2 : node.material === "hover" ? 1 : 0;
      data[base + 10] = node.interaction.hover;
      data[base + 11] = node.interaction.focus;
      data[base + 12] = node.interaction.active;
    }
    this.device.queue.writeBuffer(this.instanceBuffer, 0, data);
    return nodes.length;
  }

  uploadGlobals(state: GlobalInteractionState): void {
    const globals = new Float32Array([
      state.cursorX,
      state.cursorY,
      state.cursorVelX,
      state.cursorVelY,
      state.scrollVelocity,
      state.time,
      state.viewportWidth,
      state.viewportHeight,
    ]);
    this.device.queue.writeBuffer(this.globalsBuffer, 0, globals);
  }
}
