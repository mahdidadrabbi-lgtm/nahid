// RUAA Store - Secret Admin Portal Controller (/sys-portal-mgt-v2)

let allOrders = [];
let currentFilter = 'all';
let searchQuery = '';
let orderRefreshTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAuthentication();
});

async function verifyAdminAuthentication() {
  const token = sessionStorage.getItem("admin_token");
  if (token && await fetchOrders()) {
    showAdminApp();
    return;
  }

  sessionStorage.removeItem("admin_token");
  showAdminLogin();
}

function showAdminApp() {
  document.getElementById("auth-gate-modal").classList.add("hidden");
  document.getElementById("admin-app").classList.remove("hidden");
  if (!orderRefreshTimer) orderRefreshTimer = setInterval(fetchOrders, 12000);
}

function showAdminLogin() {
  document.getElementById("auth-gate-modal").classList.remove("hidden");
  document.getElementById("admin-app").classList.add("hidden");
  const input = document.getElementById("admin-passkey-input");
  if (input) input.focus();
}

function adminAuthHeaders(headers = {}) {
  return {
    ...headers,
    "Authorization": `Bearer ${sessionStorage.getItem("admin_token") || ""}`
  };
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("admin-passkey-input");
  const entered = input.value.trim();

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: entered })
    });
    const result = await response.json();
    if (response.status === 401) {
      alert("ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।");
      input.select();
      return;
    }
    if (!response.ok || !result.token) {
      alert(result.error || "অ্যাডমিন লগইন এখন কনফিগার করা নেই।");
      return;
    }

    sessionStorage.setItem("admin_token", result.token);
    if (await fetchOrders()) {
      input.value = "";
      showAdminApp();
    } else {
      sessionStorage.removeItem("admin_token");
      alert("ড্যাশবোর্ড লোড করা যায়নি। আবার চেষ্টা করুন।");
    }
  } catch (err) {
    alert("সার্ভারের সাথে সংযোগ করা যায়নি।");
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("admin_token");
  window.location.href = "/";
}

async function fetchOrders() {
  const icon = document.getElementById("refresh-icon");
  if (icon) icon.classList.add("fa-spin");

  try {
    const res = await fetch("/api/orders", {
      headers: adminAuthHeaders()
    });
    if (res.status === 401) {
      sessionStorage.removeItem("admin_token");
      return false;
    }
    if (!res.ok) throw new Error("Failed to load");
    const orders = await res.json();
    if (!Array.isArray(orders)) throw new Error("Invalid order data");
    allOrders = orders;
    updateAnalyticsWidgets();
    renderOrders();
    return true;
  } catch (err) {
    console.error("Fetch orders error:", err);
    return false;
  } finally {
    if (icon) icon.classList.remove("fa-spin");
  }
}

function updateAnalyticsWidgets() {
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Today's revenue calculation
  const todayOrders = allOrders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  
  // If today's orders are 0 in demo data, calculate recent total sales
  const displayRevenue = todayRevenue > 0 ? todayRevenue : allOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const pendingCount = allOrders.filter(o => o.status === 'Pending').length;
  const deliveredCount = allOrders.filter(o => o.status === 'Delivered').length;
  const shippedCount = allOrders.filter(o => o.status === 'Shipped').length;
  const confirmedCount = allOrders.filter(o => o.status === 'Confirmed').length;
  const cancelledCount = allOrders.filter(o => o.status === 'Cancelled').length;

  document.getElementById("metric-today-revenue").innerText = `৳ ${displayRevenue.toLocaleString()}`;
  document.getElementById("metric-pending-orders").innerText = pendingCount;
  document.getElementById("metric-delivered-orders").innerText = deliveredCount;

  // Tabs counts
  document.getElementById("count-all").innerText = allOrders.length;
  document.getElementById("count-pending").innerText = pendingCount;
  document.getElementById("count-confirmed").innerText = confirmedCount;
  document.getElementById("count-shipped").innerText = shippedCount;
  document.getElementById("count-delivered").innerText = deliveredCount;
  document.getElementById("count-cancelled").innerText = cancelledCount;
}

function renderOrders() {
  const tbody = document.getElementById("orders-tbody");
  const noOrders = document.getElementById("no-orders-msg");
  if (!tbody) return;

  let filtered = allOrders;

  if (currentFilter !== 'all') {
    filtered = filtered.filter(o => o.status === currentFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(o => 
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.name && o.name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    noOrders.classList.remove("hidden");
    return;
  }

  noOrders.classList.add("hidden");

  tbody.innerHTML = filtered.map(order => {
    const dateFormatted = order.createdAt ? new Date(order.createdAt).toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' }) : 'আজ';
    const waText = encodeURIComponent(`আসসালামু আলাইকুম ${order.name}, RUAA Store থেকে আপনার #${order.id} অর্ডারটি কনফার্ম করার জন্য মেসেজ দেওয়া হয়েছে।`);

    const statusBg = {
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
      'Shipped': 'bg-purple-50 text-purple-700 border-purple-200',
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Cancelled': 'bg-rose-50 text-rose-700 border-rose-200'
    }[order.status] || 'bg-slate-50 text-slate-700 border-slate-200';

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="p-4 font-mono font-bold text-slate-900">
          <div>#${order.id}</div>
          <div class="text-[10px] text-slate-400 font-sans mt-0.5">${dateFormatted}</div>
        </td>

        <td class="p-4">
          <div class="font-bold text-slate-900 text-sm">${order.name}</div>
          <div class="font-mono text-xs text-slate-600 mt-0.5 flex items-center gap-2">
            <span>${order.phone}</span>
            <a href="tel:${order.phone}" class="text-blue-500 hover:text-blue-700" title="কল দিন">
              <i class="fa-solid fa-phone"></i>
            </a>
            <a href="https://wa.me/88${order.phone.replace(/^0/, '')}?text=${waText}" target="_blank" class="text-emerald-500 hover:text-emerald-700" title="WhatsApp চ্যাট">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </td>

        <td class="p-4 max-w-xs">
          <div class="line-clamp-2 text-slate-600 text-xs">${order.address}</div>
          <span class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${order.city === 'inside_dhaka' ? 'bg-sky-50 text-sky-700' : 'bg-purple-50 text-purple-700'}">
            ${order.city === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
          </span>
        </td>

        <td class="p-4">
          <div class="font-bold text-slate-800">${order.productTitle}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">
            কালার: <span class="font-semibold text-slate-700">${order.color || 'Default'}</span> | 
            সাইজ: <span class="font-semibold text-slate-700">${order.size || 'Free'}</span>
            ${order.quantity > 1 ? ` | <span class="text-rose-500 font-bold">${order.quantity}টি</span>` : ''}
          </div>
        </td>

        <td class="p-4 font-bold text-slate-900">
          <div class="text-sm font-black text-[#FF4D6D]">৳ ${(order.total || 0).toLocaleString()}</div>
          <div class="text-[10px] text-slate-400 font-normal">ক্যাশ অন ডেলিভারি</div>
        </td>

        <td class="p-4">
          <select onchange="updateOrderStatus('${order.id}', this.value)" class="text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none transition-all cursor-pointer ${statusBg}">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>⏳ পেন্ডিং (Pending)</option>
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>✅ কনফার্মড (Confirmed)</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>🚚 শিপিং (Shipped)</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>🎉 ডেলিভার্ড (Delivered)</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>❌ বাতিল (Cancelled)</option>
          </select>
        </td>

        <td class="p-4 text-right space-x-1">
          <!-- Courier Dispatch Button -->
          <button onclick="openCourierModal('${order.id}')" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="কুরিয়ারে পাঠান (Steadfast / Pathao)">
            <i class="fa-solid fa-truck"></i>
          </button>
          <!-- Print Invoice Memo -->
          <button onclick="printOrderInvoice('${order.id}')" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="মেমো প্রিন্ট করুন">
            <i class="fa-solid fa-print"></i>
          </button>
          <!-- Delete -->
          <button onclick="deleteOrder('${order.id}')" class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="অর্ডার মুছুন">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function setFilter(status) {
  currentFilter = status;
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.classList.remove("active", "bg-slate-900", "text-white");
    tab.classList.add("bg-slate-100", "text-slate-600");
  });
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.remove("bg-slate-100", "text-slate-600");
    window.event.currentTarget.classList.add("active", "bg-slate-900", "text-white");
  }
  renderOrders();
}

function handleSearch(val) {
  searchQuery = val.trim();
  renderOrders();
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        ...adminAuthHeaders({ "Content-Type": "application/json" })
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error(`Status update failed (${res.status})`);
    const order = allOrders.find(o => o.id === orderId);
    if (order) order.status = newStatus;
    updateAnalyticsWidgets();
    renderOrders();
  } catch (err) {
    console.error("Status update error:", err);
    alert("স্ট্যাটাস আপডেট করা সম্ভব হয়নি।");
  }
}

async function deleteOrder(orderId) {
  if (!confirm(`আপনি কি নিশ্চিত #${orderId} অর্ডারটি ডিলিট করতে চান?`)) return;
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
      headers: adminAuthHeaders()
    });
    if (!res.ok) throw new Error(`Order deletion failed (${res.status})`);
    allOrders = allOrders.filter(o => o.id !== orderId);
    updateAnalyticsWidgets();
    renderOrders();
  } catch (err) {
    console.error("Delete error:", err);
    alert("অর্ডারটি মুছতে সমস্যা হয়েছে।");
  }
}

// INVOICE / MEMO PRINT GENERATOR
function printOrderInvoice(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  const invoiceDiv = document.getElementById("printable-invoice");
  invoiceDiv.innerHTML = `
    <div style="font-family: 'Hind Siliguri', sans-serif, system-ui; max-width: 600px; margin: auto; padding: 25px; border: 2px solid #e2e8f0; border-radius: 12px; background: #fff; color: #1e293b;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #FF4D6D; padding-bottom: 12px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #0f172a; letter-spacing: -0.5px;">RUAA<span style="color: #FF4D6D;">.</span></h1>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600;">PREMIUM MODEST FASHION</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569;">📞 হেল্পলাইন: 01988-863486</p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; background: #FF4D6D; color: #fff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">ক্যাশ অন ডেলিভারি</span>
          <p style="margin: 6px 0 0 0; font-size: 14px; font-weight: 800; font-family: monospace;">#${order.id}</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
        </div>
      </div>

      <div style="margin: 18px 0; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px;">
        <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569;">প্রাপকের বিবরণ (Customer Details):</h3>
        <p style="margin: 3px 0;"><strong>নাম:</strong> ${order.name}</p>
        <p style="margin: 3px 0;"><strong>মোবাইল:</strong> <span style="font-family: monospace; font-size: 13px;">${order.phone}</span></p>
        <p style="margin: 3px 0;"><strong>ঠিকানা:</strong> ${order.address}</p>
        <p style="margin: 3px 0;"><strong>এলাকা:</strong> ${order.city === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px;">
        <thead>
          <tr style="background: #0f172a; color: #fff; text-align: left;">
            <th style="padding: 8px 10px; border-radius: 6px 0 0 0;">আইটেম</th>
            <th style="padding: 8px 10px;">কালার / সাইজ</th>
            <th style="padding: 8px 10px; text-align: center;">পরিমাণ</th>
            <th style="padding: 8px 10px; text-align: right; border-radius: 0 6px 0 0;">মূল্য</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px; font-weight: 600;">${order.productTitle}</td>
            <td style="padding: 10px;">${order.color || '-'} / ${order.size || '-'}</td>
            <td style="padding: 10px; text-align: center;">${order.quantity || 1}</td>
            <td style="padding: 10px; text-align: right; font-weight: 700;">৳ ${(order.productPrice || order.total - order.deliveryFee).toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 8px 10px; text-align: right; font-weight: 600; color: #64748b;">ডেলিভারি চার্জ:</td>
            <td style="padding: 8px 10px; text-align: right; font-weight: 700;">৳ ${(order.deliveryFee || 70).toLocaleString()}</td>
          </tr>
          <tr style="border-top: 2px solid #0f172a; background: #fff5f7;">
            <td colspan="3" style="padding: 10px; text-align: right; font-size: 14px; font-weight: 900; color: #0f172a;">মোট প্রদেয় বিল (COD):</td>
            <td style="padding: 10px; text-align: right; font-size: 16px; font-weight: 900; color: #FF4D6D;">৳ ${(order.total || 0).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 10px; text-align: center; color: #64748b; line-height: 1.4;">
        <p style="margin: 0;">পার্সেলটি ডেলিভারিম্যানের সামনে চেক করে নেওয়ার জন্য অনুরোধ করা হচ্ছে।</p>
        <p style="margin: 2px 0 0 0;">RUAA Store-এর সাথে থাকার জন্য ধন্যবাদ!</p>
      </div>
    </div>
  `;

  window.print();
}

// COURIER DISPATCH MODAL (Steadfast & Pathao)
function openCourierModal(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  const container = document.getElementById("courier-modal-container");
  container.innerHTML = `
    <div id="courier-dispatch-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span class="text-xs font-bold text-indigo-600 uppercase">Courier Dispatch</span>
            <h3 class="text-lg font-bold text-slate-900">কুরিয়ারে পার্সেল বুকিং</h3>
          </div>
          <button onclick="closeCourierModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
          <p><strong>অর্ডার আইডি:</strong> #${order.id}</p>
          <p><strong>প্রাপক:</strong> ${order.name} (${order.phone})</p>
          <p><strong>ঠিকানা:</strong> ${order.address}</p>
          <p><strong>কালেকশন অ্যামাউন্ট:</strong> <span class="font-bold text-[#FF4D6D]">৳ ${order.total}</span></p>
        </div>

        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-700 uppercase">কুরিয়ার সার্ভিস বেছে নিন:</label>
          
          <button onclick="executeDispatch('${order.id}', 'steadfast')" id="btn-dispatch-steadfast" class="w-full p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/50 flex items-center justify-between transition-all group text-left">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">S</div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Steadfast Courier</h4>
                <p class="text-[11px] text-slate-500">Provider integration ও Vercel credentials প্রয়োজন</p>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-indigo-400 group-hover:translate-x-1 transition-transform"></i>
          </button>

          <button onclick="executeDispatch('${order.id}', 'pathao')" id="btn-dispatch-pathao" class="w-full p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50/50 flex items-center justify-between transition-all group text-left">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">P</div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Pathao Courier</h4>
                <p class="text-[11px] text-slate-500">Merchant API integration ও credentials প্রয়োজন</p>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-emerald-400 group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>

        <div id="dispatch-status-msg" class="hidden p-3 rounded-xl text-xs font-bold text-center"></div>

      </div>
    </div>
  `;
}

function closeCourierModal() {
  const modal = document.getElementById("courier-dispatch-modal");
  if (modal) modal.remove();
}

async function executeDispatch(orderId, courierType) {
  const statusEl = document.getElementById("dispatch-status-msg");
  statusEl.className = "p-3 rounded-xl text-xs font-bold text-center bg-blue-50 text-blue-700 block";
  statusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> ${courierType === 'steadfast' ? 'Steadfast' : 'Pathao'}-এ পার্সেল পাঠানো হচ্ছে...`;

  try {
    const res = await fetch(`/api/courier/${courierType}`, {
      method: "POST",
      headers: {
        ...adminAuthHeaders({ "Content-Type": "application/json" })
      },
      body: JSON.stringify({ orderId })
    });
    const data = await res.json();

    if (data.success) {
      statusEl.className = "p-3 rounded-xl text-xs font-bold text-center bg-emerald-50 text-emerald-700 block";
      statusEl.innerHTML = `✅ ${data.message}<br><span class="font-mono mt-1 block">কনসাইনমেন্ট আইডি: ${data.consignment_id}</span>`;
      
      // Auto-update order status to Shipped
      await updateOrderStatus(orderId, "Shipped");

      setTimeout(() => {
        closeCourierModal();
      }, 2500);
    } else {
      statusEl.className = "p-3 rounded-xl text-xs font-bold text-center bg-rose-50 text-rose-700 block";
      statusEl.innerHTML = `❌ এরর: ${data.error || 'বুকিং করা যায়নি'}`;
    }
  } catch (err) {
    statusEl.className = "p-3 rounded-xl text-xs font-bold text-center bg-rose-50 text-rose-700 block";
    statusEl.innerHTML = "সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে।";
  }
}

function exportToCSV() {
  if (allOrders.length === 0) {
    alert("এক্সপোর্ট করার জন্য কোনো অর্ডার নেই।");
    return;
  }

  const headers = ["Invoice", "Recipient Name", "Recipient Phone", "Recipient Address", "COD Amount", "Note", "Item Description"];
  const rows = allOrders.map(o => [
    `"${o.id}"`,
    `"${o.name}"`,
    `"${o.phone}"`,
    `"${(o.address || '').replace(/"/g, '""')}"`,
    `"${o.total}"`,
    `"${(o.note || '').replace(/"/g, '""')}"`,
    `"${o.productTitle} (${o.color}, ${o.size})"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `RUAA_Courier_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function refreshOrders() {
  fetchOrders();
}

function openSettingsModal() {
  fetch("/api/settings", {
    headers: adminAuthHeaders()
  })
    .then(r => r.json())
    .then(s => {
      document.getElementById("setting-whatsapp").value = s.whatsapp || '';
      document.getElementById("setting-fee-inside").value = s.deliveryFeeInside || 70;
      document.getElementById("setting-fee-outside").value = s.deliveryFeeOutside || 130;
      document.getElementById("setting-banner").value = s.bannerOfferText || '';
      if (document.getElementById("setting-free-qty")) document.getElementById("setting-free-qty").value = s.freeDeliveryMinQty || 2;
      document.getElementById("settings-modal").classList.remove("hidden");
    });
}

function closeSettingsModal() {
  document.getElementById("settings-modal").classList.add("hidden");
}

async function saveSettings(e) {
  e.preventDefault();
  const payload = {
    whatsapp: document.getElementById("setting-whatsapp").value.trim(),
    deliveryFeeInside: Number(document.getElementById("setting-fee-inside").value),
    deliveryFeeOutside: Number(document.getElementById("setting-fee-outside").value),
    bannerOfferText: document.getElementById("setting-banner").value.trim(),
    freeDeliveryMinQty: Number(document.getElementById("setting-free-qty")?.value || 2)
  };

  try {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: {
        ...adminAuthHeaders({ "Content-Type": "application/json" })
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
      closeSettingsModal();
    }
  } catch (err) {
    alert("সংরক্ষণ করা যায়নি।");
  }
}
