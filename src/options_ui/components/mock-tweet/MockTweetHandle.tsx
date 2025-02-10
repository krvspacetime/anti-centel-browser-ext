interface MockTweetAvatarHandleProps {
  username?: string;
  userhandle?: string;
}

export const MockTweetAvatarHandle = ({
  username = "username",
  userhandle = "userhandle",
}: MockTweetAvatarHandleProps) => {
  return (
    <div className="-mt-2 ml-[30px] flex gap-1">
      <div className="font-bold">{username}</div>
      <div className="">@{userhandle}</div>
    </div>
  );
};
