import { TargetList } from "../ui/TargetList";

export const POPUP_WIDTH = "500px";
export const POPUP_HEIGHT = "450px";

export const AppLayout = () => {
  return (
    <div
      className="bg-[#333] p-1"
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
