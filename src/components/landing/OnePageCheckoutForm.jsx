/**
 * OnePageCheckoutForm Component
 * Embedded 1-Page Checkout Form with Bangladesh phone validation,
 * dynamic zone-based delivery calculation, color/size selection, and instant COD submit.
 */

export function renderOnePageCheckoutForm() {
  return `
    <section id="checkout-section" class="py-12 md:py-16 bg-gradient-to-b from-white via-rose-50/40 to-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div class="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span class="text-xs md:text-sm font-bold text-[#FF4D6D] uppercase tracking-widest bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200">
            FAST 1-PAGE CHECKOUT
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900">
            অর্ডার করতে নিচের ফর্মটি পূরণ করুন
          </h2>
          <p class="text-slate-600 text-sm font-medium">
            কোনো অগ্রিম পেমেন্ট লাগবে না। পার্সেল ডেলিভারি পাওয়ার পর টাকা পরিশোধ করবেন।
          </p>
        </div>

        <div class="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
          
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs text-[#FF4D6D] font-bold uppercase tracking-wider block">Cash on Delivery</span>
              <h3 class="text-lg sm:text-xl font-bold">ক্যাশ অন ডেলিভারি অর্ডার ফর্ম</h3>
            </div>
            <div class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300">
              <i class="fa-solid fa-bolt"></i>
              <span>৩ সেকেন্ডে অর্ডার সম্পন্ন</span>
            </div>
          </div>

          <form id="embedded-checkout-form" onsubmit="handleEmbeddedOrderSubmit(event)" class="p-6 sm:p-8 space-y-6">
            
            <!-- Step 1: Select Product -->
            <div class="space-y-3">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                ১. আপনার পছন্দের কালেকশন বেছে নিন *
              </label>
              <select id="emb-product-select" onchange="onEmbeddedProductChange(this.value)" class="w-full p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D6D] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all cursor-pointer">
                <!-- Injected via script -->
              </select>
            </div>

            <!-- Selected Product Visual Card & Swatches -->
            <div class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
              <img id="emb-prod-img" src="/images/ma/ma_navy.jpg" alt="Selected Product" class="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0 cursor-pointer" onclick="openImageZoomModal(this.src, 'Product Preview')">
              
              <div class="flex-1 w-full space-y-2">
                <div class="flex items-center justify-between">
                  <h4 id="emb-prod-title" class="font-bold text-slate-900 text-base">মা স্পেশাল কালেকশন (দুবাই চেরি জর্জেট)</h4>
                  <div class="text-right">
                    <span id="emb-prod-price" class="text-xl font-black text-[#FF4D6D]">৳ ১,১৯০</span>
                  </div>
                </div>

                <!-- Color selector pills -->
                <div>
                  <span class="text-xs text-slate-500 font-bold block mb-1">কালার নির্বাচন করুন:</span>
                  <div id="emb-color-options" class="flex flex-wrap gap-2">
                    <!-- Dynamic color badges -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Size & Quantity -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">সাইজ সিলেক্ট করুন (উচ্চতা অনুযায়ী) *</label>
                <div class="grid grid-cols-4 gap-2" id="emb-size-options">
                  <button type="button" onclick="selectEmbSize('50')" class="emb-size-btn py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm transition-all text-slate-700">50</button>
                  <button type="button" onclick="selectEmbSize('52')" class="emb-size-btn py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm transition-all text-slate-700">52</button>
                  <button type="button" onclick="selectEmbSize('54')" class="emb-size-btn active py-2.5 rounded-xl border-2 border-[#FF4D6D] bg-[#FF4D6D] text-white font-bold text-sm transition-all">54</button>
                  <button type="button" onclick="selectEmbSize('56')" class="emb-size-btn py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm transition-all text-slate-700">56</button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">পরিমাণ (Quantity)</label>
                <div class="flex items-center h-[46px] bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden max-w-[160px]">
                  <button type="button" onclick="changeQuantity(-1)" class="w-12 h-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors text-lg">-</button>
                  <span id="emb-quantity" class="flex-1 text-center font-mono font-bold text-slate-900 text-base">1</span>
                  <button type="button" onclick="changeQuantity(1)" class="w-12 h-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors text-lg">+</button>
                </div>
              </div>
            </div>

            <!-- Step 3: Customer Information with BD Validation -->
            <div class="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">আপনার নাম *</label>
                <input type="text" id="emb-cust-name" required placeholder="সম্পূর্ণ নাম লিখুন" class="w-full p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D6D] focus:bg-white outline-none font-semibold text-sm transition-all">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">মোবাইল নম্বর (১১ ডিজিট) *</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">+88</span>
                  <input type="tel" id="emb-cust-phone" required pattern="^(01)[3-9][0-9]{8}$" placeholder="01XXXXXXXXX" class="w-full pl-14 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D6D] focus:bg-white outline-none font-semibold text-sm transition-all font-mono">
                </div>
                <span class="text-[11px] text-slate-400 mt-1 block">সঠিক মোবাইল নম্বর দিন (ডেলিভারিম্যান এই নম্বরে কল দিবে)</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">সম্পূর্ণ ঠিকানা *</label>
                <textarea id="emb-cust-address" required rows="2" placeholder="বাসা/হোল্ডিং নম্বর, রোড, এলাকা, থানা ও জেলা" class="w-full p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D6D] focus:bg-white outline-none font-semibold text-sm transition-all"></textarea>
              </div>

              <!-- Delivery Location Radio with Dynamic Calculation -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">ডেলিভারি এলাকা সিলেক্ট করুন *</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label class="cursor-pointer border-2 border-[#FF4D6D] bg-rose-50/60 p-3.5 rounded-xl flex items-center justify-between emb-zone-label" id="emb-zone-inside-label">
                    <div class="flex items-center gap-2.5">
                      <input type="radio" name="emb-delivery-zone" value="inside_dhaka" checked onchange="updateEmbDeliveryFee(70)" class="text-[#FF4D6D] focus:ring-0 w-4 h-4">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">ঢাকার ভিতরে</span>
                        <span class="text-[10px] text-slate-500">১-২ কার্যদিবসে ডেলিভারি</span>
                      </div>
                    </div>
                    <span class="text-sm font-extrabold text-[#FF4D6D]">৳ ৭০</span>
                  </label>

                  <label class="cursor-pointer border-2 border-slate-200 p-3.5 rounded-xl flex items-center justify-between emb-zone-label" id="emb-zone-outside-label">
                    <div class="flex items-center gap-2.5">
                      <input type="radio" name="emb-delivery-zone" value="outside_dhaka" onchange="updateEmbDeliveryFee(130)" class="text-[#FF4D6D] focus:ring-0 w-4 h-4">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">ঢাকার বাইরে</span>
                        <span class="text-[10px] text-slate-500">২-৩ কার্যদিবসে ডেলিভারি</span>
                      </div>
                    </div>
                    <span class="text-sm font-extrabold text-[#FF4D6D]">৳ ১৩০</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Dynamic Bill Calculation Summary -->
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div class="flex justify-between text-slate-600">
                <span>প্রোডাক্টের মূল্য (<span id="emb-summary-qty">1</span>x):</span>
                <span id="emb-summary-subtotal" class="font-bold">৳ ১,১৯০</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span id="emb-summary-delivery" class="font-bold">৳ ৭০</span>
              </div>
              <div class="border-t border-slate-200 pt-2 flex justify-between text-slate-900 font-extrabold text-base">
                <span>সর্বমোট বিল (ক্যাশ অন ডেলিভারি):</span>
                <span id="emb-summary-total" class="text-2xl text-[#FF4D6D]">৳ ১,২৬০</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="emb-submit-btn" class="w-full bg-[#FF4D6D] hover:bg-[#E03153] text-white py-4 sm:py-5 rounded-2xl font-extrabold text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 pulse-glow">
              <span>অর্ডার সম্পন্ন করুন (ক্যাশ অন ডেলিভারি)</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>

            <div class="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
              <span class="flex items-center gap-1"><i class="fa-solid fa-shield-halved text-emerald-500"></i> নিরাপদ চেকআউট</span>
              <span class="flex items-center gap-1"><i class="fa-solid fa-truck text-blue-500"></i> দ্রুত হোম ডেলিভারি</span>
              <span class="flex items-center gap-1"><i class="fa-solid fa-rotate-left text-amber-500"></i> সহজ এক্সচেঞ্জ</span>
            </div>

          </form>

        </div>

      </div>
    </section>
  `;
}
