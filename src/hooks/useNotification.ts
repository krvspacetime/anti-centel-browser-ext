import { useState, useRef } from "react";

export const useNotification = () => {
  const [isShown, setIsShown] = useState(false);
  const notificationRef = useRef();

  const showNotification = () => {
    setIsShown(true);
  };

  const hideNotification = () => {
    setIsShown(false);
  };

  // Optionally auto-hide after a delay
  const showForDuration = (duration = 3000) => {
    showNotification();
    setTimeout(() => hideNotification(), duration);
  };

  return {
    isShown,
    showNotification,
    hideNotification,
    showForDuration,
    notificationRef,
  };
};
