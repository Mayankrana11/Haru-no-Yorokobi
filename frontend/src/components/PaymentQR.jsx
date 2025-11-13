export default function PaymentQR({ amount }) {
  return (
    <div className="w-full text-center">
      <img src="/assets/qr.jpg" className="mx-auto w-64 h-64 rounded-2xl shadow" />
      <div className="text-xl font-bold mt-4">Pay ₹{amount}</div>
      <div className="text-gray-500 text-sm mt-1">Scan the QR to complete payment</div>
    </div>
  );
}
