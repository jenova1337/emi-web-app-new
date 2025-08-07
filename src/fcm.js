import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = "BLnHlLm2S9VopDZXBecBa6n3xrQK3Vidr9RISYCauvUN5LIzyV1KgQeBRhoCVL5HCkmCBhkfN04AnoOfS8cuSFc";

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        console.log("✅ FCM Token:", currentToken);
        return currentToken;
      }
    } else {
      console.warn("❌ Permission not granted for notifications");
    }
  } catch (err) {
    console.error("Token error:", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
