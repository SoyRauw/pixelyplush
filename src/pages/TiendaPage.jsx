import ProductCard from '../components/ProductCard';

const PLUSHIES = [
  { image: '/assets/pikachu.webp', alt: 'Pikachu Peluche', name: 'Pikachu 25cm', price: '$15.00' },
  { image: '/assets/gengar.webp', alt: 'Gengar Peluche', name: 'Gengar 25cm', price: '$15.00' },
  { image: '/assets/bulbasur.webp', alt: 'Bulbasaur Peluche', name: 'Bulbasaur 25cm', price: '$15.00' },
  { image: '/assets/psyduck.webp', alt: 'Psyduck Peluche', name: 'Psyduck 25cm', price: '$15.00' },
  { image: '/assets/charmander.webp', alt: 'Charmander Peluche', name: 'Charmander 25cm', price: '$15.00' },
  { image: '/assets/squirtle.webp', alt: 'Squirtle Peluche', name: 'Squirtle 25cm', price: '$15.00' },
];

function TiendaPage() {
  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="section-container">
        <h2 className="section-title">Todo nuestro Catálogo</h2>
        <p style={{ marginBottom: '40px', fontSize: '1.2rem' }}>
          Encuentra a tu compañero de aventuras perfecto.
        </p>
        <div className="product-grid">
          {PLUSHIES.map((plush, idx) => (
            <ProductCard
              key={idx}
              image={plush.image}
              alt={plush.alt}
              name={plush.name}
              price={plush.price}
              buttonText="¡YO TE ELIGO!"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default TiendaPage;
