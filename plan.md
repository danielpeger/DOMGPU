# Expressive WebGPU Overlay Architecture

This project is about extending modern semantic web interfaces with an expressive layer of GPU-based graphics.

The goal is to prove the technical feasibility of DOM-aware, HTML-, CSS- and Javascript-compatible graphics layer on the web. It answers the question: can we augment the DOM with GPU-driven rendering without abandoning web standards? Can GPU pipelines become first-class web citizens?

It augments, not replaces, the browser. It extends the modern web stack.

This is ultimately for a university thesis, the working title is "A Feasibility Study of GPU-Augmented DOM Rendering Using WebGPU".

## Technical Implementation Plan

---

## 1. Architectural Overview

**Chosen Architecture:**

DOM (browser controlled)\
→ Layout (browser controlled)\
→ JS observes layout\
→ Build GPU scene graph in JS\
→ WebGPU canvas renders expressive layer\
→ Overlay composited via CSS stacking

This system augments the browser rendering pipeline without replacing
it.\
The DOM remains the semantic and layout engine. WebGPU provides an
expressive material layer.

---

## 2. System Goals

1.  Preserve DOM semantics and accessibility.
2.  Avoid replacing browser layout or text rendering.
3.  Provide GPU-based expressive material effects.
4.  Maintain 60 FPS under moderate DOM complexity.
5.  Allow CSS-aware expressive rendering.

---

## 3. Core Components

### 3.1 DOM Observer Layer

Responsible for detecting structural and layout changes.

#### Required APIs:

- MutationObserver
- ResizeObserver
- getBoundingClientRect()
- getComputedStyle()

#### Responsibilities:

- Detect expressive elements (via data attributes or CSS class)
- Track position, size, and transforms
- Track interaction states (hover, focus, active)
- Emit updates to Scene Graph Builder

---

### 3.2 Expressive Element Registration

Elements opt into GPU rendering via:

```html
<div class="card expressive" data-material="glass"></div>
```

Or:

```css
.card {
  --expressive-material: glass;
}
```

JS extracts: - Computed background color - Border radius - Box shadow -
Opacity - Transform - Z-index

---

### 3.3 Scene Graph Builder (JS)

Builds a parallel GPU scene graph mirroring expressive DOM elements.

Each node contains:

- id
- world transform matrix
- width / height
- border radius
- material type
- interaction state
- z-order

Structure:

    Root
     ├── ElementNode
     ├── ElementNode
     └── ElementNode

The graph is flat unless hierarchy-based effects are implemented.

---

### 3.4 WebGPU Renderer

Single full-screen canvas:

```html
<canvas id="expressive-layer"></canvas>
```

CSS:

```css
#expressive-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
```

Renderer responsibilities:

- Initialize WebGPU device
- Create render pipeline
- Maintain uniform buffers
- Maintain instance buffers
- Execute render pass per frame

---

## 4. Rendering Strategy

### 4.1 Geometry Model

Use instanced rectangle rendering.

Each expressive DOM element = 1 rectangle instance.

Instance buffer contains:

- position (vec2)
- size (vec2)
- borderRadius (float)
- color (vec4)
- materialId (int)
- interactionState (float)

---

### 4.2 Shader Structure

Vertex Shader: - Applies transform - Converts DOM coordinates to clip
space

Fragment Shader: - Applies material logic - Reads interaction uniforms -
Simulates material (glass, liquid, depth, glow) - Handles rounded
corners

---

## 5. Interaction System

Global interaction state includes:

- Cursor position (vec2)
- Cursor velocity (vec2)
- Scroll velocity (float)
- Time (float)

Per-element state includes:

- hoverState
- focusState
- activeState

These are passed as uniforms.

---

## 6. Frame Loop

    requestAnimationFrame(loop)

    loop():
      updateInteractionState()
      syncLayoutChanges()
      updateBuffersIfNeeded()
      encodeRenderPass()
      submitCommands()

Avoid layout thrashing by batching DOM reads.

---

## 7. Performance Strategy

1.  Use instanced rendering (single draw call).
2.  Minimize getBoundingClientRect calls.
3.  Throttle layout sync to animation frames.
4.  Only update buffers when dirty.
5.  Use uniform buffer objects for global state.

Target: \<16ms frame time.

---

## 8. CSS Awareness Strategy

On element registration:

    const styles = getComputedStyle(element);

Map CSS → GPU uniforms:

CSS Property GPU Uniform

---

background-color baseColor
border-radius borderRadius
opacity alpha
transform modelMatrix
box-shadow shadowSoftness

Interaction states detected via:

- element.matches(':hover')
- pointer events
- focus/blur events

---

## 9. Minimal Proof Of Concept Exmaples

Implement 2 effects:

1.  Basic color overlay on hover
2.  Ripple (cursor-based distortion)

Keep shading lightweight and performant.

---

## 10. Phased Development Plan

### Phase 1 -- Infrastructure

- WebGPU initialization
- Instanced rectangle rendering
- Basic overlay compositing

### Phase 2 -- DOM Sync

- MutationObserver
- ResizeObserver
- Scene graph builder

### Phase 3 -- CSS Awareness

- Style extraction
- Uniform mapping

### Phase 4 -- Interaction

- Cursor tracking
- Hover detection
- Scroll velocity

### Phase 5 -- Material System

- Implement the Proof Of Concept examples
- Optimize performance

### Phase 6 -- Demo & Evaluation

- Build expressive demo site

---

## 11. Evaluation Criteria

Technical: - Stable 60 FPS - Scales to 100+ expressive elements - No
layout breakage

HCI: - Perceived responsiveness - Emotional engagement - Usability
impact

---

## 12. Constraints

- No custom browser modifications
- No full DOM re-rendering
- No custom text rendering (DOM handles text)
- Rectangular geometry only (Phase 1)
