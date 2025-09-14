// /* global importScripts, firebase */

// // Import Firebase scripts
// importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// // Firebase configuration - must match your main app config
// firebase.initializeApp({
//   apiKey: "AIzaSyAbZhQedMXx_KB5KzcwBIojMRdNiODxhDQ",
//   authDomain: "haccp-taj.firebaseapp.com",
//   projectId: "haccp-taj",
//   storageBucket: "haccp-taj.appspot.com",
//   messagingSenderId: "862058392816",
//   appId: "1:862058392816:web:9d0b1cc75fc3e7a82da635",
//   measurementId: "G-G9KKMH9LYB",
// });

// // Get messaging instance
// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log("Background message received:", payload);

//   const {
//     title = "New Notification",
//     body = "",
//     icon = "/icon.png",
//     image,
//     badge = "/badge.png",
//   } = payload.notification || {};

//   const notificationOptions = {
//     body,
//     icon,
//     badge,
//     data: payload.data || {},
//     requireInteraction: true, // Keep notification until user interacts
//     actions: [
//       {
//         action: "open",
//         title: "Open App",
//         icon: "/icon.png",
//       },
//       {
//         action: "dismiss",
//         title: "Dismiss",
//         icon: "/close-icon.png",
//       },
//     ],
//     timestamp: Date.now(),
//   };

//   // Add image if provided
//   if (image) {
//     notificationOptions.image = image;
//   }

//   // Show the notification
//   return self.registration.showNotification(title, notificationOptions);
// });

// // Handle notification clicks
// self.addEventListener("notificationclick", (event) => {
//   console.log("Notification clicked:", event);

//   // Close the notification
//   event.notification.close();

//   const action = event.action;
//   const notificationData = event.notification.data || {};

//   if (action === "dismiss") {
//     // Just close the notification
//     return;
//   }

//   // Handle click (open app or specific URL)
//   event.waitUntil(
//     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//       // Check if there's already a window/tab open
//       for (let i = 0; i < clientList.length; i++) {
//         const client = clientList[i];
//         if (client.url === self.location.origin && "focus" in client) {
//           // Focus existing window and send message
//           client.focus();
//           client.postMessage({
//             type: "notification-click",
//             data: notificationData,
//             action: action || "open",
//           });
//           return;
//         }
//       }

//       // No existing window found, open a new one
//       const urlToOpen = notificationData.url || self.location.origin;
//       return clients.openWindow(urlToOpen).then((windowClient) => {
//         if (windowClient) {
//           // Send data to the newly opened window
//           setTimeout(() => {
//             windowClient.postMessage({
//               type: "notification-click",
//               data: notificationData,
//               action: action || "open",
//             });
//           }, 1000); // Small delay to ensure the window is ready
//         }
//       });
//     }),
//   );
// });

// // Handle push events (if you're sending custom push events)
// self.addEventListener("push", (event) => {
//   if (!event.data) {
//     console.log("Push event but no data");
//     return;
//   }

//   try {
//     const payload = event.data.json();
//     console.log("Custom push event received:", payload);
//     alert(payload?.notification);
//     // Handle custom push events if needed
//     // This is in addition to Firebase's automatic handling
//   } catch (error) {
//     console.error("Error parsing push event data:", error);
//   }
// });

// // Service worker install event
// self.addEventListener("install", (event) => {
//   console.log("Firebase messaging service worker installed");
//   self.skipWaiting(); // Activate immediately
// });

// // Service worker activate event
// self.addEventListener("activate", (event) => {
//   console.log("Firebase messaging service worker activated");
//   event.waitUntil(self.clients.claim()); // Take control of all pages
// });

// // Handle messages from the main thread
// self.addEventListener("message", (event) => {
//   console.log("Service worker received message:", event.data);

//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });
