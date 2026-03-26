import React from 'react';

function NosotrosPage() {
  return (
    <main className="nosotros-page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      
      {/* --- BLOQUE 1: IDENTIFICACIÓN Y RESUMEN EJECUTIVO --- */}
      <section className="section-container fade-in-up">
        <h1 className="section-title">Plan Maestro: Pixel & Plush</h1>
        <p className="subtitle">Entretenimiento Tecnológico y Retail Temático en URBE</p>
        <div className="about-box">
          <h3>Resumen Ejecutivo</h3>
          <p>
            Pixel & Plush es una iniciativa empresarial estratégica enfocada en la convergencia del entretenimiento digital y el coleccionismo. 
            Combinamos la vanguardia de la Realidad Virtual (VR) y consolas de última generación con una tienda retail especializada en 
            peluches de Pokémon y Anime, atendiendo a un mercado creciente de gamers y coleccionistas en Maracaibo.
          </p>
        </div>
      </section>

      {/* --- BLOQUE 2: FILOSOFÍA CORPORATIVA --- */}
      <section className="section-container mission-vision-container fade-in-up delay-1">
        <div className="about-box mission-box">
          <h2>Misión</h2>
          <p>
            Brindar una experiencia tecnológica y cultural inmersiva a través de la realidad virtual y el coleccionismo temático, 
            ofreciendo a la comunidad gamer y otaku un espacio seguro e innovador que fusiona el entretenimiento digital con 
            la exclusividad de productos tangibles.
          </p>
        </div>
        <div className="about-box vision-box">
          <h2>Visión</h2>
          <p>
            Convertirnos para el próximo año en la zona gamer más conocida en la Universidad "Dr. Rafael Belloso Chacín", 
            liderando la adopción de nuevas tecnologías recreativas y consolidándose como la tienda retail predilecta para 
            aficionados al Pokémon en URBE.
          </p>
        </div>
      </section>

      {/* --- BLOQUE 3: VALORES Y OBJETIVOS ESTRATÉGICOS --- */}
      <section className="section-container fade-in-up delay-2">
        <h2 className="section-title">Fundamentos del Negocio</h2>
        <div className="values-grid">
          <div className="card cyber-card value-card">
            <h3>Valores</h3>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
              <li>🚀 <b>Innovación:</b> Tendencias constantes en VR.</li>
              <li>🤝 <b>Comunidad:</b> Entorno seguro para el nicho.</li>
              <li>💎 <b>Calidad:</b> Mercancía de alta gama.</li>
              <li>🛡️ <b>Resiliencia:</b> Adaptabilidad operativa.</li>
            </ul>
          </div>
          <div className="card cyber-card value-card">
            <h3>Objetivos (6-12 meses)</h3>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
              <li>🔗 Alianzas con proveedores de hardware.</li>
              <li>📈 Lograr punto de equilibrio operativo.</li>
              <li>🎟️ Implementar sistema de pases VIP.</li>
              <li>📱 Viralización en Instagram.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- BLOQUE 4: ANÁLISIS DE MERCADO Y DIFERENCIACIÓN --- */}
      <section className="section-container fade-in-up delay-2">
        <div className="about-box">
          <h2>Propuesta de Valor y Ventaja Competitiva</h2>
          <p style={{ marginBottom: '20px' }}>
            Nuestra diferenciación se basa en tres pilares que nos posicionan por encima de alternativas como Amazon o Mercado Libre:
          </p>
          <div className="values-grid">
            <div style={{ textAlign: 'left' }}>
              <h4>Accesibilidad</h4>
              <p>Precios competitivos en retail ofreciendo peluches de gama media y alta de forma inmediata.</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4>Ubicación Estratégica</h4>
              <p>Presencia física directa en la universidad, eliminando costos de envío y tiempos de espera.</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4>Experiencia Híbrida</h4>
              <p>Ocio inmediato mediante tecnología propia combinado con la compra impulsiva de coleccionables.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BLOQUE 5: PLAN OPERATIVO Y FINANCIERO --- */}
      <section className="section-container fade-in-up delay-3">
        <h2 className="section-title">Estructura Operativa</h2>
        <div className="values-grid">
          <div className="card cyber-card value-card" style={{ borderTop: '3px solid gold' }}>
            <h3>Inversión y Finanzas</h3>
            <p><b>Capital Inicial:</b> $240.00 (Inventario y equipos).</p>
            <p><b>Gastos Op:</b> $40.00 (Logística de evento/local).</p>
            <p><b>Proyección:</b> $50.00 ingresos/jornada con meta de ganancia neta de $25.00.</p>
          </div>
          <div className="card cyber-card value-card" style={{ borderTop: '3px solid #00f2ff' }}>
            <h3>Marketing Viral</h3>
            <p>Uso intensivo de redes sociales para mostrar la experiencia inmersiva y organización de torneos con premios del stock de peluches.</p>
          </div>
        </div>
      </section>

      {/* --- BLOQUE 6: EL EQUIPO Y CONTACTO --- */}
      <section className="section-container fade-in-up delay-3">
        <div className="about-box team-box">
          <h2>Liderazgo del Proyecto</h2>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <h3 style={{ color: 'var(--soft-lila)' }}>Raúl Martínez</h3>
              <p><b>Soporte Técnico</b></p>
              <p style={{ fontSize: '0.85rem' }}>Encargado del mantenimiento, asesoría de equipos y optimización de hardware.</p>
            </div>
            <div>
              <h3 style={{ color: 'var(--soft-lila)' }}>Camila Polo</h3>
              <p><b>Asesora de Ventas</b></p>
              <p style={{ fontSize: '0.85rem' }}>Líder en gestión de clientes, promoción y estrategias de marketing viral.</p>
            </div>
          </div>
          
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--glass)', paddingTop: '20px' }}>
            <p>📍 <b>Sede:</b> Campus URBE, Maracaibo, Venezuela.</p>
            <p>📧 <b>Email:</b> pixelxplush@gmail.com | 📸 <b>IG:</b> @pixelxplush</p>
          </div>
        </div>
      </section>

      {/* --- CONCLUSIÓN DEL PLAN --- */}
      <section className="section-container fade-in-up delay-3" style={{ opacity: 0.8 }}>
        <p><i>
          "El proyecto presenta una viabilidad sólida debido a su baja estructura de costos fijos y una ubicación estratégica. 
          La combinación de servicios de bajo costo (juegos) con productos de alto margen (peluches) asegura un flujo de caja constante."
        </i></p>
      </section>

    </main>
  );
}

export default NosotrosPage;