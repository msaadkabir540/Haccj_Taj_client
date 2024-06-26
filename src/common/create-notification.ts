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
