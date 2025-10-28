/* confirmation.js
   Shows receipt stored in session storage and clears cart.
*/

document.addEventListener('DOMContentLoaded', ()=>{
  const receiptRaw = sessionStorage.getItem('hnr_receipt');
  const cartRaw = sessionStorage.getItem('hnr_cart_session');
  if (!receiptRaw || !cartRaw) {
    document.getElementById('message').textContent = 'No order found.';
    return;
  }
  const receipt = JSON.parse(receiptRaw);
  const cart = JSON.parse(cartRaw);
  const rows = [];
  for (const id in cart){
    const e = cart[id];
    rows.push(`${e.item.englishName} x${e.qty} — ₹${(e.item.price*e.qty).toFixed(0)}`);
  }
  document.getElementById('message').innerHTML = `<p>Your payment via <strong>${receipt.method}</strong> succeeded.</p>`;
  document.getElementById('receipt').innerHTML = `<div>${rows.join('<br/>')}<hr/>Total: ₹${receipt.total.toFixed(0)}</div>`;
  // clear cart
  sessionStorage.removeItem('hnr_cart_session');
  // keep receipt for a short while if needed
});
