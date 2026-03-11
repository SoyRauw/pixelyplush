import { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';

const CYBER_PRODUCTS = [
  { image: '/assets/vr.webp', alt: 'VR', name: 'Pase VR', price: '$5.00/hr', description: 'Acceso por 1 hora a nuestras VR.', highlighted: false },
  { image: '/assets/ps4.webp', alt: 'Pase PlayStation', name: 'Pase PlayStation', price: '$5.00/hr', description: 'Acceso por 1 hora a nuestras PlayStation.', highlighted: false },
  { image: '/assets/PC.webp', alt: 'Pase PC Gamer', name: 'Pase PC Gamer', price: '$5.00/hr', description: 'Acceso por 1 hora a nuestras PC Gamer.', highlighted: true },
];

function HomePage() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`¡Genial! Hemos recibido tu correo: ${email}`);
    setEmail('');
  };

  return (
    <main>
      {/* ZONA POKEMON */}
      <div className="pokemon-zone">
        {/* Hero */}
        <section className="hero">
          <h1>Abraza tu pasión Gamer en Pixel &amp; Plush</h1>
          <p>
            Tu tienda Pokemon online donde la ternura de los peluches Pokémon se une a la intensidad del
            CyberGaming. ¡Colecciona, juega y triunfa!
          </p>
          <br />
          <a href="#carrusel-peluches" className="btn">Explorar Tienda</a>
        </section>

        {/* Propuesta de Valor */}
        <section className="section-container">
          <div className="about-box about-box--split">
            <div className="about-box__video">
              <video autoPlay muted loop playsInline>
                <source src="/assets/pikavid.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="about-box__content">
              <h2 className="section-title">Nuestra Propuesta de Valor</h2>
              <p>
                Somos el primer espacio 100% online diseñado para el gamer que no quiere elegir entre
                suavidad y rendimiento. Te ofrecemos peluches Pokémon premium y acceso exclusivo a servicios
                CyberGamer.
              </p>
              <br />
              <Link to="/nosotros" className="btn btn-outline">Leer más sobre nosotros</Link>
            </div>
          </div>
        </section>

        {/* Carrusel */}
        <section className="section-container" id="carrusel-peluches">
          <h2 className="section-title">Nuestros Peluches Estrella</h2>
          <Carousel />
          <br /><br />
          <Link to="/tienda" className="btn btn-outline">Ver Catálogo Completo</Link>
        </section>
      </div>

      {/* ZONA CYBER */}
      <div className="cyber-zone">
        <section className="section-container">
          <h2 className="section-title">CyberGamer Zone</h2>
          <p style={{ marginBottom: '40px', fontSize: '1.2rem' }}>
            Conexión de alta velocidad y periféricos top tier.
          </p>
          <div className="grid-cyber">
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
          <br /><br />
          <Link to="/cyber" className="btn btn-outline">Ver todos los detalles</Link>
        </section>
      </div>

      {/* CONTACTO / MAPA */}
      <section className="section-container contact-section">
        <h2 className="section-title">¡Encuéntranos en URBE!</h2>
        <p style={{ marginBottom: '30px', fontSize: '1.1rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Retira tus peluches en persona o ven a viciar a nuestro Cyber. ¡Te esperamos!
        </p>

        <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', borderRadius: '15px', overflow: 'hidden', border: '2px solid var(--soft-lila)', boxShadow: '0 0 15px rgba(187, 134, 252, 0.2)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6593.5661642322775!2d-71.6312411296884!3d10.691383330860171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e899ecd22a1b721%3A0xd2cfab5751fcd5cc!2sUniversidad%20Privada%20Dr.%20Rafael%20Belloso%20Chac%C3%ADn!5e0!3m2!1ses!2sve!4v1772414973374!5m2!1ses!2sve"
            width="100%"
            height="350"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa URBE"
          ></iframe>
        </div>

        <div className="newsletter">
          <form id="subscribeForm" onSubmit={handleSubscribe}>
            <input
              type="email"
              id="emailInput"
              placeholder="Tu correo de entrenador..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <button type="submit" className="btn">Suscribirme</button>
          </form>
        </div>
        <br /><br />
        <a
          href="https://wa.me/584120445559?text=Hola%20Pixel%20%26%20Plush!%20Quiero%20Este%20Pokemon..."
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp"
        >
          💬 Escríbenos por WhatsApp
        </a>
      </section>
    </main>
  );
}

export default HomePage;
