// atoms.js
import { atomWithStorage } from "jotai/utils";

export const targetHandlesAtom = atomWithStorage<string[]>("targetHandles", []);
