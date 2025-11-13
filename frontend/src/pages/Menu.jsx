import { useEffect, useState, useRef } from "react";

export default function MenuPage() {
  const [menuData, setMenuData] = useState([]);
  const [category, setCategory] = useState("ramen");
  const [cart, setCart] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  // Load menu.json
  useEffect(() => {
    fetch("/assets/menu.json")
      .then((r) => r.json())
      .then((data) => setMenuData(data))
      .catch((err) => console.error("MENU LOAD FAILED:", err));
  }, []);
    
  // Header scroll animation
  useEffect(() => {
    const content = contentRef.current;
    const header = headerRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    const updateLayout = () => {
      if (content.scrollTop === 0) {
        header.style.paddingTop = "8rem";
        header.style.paddingBottom = "8rem";

        title.classList.remove("text-4xl");
        title.classList.add("text-7xl");  

        subtitle.classList.remove("text-lg");
        subtitle.classList.add("text-2xl");
      } else {
        header.style.paddingTop = "2.5rem";
        header.style.paddingBottom = "2.5rem";

        title.classList.remove("text-7xl");
        title.classList.add("text-4xl");

        subtitle.classList.remove("text-2xl");
        subtitle.classList.add("text-lg");
      }
    };

    if (content) {
      content.addEventListener("scroll", updateLayout);
    }

    return () => {
      if (content) content.removeEventListener("scroll", updateLayout);
    };
  }, []);

  // Update +/- quantity
  const updateQuantity = (id, action) => {
    setCart((prev) => {
      let qty = prev[id] || 0;
      if (action === "increase") qty++;
      if (action === "decrease") qty = Math.max(0, qty - 1);

      const updated = { ...prev };
      if (qty === 0) delete updated[id];
      else updated[id] = qty;

      return updated;
    });
  };

  // Get item details from menuData
  const getItem = (id) => {
    if (!Array.isArray(menuData)) return null;
    for (const cat of menuData) {
      const item = cat.items.find((i) => i.id === id);
      if (item) return item;
    }
    return null;
  };

  // Get items for current category
  const items =
    Array.isArray(menuData)
      ? menuData.find((c) => c.category === category)?.items || []
      : [];

  // Total price
  const totalPrice = Object.keys(cart).reduce((sum, id) => {
    const item = getItem(id);
    return item ? sum + item.price * cart[id] : sum;
  }, 0);

  const categoryTitles = {
    sushi: 'Sushi <span class="text-5xl">寿司</span>',
    ramen: 'Ramen <span class="text-5xl">拉麺</span>',
    yakisoba: 'Yakisoba <span class="text-5xl">焼きそば</span>',
    bento: 'Bento <span class="text-5xl">弁当</span>',
    omakase: 'Omakase <span class="text-5xl">お任せ</span>'
  };

  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen p-10">
      <div className="tablet-wrapper w-[1024px] h-[1350px] rounded-[2.5rem] border-[12px] border-[#1a1a1a] overflow-hidden shadow-2xl relative bg-black">

        <div className="app-shell w-full h-full flex flex-col bg-white">

          {/* HEADER */}
          <header
            ref={headerRef}
            className="flex-shrink-0 bg-black flex justify-between items-center text-white px-10"
          >
            <button className="p-2 rounded-lg hover:bg-zinc-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                   className="w-7 h-7" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
              </svg>
            </button>

            <div className="text-center">
              <h1 ref={titleRef} className="font-jp font-semibold tracking-wide text-4xl">
                春の喜び
              </h1>
              <p ref={subtitleRef} className="tracking-wider text-lg">
                Haru no Yorokobi -- Spring's Delight
              </p>
            </div>

            <button onClick={() => setSidebarOpen(true)} className="rounded-full hover:scale-110 transition">
              <img src="/assets/icons/pay.png"
                   className="w-12 h-12 rounded-full"
                   style={{ filter: "grayscale(1) invert(1) brightness(2)" }} />
            </button>
          </header>

          {/* MAIN CONTENT */}
          <main ref={contentRef} className="main-content p-8 relative overflow-y-auto flex-grow">
            <div className="mb-10">
              <h2
                className="font-jp text-6xl font-bold text-zinc-900"
                dangerouslySetInnerHTML={{ __html: categoryTitles[category] }}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              {items.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
                    <div className={`item-badge absolute -top-2 -right-2 ${qty > 0 ? "visible" : ""}`}>
                      {qty}
                    </div>

                    <img
                      src={item.image}
                      className="w-full h-96 object-cover"
                    />

                    <div className="p-6 flex flex-col">
                      <h3 className="font-jp text-3xl font-bold">{item.name}</h3>
                      <p className="text-xl text-gray-500 mb-4">{item.japaneseName}</p>

                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-3xl font-bold">₹{item.price}</span>

                        <div className="flex items-center space-x-3">
                          <button
                            className="bg-red-accent text-white w-10 h-10 rounded-full text-3xl font-bold flex items-center justify-center"
                            onClick={() => updateQuantity(item.id, "decrease")}
                          >
                            -
                          </button>

                          <span className="text-3xl font-bold w-10 text-center">{qty}</span>

                          <button
                            className="bg-red-accent text-white w-10 h-10 rounded-full text-3xl font-bold flex items-center justify-center"
                            onClick={() => updateQuantity(item.id, "increase")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* FOOTER NAV */}
          <footer className="flex-shrink-0 bg-black flex justify-around items-center p-4 text-white">
            {["sushi", "ramen", "yakisoba", "bento", "omakase"].map((cat) => (
              <button
                key={cat}
                className={`nav-item flex flex-col items-center p-3 rounded-xl ${
                  category === cat ? "active" : ""
                }`}
                onClick={() => setCategory(cat)}
              >
                <span className="font-jp text-lg font-medium">
                  {{
                    sushi: "寿司",
                    ramen: "拉麺",
                    yakisoba: "焼きそば",
                    bento: "弁当",
                    omakase: "お任せ"
                  }[cat]}
                </span>
                <span className="text-sm font-medium">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </button>
            ))}
          </footer>

          {/* CART SIDEBAR */}
          <aside
            className={`absolute top-0 right-0 h-full w-[450px] bg-white shadow-2xl transform ${
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 z-50 flex flex-col`}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold">Your Order</h3>
              <button onClick={() => setSidebarOpen(false)}>
                <img src="/assets/icons/cross.png" className="w-12 h-12"
                     style={{ filter: "grayscale(1) invert(1) brightness(2)" }}
                />
              </button>
            </div>

            <div className="flex-grow p-6 space-y-4 overflow-y-auto">
              {Object.keys(cart).length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty.</p>
              ) : (
                Object.keys(cart).map((id) => {
                  const item = getItem(id);
                  const qty = cart[id];
                  return (
                    <div key={id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                          <span className="cart-item-badge absolute -top-2 -right-2">{qty}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">@ ₹{item.price}</p>
                        </div>
                      </div>
                      <span className="font-bold">₹{item.price * qty}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-6 border-t space-y-4">
              <div className="flex justify-between items-center text-xl">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold">₹{totalPrice}</span>
              </div>

              <button
                className="bg-red-accent hover:bg-red-accent-dark w-full text-white py-4 rounded-xl font-semibold"
              >
                Proceed to Payment
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
