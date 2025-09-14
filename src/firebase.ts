// // src/firebase.ts
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

// // Firebase configuration - use environment variables
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // VAPID Key - get this from Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates
// const VAPID_KEY =
//   import.meta.env.VITE_FIREBASE_VAPID_KEY ||
//   "BDlxBphBp7K8pHwtN5HZb4vznFI2EPvmwAZcEwshuZta7aw2LEcjVktGk9EfDsBVdbzWaIgTh1JIG3DTHWu6bZI";

// /**
//  * Bind FCM token to employee
//  * @param employeeCode - The employee code to bind the token to
//  * @returns FCM token or null if failed
//  */
// export async function bindFcmToEmployee(employeeCode: string): Promise<string | null> {
//   if (!employeeCode) {
//     console.error("Employee code is required");
//     return null;
//   }

//   try {
//     // Check if FCM is supported in this browser
//     if (!(await isSupported())) {
//       console.warn("FCM is not supported in this browser");
//       return null;
//     }

//     // Request notification permission
//     if (Notification.permission !== "granted") {
//       console.log("Requesting notification permission...");
//       const permission = await Notification.requestPermission();
//       if (permission !== "granted") {
//         console.warn("Notification permission denied");
//         return null;
//       }
//     }

//     // Register service worker
//     let swRegistration;
//     try {
//       swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
//       console.log("Service worker registered successfully:", swRegistration);

//       // Wait for service worker to be ready
//       await navigator.serviceWorker.ready;
//     } catch (swError) {
//       console.error("Service worker registration failed:", swError);
//       return null;
//     }

//     // Get messaging instance
//     const messaging = getMessaging(app);

//     // Get FCM token
//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//       serviceWorkerRegistration: swRegistration,
//     });

//     if (!token) {
//       console.warn("Failed to obtain FCM token");
//       return null;
//     }

//     console.log("FCM Token generated:", token);

//     // Check if token is already cached for this employee
//     const cacheKey = `fcm_token_${employeeCode}`;
//     const cachedToken = localStorage.getItem(cacheKey);

//     if (cachedToken === token) {
//       console.log("Token already cached for employee:", employeeCode);
//       return token;
//     }

//     // Send token to your backend API
//     try {
//       const response = await fetch("/api/employee/fcm-token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth if needed
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           employeeCode,
//           token,
//           timestamp: new Date().toISOString(),
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("Token successfully saved to backend:", result);

//       // Cache the token after successful API call
//       localStorage.setItem(cacheKey, token);

//       return token;
//     } catch (apiError) {
//       console.error("Failed to save FCM token to backend:", apiError);
//       // Still cache the token locally even if API fails
//       localStorage.setItem(cacheKey, token);
//       return token;
//     }
//   } catch (error) {
//     console.error("Error in bindFcmToEmployee:", error);
//     return null;
//   }
// }

// /**
//  * Setup foreground message handler
//  */
// export function setupForegroundMessageHandler() {
//   if (typeof window === "undefined") return;

//   isSupported().then((supported) => {
//     if (!supported) return;

//     const messaging = getMessaging(app);

//     // Handle foreground messages
//     onMessage(messaging, (payload) => {
//       console.log("Foreground message received:", payload);

//       const { title, body, icon } = payload.notification || {};
//       console.log({ title, body, icon });
//       // Show notification if browser supports it
//       if ("Notification" in window && Notification.permission === "granted") {
//         new Notification(title || "New Message", {
//           body: body || "",
//           icon: icon || "/icon.png",
//           data: payload.data || {},
//         });
//       }

//       // You can also dispatch a custom event or update your app state here
//       window.dispatchEvent(new CustomEvent("fcm-message", { detail: payload }));
//     });
//   });
// }

// /**
//  * Clear cached FCM token for employee
//  */
// export function clearFcmTokenCache(employeeCode: string) {
//   if (employeeCode) {
//     localStorage.removeItem(`fcm_token_${employeeCode}`);
//     console.log("FCM token cache cleared for employee:", employeeCode);
//   }
// }

// export { app };
