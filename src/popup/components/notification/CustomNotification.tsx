import { forwardRef, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

type NotificationPosition =
  | "topright"
  | "bottomright"
  | "topleft"
  | "bottomleft";

interface CustomNotificationProps extends React.ComponentPropsWithRef<"div"> {
  where: NotificationPosition;
  complete?: boolean;
  className?: string;
  timeout?: number;
  children: ReactNode;
  show: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomNotiication = forwardRef<any, CustomNotificationProps>(
  (
    {
      where = "bottomright",
      className,
      children,
      show,
    }: CustomNotificationProps,
    fref,
  ) => {
    const defaultClassName =
      "w-auto rounded-lg bg-neutral-800 text-white".trim();
    const customClassName = `${defaultClassName} ${className}`;
    function seTposition() {
      switch (where) {
        case "topright":
          return {
            top: "10px",
            right: "10px",
          };
        case "bottomright":
          return {
            bottom: "10px",
            right: "10px",
          };
        case "topleft":
          return {
            top: "10px",
            left: "10px",
          };
        case "bottomleft":
          return {
            bottom: "10px",
            left: "10px",
          };
      }
    }
    // useEffect(() => {
    //   console.log(tabIsLocked);
    // }, [tabIsLocked]);
    return (
      <>
        {createPortal(
          <AnimatePresence>
            {show && (
              <div ref={fref}>
                <motion.main
                  className={`${customClassName}`}
                  style={{
                    position: "fixed",
                    zIndex: 1000,
                    ...seTposition(),
                  }}
                  initial={{
                    opacity: 0,
                    x: 100,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    x: 200,
                    opacity: 0,
                  }}
                >
                  <motion.div>{children}</motion.div>
                </motion.main>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </>
    );
  },
);
