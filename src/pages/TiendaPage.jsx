import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductDetail from '../components/ProductDetail';
import { supabase } from '../lib/supabase';

function TiendaPage() {
  const [plushies, setPlushies] = useState([]);
  const [selectedPlushie, setSelectedPlushie] = useState(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();
  const hasOpenedFromNavigation = useRef(false);

  useEffect(() => {
    const fetchPlushies = async () => {
      const { data, error } = await supabase
        .from('plushies')
        .select('*')
        .gt('stock', 0)
        .order('name', { ascending: true });
      if (!error && data) {
        setPlushies(data);
      }
    };
    fetchPlushies();
  }, []);

  useEffect(() => {
    const selectedId = location.state?.selectedPlushieId;
    if (!selectedId || plushies.length === 0 || hasOpenedFromNavigation.current) return;
    const found = plushies.find((p) => p.id === selectedId);
    if (found) {
      handleSelectPlushie(found);
      hasOpenedFromNavigation.current = true;
    }
  }, [plushies, location.state]);

  const handleSelectPlushie = (plushie) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSelectedPlushie(plushie);
    setPanelVisible(true);
  };

  const handleCloseDetail = () => {
    setPanelVisible(false);
    closeTimer.current = setTimeout(() => setSelectedPlushie(null), 350);
  };

  return (
    <main style={{ paddingTop: 'var(--header-height, 80px)' }}>
      <div className={`tienda-layout${panelVisible ? ' detail-open' : ''}`}>
        <div className="detail-area">
          {selectedPlushie && (
            <div className="detail-panel">
              <ProductDetail plushie={selectedPlushie} onClose={handleCloseDetail} />
            </div>
          )}
        </div>
        <div className="products-area" onClick={panelVisible ? handleCloseDetail : undefined}>
          <section className="section-container tienda-section">
            <Helmet>
              <title>Tienda Pokémon | Pixel & Plush</title>
              <meta name="description" content="Nuestra tienda ofrece la mejor selección de peluches de Pokémon para todas las generaciones." />
            </Helmet>
            {selectedPlushie ? (
              <div className="product-grid product-column">
                {plushies
                  .filter((plush) => plush.id !== selectedPlushie.id)
                  .map((plush, idx) => (
                    <ProductCard
                      key={idx}
                      image={plush.image}
                      alt={plush.name}
                      name={plush.name}
                      price={plush.price_text}
                      stock={plush.stock}
                      buttonText="¡YO TE ELIJO!"
                      item={plush}
                      onSelect={handleSelectPlushie}
                    />
                  ))}
              </div>
            ) : (
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
                    onSelect={handleSelectPlushie}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default TiendaPage;
