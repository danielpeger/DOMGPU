export type MaterialType = "hover" | "ripple" | "none";

export interface ElementInteractionState {
  hover: number;
  focus: number;
  active: number;
}

export interface SceneNode {
  id: string;
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  color: [number, number, number, number];
  material: MaterialType;
  zIndex: number;
  interaction: ElementInteractionState;
}

export interface GlobalInteractionState {
  cursorX: number;
  cursorY: number;
  cursorVelX: number;
  cursorVelY: number;
  scrollVelocity: number;
  time: number;
  viewportWidth: number;
  viewportHeight: number;
}
