import ProductCard from '../components/ProductCard';

const CYBER_PRODUCTS = [
  { image: '/pixelyplush/assets/vr.webp', alt: 'VR', name: 'Pase VR', price: '$5.00/hr', description: 'Acceso por 1 hora a nuestras VR.' },
  { image: '/pixelyplush/assets/ps4.webp', alt: 'Pase PlayStation', name: 'Pase PlayStation', price: '$5.00/hr', description: 'Acceso por 1 hora a nuestras PlayStation.' },
  { image: '/pixelyplush/assets/PC.webp', alt: 'Pase PC Gamer', name: 'Pase PC Gamer', price: '$5.00/hr', description: 'Acceso por 1 hora a nuestras PC Gamer.', highlighted: true },
];

function CyberPage() {
  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="section-container">
        <h2 className="section-title">Planes CyberGamer</h2>
        <p style={{ marginBottom: '40px', fontSize: '1.2rem' }}>
          Elige el pase que mejor se adapte a tu estilo de juego. Conexión de alta velocidad y periféricos top tier.
        </p>
        <div className="product-grid">
          {CYBER_PRODUCTS.map((product, idx) => (
            <ProductCard
              key={idx}
              image={product.image}
              alt={product.alt}
              name={product.name}
              price={product.price}
              description={product.description}
              buttonText="¡A VICIAR!"
              isCyber={true}
              highlighted={product.highlighted}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default CyberPage;
