struct Globals {
  cursorAndVelocity: vec4f,
  scrollTimeViewport: vec4f,
  tapData: vec4f,
}

@group(0) @binding(0) var<uniform> globals: Globals;

struct VertexIn {
  @location(0) localPos: vec2f,
  @location(1) instancePos: vec2f,
  @location(2) instanceSize: vec2f,
  @location(3) borderRadius: f32,
  @location(4) color: vec4f,
  @location(5) materialId: f32,
  @location(6) hoverState: f32,
  @location(7) focusState: f32,
  @location(8) activeState: f32,
}

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) size: vec2f,
  @location(2) borderRadius: f32,
  @location(3) color: vec4f,
  @location(4) materialId: f32,
  @location(5) hoverState: f32,
  @location(6) focusState: f32,
  @location(7) activeState: f32,
  @location(8) screenPos: vec2f,
}

@vertex
fn vsMain(input: VertexIn) -> VertexOut {
  let screenPos = input.instancePos + input.localPos * input.instanceSize;
  let viewport = globals.scrollTimeViewport.zw;
  let ndcX = (screenPos.x / viewport.x) * 2.0 - 1.0;
  let ndcY = 1.0 - (screenPos.y / viewport.y) * 2.0;

  var out: VertexOut;
  out.position = vec4f(ndcX, ndcY, 0.0, 1.0);
  out.uv = input.localPos;
  out.size = input.instanceSize;
  out.borderRadius = input.borderRadius;
  out.color = input.color;
  out.materialId = input.materialId;
  out.hoverState = input.hoverState;
  out.focusState = input.focusState;
  out.activeState = input.activeState;
  out.screenPos = screenPos;
  return out;
}
