
const API_BASE_URL = window.location.origin + '/api';
window.API_BASE_URL = API_BASE_URL;

async function updateCartBadge() {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    const count = data.items ? data.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    const badge = document.getElementById('cart-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.add('show');
      } else {
        badge.classList.remove('show');
      }
    }
  } catch (error) {
    console.log('Cart badge update skipped (server may not be running)');
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.classList.remove('show');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

async function addToCart(product) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Item added to cart!', 'success');
      updateCartBadge();
    } else {
      showNotification('Failed to add item to cart', 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showNotification('Error adding item to cart', 'error');
  }
}

function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 2rem;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

