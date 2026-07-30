import React from 'react';
import { Helmet } from 'react-helmet-async';

function NosotrosPage() {
  return (
    <main className="nosotros-page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <Helmet>
        <title>Envíos y Delivery | Pixel & Plush</title>
        <meta name="description" content="Información sobre envíos nacionales y delivery en Maracaibo. Te llevamos tu peluche a donde estés." />
      </Helmet>

      <section className="section-container fade-in-up">
        <h1 className="section-title">🚚 Envíos y Delivery</h1>
        <p className="subtitle">Te llevamos tu peluche a donde estés</p>
      </section>

      {/* TARJETAS PRINCIPALES */}
      <section className="section-container fade-in-up delay-1">
        <div className="values-grid" style={{ gap: '24px' }}>

          {/* Envíos Nacionales */}
          <div className="card cyber-card value-card" style={{ borderTop: '3px solid var(--soft-lila)' }}>
            <h2 style={{ marginBottom: '12px' }}>📦 Envíos Nacionales</h2>
            <p style={{ marginBottom: '16px' }}>
              Enviamos a <strong>todo Venezuela</strong> a través de la agencia de encomiendas
              que tú prefieras.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
              <li style={{ marginBottom: '10px' }}>✅ <b>MRW, Tealca, Zoom, Domesa</b> y cualquier agencia de tu elección</li>
              <li style={{ marginBottom: '10px' }}>✅ El costo de envío lo cancela el <b>destinatario</b> al retirar</li>
              <li style={{ marginBottom: '10px' }}>✅ Te enviamos el <b>número de guía</b> para que puedas rastrear tu pedido</li>
              <li style={{ marginBottom: '10px' }}>✅ Empacamos con cuidado para que tu peluche llegue <b>impecable</b></li>
            </ul>
          </div>

          {/* Delivery Maracaibo */}
          <div className="card cyber-card value-card" style={{ borderTop: '3px solid #00f2ff' }}>
            <h2 style={{ marginBottom: '12px' }}>🛵 Delivery en Maracaibo</h2>
            <p style={{ marginBottom: '16px' }}>
              ¿Estás en Maracaibo? Te lo llevamos directo a tu puerta con un <strong>costo adicional de delivery</strong>.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
              <li style={{ marginBottom: '10px' }}>✅ Cobertura a <b>toda Maracaibo</b></li>
              <li style={{ marginBottom: '10px' }}>✅ Coordinamos el costo según tu <b>zona y distancia</b></li>
              <li style={{ marginBottom: '10px' }}>✅ Entrega <b>rápida</b>, coordinamos el horario contigo</li>
              <li style={{ marginBottom: '10px' }}>✅ Pago al momento de la entrega o <b>transferencia previa</b></li>
            </ul>
          </div>

        </div>
      </section>

      {/* CÓMO PEDIR */}
      <section className="section-container fade-in-up delay-2">
        <div className="about-box">
          <h2 style={{ marginBottom: '20px' }}>¿Cómo hago mi pedido?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>1️⃣</span>
              <p><b>Elige tu peluche</b> desde nuestra tienda y anota el producto que quieres.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>2️⃣</span>
              <p><b>Escríbenos por WhatsApp o Instagram</b> con tu pedido, nombre completo y ciudad de destino.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>3️⃣</span>
              <p><b>Coordina el pago</b> — te indicamos los métodos disponibles (Pago Móvil, Zelle, etc.).</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>4️⃣</span>
              <p><b>¡Listo!</b> Procesamos tu pedido y te enviamos la guía o coordinamos el delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container fade-in-up delay-3" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '24px', color: 'var(--soft-lila)' }}>
          ¿Tienes dudas sobre el envío? ¡Escríbenos!
        </p>
        <a
          href="https://wa.me/584120445559?text=Hola%20Pixel%20%26%20Plush!%20Quiero%20hacer%20un%20pedido..."
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp"
          style={{ display: 'inline-block', padding: '15px 40px' }}
        >
          💬 Preguntar por WhatsApp
        </a>
      </section>

    </main>
  );
}

export default NosotrosPage;
