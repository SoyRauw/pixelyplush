import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';

function TiendaPage() {
  const [plushies, setPlushies] = useState([]);

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

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="section-container">
        <h2 className="section-title">Todo nuestro Catálogo</h2>
        <p style={{ marginBottom: '40px', fontSize: '1.2rem' }}>
          Encuentra a tu compañero de aventuras perfecto.
        </p>
        <div className="product-grid">
          {plushies.map((plush, idx) => (
            <ProductCard
              key={idx}
              image={plush.image}
              alt={plush.name}
              name={plush.name}
              price={plush.price_text}
              stock={plush.stock}
              buttonText="¡YO TE ELIJO!"
              item={plush}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default TiendaPage;
