/**
 * RUAA Store - Modular Courier API Connectors
 * Ready for Steadfast Courier and Pathao Courier Integrations
 */

export const COURIER_CONFIG = {
  steadfast: {
    baseUrl: 'https://portal.steadfast.com.bd/api/v1',
    apiKey: '',
    secretKey: ''
  },
  pathao: {
    baseUrl: 'https://api-hermes.pathao.com/aladdin/api/v1',
    clientId: '',
    clientSecret: '',
    username: '',
    password: '',
    storeId: ''
  }
};

/**
 * Dispatch order to Steadfast Courier
 * @param {Object} order
 * @param {Object} credentials - optional override { apiKey, secretKey }
 */
export async function dispatchToSteadfast(order, credentials = {}) {
  const payload = {
    invoice: order.id,
    recipient_name: order.name,
    recipient_phone: order.phone,
    recipient_address: order.address,
    cod_amount: Number(order.total) || 0,
    note: order.note || `RUAA Store order ${order.productTitle} (${order.color}, ${order.size})`
  };

  try {
    const res = await fetch('/api/courier/steadfast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token') || 'ruaa-admin-secret-2026'}`
      },
      body: JSON.stringify({ order: payload, credentials })
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Steadfast dispatch error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatch order to Pathao Courier
 * @param {Object} order
 * @param {Object} credentials - optional override
 */
export async function dispatchToPathao(order, credentials = {}) {
  const payload = {
    store_id: credentials.storeId || COURIER_CONFIG.pathao.storeId || 1,
    merchant_order_id: order.id,
    recipient_name: order.name,
    recipient_phone: order.phone,
    recipient_address: order.address,
    recipient_city: order.city === 'inside_dhaka' ? 1 : 2, // 1 for Dhaka
    recipient_zone: 1,
    recipient_area: 1,
    delivery_type: 48, // Normal 48h
    item_type: 2, // Parcel
    special_instruction: order.note || '',
    item_quantity: 1,
    item_weight: 0.5,
    amount_to_collect: Number(order.total) || 0,
    item_description: `${order.productTitle} - ${order.color} (${order.size})`
  };

  try {
    const res = await fetch('/api/courier/pathao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token') || 'ruaa-admin-secret-2026'}`
      },
      body: JSON.stringify({ order: payload, credentials })
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Pathao dispatch error:', err);
    return { success: false, error: err.message };
  }
}
