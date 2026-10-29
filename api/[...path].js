const { randomInt } = require("node:crypto");
const { isAdminRequest, signIn } = require("./_lib/auth");
const { DEFAULT_SETTINGS, getDb, getSettings } = require("./_lib/firebase");

const PRODUCTS = {
  ma: { title: "মা স্পেশাল কালেকশন (দুবাই চেরি জর্জেট)", price: 1190, colors: ["Navy Blue", "Black", "Maroon", "Olive Green", "Coffee"], sizes: ["50", "52", "54", "56"] },
  classic: { title: "মা-মেয়ে ক্লাসিক কম্বো সেট (দুবাই চেরি জর্জেট)", price: 1680, colors: ["Black", "Maroon", "Blue", "Olive", "Coffee"], sizes: ["50", "52", "54", "56"] },
  borobon: { title: "বড় বোন কালেকশন (প্রিমিয়াম আবায়া)", price: 990, colors: ["Black", "Maroon", "Navy Blue", "Olive", "Coffee"], sizes: ["50", "52", "54", "56"] },
  maboromeye: { title: "মা ও বড় মেয়ে টুইনিং কালেকশন", price: 890, colors: ["Blue", "Black", "Maroon", "Olive", "Coffee"], sizes: ["50", "52", "54", "56"] },
  kids: { title: "কিডস ফ্যাশন কালেকশন (বাচ্চাদের বোরকা)", price: 690, colors: ["Black", "Maroon", "Blue", "Olive"], sizes: ["30", "34", "38", "42"] },
  chotobon: { title: "ছোট বোন কালেকশন (স্মার্ট ডিজাইন)", price: 590, colors: ["Black", "Maroon", "Blue", "Olive", "Coffee"], sizes: ["42", "46", "48", "50"] },
  hijab: { title: "দুবাই প্রিমিয়াম চেরি হিজাব (বড় সাইজ)", price: 450, colors: ["Olive", "Black", "Maroon", "Navy Blue"], sizes: ["৪০ ইঞ্চি", "৭২ ইঞ্চি", "৮০ ইঞ্চি"] }
};

const ORDER_STATUSES = new Set(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]);
const PUBLIC_SETTINGS_KEYS = ["whatsapp", "pixelId", "deliveryFeeInside", "deliveryFeeOutside", "currency", "freeDeliveryMinQty", "bannerOfferText"];

function send(res, status, body) {
  return res.status(status).json(body);
}

function routeParts(req) {
  const path = req.query.path;
  const parts = Array.isArray(path) ? path : path ? [path] : [];
  if (parts.length) return parts;

  const pathname = new URL(req.url || "/", "http://localhost").pathname;
  return pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
}

function requireAdmin(req, res) {
  if (isAdminRequest(req)) return true;
  send(res, 401, { error: "Unauthorized" });
  return false;
}

function publicOrder(order) {
  return {
    id: order.id,
    status: order.status,
    total: order.total,
    productTitle: order.productTitle,
    color: order.color,
    size: order.size
  };
}

module.exports = async function handler(req, res) {
  const [resource, id] = routeParts(req);

  if (resource === "login" && req.method === "POST") {
    try {
      const token = signIn(req.body?.password);
      return token ? send(res, 200, { success: true, token }) : send(res, 401, { success: false, error: "Invalid password" });
    } catch (error) {
      return send(res, 503, { error: error.message });
    }
  }

  if (resource === "courier" && req.method === "POST") {
    if (!requireAdmin(req, res)) return;
    return send(res, 503, { success: false, error: "Courier API credentials are not configured. No parcel was booked." });
  }

  if (!new Set(["orders", "track", "settings"]).has(resource)) {
    return send(res, 404, { error: "Not found" });
  }

  if (resource === "orders" && (req.method === "GET" || id) && !requireAdmin(req, res)) return;
  if (resource === "settings" && req.method === "POST" && !requireAdmin(req, res)) return;

  try {
    const db = getDb();

    if (resource === "settings") {
      const settings = await getSettings(db);
      if (req.method === "GET") {
        if (isAdminRequest(req)) return send(res, 200, settings);
        return send(res, 200, Object.fromEntries(PUBLIC_SETTINGS_KEYS.map(key => [key, settings[key]])));
      }
      if (req.method === "POST") {
        const next = Object.fromEntries(PUBLIC_SETTINGS_KEYS.map(key => [key, req.body?.[key] ?? settings[key]]));
        await db.collection("settings").doc("store").set(next, { merge: true });
        return send(res, 200, { success: true });
      }
      return send(res, 405, { error: "Method not allowed" });
    }

    if (resource === "orders" && !id) {
      if (req.method === "GET") {
        const snapshot = await db.collection("orders").get();
        const orders = snapshot.docs.map(doc => doc.data()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
        return send(res, 200, orders);
      }

      if (req.method === "POST") {
        const body = req.body || {};
        const product = PRODUCTS[body.productId];
        const quantity = Number(body.quantity);
        const phone = String(body.phone || "").replace(/\D/g, "");
        const city = body.city === "outside_dhaka" ? "outside_dhaka" : body.city === "inside_dhaka" ? "inside_dhaka" : "";
        if (!String(body.name || "").trim() || !/^(01)[3-9]\d{8}$/.test(phone) || !String(body.address || "").trim() || !product || !city || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
          return send(res, 400, { success: false, error: "Invalid order details" });
        }
        if (!product.colors.includes(body.color) || !product.sizes.includes(String(body.size))) {
          return send(res, 400, { success: false, error: "Invalid product variant" });
        }

        const settings = await getSettings(db);
        const deliveryFee = quantity >= Number(settings.freeDeliveryMinQty) ? 0 : city === "inside_dhaka" ? Number(settings.deliveryFeeInside) : Number(settings.deliveryFeeOutside);
        const id = `RUAA-${randomInt(100000, 1000000)}`;
        const order = {
          id,
          name: String(body.name).trim(),
          phone,
          address: String(body.address).trim(),
          city,
          productId: body.productId,
          productTitle: product.title,
          color: body.color,
          size: String(body.size),
          quantity,
          productPrice: product.price,
          deliveryFee,
          total: product.price * quantity + deliveryFee,
          status: "Pending",
          paymentMethod: "Cash on Delivery",
          note: String(body.note || "").trim(),
          createdAt: new Date().toISOString()
        };
        await db.collection("orders").doc(id).create(order);
        return send(res, 201, { success: true, order });
      }

      return send(res, 405, { error: "Method not allowed" });
    }

    if (resource === "orders" && id) {
      const orderRef = db.collection("orders").doc(id);
      const snapshot = await orderRef.get();
      if (!snapshot.exists) return send(res, 404, { error: "Order not found" });

      if (req.method === "PUT") {
        const update = {};
        if (req.body?.status !== undefined) {
          if (!ORDER_STATUSES.has(req.body.status)) return send(res, 400, { error: "Invalid order status" });
          update.status = req.body.status;
        }
        if (req.body?.note !== undefined) update.note = String(req.body.note).slice(0, 1000);
        if (!Object.keys(update).length) return send(res, 400, { error: "No valid fields to update" });
        await orderRef.update(update);
        return send(res, 200, { success: true });
      }

      if (req.method === "DELETE") {
        await orderRef.delete();
        return send(res, 200, { success: true });
      }

      return send(res, 405, { error: "Method not allowed" });
    }

    if (resource === "track" && req.method === "GET") {
      const query = String(req.query.query || req.query.phone || "").trim();
      if (!query) return send(res, 400, { error: "Query required" });
      const isPhone = /^\+?[\d\s()-]+$/.test(query);
      let matches = [];
      if (isPhone) {
        const digits = query.replace(/\D/g, "");
        const phone = digits.length === 13 && digits.startsWith("880") ? digits.slice(2) : digits;
        const snapshot = await db.collection("orders").where("phone", "==", phone).get();
        matches = snapshot.docs.map(doc => doc.data());
      } else {
        const snapshot = await db.collection("orders").doc(query.toUpperCase()).get();
        if (snapshot.exists) matches = [snapshot.data()];
      }
      return send(res, 200, { orders: matches.map(publicOrder) });
    }

    return send(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error("Vercel API error:", error);
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      return send(res, 503, { error: "Order service is not configured yet. Please contact the store." });
    }
    return send(res, 500, { error: "Internal server error" });
  }
};