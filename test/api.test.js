const { test } = require("node:test");
const assert = require("node:assert/strict");

const orders = new Map();
const settings = {
  whatsapp: "8801988863486",
  pixelId: "1338895321203100",
  deliveryFeeInside: 70,
  deliveryFeeOutside: 130,
  currency: "৳",
  freeDeliveryMinQty: 2,
  bannerOfferText: "Test offer"
};

const db = {
  collection(name) {
    if (name === "settings") {
      return {
        doc() {
          return {
            async get() {
              return { exists: true, data: () => settings };
            },
            async set(value) {
              Object.assign(settings, value);
            }
          };
        }
      };
    }

    return {
      doc(id) {
        return {
          async create(order) {
            if (orders.has(id)) throw new Error("Order already exists");
            orders.set(id, order);
          },
          async get() {
            const order = orders.get(id);
            return { exists: Boolean(order), data: () => order };
          },
          async update(fields) {
            if (!orders.has(id)) throw new Error("Order not found");
            orders.set(id, { ...orders.get(id), ...fields });
          },
          async delete() {
            orders.delete(id);
          }
        };
      },
      async get() {
        return { docs: [...orders.values()].map(data => ({ data: () => data })) };
      },
      where(field, operator, value) {
        assert.equal(field, "phone");
        assert.equal(operator, "==");
        return {
          async get() {
            return {
              docs: [...orders.values()]
                .filter(order => order.phone === value)
                .map(data => ({ data: () => data }))
            };
          }
        };
      }
    };
  }
};

const firebasePath = require.resolve("../api/_lib/firebase");
require.cache[firebasePath] = {
  id: firebasePath,
  filename: firebasePath,
  loaded: true,
  exports: {
    DEFAULT_SETTINGS: settings,
    getDb: () => db,
    getSettings: async () => settings
  }
};

process.env.ADMIN_PASSWORD = "test-admin-password-123";
process.env.JWT_SECRET = "test-jwt-secret-with-at-least-32-characters";
process.env.FIREBASE_SERVICE_ACCOUNT = "{}";

const handler = require("../api/[...path].js");

async function request(method, url, body, token) {
  const parsedUrl = new URL(url, "http://localhost");
  const req = {
    method,
    url: parsedUrl.pathname + parsedUrl.search,
    query: Object.fromEntries(parsedUrl.searchParams),
    body,
    headers: token ? { authorization: `Bearer ${token}` } : {}
  };
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    }
  };

  await handler(req, res);
  return res;
}

test("checkout orders can be authenticated, managed, and tracked", async () => {
  orders.clear();
  const created = await request("POST", "/api/orders", {
    name: "Test Buyer",
    phone: "01712345678",
    address: "Test address",
    city: "inside_dhaka",
    productId: "ma",
    color: "Navy Blue",
    size: "54",
    quantity: 1
  });

  assert.equal(created.statusCode, 201);
  assert.equal(created.body.order.total, 1260);
  const orderId = created.body.order.id;

  const login = await request("POST", "/api/login", {
    password: process.env.ADMIN_PASSWORD
  });
  assert.equal(login.statusCode, 200);

  const unauthorized = await request("GET", "/api/orders");
  assert.equal(unauthorized.statusCode, 401);

  const dashboardOrders = await request("GET", "/api/orders", undefined, login.body.token);
  assert.equal(dashboardOrders.statusCode, 200);
  assert.equal(dashboardOrders.body[0].id, orderId);

  const updated = await request("PUT", `/api/orders/${orderId}`, {
    status: "Confirmed"
  }, login.body.token);
  assert.equal(updated.statusCode, 200);

  const tracked = await request("GET", `/api/track?query=${orderId}`);
  assert.equal(tracked.statusCode, 200);
  assert.equal(tracked.body.orders[0].status, "Confirmed");

  const deleted = await request("DELETE", `/api/orders/${orderId}`, undefined, login.body.token);
  assert.equal(deleted.statusCode, 200);
  const noLongerTracked = await request("GET", `/api/track?query=${orderId}`);
  assert.deepEqual(noLongerTracked.body.orders, []);
});
