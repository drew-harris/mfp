import {
  faCheck,
  faCircleInfo,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { cva, cx } from "cva";
import { useNotifications } from "../stores/notifications";

const notificationStyle = cva(
  [
    "md:text-md",
    "outset-4",
    "my-1",
    "flex",
    "items-center",
    "p-3",
    "text-white",
    "shadow-lg",
  ],
  {
    variants: {
      type: {
        default: "bg-mc-600",
        error: "bg-red-800",
        success: "bg-green-800",
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
);

export default function Notifications(props: { className?: string }) {
  const notifications = useNotifications((state) => state.notifications);
  const dismiss = useNotifications((state) => state.dismiss);

  return (
    <div className={cx(props.className)}>
      {notifications.map((notification) => {
        let icon = faCircleInfo;

        if (notification.type === "error") {
          icon = faExclamationCircle;
        } else if (notification.type === "success") {
          icon = faCheck;
        }
        return (
          <Transition
            key={notification.id}
            appear={true}
            show={notification.isShown}
            enter="transition-all ease-out duration-100"
            enterFrom="transform opacity-0 translate-x-[100%]"
            enterTo="transform opacity-100 translate-x-0"
            leave="transition-all ease-in duration-300"
            leaveTo="transform sm:opacity-0 sm:translate-x-[100%] translate-y-[100%] sm:translate-y-0"
            leaveFrom="transform opacity-100 translate-x-0 translate-y-0"
          >
            <div
              onClick={() => dismiss(notification.id)}
              key={notification.id}
              className={notificationStyle({ type: notification.type })}
            >
              <FontAwesomeIcon icon={icon} className="mr-2" />
              <div className="flex gap-3 truncate">{notification.message}</div>
            </div>
          </Transition>
        );
      })}
    </div>
  );
}
