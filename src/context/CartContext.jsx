import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Intentar recuperar del storage local si lo deseas, o iniciar vacío:
    const savedCart = localStorage.getItem('px_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('px_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsSidebarOpen(true); // Abrir sidebar automáticamente al añadir
  };

  const removeFromCart = (productName) => {
    setCartItems((prev) => prev.filter((item) => item.name !== productName));
  };

  const decreaseQuantity = (productName) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === productName);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.name === productName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter((item) => item.name !== productName);
      }
    });
  };

  const clearCart = () => setCartItems([]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Calcula el total interpretando el string "$15.00", "$5.00/hr" o usando item.price número directo
  const cartTotal = cartItems.reduce((total, item) => {
    let numericPrice = 0;
    if (typeof item.price === 'number') {
        numericPrice = item.price;
    } else if (typeof item.price === 'string') {
        // Remover símbolos y letras (como "$", "/hr")
        numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    } else if (typeof item.price_text === 'string') {
        numericPrice = parseFloat(item.price_text.replace(/[^0-9.]/g, ''));
    }
    return total + ((isNaN(numericPrice) ? 0 : numericPrice) * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
