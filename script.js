// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 199.99,
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
        emoji: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 299.99,
        description: "Advanced fitness tracking with heart rate monitoring and GPS.",
        emoji: "⌚"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 89.99,
        description: "Portable speaker with 360° sound and waterproof design.",
        emoji: "🔊"
    },
    {
        id: 4,
        name: "Wireless Charger",
        price: 49.99,
        description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
        emoji: "🔋"
    },
    {
        id: 5,
        name: "Gaming Mouse",
        price: 79.99,
        description: "High-precision gaming mouse with customizable RGB lighting.",
        emoji: "🖱️"
    },
    {
        id: 6,
        name: "USB-C Hub",
        price: 59.99,
        description: "Multi-port hub with 4K HDMI, USB 3.0, and power delivery.",
        emoji: "🔌"
    }
];

// Shopping cart
let cart = [];

// Initialize the store
function init() {
    displayProducts();
    updateCartCount();
}

// Display products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartCount();
    
    // Show success animation
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(btn => {
        if (btn.onclick.toString().includes(productId)) {
            btn.style.background = '#10ac84';
            btn.textContent = 'Added!';
            setTimeout(() => {
                btn.style.background = '';
                btn.textContent = 'Add to Cart';
            }, 1000);
        }
    });
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    if (sectionName === 'cart') {
        displayCartItems();
    } else if (sectionName === 'checkout') {
        displayOrderSummary();
    }
}

// Display cart items
function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartTotal.style.display = 'block';
    checkoutBtn.style.display = 'inline-block';
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            displayCartItems();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCartItems();
}

// Display order summary
function displayOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    let total = 0;
    let summaryHTML = '<h3>Order Summary</h3>';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHTML += `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    summaryHTML += `
        <div class="order-total">
            <span>Total: $${total.toFixed(2)}</span>
        </div>
    `;

    orderSummary.innerHTML = summaryHTML;
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Generate order ID
        const orderId = 'ORD-' + Date.now().toString().slice(-6);
        document.getElementById('orderId').textContent = orderId;
        
        // Clear cart
        cart = [];
        updateCartCount();
        
        // Show success page
        showSection('success');
    });

    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = value.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];
        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            e.target.value = parts.join(' ');
        } else {
            e.target.value = value;
        }
    });

    // Format expiry date input
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Initialize the store
    init();
});

// Start over
function startOver() {
    showSection('products');
}