struct Globals {
  cursorAndVelocity: vec4f,
  scrollTimeViewport: vec4f,
}

@group(0) @binding(0) var<uniform> globals: Globals;

struct FragmentIn {
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

fn roundedRectMask(uv: vec2f, size: vec2f, radius: f32) -> f32 {
  let px = uv * size;
  let center = size * 0.5;
  let q = abs(px - center) - (center - vec2f(radius, radius));
  let outside = length(max(q, vec2f(0.0, 0.0)));
  return 1.0 - smoothstep(radius - 1.0, radius + 1.0, outside);
}

@fragment
fn fsMain(input: FragmentIn) -> @location(0) vec4f {
  let mask = roundedRectMask(input.uv, input.size, max(0.0, input.borderRadius));
  if (mask <= 0.001) {
    discard;
  }

  // Ripple material
  if (input.materialId >= 1.5) {
    let cursor = globals.cursorAndVelocity.xy;
    let time = globals.scrollTimeViewport.y;
    let d = distance(input.screenPos, cursor);
    let wave = sin(d * 0.07 - time * 10.0) * exp(-d * 0.015);
    let ripple = max(wave, 0.0);
    let rippleAlpha = clamp(ripple, 0.0, 1.0) * mask;
    return vec4f(1.0, 1.0, 1.0, rippleAlpha);
  }

  var color = vec4f(0.0, 0.0, 0.0, 0.0);

  // Effect 1: hover color overlay.
  let hoverTint = vec3f(0.76, 0.86, 1.0);
  let hoverMix = clamp(input.hoverState * 0.7 + input.focusState * 0.25, 0.0, 1.0);
  if (input.materialId >= 0.5) {
    color = vec4f(hoverTint, hoverMix);
  }

  // Active state slightly increases brightness.
  let activeRgb = color.rgb + vec3f(input.activeState * 0.08);
  let maskedAlpha = color.a * mask;
  return vec4f(activeRgb, maskedAlpha);
}
