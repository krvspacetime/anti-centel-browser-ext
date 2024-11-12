import { TargetList } from "../list/TargetList";

const POPUP_WIDTH = "400px";
const POPUP_HEIGHT = "500px";

export const AppLayout = () => {
  return (
    <div
      className="p-1 bg-zinc-800"
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
