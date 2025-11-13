export default function Header({ onCart }) {
  return (
    <div className="w-full bg-pink-200/60 backdrop-blur-md px-8 py-4 flex justify-between items-center shadow">
      <div>
        <div className="text-3xl font-bold">春の喜び</div>
        <div className="text-xs text-gray-600">Haru no Yorokobi — Spring’s Delight</div>
      </div>
      <img
        src="/assets/icons/pay.png"
        onClick={onCart}
        className="w-10 h-10 cursor-pointer"
      />
    </div>
  );
}
