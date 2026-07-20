/* ======================================================
   KAHWA CO. — app.js
====================================================== */

/* ---------- Data ---------- */
const MENU = [
  { id:'m1', cat:'hot', name:'Classic Cardamom Kahwa', desc:'Green tea base, whole cardamom, almond slivers.', price:350 },
  { id:'m2', cat:'hot', name:'Saffron Royal Kahwa', desc:'Real saffron threads bloomed in warm water.', price:480 },
  { id:'m3', cat:'hot', name:'Rose & Pistachio Kahwa', desc:'Dried rose petals, crushed pistachio dust.', price:420 },
  { id:'m4', cat:'hot', name:'Spiced Espresso', desc:'Double shot, cinnamon, clove, a little jaggery.', price:400 },
  { id:'m5', cat:'cold', name:'Cardamom Cold Brew', desc:'18-hour steep, cardamom syrup, oat milk optional.', price:500 },
  { id:'m6', cat:'cold', name:'Rose Iced Latte', desc:'Espresso, rose water, cold milk over ice.', price:520 },
  { id:'m7', cat:'cold', name:'Saffron Frappe', desc:'Blended cold kahwa, saffron cream top.', price:560 },
  { id:'m8', cat:'pastry', name:'Cardamom Bun', desc:'Soft-baked, cardamom sugar crust.', price:220 },
  { id:'m9', cat:'pastry', name:'Pistachio Baklava Slice', desc:'Layered filo, honey syrup, crushed pistachio.', price:260 },
  { id:'m10', cat:'pastry', name:'Saffron Shortbread', desc:'Buttery, saffron-infused, sea salt finish.', price:200 },
  { id:'m11', cat:'special', name:'Kahwa Flight (3 cups)', desc:'Cardamom, saffron, and rose — side by side.', price:900 },
  { id:'m12', cat:'special', name:'Winter Clove Kahwa', desc:'Seasonal blend, clove-forward, honey sweetened.', price:400 },
];

/* ---------- State ---------- */
let cart = [];
let beans = 0;
let activeCat = 'hot';

/* ---------- Elements ---------- */
const menuGrid = document.getElementById('menuGrid');
const menuTabs = document.getElementById('menuTabs');
const cartBtn = document.getElementById('cartBtn');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const toastEl = document.getElementById('toast');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

/* ---------- Toast ---------- */
let toastTimer = null;
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

/* ---------- Render Menu ---------- */
function renderMenu(){
  const items = MENU.filter(m => m.cat === activeCat);
  menuGrid.innerHTML = items.map((m, i) => `
    <div class="menu-card" style="animation-delay:${i * 0.06}s">
      <span class="tag">${labelForCat(m.cat)}</span>
      <h4>${m.name}</h4>
      <p>${m.desc}</p>
      <div class="menu-card-footer">
        <strong>Rs. ${m.price}</strong>
        <button class="add-btn" data-id="${m.id}" aria-label="Add ${m.name} to cart">+</button>
      </div>
    </div>
  `).join('');

  menuGrid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = MENU.find(m => m.id === btn.dataset.id);
      addToCart({ name: item.name, meta: labelForCat(item.cat), price: item.price });
    });
  });
}

function labelForCat(cat){
  return { hot:'Hot Kahwa', cold:'Cold Brew', pastry:'Pastry', special:'Spice Special' }[cat] || cat;
}

menuTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  menuTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeCat = tab.dataset.cat;
  renderMenu();
});

renderMenu();

/* ---------- Cart ---------- */
function addToCart(item){
  cart.push(item);
  beans += Math.round(item.price * 0.05);
  updateCartUI();
  updateRewardsUI();
  showToast(`Added ${item.name} — +${Math.round(item.price * 0.05)} beans 🌱`);
}

function removeFromCart(index){
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI(){
  cartCountEl.textContent = cart.length;
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  cartTotalEl.textContent = total;

  if (cart.length === 0){
    cartItemsEl.innerHTML = `<p class="cart-empty">Your cart's as empty as a kettle before kahwa. Add something from the menu.</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.meta}</div>
        <div class="cart-item-remove" data-i="${i}">Remove</div>
      </div>
      <div class="cart-item-price">Rs. ${item.price}</div>
    </div>
  `).join('');

  cartItemsEl.querySelectorAll('.cart-item-remove').forEach(el => {
    el.addEventListener('click', () => removeFromCart(Number(el.dataset.i)));
  });
}

function openCart(){ cartDrawer.classList.add('show'); cartOverlay.classList.add('show'); }
function closeCart(){ cartDrawer.classList.remove('show'); cartOverlay.classList.remove('show'); }

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0){ showToast("Add a cup before checking out!"); return; }
  showToast(`Order placed — Rs. ${cart.reduce((s,i)=>s+i.price,0)}. See you soon!`);
  cart = [];
  updateCartUI();
  closeCart();
});

/* ---------- Mobile nav ---------- */
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---------- Build Your Cup ---------- */
let build = { basePrice: 350, baseName: 'Kahwa', sizePrice: 60, sizeName: 'Regular', spices: [], sweetness: 2 };

const baseOptions = document.getElementById('baseOptions');
const sizeOptions = document.getElementById('sizeOptions');
const spiceWheel = document.getElementById('spiceWheel');
const sweetSlider = document.getElementById('sweetSlider');
const sweetLabel = document.getElementById('sweetLabel');
const buildTotalEl = document.getElementById('buildTotal');
const spiceCenterPrice = document.getElementById('spiceCenterPrice');
const sweetWords = ['None', 'Light', 'Medium', 'Sweet', 'Extra Sweet'];

baseOptions.addEventListener('click', (e) => {
  const opt = e.target.closest('.option');
  if (!opt) return;
  baseOptions.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
  opt.classList.add('active');
  build.basePrice = Number(opt.dataset.price);
  build.baseName = opt.dataset.base;
  updateBuildTotal();
});

sizeOptions.addEventListener('click', (e) => {
  const opt = e.target.closest('.option');
  if (!opt) return;
  sizeOptions.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
  opt.classList.add('active');
  build.sizePrice = Number(opt.dataset.price);
  build.sizeName = opt.dataset.size;
  updateBuildTotal();
});

spiceWheel.addEventListener('click', (e) => {
  const spice = e.target.closest('.spice');
  if (!spice) return;
  spice.classList.toggle('active');
  const name = spice.dataset.spice;
  const price = Number(spice.dataset.price);
  const existing = build.spices.find(s => s.name === name);
  if (existing){
    build.spices = build.spices.filter(s => s.name !== name);
  } else {
    build.spices.push({ name, price });
  }
  updateBuildTotal();
});

sweetSlider.addEventListener('input', () => {
  build.sweetness = Number(sweetSlider.value);
  sweetLabel.textContent = sweetWords[build.sweetness];
});

function updateBuildTotal(){
  const spicesTotal = build.spices.reduce((s, sp) => s + sp.price, 0);
  const total = build.basePrice + build.sizePrice + spicesTotal;
  buildTotalEl.textContent = total;
  spiceCenterPrice.textContent = spicesTotal;
}
updateBuildTotal();

document.getElementById('addBuildToCart').addEventListener('click', () => {
  const spicesTotal = build.spices.reduce((s, sp) => s + sp.price, 0);
  const total = build.basePrice + build.sizePrice + spicesTotal;
  const spiceNames = build.spices.map(s => s.name).join(', ') || 'no spices';
  addToCart({
    name: `${build.sizeName} ${build.baseName}`,
    meta: `${spiceNames} · ${sweetWords[build.sweetness]} sweet`,
    price: total
  });
});

/* ---------- Rewards ---------- */
const rewardsFill = document.getElementById('rewardsFill');
const beanCountEl = document.getElementById('beanCount');
const rewardsHint = document.getElementById('rewardsHint');
const dotRegular = document.getElementById('dotRegular');
const dotSteeped = document.getElementById('dotSteeped');
const dotMaster = document.getElementById('dotMaster');
const TIER_MAX = 200;

function updateRewardsUI(){
  beanCountEl.textContent = beans;
  const pct = Math.min(100, (beans / TIER_MAX) * 100);
  rewardsFill.style.width = pct + '%';

  dotRegular.classList.toggle('active', beans >= TIER_MAX * 0.33);
  dotSteeped.classList.toggle('active', beans >= TIER_MAX * 0.66);
  dotMaster.classList.toggle('active', beans >= TIER_MAX);

  if (beans >= TIER_MAX) rewardsHint.textContent = "you're a certified Kahwa Master. 🎉";
  else if (beans >= TIER_MAX * 0.66) rewardsHint.textContent = "almost at Kahwa Master.";
  else if (beans >= TIER_MAX * 0.33) rewardsHint.textContent = "you're a Regular now.";
  else rewardsHint.textContent = "order something to start earning.";
}
updateRewardsUI();

/* ---------- Roast Meter (scroll progress) ---------- */
const roastFill = document.getElementById('roastFill');
const roastLabel = document.getElementById('roastLabel');
const roastStages = ['Green Bean', 'Light Roast', 'Medium Roast', 'City Roast', 'Full City', 'Dark Roast'];

function updateRoastMeter(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
  roastFill.style.width = pct + '%';
  const stageIndex = Math.min(roastStages.length - 1, Math.floor((pct / 100) * roastStages.length));
  roastLabel.textContent = roastStages[stageIndex];
}
window.addEventListener('scroll', updateRoastMeter, { passive: true });
updateRoastMeter();

/* ---------- Testimonial Carousel ---------- */
const tSlides = document.querySelectorAll('.t-slide');
const tDotsWrap = document.getElementById('tDots');
let tIndex = 0;

tSlides.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  tDotsWrap.appendChild(dot);
});

function goToSlide(i){
  tSlides[tIndex].classList.remove('active');
  tDotsWrap.children[tIndex].classList.remove('active');
  tIndex = i;
  tSlides[tIndex].classList.add('active');
  tDotsWrap.children[tIndex].classList.add('active');
}

setInterval(() => goToSlide((tIndex + 1) % tSlides.length), 5000);

/* ---------- Newsletter ---------- */
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  showToast(`You're on the list, ${email.split('@')[0]}! 🌿`);
  e.target.reset();
});

/* ---------- Scroll Reveal ---------- */
const revealTargets = document.querySelectorAll('.section-head, .build-panel, .rewards-panel, .story-text, .story-visual, .testimonial-carousel, .visit-grid');
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

/* ======================================================
   Vedhi — AI chat assistant
====================================================== */
const vedhiToggle = document.getElementById('vedhiToggle');
const vedhiPanel = document.getElementById('vedhiPanel');
const vedhiClose = document.getElementById('vedhiClose');
const vedhiMessages = document.getElementById('vedhiMessages');
const vedhiInput = document.getElementById('vedhiInput');
const vedhiSend = document.getElementById('vedhiSend');
const vedhiQuick = document.getElementById('vedhiQuick');

const vedhiKnowledge = [
  { keywords: ['hour', 'open', 'close', 'timing'], answer: "We're open Mon–Thu 8AM–10PM, Friday 2PM–11PM, and weekends 9AM–11PM. Come sit for a while, there's no rush here." },
  { keywords: ['best seller', 'popular', 'recommend', 'suggest'], answer: "Most people fall for the Saffron Royal Kahwa first, but regulars usually end up ordering the Cardamom Cold Brew on repeat." },
  { keywords: ['dairy', 'vegan', 'milk free', 'lactose'], answer: "Almost everything works dairy-free — just pick oat or almond milk in Build Your Cup, or ask for any hot kahwa black, which is how it's traditionally made anyway." },
  { keywords: ['reward', 'bean', 'points', 'loyalty'], answer: "Every order earns Beans automatically — about 5% of what you spend. Hit 33% of the bar and you're a Regular, 66% gets you Steeped In, and a full bar makes you a Kahwa Master." },
  { keywords: ['build', 'customiz', 'custom', 'spice wheel'], answer: "Head to Build Your Cup — pick a base, a size, spin the spice wheel for as many spices as you like, then set your sweetness. The price updates live as you go." },
  { keywords: ['price', 'cost', 'how much'], answer: "Hot kahwa starts around Rs. 350, cold brews from Rs. 500, and pastries are Rs. 200–260. Building your own cup shows the exact total before you add it to cart." },
  { keywords: ['location', 'address', 'where', 'visit'], answer: "We're in Latifabad Unit No. 7, Hyderabad, Sindh. Scroll down to the Visit section for hours and a newsletter sign-up too." },
  { keywords: ['cardamom'], answer: "Cardamom is our house signature — whole pods, hand-cracked, steeped slow. It's in the Classic Kahwa and available on the spice wheel for any custom cup." },
  { keywords: ['saffron'], answer: "Real saffron threads, bloomed in warm water before brewing — you'll taste it, not just see the color. It's the priciest spice on the wheel for good reason." },
  { keywords: ['cold brew', 'iced', 'cold'], answer: "Our cold brew steeps for 18 hours before it ever meets ice. Try it with cardamom syrup, or build your own cold base from scratch." },
  { keywords: ['pastry', 'food', 'snack', 'bakery'], answer: "We bake a Cardamom Bun, a Pistachio Baklava Slice, and Saffron Shortbread daily — check the Pastries tab in the menu." },
  { keywords: ['cart', 'checkout', 'order'], answer: "Tap the bag icon in the top nav any time to see your cart, and Checkout when you're ready. It's all kept right here on the page." },
  { keywords: ['hi', 'hello', 'hey', 'salam'], answer: "Hi, I'm Vedhi 🪆 — ask me about the menu, Build Your Cup, hours, or Bean Rewards, and I'll point you in the right direction." },
];

const vedhiFallback = "I'm not sure about that one 🪆 — try asking about the menu, Build Your Cup, hours, Bean Rewards, or where to find us.";

function addVedhiMessage(text, sender){
  const bubble = document.createElement('div');
  bubble.className = 'vmsg ' + sender;
  bubble.textContent = text;
  vedhiMessages.appendChild(bubble);
  vedhiMessages.scrollTop = vedhiMessages.scrollHeight;
}

function answerVedhi(question){
  const lower = question.toLowerCase();
  for (const entry of vedhiKnowledge){
    if (entry.keywords.some(k => lower.includes(k))) return entry.answer;
  }
  return vedhiFallback;
}

function sendVedhiMessage(text){
  const message = (text !== undefined) ? text : vedhiInput.value.trim();
  if (message === '') return;
  addVedhiMessage(message, 'user');
  vedhiInput.value = '';
  const reply = answerVedhi(message);
  setTimeout(() => addVedhiMessage(reply, 'bot'), 350);
}

vedhiToggle.addEventListener('click', () => {
  vedhiPanel.classList.toggle('show');
  if (vedhiPanel.classList.contains('show') && vedhiMessages.children.length === 0){
    addVedhiMessage("Hi, I'm Vedhi 🪆 — your kahwa guide. Ask me about the menu, Build Your Cup, hours, or Bean Rewards!", 'bot');
  }
});
vedhiClose.addEventListener('click', () => vedhiPanel.classList.remove('show'));
vedhiSend.addEventListener('click', () => sendVedhiMessage());
vedhiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendVedhiMessage(); });
vedhiQuick.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  sendVedhiMessage(btn.dataset.q);
});