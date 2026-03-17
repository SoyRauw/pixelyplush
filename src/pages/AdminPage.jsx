import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState('plushies'); // 'plushies' or 'purchases'
  const [plushies, setPlushies] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '', stock: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [invoiceCustomer, setInvoiceCustomer] = useState({ name: '', cedula: '' });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedPlushieId, setSelectedPlushieId] = useState('');
  const invoiceTotal = invoiceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const navigate = useNavigate();

  // Mantener sesión admin durante la visita
  useEffect(() => {
    const session = sessionStorage.getItem('px_admin');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'plushies') {
        fetchPlushies();
      } else {
        fetchPurchases();
      }
    }
  }, [isAuthenticated, activeTab]);

  const fetchPlushies = async () => {
    const { data } = await supabase
      .from('plushies')
      .select('*')
      .order('name', { ascending: true });
    setPlushies(data || []);
  };

  const fetchPurchases = async () => {
    const { data } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    setPurchases(data || []);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Auto-completar el correo
    const fullEmail = username.includes('@') ? username : `${username}@gmail.com`;

    // Auth con el SDK de Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: fullEmail,
      password: password,
    });

    if (error) {
      setPasswordError('❌ Usuario o clave incorrectos');
    } else if (data.session) {
      setIsAuthenticated(true);
      sessionStorage.setItem('px_admin', 'true');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('px_admin');
    setIsAuthenticated(false);
    navigate('/leaderboard');
  };

  const handleAddPlushie = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { name, price, image, stock } = form;
    if (!name || price === '' || !image || stock === '') {
      setFormError('Completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock);
    const imagePath = image.startsWith('/pixelyplush/assets/') ? image : `/pixelyplush/assets/${image}`;
    
    const { error } = await supabase
      .from('plushies')
      .insert([{ 
        name, 
        price: numericPrice, 
        price_text: `$${numericPrice.toFixed(2)}`,
        image: imagePath,
        stock: numericStock
      }]);
    setLoading(false);

    if (error) {
      setFormError('Error al guardar: ' + error.message);
    } else {
      setFormSuccess(`✅ ¡${name} agregado al inventario!`);
      setForm({ name: '', price: '', image: '', stock: '' });
      fetchPlushies();
    }
  };

  const handleDeletePlushie = async (id, name) => {
    if (!confirm(`¿Eliminar el peluche ${name}?`)) return;
    await supabase.from('plushies').delete().eq('id', id);
    fetchPlushies();
  };

  const handleAddInvoiceItem = () => {
    if (!selectedPlushieId) return;
    const plush = plushies.find(p => p.id === selectedPlushieId);
    if (!plush) return;
    
    const existing = invoiceItems.find(i => i.id === plush.id);
    if (existing) {
       if (existing.quantity >= plush.stock) {
           alert("No hay suficiente stock");
           return;
       }
       setInvoiceItems(invoiceItems.map(i => i.id === plush.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
       setInvoiceItems([...invoiceItems, { id: plush.id, name: plush.name, price: plush.price, quantity: 1, maxStock: plush.stock }]);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (invoiceItems.length === 0) {
      alert("Añade al menos un peluche a la factura");
      return;
    }
    setLoading(true);
    
    const now = new Date();
    const localTimestamp = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ');

    const purchaseData = {
      items: {
         customerName: invoiceCustomer.name || "Consumidor Final",
         customerCedula: invoiceCustomer.cedula || "N/A",
         products: invoiceItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }))
      },
      total_amount: invoiceTotal,
      status: 'completado',
      created_at: localTimestamp
    };

    const { error } = await supabase.from('purchases').insert([purchaseData]);
    
    if (!error) {
       for (const item of invoiceItems) {
          if (item.maxStock !== undefined) {
             const newStock = Math.max(0, item.maxStock - item.quantity);
             await supabase.from('plushies').update({ stock: newStock }).eq('id', item.id);
          }
       }
       fetchPlushies();
       fetchPurchases();
       alert("✅ Factura registrada exitosamente");
       setInvoiceCustomer({ name: '', cedula: '' });
       setInvoiceItems([]);
       setSelectedPlushieId('');
    } else {
       alert("Error: " + error.message);
    }
    setLoading(false);
  };

  // --- PANTALLA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <main style={{ paddingTop: '80px' }}>
        <section className="section-container">
          <div className="admin-login-box">
            <div className="admin-login-icon">🔐</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Panel Administrador</h2>
            <p style={{ color: '#aaa', marginBottom: '30px' }}>Ingresa tus credenciales para continuar</p>
            <form onSubmit={handleLogin} className="admin-login-form">
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input"
                autoFocus
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                style={{ marginTop: '15px' }}
              />
              {passwordError && <p className="admin-error">{passwordError}</p>}
              <button type="submit" className="btn">Ingresar</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  // --- PANEL ADMIN ---
  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>🛠️ Panel Admin</h2>
          <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>
            Cerrar sesión
          </button>
        </div>

        {/* TABS MENU */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button 
            className={`btn ${activeTab === 'plushies' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('plushies')}
          >
            🧸 Inventario Peluches
          </button>
          <button 
            className={`btn ${activeTab === 'purchases' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('purchases')}
          >
            💰 Compras Recientes
          </button>
        </div>

        {activeTab === 'plushies' && (
          <>
            {/* FORMULARIO AGREGAR PELUCHE */}
            <div className="admin-card">
              <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
                ➕ Agregar Peluche
              </h3>
              <form onSubmit={handleAddPlushie} className="admin-form">
                <div className="admin-form-group">
                  <label>Nombre del Peluche</label>
                  <input
                    type="text"
                    placeholder="Ej: Pikachu 25cm"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="admin-form-group">
                    <label>Precio (Ej: 15.00)</label>
                    <input
                      type="number" step="0.01" min="0" placeholder="15.00"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Stock</label>
                    <input
                      type="number" min="0" placeholder="10"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Nombre Imagen</label>
                    <input
                      type="text" placeholder="Ej: pikachu.webp"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>
                
                {formError && <p className="admin-error">{formError}</p>}
                {formSuccess && <p className="admin-success">{formSuccess}</p>}
                <button type="submit" className="btn" disabled={loading} style={{ marginTop: '15px' }}>
                  {loading ? 'Guardando...' : '🧸 Registrar Peluche'}
                </button>
              </form>
            </div>

            {/* TABLA DE PELUCHES */}
            <div className="admin-card" style={{ marginTop: '30px' }}>
              <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
                📋 Inventario Actual ({plushies.length})
              </h3>
              {plushies.length === 0 ? (
                <p style={{ color: '#aaa' }}>No hay peluches registrados aún.</p>
              ) : (
                <div className="lb-table-wrapper">
                  <table className="lb-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plushies.map((plush) => (
                        <tr key={plush.id}>
                          <td className="lb-pos">
                            <img src={plush.image} alt={plush.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                          </td>
                          <td className="lb-pilot">{plush.name}</td>
                          <td className="lb-time">{plush.price_text}</td>
                          <td className="lb-time">{plush.stock}</td>
                          <td>
                            <button
                              className="admin-delete-btn"
                              onClick={() => handleDeletePlushie(plush.id, plush.name)}
                            >
                              ❌
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'purchases' && (
          <>
            {/* FORMULARIO AGREGAR COMPRA */}
            <div className="admin-card">
              <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
                📝 Emitir Factura
              </h3>
              <div className="admin-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="admin-form-group">
                    <label>Nombre del Cliente</label>
                    <input 
                      type="text" className="admin-input" 
                      value={invoiceCustomer.name} onChange={e => setInvoiceCustomer({...invoiceCustomer, name: e.target.value})}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Cédula</label>
                    <input 
                      type="text" className="admin-input" 
                      value={invoiceCustomer.cedula} onChange={e => setInvoiceCustomer({...invoiceCustomer, cedula: e.target.value})}
                      placeholder="Ej: 25123456"
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: '20px' }}>
                  <label>Agregar Peluches a la Factura</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                      className="admin-input" 
                      value={selectedPlushieId} 
                      onChange={e => setSelectedPlushieId(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">Selecciona un peluche...</option>
                      {plushies.filter(p => p.stock > 0).map(p => (
                         <option key={p.id} value={p.id}>{p.name} (${p.price}) - Disp: {p.stock}</option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-outline" onClick={handleAddInvoiceItem}>
                      ➕ Añadir
                    </button>
                  </div>
                </div>

                {invoiceItems.length > 0 && (
                  <div style={{ marginTop: '20px', background: '#1e1e1e', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#aaa', marginBottom: '10px' }}>Detalle de Factura</h4>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #333' }}>
                          <th style={{ padding: '8px' }}>Producto</th>
                          <th style={{ padding: '8px' }}>Cant.</th>
                          <th style={{ padding: '8px' }}>Subtotal</th>
                          <th style={{ padding: '8px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '8px' }}>{item.name}</td>
                            <td style={{ padding: '8px' }}>
                              <input 
                                type="number" min="1" max={item.maxStock} className="admin-input" 
                                style={{ width: '60px', padding: '4px' }}
                                value={item.quantity}
                                onChange={(e) => {
                                   const val = parseInt(e.target.value) || 1;
                                   if (val > item.maxStock) {
                                       alert(`El stock máximo es ${item.maxStock}`);
                                       return;
                                   }
                                   setInvoiceItems(invoiceItems.map(i => i.id === item.id ? { ...i, quantity: val } : i));
                                }}
                              />
                            </td>
                            <td style={{ padding: '8px', color: 'var(--accent-glow)' }}>${(item.price * item.quantity).toFixed(2)}</td>
                            <td style={{ padding: '8px' }}>
                              <button type="button" style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem' }}
                                onClick={() => setInvoiceItems(invoiceItems.filter(i => i.id !== item.id))}
                              >✖</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      Total a Cobrar: <span style={{ color: 'var(--accent-glow)' }}>${invoiceTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button type="button" onClick={handleCreateInvoice} className="btn" disabled={loading || invoiceItems.length === 0} style={{ marginTop: '20px', width: '100%' }}>
                  {loading ? 'Procesando...' : '💰 Procesar y Guardar Venta'}
                </button>
              </div>
            </div>

            <div className="admin-card" style={{ marginTop: '30px' }}>
              <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
                🛍️ Registro de Compras ({purchases.length})
              </h3>
              {purchases.length === 0 ? (
                <p style={{ color: '#aaa' }}>No hay compras registradas aún.</p>
              ) : (
                <div className="lb-table-wrapper">
                  <table className="lb-table" style={{ width: '100%', fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Artículos / Descripción</th>
                        <th>Total</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => {
                        const items = purchase.items || [];
                        let description = '';
                        let clientInfo = '-';
                        
                        if (Array.isArray(items)) {
                          // Old format
                          description = items.map(item => item.quantity ? `${item.quantity}x ${item.name}` : item.name).join('\n');
                        } else if (items.products) {
                          // New format (Factura)
                          clientInfo = `${items.customerName}\nC.I: ${items.customerCedula}`;
                          description = items.products.map(item => `${item.quantity}x ${item.name}`).join('\n');
                        }

                        return (
                          <tr key={purchase.id}>
                            <td className="lb-date">
                              {new Date(purchase.created_at).toLocaleString('es-VE')}
                            </td>
                            <td className="lb-pilot" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                              {clientInfo}
                            </td>
                            <td className="lb-pilot" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                              {description}
                            </td>
                            <td className="lb-time" style={{ color: 'var(--accent-glow)' }}>
                              ${purchase.total_amount?.toFixed(2)}
                            </td>
                            <td>
                              <button
                                className="admin-delete-btn"
                                onClick={async () => {
                                  if(!confirm('¿Borrar este registro?')) return;
                                  await supabase.from('purchases').delete().eq('id', purchase.id);
                                  fetchPurchases();
                                }}
                              >
                                ❌
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminPage;
