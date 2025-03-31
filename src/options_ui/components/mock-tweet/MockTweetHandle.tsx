interface MockTweetAvatarHandleProps {
  username?: string;
  userhandle?: string;
}

export const MockTweetAvatarHandle = ({
  username = "username",
  userhandle = "userhandle",
}: MockTweetAvatarHandleProps) => {
  return (
    <div className="ml-[40px] mt-2 flex gap-1">
      <div className="font-bold">{username}</div>
      <div className="">{userhandle}</div>
    </div>
  );
};
