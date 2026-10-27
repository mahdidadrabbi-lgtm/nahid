/**
 * OrderTable Component
 * Order listing, status filters, one-click updater, and quick action buttons
 */

export function renderOrderRow(order) {
  const dateFormatted = order.createdAt ? new Date(order.createdAt).toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' }) : 'আজ';
  const waText = encodeURIComponent(`আসসালামু আলাইকুম ${order.name}, RUAA Store থেকে আপনার #${order.id} অর্ডারটি কনফার্ম করার জন্য যোগাযোগ করা হয়েছে।`);

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
        <!-- Courier Dispatch Dropdown -->
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
}
