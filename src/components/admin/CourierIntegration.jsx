/**
 * CourierIntegration Component
 * Modal and action handler to dispatch orders directly to Steadfast or Pathao APIs
 */

export function renderCourierModal(order) {
  return `
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
          
          <!-- Steadfast Courier Button -->
          <button onclick="executeDispatch('${order.id}', 'steadfast')" id="btn-dispatch-steadfast" class="w-full p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/50 flex items-center justify-between transition-all group text-left">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">S</div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Steadfast Courier</h4>
                <p class="text-[11px] text-slate-500">API অটো বুকিং ও ট্র্যাকিং কোড জেনারেশন</p>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-indigo-400 group-hover:translate-x-1 transition-transform"></i>
          </button>

          <!-- Pathao Courier Button -->
          <button onclick="executeDispatch('${order.id}', 'pathao')" id="btn-dispatch-pathao" class="w-full p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50/50 flex items-center justify-between transition-all group text-left">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">P</div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Pathao Courier</h4>
                <p class="text-[11px] text-slate-500">পাঠাও মার্চেন্ট এপিআই সরাসরি বুকিং</p>
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
