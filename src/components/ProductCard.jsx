import React from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ image, alt, name, price, stock, buttonText = "Comprar", description, highlighted = false, isCyber = false, item = null, onSelect }) {
  const { addToCart } = useCart();

  // Fix old paths from DB if they still include /pixelyplush
  const displayImage = image?.replace('/pixelyplush/assets/', '/assets/') || image;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (onSelect && item) {
      onSelect(item);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    addToCart(item || { name, price, image });
  };

  return (
    <div
      className={`card${isCyber ? ' cyber-card' : ''}${highlighted ? ' cyber-highlighted' : ''}`}
      style={highlighted ? { borderColor: 'var(--accent-glow)' } : {}}
      onClick={handleCardClick}
    >
      <img src={displayImage} alt={alt} className="product-image" />
      <div className="card-body">
        <h3>{name}</h3>
        {description && (
          <p className="card-description">{description}</p>
        )}
        <div className="price">{price}</div>
        {stock !== undefined && (
          <div className="stock-text">
            Quedan {stock} en stock
          </div>
        )}
      </div>
      <button 
        className="btn"
        onClick={handleButtonClick}
        disabled={stock === 0}
      >
        {stock === 0 ? 'Agotado' : buttonText}
      </button>
    </div>
  );
}

export default ProductCard;
