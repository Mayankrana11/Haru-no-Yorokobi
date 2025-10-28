/* payment.js
   Reads order from session storage, presents payment methods,
   and simulates payment. On success, navigates to confirmation page.
*/

const CART_KEY = 'hnr_cart_session';

function getCart(){
  const raw = sessionStorage.getItem(CART_KEY);
  if (!raw) return {};
  return JSON.parse(raw);
}

function summarizeCart(cart){
  const rows = [];
  let total = 0;
  for (const id in cart){
    const e = cart[id];
    rows.push(`${e.item.englishName} x${e.qty} — ₹${(e.item.price*e.qty).toFixed(0)}`);
    total += e.item.price * e.qty;
  }
  return {rows, total};
}

function renderOrder(){
  const cart = getCart();
  const s = summarizeCart(cart);
  const container = document.getElementById('order-summary');
  container.innerHTML = `<strong>Order:</strong><br/>${s.rows.join('<br/>')}<hr/>Total: ₹${s.total.toFixed(0)}`;
  return s.total;
}

function renderMethodArea(){
  const sel = document.querySelector('input[name="method"]:checked').value;
  const area = document.getElementById('method-area');
  area.innerHTML = '';
  if (sel === 'UPI'){
    const img = document.createElement('img');
    img.src = '../assets/qr.png';
    img.alt = 'UPI QR';
    img.style.maxWidth = '220px';
    area.appendChild(img);
    const note = document.createElement('div');
    note.textContent = 'Scan QR with your UPI app and then press Confirm.';
    area.appendChild(note);
  } else if (sel === 'CARD'){
    area.innerHTML = `
      <div><input id="card-name" placeholder="Name on card" style="padding:8px;width:100%;margin-bottom:8px"/></div>
      <div><input id="card-number" placeholder="Card number" style="padding:8px;width:100%;margin-bottom:8px"/></div>
      <div style="display:flex;gap:8px"><input id="card-exp" placeholder="MM/YY" style="padding:8px;flex:1"/><input id="card-cvv" placeholder="CVV" style="padding:8px;width:80px"/></div>
    `;
  } else {
    area.innerHTML = '<div>Choose Cash at counter. Your order will be saved and marked unpaid.</div>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderOrder();
  renderMethodArea();

  document.querySelectorAll('input[name="method"]').forEach(r=>r.onchange=renderMethodArea);

  document.getElementById('pay-btn').onclick = ()=>{
    const method = document.querySelector('input[name="method"]:checked').value;
    const cart = getCart();
    if (Object.keys(cart).length === 0) { alert('Cart empty'); return; }
    // simulate processing time
    document.getElementById('pay-btn').disabled = true;
    setTimeout(()=>{
      // create a simple receipt object to pass to confirmation
      const receipt = {
        total: summarizeCart(cart).total,
        method,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('hnr_receipt', JSON.stringify(receipt));
      window.location.href = 'confirmation.html';
    }, 800);
  };
});
