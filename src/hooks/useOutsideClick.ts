import { useEffect } from "react";

/**
 * This hook listens for clicks outside of a specified element and executes a provided event handler if the click is outside and the element is not locked.
 *
 * @param {React.RefObject<HTMLElement>} ref - The reference to the element to listen for clicks outside of.
 * @param {(event: MouseEvent) => void} eventHandler - The function to execute when a click is detected outside of the element.
 * @param {boolean} [isLocked=false] - A flag indicating whether the element is currently locked and should not trigger the event handler.
 * @return {void} This hook does not return anything.
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  eventHandler: (event: MouseEvent) => void,
  isLocked: boolean = false,
) {
  useEffect(() => {
    // Function to check if the click is outside the referenced element
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node | null) &&
        !isLocked
      ) {
        eventHandler(event);
      }
    };

    // Add the event listener to detect clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, eventHandler, isLocked]);
}
