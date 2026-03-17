import React from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ image, alt, name, price, stock, buttonText = "Comprar", description, highlighted = false, isCyber = false, item = null }) {
  const { addToCart } = useCart();

  return (
    <div
      className={`card${isCyber ? ' cyber-card' : ''}${highlighted ? ' cyber-highlighted' : ''}`}
      style={highlighted ? { borderColor: 'var(--accent-glow)' } : {}}
    >
      <img src={image} alt={alt} className="product-image" />
      <h3>{name}</h3>
      {description && (
        <p style={{ margin: '15px 0', color: '#aaa' }}>{description}</p>
      )}
      <div className="price">{price}</div>
      {stock !== undefined && (
        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>
          Quedan {stock} en stock
        </div>
      )}
      <button 
        className="btn"
        onClick={() => addToCart(item || { name, price, image })}
        disabled={stock === 0}
      >
        {stock === 0 ? 'Agotado' : buttonText}
      </button>
    </div>
  );
}

export default ProductCard;
