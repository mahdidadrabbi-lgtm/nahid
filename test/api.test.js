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
        return {
          async get() {
            return {
              docs: [...orders.values()]
                .filter(order => {
                  if (field === "phone") return order.phone === value;
                  if (field === "updatedAt" && operator === ">=") return order.updatedAt >= value;
                  return false;
                })
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
    status: "Processing"
  }, login.body.token);
  assert.equal(updated.statusCode, 200);

  const tracked = await request("GET", `/api/track?query=${orderId}`);
  assert.equal(tracked.statusCode, 200);
  assert.equal(tracked.body.orders[0].status, "Processing");

  const updates = await request("GET", `/api/orders?since=${encodeURIComponent(new Date(Date.now() - 60_000).toISOString())}`, undefined, login.body.token);
  assert.equal(updates.statusCode, 200);
  assert.equal(updates.body[0].updatedAt, orders.get(orderId).updatedAt);

  const deleted = await request("DELETE", `/api/orders/${orderId}`, undefined, login.body.token);
  assert.equal(deleted.statusCode, 200);
  const noLongerTracked = await request("GET", `/api/track?query=${orderId}`);
  assert.deepEqual(noLongerTracked.body.orders, []);
});

test("repeat orders from the same phone within two minutes are flagged", async () => {
  orders.clear();
  const orderDetails = {
    name: "Repeat Buyer",
    phone: "01712345678",
    address: "Test address",
    city: "inside_dhaka",
    productId: "ma",
    color: "Navy Blue",
    size: "54",
    quantity: 1
  };

  const first = await request("POST", "/api/orders", orderDetails);
  const second = await request("POST", "/api/orders", orderDetails);

  assert.equal(first.statusCode, 201);
  assert.equal(first.body.order.isDuplicate, false);
  assert.equal(second.statusCode, 201);
  assert.equal(second.body.order.isDuplicate, true);
  assert.equal(second.body.order.duplicateOf, first.body.order.id);
});

test("Turnstile is required for production order writes when its credentials are absent", async () => {
  const previousEnvironment = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = "production";

  try {
    const config = await request("GET", "/api/captcha-config");
    assert.deepEqual(config.body, { required: true, siteKey: "" });

    const order = await request("POST", "/api/orders", {
      name: "Captcha Buyer",
      phone: "01712345678",
      address: "Test address",
      city: "inside_dhaka",
      productId: "ma",
      color: "Navy Blue",
      size: "54",
      quantity: 1
    });
    assert.equal(order.statusCode, 503);
  } finally {
    if (previousEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnvironment;
  }
});

test("production order creation accepts a valid Turnstile response", async () => {
  const previousEnvironment = process.env.VERCEL_ENV;
  const previousSiteKey = process.env.TURNSTILE_SITE_KEY;
  const previousSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const previousFetch = global.fetch;
  process.env.VERCEL_ENV = "production";
  process.env.TURNSTILE_SITE_KEY = "test-site-key";
  process.env.TURNSTILE_SECRET_KEY = "test-secret-key";
  global.fetch = async (url, options) => {
    assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(new URLSearchParams(options.body).get("response"), "valid-test-token");
    return {
      ok: true,
      json: async () => ({
        success: true,
        action: "order",
        hostname: "ruaaborqa.vercel.app"
      })
    };
  };

  try {
    orders.clear();
    const order = await request("POST", "/api/orders", {
      name: "Verified Buyer",
      phone: "01712345678",
      address: "Test address",
      city: "inside_dhaka",
      productId: "ma",
      color: "Navy Blue",
      size: "54",
      quantity: 1,
      turnstileToken: "valid-test-token"
    });
    assert.equal(order.statusCode, 201);
  } finally {
    global.fetch = previousFetch;
    if (previousEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnvironment;
    if (previousSiteKey === undefined) delete process.env.TURNSTILE_SITE_KEY;
    else process.env.TURNSTILE_SITE_KEY = previousSiteKey;
    if (previousSecretKey === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = previousSecretKey;
  }
});

test("production order creation rejects invalid Turnstile action or hostname", async () => {
  const previousEnvironment = process.env.VERCEL_ENV;
  const previousSiteKey = process.env.TURNSTILE_SITE_KEY;
  const previousSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const previousFetch = global.fetch;
  process.env.VERCEL_ENV = "production";
  process.env.TURNSTILE_SITE_KEY = "test-site-key";
  process.env.TURNSTILE_SECRET_KEY = "test-secret-key";
  const invalidResponses = [
    { success: true, action: "login", hostname: "ruaaborqa.vercel.app" },
    { success: true, action: "order", hostname: "attacker.example" },
    { success: true, hostname: "ruaaborqa.vercel.app" },
    { success: false, action: "order", hostname: "ruaaborqa.vercel.app" }
  ];
  global.fetch = async () => ({
    ok: true,
    json: async () => invalidResponses.shift()
  });

  try {
    orders.clear();
    for (let index = 0; index < 4; index += 1) {
      const order = await request("POST", "/api/orders", {
        name: "Rejected Buyer",
        phone: `0171234567${index}`,
        address: "Test address",
        city: "inside_dhaka",
        productId: "ma",
        color: "Navy Blue",
        size: "54",
        quantity: 1,
        turnstileToken: `invalid-test-token-${index}`
      });
      assert.equal(order.statusCode, 400);
    }
    assert.equal(orders.size, 0);
  } finally {
    global.fetch = previousFetch;
    if (previousEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnvironment;
    if (previousSiteKey === undefined) delete process.env.TURNSTILE_SITE_KEY;
    else process.env.TURNSTILE_SITE_KEY = previousSiteKey;
    if (previousSecretKey === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = previousSecretKey;
  }
});

test("production order creation rejects oversized Turnstile tokens before verification", async () => {
  const previousEnvironment = process.env.VERCEL_ENV;
  const previousSiteKey = process.env.TURNSTILE_SITE_KEY;
  const previousSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const previousFetch = global.fetch;
  process.env.VERCEL_ENV = "production";
  process.env.TURNSTILE_SITE_KEY = "test-site-key";
  process.env.TURNSTILE_SECRET_KEY = "test-secret-key";
  global.fetch = async () => {
    throw new Error("Siteverify must not be called for oversized tokens");
  };

  try {
    orders.clear();
    const order = await request("POST", "/api/orders", {
      name: "Rejected Buyer",
      phone: "01712345678",
      address: "Test address",
      city: "inside_dhaka",
      productId: "ma",
      color: "Navy Blue",
      size: "54",
      quantity: 1,
      turnstileToken: "x".repeat(2049)
    });
    assert.equal(order.statusCode, 400);
    assert.equal(orders.size, 0);
  } finally {
    global.fetch = previousFetch;
    if (previousEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnvironment;
    if (previousSiteKey === undefined) delete process.env.TURNSTILE_SITE_KEY;
    else process.env.TURNSTILE_SITE_KEY = previousSiteKey;
    if (previousSecretKey === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = previousSecretKey;
  }
});
