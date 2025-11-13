export default function FoodCard({ item, qty, onAdd, onRemove }) {
  const safeId = item.englishName.replace(/\s+/g, "");

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col">
      <img src={item.imagePath} className="w-full h-48 object-cover rounded-xl" />
      <div className="font-bold mt-2">{item.englishName}</div>
      <div className="text-sm text-gray-500">{item.japaneseName}</div>
      <div className="text-xs text-gray-500 mt-1">{item.description}</div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-3 items-center">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onRemove}>-</button>
          <span>{qty}</span>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onAdd}>+</button>
        </div>
        <div className="font-bold text-pink-600">₹{item.price}</div>
      </div>
    </div>
  );
}
