import { ToolType } from "./ToolType";
export interface Shape  {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    lineWidth: number;
    type: ToolType;
    text?: string;
    fontSize?: number;
  }