// UPDATED: Wrapped all code in an async DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', async () => {

    // --- DATA ---
    // UPDATED: Data is now fetched from menu.json
    let menuData = {};
    let categoryTitles = {};

    try {
        const response = await fetch('../assets/menu.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        menuData = data.menuData;
        categoryTitles = data.categoryTitles;
    } catch (error) {
        console.error("Failed to fetch menu data:", error);
        // Display error to user
        const menuGrid = document.getElementById('menu-grid');
        if (menuGrid) {
            menuGrid.innerHTML = `<p class="text-center text-red-accent col-span-2">Error: Could not load menu data. Please try refreshing the page.</p>`;
        }
        return; // Stop execution if data fails to load
    }
    
    let cart = {}; // Stores { id: quantity }
    let currentCategory = 'ramen'; // Default category

    // --- DOM ELEMENTS ---
    const menuGrid = document.getElementById('menu-grid');
    const navButtons = document.querySelectorAll('.nav-item');
    const categoryTitle = document.getElementById('category-title');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('total-price');
    
    // Modal Elements
    const customModal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const openCartBtnHeader = document.getElementById('open-cart-btn-header');
    const menuBtn = document.getElementById('menu-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- SCROLL/HEADER LOGIC ELEMENTS ---
    const mainContent = document.querySelector('.main-content');
    const appHeader = document.querySelector('header');
    const appShell = document.querySelector('.app-shell');
    const headerTitle = appHeader.querySelector('h1.font-jp');
    const headerSubtitle = appHeader.querySelector('p'); 

    /**
     * Updates header size based on scroll
     */
    function updateLayout() {
        if (mainContent.scrollTop === 0) {
            // --- At Top: Enlarge Header ---
            appHeader.style.paddingTop = '8rem'; 
            appHeader.style.paddingBottom = '8rem'; 
            
            headerTitle.classList.remove('text-4xl');
            headerTitle.classList.add('text-7xl');
            
            headerSubtitle.classList.remove('text-lg');
            headerSubtitle.classList.add('text-2xl');

        } else {
            // --- Scrolled: Default Header ---
            appHeader.style.paddingTop = '2.5rem'; 
            appHeader.style.paddingBottom = '2.5rem'; 
            
            headerTitle.classList.remove('text-7xl');
            headerTitle.classList.add('text-4xl');
            
            headerSubtitle.classList.remove('text-2xl');
            headerSubtitle.classList.add('text-lg');
        }
    }
    
    // Add scroll event listener
    mainContent.addEventListener('scroll', updateLayout);
    // --- END NEW LOGIC ---


    // --- FUNCTIONS ---

    /**
     * Renders the menu items for a given category
     */
    function renderMenu(category) {
        currentCategory = category;
        menuGrid.innerHTML = ''; 
        
        const titleElement = document.getElementById('category-title');
        if (categoryTitles[category]) {
            titleElement.innerHTML = categoryTitles[category];
        }
        
        const items = menuData[category];
        if (!items) {
            console.error(`No items found for category: ${category}`);
            return;
        }
        
        items.forEach(item => {
            const itemQty = cart[item.id] || 0;
            const badgeVisibleClass = itemQty > 0 ? 'visible' : '';

            const itemHtml = `
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col relative">
                    <div id="badge-${item.id}" class="item-badge ${badgeVisibleClass}">
                        ${itemQty}
                    </div>

                    <img src="${item.image}" alt="${item.name}" class="w-full h-96 object-cover" 
                         onerror="this.src='https://placehold.co/400x300/e2e8f0/94a3b8?text=Image+Error'; this.onerror=null;">
                    
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="font-jp text-3xl font-bold text-zinc-900">${item.name}</h3>
                        <p class="text-xl text-gray-500 mb-4">${item.japaneseName}</p>
                        
                        <div class="flex justify-between items-center mt-auto pt-4">
                            <span class="text-3xl font-bold text-zinc-900">₹${item.price}</span>
                            
                            <div class="flex items-center space-x-3">
                                <button class="quantity-btn bg-red-accent text-white w-10 h-10 rounded-full text-3xl font-bold flex items-center justify-center leading-none transition-transform hover:scale-110" data-action="decrease" data-id="${item.id}">-</button>
                                <span id="quantity-${item.id}" class="text-3xl font-bold w-10 text-center">${itemQty}</span>
                                <button class="quantity-btn bg-red-accent text-white w-10 h-10 rounded-full text-3xl font-bold flex items-center justify-center leading-none transition-transform hover:scale-110" data-action="increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            menuGrid.innerHTML += itemHtml;
        });

        // Update nav button active state
        navButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Handles changes in item quantity
     */
    function handleQuantityChange(itemId, action) {
        let currentQty = cart[itemId] || 0;

        if (action === 'increase') {
            currentQty++;
        } else if (action === 'decrease') {
            currentQty = Math.max(0, currentQty - 1);
        }

        if (currentQty > 0) {
            cart[itemId] = currentQty;
        } else {
            delete cart[itemId]; 
        }

        const quantityEl = document.getElementById(`quantity-${itemId}`);
        if (quantityEl) {
            quantityEl.innerText = currentQty;
        }
        
        // FIXED: Use backticks for template literal
        const badgeEl = document.getElementById(`badge-${itemId}`);
        if(badgeEl) {
            badgeEl.innerText = currentQty;
            if (currentQty > 0) {
                badgeEl.classList.add('visible');
            } else {
                badgeEl.classList.remove('visible');
            }
        }

        updateCart();
    }

    /**
     * Finds an item by its ID across all categories
     */
    function getItemById(itemId) {
        for (const category in menuData) {
            const item = menuData[category].find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    }

    /**
     * Updates the cart sidebar UI and total price
     */
    function updateCart() {
        cartItemsList.innerHTML = ''; 
        let totalPrice = 0;

        if (Object.keys(cart).length === 0) {
            cartItemsList.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty.</p>';
        } else {
            const sortedItemIds = Object.keys(cart).sort();
            
            sortedItemIds.forEach(itemId => {
                const item = getItemById(itemId);
                const quantity = cart[itemId];
                
                if (item && quantity > 0) {
                    const itemTotalPrice = item.price * quantity;
                    totalPrice += itemTotalPrice;

                    const cartItemHtml = `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="relative flex-shrink-0">
                                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover" onerror="this.src='https://placehold.co/64x64/e2e8f0/94a3b8?text=Img'; this.onerror=null;">
                                    <span class="cart-item-badge absolute -top-2 -right-2">${quantity}</span>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">${item.name}</p>
                                    <p class="text-sm text-gray-500">@ ₹${item.price}</p>
                                </div>
                            </div>
                            <span class="font-semibold text-lg text-gray-900">₹${itemTotalPrice}</span>
                        </div>
                    `;
                    cartItemsList.innerHTML += cartItemHtml;
                }
            });
        }
        
        totalPriceEl.innerText = `₹${totalPrice}`;
    }
    
    /**
     * Shows or hides the cart sidebar
     */
    function toggleCart(show) {
        if (show) {
            cartSidebar.classList.remove('translate-x-full');
        } else {
            cartSidebar.classList.add('translate-x-full');
        }
    }

    /**
     * Shows a custom modal
     */
    function showModal(title, message) {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        customModal.classList.remove('hidden');
    }

    /**
     * Hides the custom modal
     */
    function hideModal() {
        customModal.classList.add('hidden');
    }


    // --- EVENT LISTENERS ---

    // Navigation bar
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            renderMenu(btn.dataset.category);
        });
    });

    // Menu grid (for +/- buttons)
    menuGrid.addEventListener('click', (e) => {
        const button = e.target.closest('.quantity-btn');
        if (button) {
            const { action, id } = button.dataset;
            handleQuantityChange(id, action);
        }
    });

    // Cart buttons
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    openCartBtnHeader.addEventListener('click', () => toggleCart(true));
    
    // Modal buttons
    closeModalBtn.addEventListener('click', hideModal);
    
    menuBtn.addEventListener('click', () => {
        showModal('Menu Options', 'This would typically open a settings or navigation menu. This feature is currently in development.');
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            showModal('Empty Cart', 'Please add some items to your cart before proceeding to payment.');
        } else {
            // UPDATED: Redirect to payment page
            window.location.href = 'payment.html'; 
        }
    });

    // --- INITIAL RENDER ---
    renderMenu(currentCategory);

    // Call layout function on load to set initial state
    updateLayout();

});
