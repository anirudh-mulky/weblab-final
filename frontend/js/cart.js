
if (typeof window.API_BASE_URL === 'undefined') {
  window.API_BASE_URL = window.location.origin + '/api';
}

async function loadCart() {
  const cartItemsContainer = document.getElementById('cart-items');

  try {
    const apiUrl = window.API_BASE_URL;
    console.log('Loading cart from:', `${apiUrl}/cart`);
    const response = await fetch(`${apiUrl}/cart`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Cart data received:', data);

    renderCart(data.items || [], data.total || 0);
  } catch (error) {
    console.error('Error loading cart:', error);

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">⚠️</div>
          <h2>Error loading cart</h2>
          <p>${error.message}</p>
          <p style="font-size: 0.875rem; margin-top: 1rem;">Please check the console for details.</p>
          <button class="btn btn-primary" style="margin-top: 1rem;" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }
}

function renderCart(items, total) {
  console.log('Rendering cart with items:', items);
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');

  if (!cartItemsContainer) {
    console.error('cart-items container not found!');
    return;
  }

  if (items.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart</p>
        <a href="products.html" class="btn btn-primary" style="margin-top: 2rem;">View Products</a>
      </div>
    `;

    if (cartSummary) {
      cartSummary.innerHTML = '';
    }
    return;
  }

  cartItemsContainer.innerHTML = items.map(item => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === item.productId);
    const imageUrl = item.image || product?.image || '⚡';
    const isImageUrl = typeof imageUrl === 'string' && (imageUrl.startsWith('images/') || imageUrl.startsWith('http'));

    return `
    <div class="cart-item" data-product-id="${item.productId}">
      <div class="cart-item-image">
        ${isImageUrl ? `<img src="${imageUrl}" alt="${item.productName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="cart-image-fallback" style="display: none;">${product?.imageFallback || '⚡'}</div>` : `<div>${imageUrl}</div>`}
      </div>
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.productName}</h3>
        <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} each</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button class="quantity-btn decrease-btn" data-product-id="${item.productId}" data-action="decrease">−</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1"
                 data-product-id="${item.productId}" />
          <button class="quantity-btn increase-btn" data-product-id="${item.productId}" data-action="increase">+</button>
        </div>
        <button class="remove-btn" data-product-id="${item.productId}">Remove</button>
      </div>
    </div>
  `;
  }).join('');

  attachCartEventListeners();

  if (cartSummary) {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + tax;

    cartSummary.innerHTML = `
      <h3 style="margin-bottom: 1.5rem;">Order Summary</h3>
      <div class="cart-summary-row">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Tax (8%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Total</span>
        <span>$${finalTotal.toFixed(2)}</span>
      </div>
      <button class="btn btn-primary checkout-btn" id="checkout-btn">Proceed to Checkout</button>
    `;
  }
}

function attachCartEventListeners() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;

  cartItemsContainer.addEventListener('click', (e) => {
    const productId = e.target.getAttribute('data-product-id');
    if (!productId) return;

    if (e.target.classList.contains('decrease-btn')) {
      const input = cartItemsContainer.querySelector(`input[data-product-id="${productId}"]`);
      const currentQty = parseInt(input.value) || 1;
      updateQuantity(productId, currentQty - 1);
    }

    else if (e.target.classList.contains('increase-btn')) {
      const input = cartItemsContainer.querySelector(`input[data-product-id="${productId}"]`);
      const currentQty = parseInt(input.value) || 1;
      updateQuantity(productId, currentQty + 1);
    }

    else if (e.target.classList.contains('remove-btn')) {
      removeItem(productId);
    }
  });

  cartItemsContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('quantity-input')) {
      const productId = e.target.getAttribute('data-product-id');
      const quantity = parseInt(e.target.value) || 1;
      if (productId) {
        updateQuantity(productId, quantity);
      }
    }
  });

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }
}

async function updateQuantity(productId, quantity) {
  if (quantity < 1) {
    removeItem(productId);
    return;
  }

  try {
    const response = await fetch(`${window.API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    if (data.success) {
      loadCart();
      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('Failed to update quantity');
  }
}

async function removeItem(productId) {
  if (!confirm('Remove this item from cart?')) {
    return;
  }

  try {
    const response = await fetch(`${window.API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (data.success) {
      loadCart();
      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }

      if (typeof showNotification === 'function') {
        showNotification('Item removed from cart', 'success');
      }
    }
  } catch (error) {
    console.error('Error removing item:', error);
    alert('Failed to remove item');
  }
}

function checkout() {
  alert('Thank you for your interest! Checkout functionality would be implemented here in a production environment.');
}

function initCart() {
  console.log('Cart page initialized, fetching cart data...');
  console.log('window.API_BASE_URL:', window.API_BASE_URL);

  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) {
    console.error('cart-items container not found on page!');
    return;
  }

  loadCart();
}

function startCart() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {

    initCart();
  }
}

startCart();

