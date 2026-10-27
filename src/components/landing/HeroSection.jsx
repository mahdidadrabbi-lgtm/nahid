/**
 * HeroSection Component
 * Full-width campaign cover with Bengali headline and order actions
 */

export function renderHeroSection({ onOrderClick, onWhatsAppClick }) {
  return `
    <section class="relative isolate w-full overflow-hidden bg-slate-950">
      <div class="relative aspect-square md:aspect-[4/3] xl:aspect-[16/10] max-h-[760px] w-full overflow-hidden">
        <img src="/images/hero/hero_campaign.png" alt="RUAA মা-মেয়ে বোরকা কালেকশন" class="absolute inset-0 h-full w-full object-cover object-center">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-7 sm:px-8 sm:pb-10 md:pb-14">
          <div class="max-w-3xl">
            <h1 class="text-xl font-extrabold leading-snug text-white drop-shadow-lg sm:text-2xl md:text-3xl">
              মার্জিত সৌন্দর্য ও আভিজাত্যের প্রিমিয়াম বোরকা কালেকশন
            </h1>
            <div class="mt-4 flex flex-wrap gap-3">
              <a href="#checkout-section" class="rounded-xl bg-[#FF4D6D] px-5 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#E03153]">
                অর্ডার করুন
              </a>
              <a href="https://wa.me/8801988863486" target="_blank" rel="noopener noreferrer" class="rounded-xl border border-white/80 bg-slate-950/30 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15">
                WhatsApp এ কথা বলুন
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
