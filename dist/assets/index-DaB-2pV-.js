(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();function S(o){let e=0,t=!1;const r=n=>{t||(o(n),e=window.requestAnimationFrame(r))};return e=window.requestAnimationFrame(r),()=>{t=!0,window.cancelAnimationFrame(e)}}class P{state;lastPointerTime=performance.now();lastCursorX=0;lastCursorY=0;lastScrollY=window.scrollY;lastScrollTime=performance.now();activeElement=null;constructor(){this.state={cursorX:0,cursorY:0,cursorVelX:0,cursorVelY:0,scrollVelocity:0,time:0,viewportWidth:window.innerWidth,viewportHeight:window.innerHeight}}attach(){window.addEventListener("pointermove",this.onPointerMove,{passive:!0}),window.addEventListener("pointerdown",this.onPointerDown,{passive:!0}),window.addEventListener("pointerup",this.onPointerUp,{passive:!0}),window.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("resize",this.onResize,{passive:!0})}detach(){window.removeEventListener("pointermove",this.onPointerMove),window.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointerup",this.onPointerUp),window.removeEventListener("scroll",this.onScroll),window.removeEventListener("resize",this.onResize)}updateTime(e){this.state.time=e*.001}getState(){return this.state}updateElementStates(e){for(const t of e){const r=t.element.matches(":hover")?1:0,n=t.element.matches(":focus, :focus-visible")?1:0,i=this.activeElement===t.element?1:0;t.interaction.hover=f(t.interaction.hover,r,.18),t.interaction.focus=f(t.interaction.focus,n,.25),t.interaction.active=f(t.interaction.active,i,.2)}}onPointerMove=e=>{const t=performance.now(),r=Math.max(1,t-this.lastPointerTime),n=e.clientX-this.lastCursorX,i=e.clientY-this.lastCursorY;this.state.cursorX=e.clientX,this.state.cursorY=e.clientY,this.state.cursorVelX=n/r*1e3,this.state.cursorVelY=i/r*1e3,this.lastPointerTime=t,this.lastCursorX=e.clientX,this.lastCursorY=e.clientY};onPointerDown=e=>{this.activeElement=e.target instanceof HTMLElement?e.target:null};onPointerUp=()=>{this.activeElement=null};onScroll=()=>{const e=performance.now(),t=Math.max(1,e-this.lastScrollTime),r=window.scrollY-this.lastScrollY;this.state.scrollVelocity=r/t*1e3,this.lastScrollY=window.scrollY,this.lastScrollTime=e};onResize=()=>{this.state.viewportWidth=window.innerWidth,this.state.viewportHeight=window.innerHeight}}function f(o,e,t){return o+(e-o)*t}class E{constructor(e,t){this.registry=e,this.onDirty=t}mutationObserver=null;resizeObserver=null;attach(){this.mutationObserver=new MutationObserver(e=>{let t=!1;for(const r of e)for(const n of r.addedNodes)n instanceof HTMLElement&&(t=this.registry.scan(n)||t);t=this.registry.removeDisconnected()||t,t&&this.onDirty()}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","data-material"]}),this.resizeObserver=new ResizeObserver(()=>{this.onDirty()}),this.resizeObserver.observe(document.body),window.addEventListener("resize",this.onDirty,{passive:!0}),window.addEventListener("scroll",this.onDirty,{passive:!0})}detach(){this.mutationObserver?.disconnect(),this.resizeObserver?.disconnect(),window.removeEventListener("resize",this.onDirty),window.removeEventListener("scroll",this.onDirty)}}class L{elements=new Set;scan(e=document){let t=!1;const r=e.querySelectorAll(".expressive, [data-material], [style*='--expressive-material']");for(const n of r)this.isExpressive(n)&&!this.elements.has(n)&&(this.elements.add(n),t=!0);return t}removeDisconnected(){let e=!1;for(const t of this.elements)t.isConnected||(this.elements.delete(t),e=!0);return e}getElements(){return Array.from(this.elements)}isExpressive(e){return e.classList.contains("expressive")||e.dataset.material?!0:getComputedStyle(e).getPropertyValue("--expressive-material").trim().length>0}}const p=13,B=4,y=p*B,M={arrayStride:y,stepMode:"instance",attributes:[{shaderLocation:1,offset:0,format:"float32x2"},{shaderLocation:2,offset:8,format:"float32x2"},{shaderLocation:3,offset:16,format:"float32"},{shaderLocation:4,offset:20,format:"float32x4"},{shaderLocation:5,offset:36,format:"float32"},{shaderLocation:6,offset:40,format:"float32"},{shaderLocation:7,offset:44,format:"float32"},{shaderLocation:8,offset:48,format:"float32"}]};class R{constructor(e){this.device=e;const t=new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]);this.quadBuffer=e.createBuffer({size:t.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.quadBuffer,0,t),this.instanceBuffer=e.createBuffer({size:this.instanceCapacity*y,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.globalsBuffer=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.globalsBindGroupLayout=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),this.globalsBindGroup=e.createBindGroup({layout:this.globalsBindGroupLayout,entries:[{binding:0,resource:{buffer:this.globalsBuffer}}]})}quadBuffer;instanceBuffer;globalsBuffer;globalsBindGroupLayout;globalsBindGroup;instanceCapacity=512;uploadInstances(e){if(e.length>this.instanceCapacity)throw new Error(`Instance capacity exceeded: ${e.length}`);const t=new Float32Array(e.length*p);for(let r=0;r<e.length;r+=1){const n=e[r],i=r*p;t[i+0]=n.x,t[i+1]=n.y,t[i+2]=n.width,t[i+3]=n.height,t[i+4]=n.borderRadius,t[i+5]=n.color[0],t[i+6]=n.color[1],t[i+7]=n.color[2],t[i+8]=n.color[3],t[i+9]=n.material==="ripple"?2:n.material==="hover"?1:0,t[i+10]=n.interaction.hover,t[i+11]=n.interaction.focus,t[i+12]=n.interaction.active}return this.device.queue.writeBuffer(this.instanceBuffer,0,t),e.length}uploadGlobals(e){const t=new Float32Array([e.cursorX,e.cursorY,e.cursorVelX,e.cursorVelY,e.scrollVelocity,e.time,e.viewportWidth,e.viewportHeight]);this.device.queue.writeBuffer(this.globalsBuffer,0,t)}}async function I(o){if(!("gpu"in navigator))throw new Error("WebGPU is not supported in this browser.");const e=navigator.gpu,t=await e.requestAdapter();if(!t)throw new Error("Unable to get WebGPU adapter.");const r=await t.requestDevice(),n=o.getContext("webgpu");if(!n)throw new Error("Unable to get WebGPU canvas context.");const i=e.getPreferredCanvasFormat();return n.configure({device:r,format:i,alphaMode:"premultiplied"}),{adapter:t,device:r,context:n,format:i}}const z=`struct Globals {
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

  var color = input.color;

  // Effect 1: hover color overlay.
  let hoverTint = vec3f(0.76, 0.86, 1.0);
  let hoverMix = clamp(input.hoverState * 0.7 + input.focusState * 0.25, 0.0, 1.0);
  if (input.materialId >= 0.5) {
    let mixedRgb = mix(color.rgb, hoverTint, hoverMix);
    color = vec4f(mixedRgb, color.a);
  }

  // Effect 2: cursor-based ripple distortion.
  if (input.materialId >= 1.5) {
    let cursor = globals.cursorAndVelocity.xy;
    let time = globals.scrollTimeViewport.y;
    let d = distance(input.screenPos, cursor);
    let wave = sin(d * 0.07 - time * 10.0) * exp(-d * 0.015);
    let rippleRgb = color.rgb + vec3f(0.15, 0.25, 0.5) * wave;
    let rippleAlpha = clamp(color.a + abs(wave) * 0.15, 0.0, 1.0);
    color = vec4f(rippleRgb, rippleAlpha);
  }

  // Active state slightly increases brightness.
  let activeRgb = color.rgb + vec3f(input.activeState * 0.08);
  let maskedAlpha = color.a * mask;
  color = vec4f(activeRgb, maskedAlpha);
  return color;
}
`,C=`struct Globals {
  cursorAndVelocity: vec4f,
  scrollTimeViewport: vec4f,
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
`;function G(o,e,t){const r=o.createShaderModule({code:C}),n=o.createShaderModule({code:z}),i=o.createPipelineLayout({bindGroupLayouts:[t]});return o.createRenderPipeline({layout:i,vertex:{module:r,entryPoint:"vsMain",buffers:[{arrayStride:8,stepMode:"vertex",attributes:[{shaderLocation:0,offset:0,format:"float32x2"}]},M]},fragment:{module:n,entryPoint:"fsMain",targets:[{format:e,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}function T(o,e,t,r,n){const i=o.createCommandEncoder(),s=e.getCurrentTexture().createView(),a=i.beginRenderPass({colorAttachments:[{view:s,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});a.setPipeline(t),a.setBindGroup(0,r.globalsBindGroup),a.setVertexBuffer(0,r.quadBuffer),a.setVertexBuffer(1,r.instanceBuffer),a.draw(6,n,0,0),a.end(),o.queue.submit([i.finish()])}class V{nodesById=new Map;dirty=!0;upsert(e){this.nodesById.set(e.id,e),this.dirty=!0}remove(e){this.nodesById.delete(e)&&(this.dirty=!0)}getNodes(){return Array.from(this.nodesById.values()).sort((e,t)=>e.zIndex-t.zIndex)}has(e){return this.nodesById.has(e)}markDirty(){this.dirty=!0}consumeDirty(){const e=this.dirty;return this.dirty=!1,e}}const O=[.5,.6,1,.65];function F(o){const e=getComputedStyle(o),t=h(e.opacity,1),r=D(e.backgroundColor)??O,n=[r[0],r[1],r[2],b(r[3]*t)],i=h(e.borderTopLeftRadius,0),s=parseInt(e.zIndex,10),a=e.getPropertyValue("--expressive-material").trim().toLowerCase(),l=(o.dataset.material??"").trim().toLowerCase(),u=A(l||a);return{borderRadius:i,color:n,zIndex:Number.isFinite(s)?s:0,material:u}}function A(o){return o==="ripple"?"ripple":o==="hover"||o==="glass"||o==="overlay"?"hover":"none"}function h(o,e){const t=Number.parseFloat(o);return Number.isFinite(t)?t:e}function b(o){return Math.max(0,Math.min(1,o))}function D(o){const e=o.trim().toLowerCase();if(e.startsWith("rgb(")){const t=e.slice(4,-1).split(",").map(r=>Number.parseFloat(r.trim()));return t.length!==3||t.some(r=>!Number.isFinite(r))?null:[t[0]/255,t[1]/255,t[2]/255,1]}if(e.startsWith("rgba(")){const t=e.slice(5,-1).split(",").map(r=>Number.parseFloat(r.trim()));return t.length!==4||t.some(r=>!Number.isFinite(r))?null:[t[0]/255,t[1]/255,t[2]/255,b(t[3])]}return null}let m=0;const v=new WeakMap;function U(o){const e=v.get(o);if(e)return e;m+=1;const t=`expressive-${m}`;return v.set(o,t),t}function g(o,e){const t=new Set,r=[];for(const n of o){const i=U(n);t.add(i);const s=n.getBoundingClientRect(),a=F(n),l=e.getNodes().find(c=>c.id===i),u={id:i,element:n,x:s.left,y:s.top,width:s.width,height:s.height,borderRadius:a.borderRadius,color:a.color,material:a.material,zIndex:a.zIndex,interaction:l?.interaction??{hover:0,focus:0,active:0}};e.upsert(u),r.push(u)}for(const n of e.getNodes())t.has(n.id)||e.remove(n.id);return r}async function Y(){const o=document.querySelector("#expressive-layer");if(!o)throw new Error("Missing #expressive-layer canvas.");w(o),window.addEventListener("resize",()=>w(o),{passive:!0});const e=await I(o),t=new R(e.device),r=G(e.device,e.format,t.globalsBindGroupLayout),n=new L,i=new V,s=new P;s.attach();let a=!0;const l=()=>{a=!0,i.markDirty()};n.scan(document),new E(n,l).attach();let c=g(n.getElements(),i),d=t.uploadInstances(c);S(x=>{s.updateTime(x),s.updateElementStates(c),t.uploadGlobals(s.getState()),a||i.consumeDirty()?(n.scan(document),n.removeDisconnected(),c=g(n.getElements(),i),d=t.uploadInstances(c),a=!1):d=t.uploadInstances(c),T(e.device,e.context,r,t,d)})}function w(o){const e=window.devicePixelRatio||1;o.width=Math.max(1,Math.floor(window.innerWidth*e)),o.height=Math.max(1,Math.floor(window.innerHeight*e)),o.style.width=`${window.innerWidth}px`,o.style.height=`${window.innerHeight}px`}Y().catch(o=>{const e=o instanceof Error?o.message:String(o),t=document.createElement("div");t.style.position="fixed",t.style.bottom="16px",t.style.left="16px",t.style.padding="8px 12px",t.style.borderRadius="8px",t.style.background="#2d1f31",t.style.color="#ffd7e5",t.style.zIndex="10000",t.textContent=`DOMGPU failed to initialize: ${e}`,document.body.appendChild(t)});
