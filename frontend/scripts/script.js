/* script.js
   Responsible for loading menu.json, rendering categories and items,
   handling add/remove and cart state, and reviews display/submit.
*/

const MENU_JSON = '/frontend/assets/menu.json';
// const REVIEWS_KEY = 'hnr_reviews_local'; // localStorage key for submitted reviews
const CART_KEY = 'hnr_cart_session'; // session-storage key to pass order to payment

let menuData = [];
let cart = {}; // itemId -> { item, qty }

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

async function loadMenu(){
  try {
    const res = await fetch(MENU_JSON);
    menuData = await res.json();
    renderCategories();
    renderMenu(menuData[0].category);
  } catch (e) {
    console.error('Failed to load menu', e);
    document.getElementById('menu').innerText = 'Menu could not be loaded.';
  }
}

function renderCategories(){
  const container = $('#category-tabs');
  container.innerHTML = '';
  menuData.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.category;
    btn.onclick = () => {
      $all('#category-tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(cat.category);
    };
    container.appendChild(btn);
  });
  // activate first
  if (container.firstChild) container.firstChild.classList.add('active');
}

function renderMenu(categoryName){
  const container = $('#menu');
  container.innerHTML = '';
  const category = menuData.find(c=>c.category===categoryName);
  if (!category) return;
  category.items.forEach((it, idx) => {
    const card = document.createElement('div'); card.className='card';
    const img = document.createElement('img'); img.src = it.imagePath || '../assets/images/placeholder.jpg';
    const names = document.createElement('div'); names.className='names';
    const jp = document.createElement('div'); jp.className='jp-name'; jp.textContent = it.japaneseName;
    const en = document.createElement('div'); en.className='en-name'; en.textContent = it.englishName;
    names.appendChild(jp); names.appendChild(en);
    const desc = document.createElement('div'); desc.className='desc'; desc.textContent = it.description;
    const controls = document.createElement('div'); controls.className='controls';
    const qtyBox = document.createElement('div'); qtyBox.className='qty';
    const minus = document.createElement('button'); minus.textContent='-';
    const plus = document.createElement('button'); plus.textContent='+';
    const qtyLabel = document.createElement('span'); qtyLabel.textContent = getQty(it).toString();
    minus.onclick = ()=>changeQty(it, -1, qtyLabel);
    plus.onclick = ()=>changeQty(it, +1, qtyLabel);
    qtyBox.appendChild(minus); qtyBox.appendChild(qtyLabel); qtyBox.appendChild(plus);
    const price = document.createElement('div'); price.className='price'; price.textContent = `₹${it.price.toFixed(0)}`;
    controls.appendChild(qtyBox); controls.appendChild(price);
    card.appendChild(img); card.appendChild(names); card.appendChild(desc); card.appendChild(controls);
    container.appendChild(card);
  });
}

function getId(item){
  // derive an id for mapping; english name is fine for now
  return (item.englishName || item.japaneseName).replace(/\s+/g,'_').toLowerCase();
}

function getQty(item){
  const id = getId(item);
  return cart[id] ? cart[id].qty : 0;
}

function changeQty(item, delta, qtyLabel){
  const id = getId(item);
  const current = cart[id] ? cart[id].qty : 0;
  const next = Math.max(0, current + delta);
  if (next === 0) delete cart[id]; else cart[id] = { item, qty: next };
  qtyLabel.textContent = next;
  updateCartUI();
}

function updateCartUI(){
  const container = $('#cart-items'); container.innerHTML = '';
  let total = 0;
  for (const id in cart){
    const entry = cart[id];
    const row = document.createElement('div');
    row.textContent = `${entry.item.englishName} x${entry.qty} — ₹${(entry.item.price * entry.qty).toFixed(0)}`;
    container.appendChild(row);
    total += entry.item.price * entry.qty;
  }
  $('#cart-total').textContent = total.toFixed(0);
  // save to sessionStorage for payment page
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadMenu();
  attachReviewForm();
  loadSavedReviews();
  $('#view-payment').onclick = ()=> {
    // require at least one item
    const items = Object.values(cart);
    if (items.length === 0) { alert('Please add at least one item to your order.'); return; }
    // store in session and navigate
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.location.href = 'payment.html';
  };
});
