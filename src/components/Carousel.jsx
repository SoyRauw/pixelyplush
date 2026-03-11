import { useState, useEffect, useRef } from 'react';

const PLUSHIES = [
  { image: '/pixelyplush/assets/pikachu.webp', alt: 'Pikachu Peluche', name: 'Pikachu 25cm', price: '$15.00' },
  { image: '/pixelyplush/assets/gengar.webp', alt: 'Gengar Peluche', name: 'Gengar 25cm', price: '$15.00' },
  { image: '/pixelyplush/assets/bulbasur.webp', alt: 'Bulbasaur Peluche', name: 'Bulbasaur 25cm', price: '$15.00' },
  { image: '/pixelyplush/assets/psyduck.webp', alt: 'Psyduck Peluche', name: 'Psyduck 25cm', price: '$15.00' },
  { image: '/pixelyplush/assets/charmander.webp', alt: 'Charmander Peluche', name: 'Charmander 25cm', price: '$15.00' },
  { image: '/pixelyplush/assets/squirtle.webp', alt: 'Squirtle Peluche', name: 'Squirtle 25cm', price: '$15.00' },
];

function Carousel() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const cardRefs = useRef([]);
  const total = PLUSHIES.length;

  useEffect(() => {
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
        {PLUSHIES.map((item, idx) => (
          <div
            key={idx}
            className="carousel-card"
            ref={(el) => (cardRefs.current[idx] = el)}
          >
            <div className="card">
              <img src={item.image} alt={item.alt} className="product-image" />
              <h3>{item.name}</h3>
              <div className="price">{item.price}</div>
              <button className="btn">¡YO TE ELIGO!</button>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-btn next" onClick={() => moveCarousel(1)}>❯</button>
    </div>
  );
}

export default Carousel;
