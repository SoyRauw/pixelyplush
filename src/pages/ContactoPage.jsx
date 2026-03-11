import { useState } from 'react';

function ContactoPage() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`¡Genial! Hemos recibido tu correo: ${email}`);
    setEmail('');
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="section-container">
        <h2 className="section-title">¡Únete a la Familia!</h2>

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
        <br /><br />

        <h3 className="section-title">¡Encuéntranos en URBE!</h3>
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
      </section>
    </main>
  );
}

export default ContactoPage;
