/**
 * StickyMobileCTA Component
 * Persistent bottom bar on mobile screens with WhatsApp shortcut and smooth scroll to checkout
 */

export function renderStickyMobileCTA() {
  return `
    <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-30 md:hidden flex items-center gap-2 shadow-2xl">
      <a href="https://wa.me/8801988863486" target="_blank" rel="noopener noreferrer" class="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 text-2xl shadow-sm transition-all" title="WhatsApp Chat">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <button onclick="scrollToCheckoutForm()" class="flex-1 bg-[#FF4D6D] hover:bg-[#E03153] text-white py-3.5 px-4 rounded-xl font-extrabold text-base shadow-md flex items-center justify-center gap-2 pulse-glow active:scale-95 transition-all">
        <span>এখনই অর্ডার করুন</span>
        <i class="fa-solid fa-arrow-down"></i>
      </button>
    </div>
  `;
}
