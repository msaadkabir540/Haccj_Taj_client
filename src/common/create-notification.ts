// import { toast } from "react-toastify";

// // "success" | "error" | "info" | "warn"
// const createNotification: (type: string, message?: string, timeout?: number) => void = (
//   type,
//   message,
//   timeout = 2000,
// ) => {
//   toast[type as "success" | "error" | "info" | "warn"](message, {
//     position: toast.POSITION.TOP_RIGHT,
//     autoClose: timeout,
//   });
// };

// export default createNotification;

import { TypeOptions, toast } from "react-toastify";

// Define the types of notification types
type NotificationType = "success" | "error" | "info" | "warn";

// Function to create and display a notification
const createNotification = ({
  type,
  message,
}: {
  type: NotificationType;
  message?: string | undefined;
}) => {
  // Display the notification using toastify
  toast(message || "", {
    type: type as TypeOptions | undefined,
    autoClose: 2000,
  });
};

export default createNotification;
