import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { getAllImages } from '../lib/images';

function ProductDetail({ plushie, onClose }) {
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(plushie.main_image_index ?? 0);

  const images = getAllImages(plushie);
  const displayImage = images[currentIndex] || images[0] || '';
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [displayImage]);

  // Extraer tamaño del nombre si existe (ej: "Pikachu 25cm" -> "25CM")
  const sizeMatch = plushie.name?.match(/(\d+)\s?(cm|CM|Cm)/);
  const sizeText = sizeMatch ? `${sizeMatch[1]}CM` : null;
  const cleanName = plushie.name?.replace(/\s*\d+\s?(cm|CM|Cm)\s*/i, '').trim() || plushie.name;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(plushie);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <button className="detail-close-btn" onClick={onClose}>✕</button>
      <div className="detail-inner">
        <div className="detail-image-block product-gallery-block">
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt={plushie.name}
                className={`detail-image product-gallery-image${imageLoaded ? ' loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="image-loader-overlay">
                  <span className="image-loader-spinner"></span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button className="gallery-arrow gallery-arrow-left" onClick={handlePrev}>‹</button>
                  <button className="gallery-arrow gallery-arrow-right" onClick={handleNext}>›</button>
                  <div className="gallery-dots">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`gallery-dot${idx === currentIndex ? ' active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="admin-no-image">Sin imagen</div>
          )}
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
