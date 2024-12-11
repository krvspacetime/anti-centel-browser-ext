import { TargetList } from "../list/TargetList";

export const POPUP_WIDTH = "420px";
export const POPUP_HEIGHT = "450px";

export const AppLayout = () => {
  return (
    <div
      className="bg-zinc-800 p-1"
      style={{
        width: POPUP_WIDTH,
        height: POPUP_HEIGHT,
      }}
    >
      <div>
        <TargetList />
      </div>
    </div>
  );
};
