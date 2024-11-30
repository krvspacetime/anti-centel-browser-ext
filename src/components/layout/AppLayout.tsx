import { TargetList } from "../list/TargetList";

const POPUP_WIDTH = "360px";
const POPUP_HEIGHT = "420px";

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
