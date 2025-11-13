export default function CategoryBar({ current, onChange }) {
  const cats = [
    ["Sushi","寿司"],
    ["Ramen","拉麺"],
    ["Yakisoba","焼きそば"],
    ["Bento","弁当"],
    ["Omakase","おまかせ"],
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-pink-100/70 backdrop-blur-md rounded-2xl shadow flex justify-around items-center">
      {cats.map(([en,jp]) => (
        <div
          key={en}
          onClick={() => onChange(en)}
          className={`px-4 py-2 rounded-xl cursor-pointer text-center transition ${
            current === en ? "bg-pink-400 text-white scale-105" : "bg-white"
          }`}
        >
          <div className="font-bold text-sm">{en}</div>
          <div className="text-[11px] text-gray-500">{jp}</div>
        </div>
      ))}
    </div>
  );
}
