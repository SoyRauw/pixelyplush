import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

function CartSidebar() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
    clearCart
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    const phoneNumber = '584120445559'; // Número proporcionado por el usuario
    
    let message = '¡Hola! 👾 Me gustaría hacer un pedido en Pixel & Plush:\n\n';
    
    cartItems.forEach((item) => {
      // Usamos item.price_text si viene de supabase, o item.price si es fallback
      const priceStr = item.price_text || item.price || '$0.00';
      message += `▪️ ${item.quantity}x ${item.name} (${priceStr})\n`;
    });
    
    message += `\n*Total a Pagar: $${cartTotal.toFixed(2)}*\n\n¿Podrían confirmarme la disponibilidad?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setIsProcessing(false);
  };

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Fondo oscuro detrás del panel */}
      <div className="cart-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      
      {/* Panel en sí */}
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>🛒 Tu Pedido</h2>
          <button className="cart-close" onClick={() => setIsSidebarOpen(false)}>✖</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="cart-empty-msg">Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">{item.price_text || item.price}</p>
                  
                  <div className="cart-item-actions">
                    <button onClick={() => decreaseQuantity(item.name)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.name)}>
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            className="btn btn-whatsapp" 
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Comprar vía WhatsApp 📱'}
          </button>
        </div>
      </div>
    </>
  );
}

export default CartSidebar;
