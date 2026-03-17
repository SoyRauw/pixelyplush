import ProductCard from '../components/ProductCard';

const CYBER_PRODUCTS = [
  { image: '/pixelyplush/assets/vr.webp', alt: 'VR', name: 'Pase VR', price: '$1/15min', description: 'Acceso por 15 minutos a nuestras VR.' },
  { image: '/pixelyplush/assets/ps4.webp', alt: 'Pase PlayStation', name: 'Pase PlayStation', price: '$1/15min', description: 'Acceso por 15 minutos a nuestras PlayStation.' },
  { image: '/pixelyplush/assets/simulador.webp', alt: 'Pase Simulador De Carreras', name: 'Pase Simulador De Carreras', price: '$1/Vuelta', description: 'Acceso a una carrera en el simulador.', highlighted: true },
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
