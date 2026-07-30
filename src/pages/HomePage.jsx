import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Carousel from '../components/Carousel';

function HomePage() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`¡Genial! Hemos recibido tu correo: ${email}`);
    setEmail('');
  };

  return (
    <div className="home-page">
      <Helmet>
        <title>Inicio | Pixel & Plush</title>
        <meta name="description" content="Bienvenido a Pixel & Plush. Explora nuestra increíble colección de peluches Pokémon y descubre la adrenalina de nuestra zona CyberGaming." />
      </Helmet>
      
      {/* ZONA POKEMON */}
      <div className="pokemon-zone">
        {/* Hero */}
        <section className="hero">
          <h1>Abraza tu pasión Gamer en Pixel &amp; Plush</h1>
          <p>
            Tu tienda de peluches Pokémon y Anime online, hecha para la comunidad geek.
            ¡Colecciona, regala y triunfa!
          </p>
          <br />
          <Link to="/tienda" className="btn">Explorar Tienda</Link>
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
              <h2 className="section-title">¿Quienes Somos?</h2>
              <p>
                Somos una tienda online dedicada a la comunidad gamer y otaku.
                Ofrecemos peluches Pokémon y Anime premium para coleccionistas
                y fanáticos de todo el mundo.
              </p>

              <a
                href="https://www.instagram.com/pixelxplush/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>@pixelxplush</span>
              </a>
            </div>
          </div>
        </section>

        {/* Carrusel */}
        <section className="section-container" id="carrusel-peluches">
          <h2 className="section-title">Nuestros Peluches</h2>
          <Carousel />
          <br /><br />
          <Link to="/tienda" className="btn btn-outline">Ver Catálogo Completo</Link>
        </section>
      </div>

      {/* CONTACTO */}
      <section className="section-container contact-section">
        <h2 className="section-title">¡Contáctanos!</h2>
        <p style={{ marginBottom: '30px', fontSize: '1.1rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          ¿Tienes alguna pregunta o quieres hacer un pedido especial? ¡Estamos para ayudarte!
        </p>

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
        <div style={{ textAlign: 'center' }}>
          <a
            href="https://wa.me/584120445559?text=Hola%20Pixel%20%26%20Plush!%20Quiero%20Este%20Pokemon..."
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp"
            style={{ display: 'inline-block', width: 'fit-content', padding: '15px 40px' }}
          >
            💬 Escríbenos por WhatsApp
          </a>
        </div>
      </section>
      </div>
  );
}

export default HomePage;
