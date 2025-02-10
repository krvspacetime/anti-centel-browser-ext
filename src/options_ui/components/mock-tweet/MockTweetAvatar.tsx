const AVATAR_SIZE = "35px";

export const MockTweetAvatar = () => {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute left-3 top-3 rounded-full bg-zinc-700"
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
        }}
      />
    </div>
  );
};
