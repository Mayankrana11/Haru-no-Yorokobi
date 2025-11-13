import IpadFrame from "../components/IpadFrame";

export default function Confirmation() {
  return (
    <IpadFrame>
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-3xl font-bold">Payment Successful</h1>
        <p className="text-gray-600">Your order is being prepared</p>
        <a href="/" className="mt-4 bg-pink-500 text-white px-8 py-3 rounded-xl shadow">
          Back to Menu
        </a>
      </div>
    </IpadFrame>
  );
}
