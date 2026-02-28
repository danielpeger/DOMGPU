(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();function P(r){let e=0,t=!1;const i=n=>{t||(r(n),e=window.requestAnimationFrame(i))};return e=window.requestAnimationFrame(i),()=>{t=!0,window.cancelAnimationFrame(e)}}class E{state;lastPointerTime=performance.now();lastCursorX=0;lastCursorY=0;lastScrollY=window.scrollY;lastScrollTime=performance.now();activeElement=null;constructor(){const e=m();this.state={cursorX:0,cursorY:0,cursorVelX:0,cursorVelY:0,scrollVelocity:0,time:0,viewportWidth:e.width,viewportHeight:e.height,tapX:0,tapY:0,tapTime:-1e3,tapActive:0}}attach(){window.addEventListener("pointermove",this.onPointerMove,{passive:!0}),window.addEventListener("pointerdown",this.onPointerDown,{passive:!0}),window.addEventListener("pointerup",this.onPointerUp,{passive:!0}),window.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("resize",this.onResize,{passive:!0})}detach(){window.removeEventListener("pointermove",this.onPointerMove),window.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointerup",this.onPointerUp),window.removeEventListener("scroll",this.onScroll),window.removeEventListener("resize",this.onResize)}updateTime(e){this.state.time=e*.001,this.state.tapActive=d(this.state.tapActive,0,.08)}getState(){return this.state}updateElementStates(e){for(const t of e){const i=t.element.matches(":hover")?1:0,n=t.element.matches(":focus, :focus-visible")?1:0,o=this.activeElement===t.element?1:0;t.interaction.hover=d(t.interaction.hover,i,.18),t.interaction.focus=d(t.interaction.focus,n,.25),t.interaction.active=d(t.interaction.active,o,.2)}}onPointerMove=e=>{const t=performance.now(),i=Math.max(1,t-this.lastPointerTime),n=e.clientX+window.scrollX,o=e.clientY+window.scrollY,s=n-this.lastCursorX,a=o-this.lastCursorY;this.state.cursorX=n,this.state.cursorY=o,this.state.cursorVelX=s/i*1e3,this.state.cursorVelY=a/i*1e3,this.lastPointerTime=t,this.lastCursorX=n,this.lastCursorY=o};onPointerDown=e=>{if(!(e.target instanceof HTMLElement)){this.activeElement=null;return}this.activeElement=L(e.target),this.state.tapX=e.clientX+window.scrollX,this.state.tapY=e.clientY+window.scrollY,this.state.tapTime=performance.now()*.001,this.state.tapActive=1};onPointerUp=()=>{this.activeElement=null};onScroll=()=>{const e=performance.now(),t=Math.max(1,e-this.lastScrollTime),i=window.scrollY-this.lastScrollY;this.state.scrollVelocity=i/t*1e3,this.lastScrollY=window.scrollY,this.lastScrollTime=e};onResize=()=>{const e=m();this.state.viewportWidth=e.width,this.state.viewportHeight=e.height}}function d(r,e,t){return r+(e-r)*t}function m(){const r=document.documentElement,e=Math.max(window.innerWidth,r.clientWidth,r.scrollWidth),t=Math.max(window.innerHeight,r.clientHeight,r.scrollHeight);return{width:e,height:t}}function L(r){return r.closest(".expressive, [data-material], [style*='--expressive-material']")}class B{constructor(e,t){this.registry=e,this.onDirty=t}mutationObserver=null;resizeObserver=null;attach(){this.mutationObserver=new MutationObserver(e=>{let t=!1;for(const i of e)for(const n of i.addedNodes)n instanceof HTMLElement&&(t=this.registry.scan(n)||t);t=this.registry.removeDisconnected()||t,t&&this.onDirty()}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","data-material"]}),this.resizeObserver=new ResizeObserver(()=>{this.onDirty()}),this.resizeObserver.observe(document.body),window.addEventListener("resize",this.onDirty,{passive:!0}),window.addEventListener("scroll",this.onDirty,{passive:!0})}detach(){this.mutationObserver?.disconnect(),this.resizeObserver?.disconnect(),window.removeEventListener("resize",this.onDirty),window.removeEventListener("scroll",this.onDirty)}}class M{elements=new Set;scan(e=document){let t=!1;const i=e.querySelectorAll(".expressive, [data-material], [style*='--expressive-material']");for(const n of i)this.isExpressive(n)&&!this.elements.has(n)&&(this.elements.add(n),t=!0);return t}removeDisconnected(){let e=!1;for(const t of this.elements)t.isConnected||(this.elements.delete(t),e=!0);return e}getElements(){return Array.from(this.elements)}isExpressive(e){return e.classList.contains("expressive")||e.dataset.material?!0:getComputedStyle(e).getPropertyValue("--expressive-material").trim().length>0}}const h=13,z=4,b=h*z,I={arrayStride:b,stepMode:"instance",attributes:[{shaderLocation:1,offset:0,format:"float32x2"},{shaderLocation:2,offset:8,format:"float32x2"},{shaderLocation:3,offset:16,format:"float32"},{shaderLocation:4,offset:20,format:"float32x4"},{shaderLocation:5,offset:36,format:"float32"},{shaderLocation:6,offset:40,format:"float32"},{shaderLocation:7,offset:44,format:"float32"},{shaderLocation:8,offset:48,format:"float32"}]};class T{constructor(e){this.device=e;const t=new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]);this.quadBuffer=e.createBuffer({size:t.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.quadBuffer,0,t),this.instanceBuffer=e.createBuffer({size:this.instanceCapacity*b,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.globalsBuffer=e.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.globalsBindGroupLayout=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),this.globalsBindGroup=e.createBindGroup({layout:this.globalsBindGroupLayout,entries:[{binding:0,resource:{buffer:this.globalsBuffer}}]})}quadBuffer;instanceBuffer;globalsBuffer;globalsBindGroupLayout;globalsBindGroup;instanceCapacity=512;uploadInstances(e){if(e.length>this.instanceCapacity)throw new Error(`Instance capacity exceeded: ${e.length}`);const t=new Float32Array(e.length*h);for(let i=0;i<e.length;i+=1){const n=e[i],o=i*h;t[o+0]=n.x,t[o+1]=n.y,t[o+2]=n.width,t[o+3]=n.height,t[o+4]=n.borderRadius,t[o+5]=n.color[0],t[o+6]=n.color[1],t[o+7]=n.color[2],t[o+8]=n.color[3],t[o+9]=n.material==="ripple-touch"?3:n.material==="ripple"?2:n.material==="hover"?1:0,t[o+10]=n.interaction.hover,t[o+11]=n.interaction.focus,t[o+12]=n.interaction.active}return this.device.queue.writeBuffer(this.instanceBuffer,0,t),e.length}uploadGlobals(e){const t=new Float32Array([e.cursorX,e.cursorY,e.cursorVelX,e.cursorVelY,e.scrollVelocity,e.time,e.viewportWidth,e.viewportHeight,e.tapX,e.tapY,e.tapTime,e.tapActive]);this.device.queue.writeBuffer(this.globalsBuffer,0,t)}}async function C(r){if(!("gpu"in navigator))throw new Error("WebGPU is not supported in this browser.");const e=navigator.gpu,t=await e.requestAdapter();if(!t)throw new Error("Unable to get WebGPU adapter.");const i=await t.requestDevice(),n=r.getContext("webgpu");if(!n)throw new Error("Unable to get WebGPU canvas context.");const o=e.getPreferredCanvasFormat();return n.configure({device:i,format:o,alphaMode:"premultiplied"}),{adapter:t,device:i,context:n,format:o}}const G=`struct Globals {
  cursorAndVelocity: vec4f,
  scrollTimeViewport: vec4f,
  tapData: vec4f,
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

  // Tap/click ripple pulse from the pointer-down position.
  if (input.materialId >= 2.5) {
    let tapPos = globals.tapData.xy;
    let tapTime = globals.tapData.z;
    let tapActive = globals.tapData.w;
    let time = globals.scrollTimeViewport.y;
    let elapsed = max(0.0, time - tapTime);
    let radius = elapsed * 900.0;
    let d = distance(input.screenPos, tapPos);
    let ring = exp(-abs(d - radius) * 0.04);
    let innerGlow = exp(-d * 0.02) * 0.35;
    let timeFade = exp(-elapsed * 4.0);
    let trigger = step(0.01, input.activeState) * tapActive;
    let alpha = clamp((ring + innerGlow) * timeFade * trigger, 0.0, 1.0) * mask;
    return vec4f(1.0, 1.0, 1.0, alpha);
  }

  // Cursor-driven ripple material.
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
`,R=`struct Globals {
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
`;function V(r,e,t){const i=r.createShaderModule({code:R}),n=r.createShaderModule({code:G}),o=r.createPipelineLayout({bindGroupLayouts:[t]});return r.createRenderPipeline({layout:o,vertex:{module:i,entryPoint:"vsMain",buffers:[{arrayStride:8,stepMode:"vertex",attributes:[{shaderLocation:0,offset:0,format:"float32x2"}]},I]},fragment:{module:n,entryPoint:"fsMain",targets:[{format:e,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}function A(r,e,t,i,n){const o=r.createCommandEncoder(),s=e.getCurrentTexture().createView(),a=o.beginRenderPass({colorAttachments:[{view:s,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});a.setPipeline(t),a.setBindGroup(0,i.globalsBindGroup),a.setVertexBuffer(0,i.quadBuffer),a.setVertexBuffer(1,i.instanceBuffer),a.draw(6,n,0,0),a.end(),r.queue.submit([o.finish()])}class D{nodesById=new Map;dirty=!0;upsert(e){this.nodesById.set(e.id,e),this.dirty=!0}remove(e){this.nodesById.delete(e)&&(this.dirty=!0)}getNodes(){return Array.from(this.nodesById.values()).sort((e,t)=>e.zIndex-t.zIndex)}has(e){return this.nodesById.has(e)}markDirty(){this.dirty=!0}consumeDirty(){const e=this.dirty;return this.dirty=!1,e}}const F=[.5,.6,1,.65];function O(r){const e=getComputedStyle(r),t=v(e.opacity,1),i=U(e.backgroundColor)??F,n=[i[0],i[1],i[2],x(i[3]*t)],o=v(e.borderTopLeftRadius,0),s=parseInt(e.zIndex,10),a=e.getPropertyValue("--expressive-material").trim().toLowerCase(),l=(r.dataset.material??"").trim().toLowerCase(),u=Y(l||a);return{borderRadius:o,color:n,zIndex:Number.isFinite(s)?s:0,material:u}}function Y(r){return r==="ripple-touch"||r==="ripple_touch"?"ripple-touch":r==="ripple"?"ripple":r==="hover"||r==="glass"||r==="overlay"?"hover":"none"}function v(r,e){const t=Number.parseFloat(r);return Number.isFinite(t)?t:e}function x(r){return Math.max(0,Math.min(1,r))}function U(r){const e=r.trim().toLowerCase();if(e.startsWith("rgb(")){const t=e.slice(4,-1).split(",").map(i=>Number.parseFloat(i.trim()));return t.length!==3||t.some(i=>!Number.isFinite(i))?null:[t[0]/255,t[1]/255,t[2]/255,1]}if(e.startsWith("rgba(")){const t=e.slice(5,-1).split(",").map(i=>Number.parseFloat(i.trim()));return t.length!==4||t.some(i=>!Number.isFinite(i))?null:[t[0]/255,t[1]/255,t[2]/255,x(t[3])]}return null}let w=0;const g=new WeakMap;function X(r){const e=g.get(r);if(e)return e;w+=1;const t=`expressive-${w}`;return g.set(r,t),t}function y(r,e){const t=new Set,i=[];for(const n of r){const o=X(n);t.add(o);const s=n.getBoundingClientRect(),a=O(n),l=e.getNodes().find(c=>c.id===o),u={id:o,element:n,x:s.left+window.scrollX,y:s.top+window.scrollY,width:s.width,height:s.height,borderRadius:a.borderRadius,color:a.color,material:a.material,zIndex:a.zIndex,interaction:l?.interaction??{hover:0,focus:0,active:0}};e.upsert(u),i.push(u)}for(const n of e.getNodes())t.has(n.id)||e.remove(n.id);return i}async function N(){const r=document.querySelector("#expressive-layer");if(!r)throw new Error("Missing #expressive-layer canvas.");p(r),window.addEventListener("resize",()=>p(r),{passive:!0});const e=await C(r),t=new T(e.device),i=V(e.device,e.format,t.globalsBindGroupLayout),n=new M,o=new D,s=new E;s.attach();let a=!0;const l=()=>{a=!0,o.markDirty()};n.scan(document),new B(n,l).attach();let c=y(n.getElements(),o),f=t.uploadInstances(c);P(S=>{s.updateTime(S),s.updateElementStates(c),t.uploadGlobals(s.getState()),a||o.consumeDirty()?(n.scan(document),n.removeDisconnected(),p(r),c=y(n.getElements(),o),f=t.uploadInstances(c),a=!1):f=t.uploadInstances(c),A(e.device,e.context,i,t,f)})}function p(r){const e=q(),t=window.devicePixelRatio||1;r.width=Math.max(1,Math.floor(e.width*t)),r.height=Math.max(1,Math.floor(e.height*t)),r.style.width=`${e.width}px`,r.style.height=`${e.height}px`}function q(){const r=document.documentElement,e=Math.max(window.innerWidth,r.clientWidth,r.scrollWidth),t=Math.max(window.innerHeight,r.clientHeight,r.scrollHeight);return{width:e,height:t}}N().catch(r=>{const e=r instanceof Error?r.message:String(r),t=document.createElement("div");t.style.position="fixed",t.style.bottom="16px",t.style.left="16px",t.style.padding="8px 12px",t.style.borderRadius="8px",t.style.background="#2d1f31",t.style.color="#ffd7e5",t.style.zIndex="10000",t.textContent=`DOMGPU failed to initialize: ${e}`,document.body.appendChild(t)});
