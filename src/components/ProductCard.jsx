import React from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ image, alt, name, price, buttonText = "Comprar", description, highlighted = false, isCyber = false }) {
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
      {description && <p>{description}</p>}
      <div className="price">{price}</div>
      <button 
        className="btn"
        onClick={() => addToCart({ name, price, image })}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default ProductCard;
