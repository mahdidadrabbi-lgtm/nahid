// RUAA Store - Senior Full-Stack & UI/UX Engine
// Features: 1-Page Embedded Checkout, Image Zoom Lightbox, Dynamic Bill Calc, Sticky Mobile CTA

const PRODUCTS = [
  {
    id: "ma",
    category: "ma",
    title: "মা স্পেশাল কালেকশন (দুবাই চেরি জর্জেট)",
    price: 1190,
    oldPrice: 1690,
    discount: "30% OFF",
    badge: "বেস্ট সেলার",
    image: "/images/ma/ma_navy.jpg",
    colors: [
      { name: "Navy Blue", code: "#000080", img: "/images/ma/ma_navy.jpg" },
      { name: "Black", code: "#000000", img: "/images/ma/ma_black.jpg" },
      { name: "Maroon", code: "#800000", img: "/images/ma/ma_maroon.jpg" },
      { name: "Olive Green", code: "#006a4e", img: "/images/ma/ma_olive.jpg" },
      { name: "Coffee", code: "#4b3621", img: "/images/ma/ma_coffee.jpg" }
    ],
    sizes: ["50", "52", "54", "56"]
  },
  {
    id: "classic",
    category: "classic",
    title: "মা-মেয়ে ক্লাসিক কম্বো সেট (দুবাই চেরি জর্জেট)",
    price: 1680,
    oldPrice: 2200,
    discount: "24% OFF",
    badge: "কম্বো অফার",
    image: "/images/classic/classic_black.jpg",
    colors: [
      { name: "Black", code: "#000000", img: "/images/classic/classic_black.jpg" },
      { name: "Maroon", code: "#800000", img: "/images/classic/classic_maroon.jpg" },
      { name: "Blue", code: "#1e3a8a", img: "/images/classic/classic_blue.jpg" },
      { name: "Olive", code: "#3f4f34", img: "/images/classic/classic_olive.jpg" },
      { name: "Coffee", code: "#4b3621", img: "/images/classic/classic_coffee.jpg" }
    ],
    sizes: ["50", "52", "54", "56"]
  },
  {
    id: "borobon",
    category: "borobon",
    title: "বড় বোন কালেকশন (প্রিমিয়াম আবায়া)",
    price: 990,
    oldPrice: 1290,
    discount: "23% OFF",
    badge: "জনপ্রিয়",
    image: "/images/boro-bon/boro_bon_black_new.jpg",
    colors: [
      { name: "Black", code: "#000000", img: "/images/boro-bon/boro_bon_black_new.jpg" },
      { name: "Maroon", code: "#800000", img: "/images/boro-bon/boro_bon_maroon_new.jpg" },
      { name: "Navy Blue", code: "#000080", img: "/images/boro-bon/boro_bon_blue_new.jpg" },
      { name: "Olive", code: "#3f4f34", img: "/images/boro-bon/boro_bon_olive_new.jpg" },
      { name: "Coffee", code: "#4b3621", img: "/images/boro-bon/boro_bon_coffee_new.jpg" }
    ],
    sizes: ["50", "52", "54", "56"]
  },
  {
    id: "maboromeye",
    category: "maboromeye",
    title: "মা ও বড় মেয়ে টুইনিং কালেকশন",
    price: 890,
    oldPrice: 1190,
    discount: "25% OFF",
    badge: "লিমিটেড স্টক",
    image: "/images/ma-boro-meye/ma_boro_meye_blue_latest.jpg",
    colors: [
      { name: "Blue", code: "#1e3a8a", img: "/images/ma-boro-meye/ma_boro_meye_blue_latest.jpg" },
      { name: "Black", code: "#000000", img: "/images/ma-boro-meye/ma_boro_meye_black_latest.jpg" },
      { name: "Maroon", code: "#800000", img: "/images/ma-boro-meye/ma_boro_meye_maroon_latest.jpg" },
      { name: "Olive", code: "#3f4f34", img: "/images/ma-boro-meye/ma_boro_meye_olive_latest.jpg" },
      { name: "Coffee", code: "#4b3621", img: "/images/ma-boro-meye/ma_boro_meye_coffee_latest.jpg" }
    ],
    sizes: ["50", "52", "54", "56"]
  },
  {
    id: "kids",
    category: "kids",
    title: "কিডস ফ্যাশন কালেকশন (বাচ্চাদের বোরকা)",
    price: 690,
    oldPrice: 890,
    discount: "22% OFF",
    badge: "কিডস স্পেশাল",
    image: "/images/kids/kids_black.jpg",
    colors: [
      { name: "Black", code: "#000000", img: "/images/kids/kids_black.jpg" },
      { name: "Maroon", code: "#800000", img: "/images/kids/kids_maroon.jpg" },
      { name: "Blue", code: "#1e3a8a", img: "/images/kids/kids_blue.jpg" },
      { name: "Olive", code: "#3f4f34", img: "/images/kids/kids_olive.jpg" }
    ],
    sizes: ["30", "34", "38", "42"]
  },
  {
    id: "chotobon",
    category: "chotobon",
    title: "ছোট বোন কালেকশন (স্মার্ট ডিজাইন)",
    price: 590,
    oldPrice: 850,
    discount: "30% OFF",
    badge: "হট ডিল",
    image: "/images/choto-bon/chotobon_black.jpg",
    colors: [
      { name: "Black", code: "#000000", img: "/images/choto-bon/chotobon_black.jpg" },
      { name: "Maroon", code: "#800000", img: "/images/choto-bon/chotobon_maroon.jpg" },
      { name: "Blue", code: "#1e3a8a", img: "/images/choto-bon/chotobon_blue.jpg" },
      { name: "Olive", code: "#3f4f34", img: "/images/choto-bon/chotobon_olive.jpg" },
      { name: "Coffee", code: "#4b3621", img: "/images/choto-bon/chotobon_coffee.jpg" }
    ],
    sizes: ["42", "46", "48", "50"]
  },
  {
    id: "hijab",
    category: "hijab",
    title: "দুবাই প্রিমিয়াম চেরি হিজাব (বড় সাইজ)",
    price: 450,
    oldPrice: 650,
    discount: "30% OFF",
    badge: "প্রিমিয়াম হিজাব",
    image: "/images/ma/ma_olive.jpg",
    colors: [
      { name: "Olive", code: "#3f4f34", img: "/images/ma/ma_olive.jpg" },
      { name: "Black", code: "#000000", img: "/images/ma/ma_black.jpg" },
      { name: "Maroon", code: "#800000", img: "/images/ma/ma_maroon.jpg" },
      { name: "Navy Blue", code: "#000080", img: "/images/ma/ma_navy.jpg" }
    ],
    sizes: ["৪০ ইঞ্চি", "৭২ ইঞ্চি", "৮০ ইঞ্চি"]
  }
];

const cardSelectedColors = new Map(PRODUCTS.map(product => [product.id, product.colors[0].name]));

// Current State
let embCurrentProduct = PRODUCTS[0];
let embSelectedColor = PRODUCTS[0].colors[0];
let embSelectedSize = "54";
let embQuantity = 1;
let embDeliveryFee = 70;
let embDeliveryFeeInside = 70;
let embDeliveryFeeOutside = 130;
let embDeliveryZone = "inside_dhaka";
let whatsappNumber = "8801988863486";
let freeDeliveryMinQty = 2;
let turnstileConfigLoaded = false;
let turnstileRequired = false;
let turnstileWidgetId = null;
let turnstileSetupPromise;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProducts("all");
  initEmbeddedCheckout();
  fetchSettings();
  turnstileSetupPromise = initTurnstile();
});

async function initTurnstile() {
  const container = document.getElementById('turnstile-container');
  const message = document.getElementById('turnstile-message');

  try {
    const response = await fetch('/api/captcha-config');
    if (!response.ok) throw new Error('Security settings could not be loaded');
    const config = await response.json();
    turnstileRequired = config.required === true;
    turnstileConfigLoaded = true;
    if (!turnstileRequired) return;

    container.classList.remove('hidden');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    if (!config.siteKey) throw new Error('অর্ডার ফর্মের নিরাপত্তা যাচাই এখনো কনফিগার করা হয়নি।');

    await loadTurnstileScript();
    turnstileWidgetId = window.turnstile.render('#turnstile-widget', {
      sitekey: config.siteKey,
      action: 'order',
      callback: () => message.classList.add('hidden'),
      'expired-callback': () => window.turnstile.reset(turnstileWidgetId),
      'error-callback': () => {
        message.textContent = 'নিরাপত্তা যাচাই লোড হয়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।';
        message.classList.remove('hidden');
      }
    });
  } catch (error) {
    turnstileConfigLoaded = false;
    if (container) {
      container.classList.remove('hidden');
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
    }
    if (message) {
      message.textContent = error.message || 'নিরাপত্তা যাচাই লোড হয়নি।';
      message.classList.remove('hidden');
    }
    console.error('Turnstile setup error:', error);
  }
}

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  const existingScript = document.querySelector('script[data-turnstile]');
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Security check could not be loaded')), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = 'true';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Security check could not be loaded'));
    document.head.appendChild(script);
  });
}

// Render Product Grid with zoom support
function renderProducts(cat = "all") {
  const container = document.getElementById("products-grid");
  if (!container) return;

  const filtered = cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  
  container.innerHTML = filtered.map(prod => `
    <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group">
      
      <!-- Image with zoom overlay -->
      <div class="relative overflow-hidden bg-slate-100 cursor-zoom-in" onclick="openImageZoomModal('${prod.image}', '${prod.title}')">
        <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <span class="bg-[#FF4D6D] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase">
            ${prod.discount}
          </span>
        </div>

        <!-- Zoom button pill -->
        <div class="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <i class="fa-solid fa-magnifying-glass-plus text-amber-400 mr-1"></i> জুম
        </div>

        <img id="prod-img-${prod.id}" 
             src="${prod.image}" 
             alt="${prod.title}" 
             class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500">
      </div>

      <!-- Info Area -->
      <div class="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="text-xs text-slate-400">
            <span>দুবাই চেরি ফেব্রিক</span>
          </div>

          <h3 class="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-[#FF4D6D] transition-colors cursor-pointer"
              onclick="selectProductForCheckout('${prod.id}')">
            ${prod.title}
          </h3>

          <!-- Color options preview -->
          <div class="flex items-center gap-2 pt-1">
            <span class="text-xs text-slate-400">কালার:</span>
            <div class="flex items-center gap-1.5" data-product-color-options="${prod.id}">
              ${prod.colors.map(c => `
                <button type="button" 
                        title="${c.name}" 
                        aria-label="${prod.title}: ${c.name}"
                        aria-pressed="${c.name === (cardSelectedColors.get(prod.id) || prod.colors[0].name)}"
                        data-color-name="${c.name}"
                  onclick="switchCardColor('${prod.id}', '${c.name}', '${c.img}')"
                  class="w-9 h-11 overflow-hidden rounded-lg border-2 shadow-xs hover:scale-105 transition-transform focus:outline-none ${c.name === (cardSelectedColors.get(prod.id) || prod.colors[0].name) ? 'border-[#FF4D6D] ring-1 ring-[#FF4D6D]' : 'border-white'}">
                  <img src="${c.img}" alt="" loading="lazy" class="w-full h-full object-cover">
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-slate-400 line-through">৳ ${prod.oldPrice.toLocaleString()}</span>
            <div class="text-2xl font-black text-[#FF4D6D]">৳ ${prod.price.toLocaleString()}</div>
          </div>

          <button onclick="selectProductForCheckout('${prod.id}')" 
                  class="bg-[#FF4D6D] hover:bg-[#E03153] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 pulse-glow">
            <span>অর্ডার করুন</span>
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Category filter
function filterCategory(cat) {
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.remove('bg-slate-900', 'text-white');
    btn.classList.add('bg-white', 'text-slate-600');
  });
  if (window.event && window.event.target) {
    window.event.target.classList.remove('bg-white', 'text-slate-600');
    window.event.target.classList.add('bg-slate-900', 'text-white');
  }
  renderProducts(cat);
}

// Switch card preview image
function switchCardColor(prodId, colorName, imgSrc) {
  const imgEl = document.getElementById(`prod-img-${prodId}`);
  if (imgEl) imgEl.src = imgSrc;
  updateCardColorSelection(prodId, colorName);
}

function updateCardColorSelection(prodId, colorName) {
  cardSelectedColors.set(prodId, colorName);
  const options = document.querySelector(`[data-product-color-options="${prodId}"]`);
  if (!options) return;

  options.querySelectorAll('button[data-color-name]').forEach(button => {
    const selected = button.dataset.colorName === colorName;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('ring-2', selected);
    button.classList.toggle('ring-[#FF4D6D]', selected);
    button.classList.toggle('ring-offset-1', selected);
  });
}

// INTERACTIVE IMAGE ZOOM / LIGHTBOX
function openImageZoomModal(imgSrc, title = 'ফেব্রিক জুম প্রিভিউ') {
  const modal = document.getElementById('image-zoom-modal');
  const img = document.getElementById('zoom-modal-img');
  const titleEl = document.getElementById('zoom-modal-title');
  if (img) img.src = imgSrc;
  if (titleEl) titleEl.innerText = title;
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeImageZoomModal() {
  const modal = document.getElementById('image-zoom-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// SMOOTH SCROLL TO EMBEDDED CHECKOUT FORM
function scrollToCheckoutForm() {
  const sec = document.getElementById('checkout-section');
  if (sec) {
    sec.scrollIntoView({ behavior: 'smooth' });
    const nameInput = document.getElementById('emb-cust-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 600);
  }
}

// Select product from grid directly into embedded checkout form
function selectProductForCheckout(prodId) {
  const sel = document.getElementById('emb-product-select');
  if (sel) {
    sel.value = prodId;
    onEmbeddedProductChange(prodId);
    const selectedColor = cardSelectedColors.get(prodId);
    if (selectedColor) selectEmbColor(selectedColor);
  }
  
  // Meta Pixel AddToCart event
  if (typeof fbq === 'function') {
    fbq('track', 'AddToCart', {
      content_name: embCurrentProduct.title,
      content_ids: [embCurrentProduct.id],
      content_type: 'product',
      value: embCurrentProduct.price,
      currency: 'BDT'
    });
  }

  scrollToCheckoutForm();
}

// Initialize Embedded Checkout Form
function initEmbeddedCheckout() {
  const sel = document.getElementById('emb-product-select');
  if (!sel) return;

  sel.innerHTML = PRODUCTS.map(p => `
    <option value="${p.id}">${p.title} - ৳${p.price.toLocaleString()}</option>
  `).join('');

  updateEmbeddedProductUI();
}

function onEmbeddedProductChange(prodId) {
  embCurrentProduct = PRODUCTS.find(p => p.id === prodId) || PRODUCTS[0];
  embSelectedColor = embCurrentProduct.colors[0];
  embSelectedSize = embCurrentProduct.sizes[1] || embCurrentProduct.sizes[0];
  updateEmbeddedProductUI();
}

function updateEmbeddedProductUI() {
  const p = embCurrentProduct;
  document.getElementById('emb-prod-img').src = embSelectedColor.img;
  document.getElementById('emb-prod-title').innerText = p.title;
  document.getElementById('emb-prod-price').innerText = `৳ ${p.price.toLocaleString()}`;

  // Colors
  const colorWrap = document.getElementById('emb-color-options');
  if (colorWrap) {
    colorWrap.innerHTML = p.colors.map((c, i) => `
      <button type="button" onclick="selectEmbColor('${c.name}')" 
              class="emb-color-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${c.name === embSelectedColor.name ? 'border-[#FF4D6D] bg-rose-50 text-[#FF4D6D]' : 'border-slate-200 text-slate-700'}">
        <span class="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" style="background-color: ${c.code}"></span>
        <span>${c.name}</span>
      </button>
    `).join('');
  }

  // Sizes
  const sizeWrap = document.getElementById('emb-size-options');
  if (sizeWrap) {
    sizeWrap.innerHTML = p.sizes.map(s => `
      <button type="button" onclick="selectEmbSize('${s}')" 
              class="emb-size-btn py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${s === embSelectedSize ? 'border-[#FF4D6D] bg-[#FF4D6D] text-white' : 'border-slate-200 text-slate-700 hover:border-[#FF4D6D]'}">
        ${s}
      </button>
    `).join('');
  }

  recalculateEmbBill();
}

function selectEmbColor(colorName) {
  const c = embCurrentProduct.colors.find(i => i.name === colorName);
  if (!c) return;
  embSelectedColor = c;
  document.getElementById('emb-prod-img').src = c.img;

  document.querySelectorAll('.emb-color-pill').forEach(el => {
    el.classList.remove('border-[#FF4D6D]', 'bg-rose-50', 'text-[#FF4D6D]');
    el.classList.add('border-slate-200', 'text-slate-700');
  });
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.remove('border-slate-200', 'text-slate-700');
    window.event.currentTarget.classList.add('border-[#FF4D6D]', 'bg-rose-50', 'text-[#FF4D6D]');
  }
}

function selectEmbSize(s) {
  embSelectedSize = s;
  document.querySelectorAll('.emb-size-btn').forEach(el => {
    el.classList.remove('border-[#FF4D6D]', 'bg-[#FF4D6D]', 'text-white');
    el.classList.add('border-slate-200', 'text-slate-700');
  });
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.remove('border-slate-200', 'text-slate-700');
    window.event.currentTarget.classList.add('border-[#FF4D6D]', 'bg-[#FF4D6D]', 'text-white');
  }
}

function changeQuantity(delta) {
  embQuantity = Math.max(1, Math.min(10, embQuantity + delta));
  const el = document.getElementById('emb-quantity');
  if (el) el.innerText = embQuantity;
  recalculateEmbBill();
}

function updateEmbDeliveryFee(zone) {
  embDeliveryZone = zone;
  embDeliveryFee = zone === 'inside_dhaka' ? embDeliveryFeeInside : embDeliveryFeeOutside;

  const inside = document.getElementById('emb-zone-inside-label');
  const outside = document.getElementById('emb-zone-outside-label');
  if (inside && outside) {
    if (zone === 'inside_dhaka') {
      inside.classList.add('border-[#FF4D6D]', 'bg-rose-50/60');
      inside.classList.remove('border-slate-200');
      outside.classList.remove('border-[#FF4D6D]', 'bg-rose-50/60');
      outside.classList.add('border-slate-200');
    } else {
      outside.classList.add('border-[#FF4D6D]', 'bg-rose-50/60');
      outside.classList.remove('border-slate-200');
      inside.classList.remove('border-[#FF4D6D]', 'bg-rose-50/60');
      inside.classList.add('border-slate-200');
    }
  }

  recalculateEmbBill();
}

function recalculateEmbBill() {
  const subtotal = embCurrentProduct.price * embQuantity;
  
  // AOV Booster: Buy 2+ items = FREE DELIVERY!
  let effectiveDelivery = embDeliveryFee;
  if (embQuantity >= freeDeliveryMinQty) {
    effectiveDelivery = 0;
  }

  const total = subtotal + effectiveDelivery;

  document.getElementById('emb-summary-qty').innerText = embQuantity;
  document.getElementById('emb-summary-subtotal').innerText = `৳ ${subtotal.toLocaleString()}`;
  
  const delEl = document.getElementById('emb-summary-delivery');
  if (effectiveDelivery === 0) {
    delEl.innerHTML = `<span class="text-emerald-600 font-extrabold">ফ্রি (০ ৳)! 🎉</span>`;
  } else {
    delEl.innerText = `৳ ${effectiveDelivery.toLocaleString()}`;
  }

  document.getElementById('emb-summary-total').innerText = `৳ ${total.toLocaleString()}`;
}

// SIZE CHART MODAL
function openSizeChartModal() {
  const m = document.getElementById('size-chart-modal');
  if (m) {
    m.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeSizeChartModal() {
  const m = document.getElementById('size-chart-modal');
  if (m) {
    m.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// LIVE SOCIAL PROOF SALES TOAST (Conversion Booster)
// Handle Embedded Order Submit
async function handleEmbeddedOrderSubmit(e) {
  e.preventDefault();
  await turnstileSetupPromise;

  if (!turnstileConfigLoaded) {
    alert('নিরাপত্তা যাচাই লোড হয়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
    return;
  }

  const name = document.getElementById('emb-cust-name').value.trim();
  const phone = document.getElementById('emb-cust-phone').value.trim();
  const address = document.getElementById('emb-cust-address').value.trim();
  const note = document.getElementById('emb-cust-note') ? document.getElementById('emb-cust-note').value.trim() : '';

  // Validate BD Phone (11 digits, starts with 013-019)
  const phoneRegex = /^(01)[3-9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    alert('দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)');
    document.getElementById('emb-cust-phone').focus();
    return;
  }

  const captchaToken = turnstileRequired && turnstileWidgetId !== null
    ? window.turnstile.getResponse(turnstileWidgetId)
    : '';
  if (turnstileRequired && !captchaToken) {
    alert('অর্ডার দেওয়ার আগে নিরাপত্তা যাচাই সম্পন্ন করুন।');
    return;
  }

  const subtotal = embCurrentProduct.price * embQuantity;
  const effectiveDelivery = embQuantity >= freeDeliveryMinQty ? 0 : embDeliveryFee;
  const total = subtotal + effectiveDelivery;

  const btn = document.getElementById('emb-submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> অর্ডার প্রসেস হচ্ছে...`;

  const orderPayload = {
    name,
    phone,
    address,
    city: embDeliveryZone,
    productTitle: embCurrentProduct.title,
    productId: embCurrentProduct.id,
    color: embSelectedColor.name,
    size: embSelectedSize,
    quantity: embQuantity,
    productPrice: embCurrentProduct.price,
    deliveryFee: effectiveDelivery,
    total: total,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    note,
    turnstileToken: captchaToken
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      return;
    }

    if (data.success && data.order) {
      const order = data.order;

      // Populate success modal
      document.getElementById('success-order-id').innerText = `#${order.id}`;
      document.getElementById('success-cust-name').innerText = order.name;
      document.getElementById('success-cust-phone').innerText = order.phone;
      document.getElementById('success-cust-address').innerText = order.address;
      document.getElementById('success-total').innerText = `৳ ${order.total.toLocaleString()}`;

      // WhatsApp link
      const waText = encodeURIComponent(
        `আসসালামু আলাইকুম RUAA Store, আমি একটি নতুন অর্ডার সম্পন্ন করেছি!\n\n` +
        `📦 অর্ডার আইডি: #${order.id}\n` +
        `👗 প্রোডাক্ট: ${order.productTitle} (${order.color}, সাইজ: ${order.size}, পরিমাণ: ${order.quantity})\n` +
        `👤 নাম: ${order.name}\n` +
        `📞 ফোন: ${order.phone}\n` +
        `📍 ঠিকানা: ${order.address}\n` +
        `💰 মোট বিল: ৳${order.total} (ক্যাশ অন ডেলিভারি)`
      );
      document.getElementById('success-whatsapp-link').href = `https://wa.me/${whatsappNumber}?text=${waText}`;

      document.getElementById('success-modal').classList.remove('hidden');

      // Meta Pixel Purchase Event
      if (typeof fbq === 'function') {
        fbq('track', 'Purchase', {
          content_name: order.productTitle,
          content_ids: [order.productId],
          content_type: 'product',
          value: order.total,
          currency: 'BDT'
        });
      }

      // Reset form
      document.getElementById('embedded-order-form').reset();
      embQuantity = 1;
      document.getElementById('emb-quantity').innerText = '1';
      recalculateEmbBill();
    } else {
      alert(data.error || 'অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  } catch (err) {
    console.error('Order error:', err);
    alert('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
  } finally {
    if (turnstileRequired && turnstileWidgetId !== null) {
      window.turnstile.reset(turnstileWidgetId);
    }
    btn.disabled = false;
    btn.innerHTML = `<span>ক্যাশ অন ডেলিভারিতে অর্ডার সম্পন্ন করুন</span> <i class="fa-solid fa-arrow-right"></i>`;
  }
}

function closeSuccessModal() {
  document.getElementById('success-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

// Settings fetch
async function fetchSettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const s = await res.json();
    if (s.bannerOfferText) {
      const banner = document.getElementById('announcement-text');
      if (banner) banner.innerText = s.bannerOfferText;
    }
    if (s.whatsapp) {
      whatsappNumber = s.whatsapp;
    }
    if (Number.isFinite(Number(s.deliveryFeeInside)) && Number(s.deliveryFeeInside) >= 0) {
      embDeliveryFeeInside = Number(s.deliveryFeeInside);
      const feeLabel = document.getElementById('emb-fee-inside');
      if (feeLabel) feeLabel.innerText = `৳ ${embDeliveryFeeInside.toLocaleString('bn-BD')}`;
    }
    if (Number.isFinite(Number(s.deliveryFeeOutside)) && Number(s.deliveryFeeOutside) >= 0) {
      embDeliveryFeeOutside = Number(s.deliveryFeeOutside);
      const feeLabel = document.getElementById('emb-fee-outside');
      if (feeLabel) feeLabel.innerText = `৳ ${embDeliveryFeeOutside.toLocaleString('bn-BD')}`;
    }
    if (Number.isFinite(Number(s.freeDeliveryMinQty)) && Number(s.freeDeliveryMinQty) >= 1) {
      freeDeliveryMinQty = Number(s.freeDeliveryMinQty);
      const offerLabel = document.getElementById('emb-free-delivery-copy');
      if (offerLabel) {
        offerLabel.innerText = `${freeDeliveryMinQty.toLocaleString('bn-BD')}টি নিলে ডেলিভারি ফ্রি!`;
      }
    }
    updateEmbDeliveryFee(embDeliveryZone);
  } catch (e) {
    // ignore
  }
}
