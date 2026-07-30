import { useCart } from '../context/CartContext';

function ProductDetail({ plushie, onClose }) {
  const { addToCart } = useCart();

  const displayImage = plushie.image?.replace('/pixelyplush/assets/', '/assets/') || plushie.image;

  // Extraer tamaño del nombre si existe (ej: "Pikachu 25cm" -> "25CM")
  const sizeMatch = plushie.name?.match(/(\d+)\s?(cm|CM|Cm)/);
  const sizeText = sizeMatch ? `${sizeMatch[1]}CM` : null;
  const cleanName = plushie.name?.replace(/\s*\d+\s?(cm|CM|Cm)\s*/i, '').trim() || plushie.name;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(plushie);
  };

  return (
    <>
      <button className="detail-close-btn" onClick={onClose}>✕</button>
      <div className="detail-inner">
        <div className="detail-image-block">
          <img src={displayImage} alt={plushie.name} className="detail-image" />
        </div>
        <div className="detail-info-block">
          <h2 className="detail-name">{cleanName}</h2>
          {plushie.description && (
            <p className="detail-description">{plushie.description}</p>
          )}
          {sizeText && (
            <div className="detail-size">TAMAÑO: {sizeText}</div>
          )}
          <div className="detail-price">PRECIO: {plushie.price_text}</div>
          <button
            className="btn"
            onClick={handleAddToCart}
            disabled={plushie.stock === 0}
          >
            {plushie.stock === 0 ? 'AGOTADO' : 'YO TE ELIJO'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
