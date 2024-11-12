import { TargetList } from "../list/TargetList";

export const AppLayout = () => {
  return (
    <div className="w-full h-full p-1 bg-zinc-800">
      <div>
        <TargetList />
      </div>
    </div>
  );
};
