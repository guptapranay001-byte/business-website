import React, { useState, useEffect } from 'react';
import { EcommerceContext } from './EcommerceContextDef';
import { DEMO_PRODUCTS } from '../data/catalogData';

const CART_STORAGE_KEY = 'vinay_agri_cart_v1';
const FAVOURITES_STORAGE_KEY = 'vinay_agri_favourites_v1';

export default function EcommerceProvider({ children }) {
  // 1. Cart State (persisted in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        // Default initial items to demonstrate multi-firm shopping
        { product: DEMO_PRODUCTS[0], quantity: 2 },
        { product: DEMO_PRODUCTS[6], quantity: 1 }
      ];
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // 2. Favourites State (persisted in localStorage)
  const [favouriteIds, setFavouriteIds] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [1, 2]; // Initial sample favourites
    } catch (e) {
      console.warn('Failed to parse favourites from localStorage:', e);
      return [];
    }
  });

  // 3. User Feedback Toast
  const [toast, setToast] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  }, [cartItems]);

  // Sync favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favouriteIds));
    } catch (e) {
      console.warn('Could not save favourites to localStorage:', e);
    }
  }, [favouriteIds]);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    showNotification('Cart cleared', 'info');
  };

  const isFavourite = (productId) => {
    return favouriteIds.includes(productId);
  };

  const toggleFavourite = (productId, productName = '') => {
    setFavouriteIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification(productName ? `Removed "${productName}" from favourites` : 'Removed from favourites', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification(productName ? `Saved "${productName}" to favourites` : 'Added to favourites', 'success');
        return [...prev, productId];
      }
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favouritesCount = favouriteIds.length;

  const favouriteProducts = DEMO_PRODUCTS.filter((p) => favouriteIds.includes(p.id));

  return (
    <EcommerceContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        favouriteIds,
        favouritesCount,
        favouriteProducts,
        isFavourite,
        toggleFavourite,
        toast,
        dismissToast: () => setToast(null)
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1090 }}
          role="region"
          aria-live="polite"
        >
          <div className="toast show align-items-center text-white bg-dark border-0 shadow-lg rounded-3">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i
                  className={`bi ${
                    toast.type === 'success'
                      ? 'bi-check-circle-fill text-success'
                      : 'bi-info-circle-fill text-info'
                  } fs-5`}
                ></i>
                <span className="small">{toast.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast(null)}
                aria-label="Close notification"
              ></button>
            </div>
          </div>
        </div>
      )}
    </EcommerceContext.Provider>
  );
}
