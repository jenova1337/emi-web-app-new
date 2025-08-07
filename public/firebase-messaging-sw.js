importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyACASp8Yk5l0c0AH-HJjfaBocXk_sit6WY",
  authDomain: "emi-tracker-e3771.firebaseapp.com",
  projectId: "emi-tracker-e3771",
  storageBucket: "emi-tracker-e3771.appspot.com",
  messagingSenderId: "744538139343",
  appId: "1:744538139343:web:74c881b8bacc557d59a5ba"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/icon-192x192.png", // Optional
  };

  self.registration.showNotification(title, notificationOptions);
});
