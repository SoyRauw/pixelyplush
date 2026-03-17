import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

function Carousel() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [plushies, setPlushies] = useState([]);
  const cardRefs = useRef([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPlushies = async () => {
      const { data, error } = await supabase
        .from('plushies')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) {
        setPlushies(data);
      }
    };
    fetchPlushies();
  }, []);

  const total = plushies.length;

  useEffect(() => {
    if (total === 0) return;
    cardRefs.current.forEach((card, idx) => {
      if (!card) return;

      let offset = idx - carouselIndex;

      // Lógica circular infinita
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const absOffset = Math.abs(offset);
      const translateX = offset * 180;
      const translateZ = -absOffset * 150;
      const rotateY = offset * -10;
      const scale = Math.max(0.6, 1 - absOffset * 0.1);
      const opacity = Math.max(0.3, 1 - absOffset * 0.3);

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity.toString();
      card.style.zIndex = String(100 - absOffset * 10);

      if (offset === 0) {
        card.classList.add('active-card');
        card.style.pointerEvents = 'auto';
      } else {
        card.classList.remove('active-card');
        card.style.pointerEvents = 'none';
      }
    });
  }, [carouselIndex, total]);

  const moveCarousel = (direction) => {
    setCarouselIndex((prev) => (prev + direction + total) % total);
  };

  return (
    <div className="carousel-wrapper">
      <button className="carousel-btn prev" onClick={() => moveCarousel(-1)}>❮</button>
      <div className="carousel-track" id="track">
        {plushies.map((item, idx) => (
          <div
            key={idx}
            className="carousel-card"
            ref={(el) => (cardRefs.current[idx] = el)}
          >
            <div className="card">
              <img src={item.image} alt={item.name} className="product-image" />
              <h3>{item.name}</h3>
              <div className="price">{item.price_text}</div>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>
                Quedan {item.stock} en stock
              </div>
              <button 
                className="btn" 
                onClick={() => addToCart(item)}
                disabled={item.stock === 0}
              >
                {item.stock === 0 ? 'Agotado' : '¡YO TE ELIJO!'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-btn next" onClick={() => moveCarousel(1)}>❯</button>
    </div>
  );
}

export default Carousel;
