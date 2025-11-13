export default function CartPanel({ open, cart, total, onClose }) {
  return (
    <div className={`absolute top-0 right-0 w-80 h-full bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="p-4 border-b flex justify-between">
        <h2 className="font-bold text-lg">Your Order</h2>
        <img src="/assets/icons/cross.png" onClick={onClose} className="w-8 h-8 cursor-pointer" />
      </div>

      <div className="p-4 overflow-y-auto h-[70%]">
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty</div>
        ) : (
          cart.map((c,i)=>(
            <div key={i} className="mb-3">
              <div className="font-semibold">{c.englishName}</div>
              <div className="text-sm">{c.japaneseName}</div>
              <div className="text-sm mt-1">Qty: {c.qty}</div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t font-bold">
        Total: ₹{total}
        <a href="/payment" className="block mt-4 bg-pink-500 text-white text-center py-2 rounded-xl">Proceed to Pay</a>
      </div>
    </div>
  );
}
