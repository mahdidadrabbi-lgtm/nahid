const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const DEFAULT_SETTINGS = {
  whatsapp: "8801988863486",
  pixelId: "1338895321203100",
  deliveryFeeInside: 70,
  deliveryFeeOutside: 130,
  currency: "৳",
  freeDeliveryMinQty: 2,
  bannerOfferText: "🔥 সীমিত সময়ের অফার! যেকোনো ২টি অর্ডার করলেই ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!"
};

function getDb() {
  if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccount) throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured");
    initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
  }
  return getFirestore();
}

async function getSettings(db) {
  const snapshot = await db.collection("settings").doc("store").get();
  return { ...DEFAULT_SETTINGS, ...(snapshot.exists ? snapshot.data() : {}) };
}

module.exports = { DEFAULT_SETTINGS, getDb, getSettings };