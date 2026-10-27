/**
 * TrustBadges Component
 * Trust signals, countdown timer, delivery badges & social proof reviews
 */

export function renderTrustBadges() {
  return `
    <!-- Trust Highlights -->
    <div class="py-8 bg-slate-900 text-white border-y border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="p-2">
            <i class="fa-solid fa-box-open text-3xl text-emerald-400 mb-2"></i>
            <h4 class="font-bold text-sm md:text-base">ক্যাশ অন ডেলিভারি</h4>
            <p class="text-xs text-slate-400 mt-1">পার্সেল হাতে পেয়ে মূল্য পরিশোধ করুন</p>
          </div>
          <div class="p-2">
            <i class="fa-solid fa-award text-3xl text-amber-400 mb-2"></i>
            <h4 class="font-bold text-sm md:text-base">১০০% দুবাই চেরি জর্জেট</h4>
            <p class="text-xs text-slate-400 mt-1">কোয়ালিটি ও কাপড়ে কোনো আপস নয়</p>
          </div>
          <div class="p-2">
            <i class="fa-solid fa-truck-fast text-3xl text-[#FF4D6D] mb-2"></i>
            <h4 class="font-bold text-sm md:text-base">দ্রুততম হোম ডেলিভারি</h4>
            <p class="text-xs text-slate-400 mt-1">ঢাকা ও সারাদেশে দ্রুত কুরিয়ার সুবিধা</p>
          </div>
          <div class="p-2">
            <i class="fa-solid fa-arrow-rotate-left text-3xl text-sky-400 mb-2"></i>
            <h4 class="font-bold text-sm md:text-base">সহজ এক্সচেঞ্জ পলিসি</h4>
            <p class="text-xs text-slate-400 mt-1">সাইজে সমস্যা হলে সাথে সাথে পরিবর্তন</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
