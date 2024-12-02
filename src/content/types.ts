import { CategoryType } from "./utils/styleConfig";

export interface TargetHandle {
  handle: string;
  tag: CategoryType;
  action?: "monitor" | "hide" | "blur" | "highlight";
}
