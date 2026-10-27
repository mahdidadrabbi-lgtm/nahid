/**
 * ProductZoomGallery Component
 * Interactive product gallery with thumbnail switcher and click-to-zoom / lightbox inspection
 */

export function renderProductZoomGallery(product) {
  return `
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4" id="gallery-container">
      <div class="relative overflow-hidden rounded-2xl bg-slate-50 cursor-zoom-in group" onclick="openImageZoomModal('${product.image}', '${product.title}')">
        <!-- Main Image -->
        <img id="main-gallery-img" src="${product.image}" alt="${product.title}" class="w-full h-96 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105">
        
        <!-- Zoom Badge Overlay -->
        <div class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
          <i class="fa-solid fa-magnifying-glass-plus text-amber-400"></i>
          <span>জুম করে ফেব্রিক দেখুন</span>
        </div>

        <div class="absolute top-3 left-3 bg-[#FF4D6D] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase shadow-sm">
          ${product.discount || 'Special Offer'}
        </div>
      </div>

      <!-- Color / Image Thumbnails -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1" id="gallery-thumbs">
        ${product.colors.map((c, i) => `
          <button type="button" onclick="switchGalleryImage('${c.img}', '${c.name}', this)" class="gallery-thumb-btn w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === 0 ? 'border-[#FF4D6D] ring-2 ring-rose-200' : 'border-slate-200 opacity-80 hover:opacity-100'}">
            <img src="${c.img}" alt="${c.name}" class="w-full h-full object-cover">
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
