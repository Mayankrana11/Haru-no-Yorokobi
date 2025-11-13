export default function IpadFrame({ children }) {
  return (
    <div className="w-[1024px] h-[1350px] rounded-[40px] bg-black mx-auto mt-4 shadow-2xl p-5">
      <div className="w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-br from-pink-200 to-white relative">
        {children}
      </div>
    </div>
  );
}
