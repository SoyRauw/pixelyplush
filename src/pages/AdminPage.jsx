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
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [invoiceCustomer, setInvoiceCustomer] = useState({ name: '', cedula: '' });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedPlushieId, setSelectedPlushieId] = useState('');
  const invoiceTotal = invoiceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Leaderboard states
  const [records, setRecords] = useState([]);
  const [recordForm, setRecordForm] = useState({ name: '', min: '0', sec: '0', ms: '0' });

  const navigate = useNavigate();

  // Mantener sesión admin durante la visita
  useEffect(() => {
    const session = sessionStorage.getItem('px_admin');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'plushies') fetchPlushies();
      else if (activeTab === 'purchases') fetchPurchases();
      else if (activeTab === 'leaderboard') fetchLeaderboard();
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

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .order('tiempo', { ascending: true });
    setRecords(data || []);
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

  const handleSavePlushie = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { name, price, stock, description } = form;
    if (!name || price === '' || stock === '' || !description.trim()) {
      setFormError('Completa todos los campos obligatorios (incluyendo la descripción).');
      return;
    }

    if (!editingId && !imageFile) {
      setFormError('La imagen es obligatoria para agregar un nuevo peluche.');
      return;
    }

    setLoading(true);
    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock);

    try {
      let imageUrl = null;

      // 1. Upload image to Supabase Storage if a new image was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Insert or update database
      const plushieData = {
        name,
        price: numericPrice,
        price_text: `$${numericPrice.toFixed(2)}`,
        stock: numericStock,
        description: description.trim()
      };

      if (imageUrl) {
        plushieData.image = imageUrl;
      }

      if (editingId) {
        const { error: dbError } = await supabase
          .from('plushies')
          .update(plushieData)
          .eq('id', editingId);

        if (dbError) throw dbError;

        setFormSuccess(`✅ ¡${name} actualizado correctamente!`);
      } else {
        const { error: dbError } = await supabase
          .from('plushies')
          .insert([plushieData]);

        if (dbError) throw dbError;

        setFormSuccess(`✅ ¡${name} agregado al inventario!`);
      }

      setForm({ name: '', price: '', stock: '', description: '' });
      setImageFile(null);
      setEditingId(null);
      const fileInput = document.getElementById('imageFileInput');
      if (fileInput) fileInput.value = '';
      fetchPlushies();
    } catch (err) {
      setFormError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (plushie) => {
    setEditingId(plushie.id);
    setForm({
      name: plushie.name,
      price: plushie.price,
      stock: plushie.stock,
      description: plushie.description || ''
    });
    setImageFile(null);
    const fileInput = document.getElementById('imageFileInput');
    if (fileInput) fileInput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '', stock: '', description: '' });
    setImageFile(null);
    const fileInput = document.getElementById('imageFileInput');
    if (fileInput) fileInput.value = '';
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

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { name, min, sec, ms } = recordForm;
    const m = parseInt(min) || 0;
    const s = parseInt(sec) || 0;
    const mili = parseInt(ms) || 0;
    
    if (!name || (m === 0 && s === 0 && mili === 0)) {
      setFormError('Ingresa un piloto y un tiempo válido.');
      return;
    }

    const totalMs = (m * 60000) + (s * 1000) + mili;
    setLoading(true);

    const { error } = await supabase
      .from('leaderboard')
      .insert([{ name, tiempo: totalMs }]);

    setLoading(false);

    if (error) {
      setFormError('Error al guardar: ' + error.message);
    } else {
      setFormSuccess('¡Tiempo registrado exitosamente!');
      setRecordForm({ name: '', min: '0', sec: '0', ms: '0' });
      fetchLeaderboard();
    }
  };

  const handleDeleteRecord = async (id, name) => {
    if (!confirm(`¿Eliminar el récord de ${name}?`)) return;
    await supabase.from('leaderboard').delete().eq('id', id);
    fetchLeaderboard();
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
        <div className="admin-header">
          <h2 className="section-title" style={{ margin: 0 }}>🛠️ Panel Admin</h2>
          <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>
            Cerrar sesión
          </button>
        </div>

        {/* TABS MENU */}
        <div className="admin-tabs">
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
          <button 
            className={`btn ${activeTab === 'leaderboard' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏁 Simulador Racing
          </button>
        </div>

        {activeTab === 'plushies' && (
          <>
            {/* FORMULARIO AGREGAR PELUCHE */}
            <div className="admin-card">
              <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
                {editingId ? '✏️ Editar Peluche' : '➕ Agregar Peluche'}
              </h3>
              <form onSubmit={handleSavePlushie} className="admin-form">
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
                <div className="admin-form-group">
                  <label>Descripción *</label>
                  <textarea
                    placeholder="Ej: Peluche suave de Pikachu de 25cm, edición primera generación."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="admin-input"
                    rows={4}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                  />
                </div>
                <div className="admin-grid-3">
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
                    <label>Imagen del Peluche {editingId ? '(opcional al editar)' : '*'}</label>
                    <input
                      type="file"
                      id="imageFileInput"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="admin-input"
                      style={{ padding: '8px' }}
                    />
                  </div>
                </div>

                {formError && <p className="admin-error">{formError}</p>}
                {formSuccess && <p className="admin-success">{formSuccess}</p>}
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                  <button type="submit" className="btn" disabled={loading} style={{ flex: '1 1 auto' }}>
                    {loading ? 'Guardando...' : editingId ? '💾 Actualizar Peluche' : '🧸 Registrar Peluche'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline" onClick={handleCancelEdit} style={{ flex: '0 0 auto' }}>
                      Cancelar
                    </button>
                  )}
                </div>
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
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plushies.map((plush) => (
                        <tr key={plush.id}>
                          <td className="lb-pos" data-label="Imagen">
                            <img src={plush.image?.replace('/pixelyplush/assets/', '/assets/') || plush.image} alt={plush.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                          </td>
                          <td className="lb-pilot" data-label="Nombre">{plush.name}</td>
                          <td className="lb-pilot" data-label="Descripción" style={{ fontSize: '0.8rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {plush.description || '-'}
                          </td>
                          <td className="lb-time" data-label="Precio">{plush.price_text}</td>
                          <td className="lb-time" data-label="Stock">{plush.stock}</td>
                          <td data-label="Acción">
                            <button
                              className="admin-delete-btn"
                              onClick={() => handleEditClick(plush)}
                              style={{ marginRight: '8px' }}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="admin-delete-btn"
                              onClick={() => handleDeletePlushie(plush.id, plush.name)}
                              title="Eliminar"
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
                <div className="admin-grid-2">
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
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select 
                      className="admin-input" 
                      value={selectedPlushieId} 
                      onChange={e => setSelectedPlushieId(e.target.value)}
                      style={{ flex: '1 1 200px' }}
                    >
                      <option value="">Selecciona un peluche...</option>
                      {plushies.filter(p => p.stock > 0).map(p => (
                         <option key={p.id} value={p.id}>{p.name} (${p.price}) - Disp: {p.stock}</option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-outline" onClick={handleAddInvoiceItem} style={{ flex: '1 1 100px' }}>
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
                            <td className="lb-date" data-label="Fecha">
                              {new Date(purchase.created_at).toLocaleString('es-VE')}
                            </td>
                            <td className="lb-pilot" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }} data-label="Cliente">
                              {clientInfo}
                            </td>
                            <td className="lb-pilot" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }} data-label="Descripción">
                              {description}
                            </td>
                            <td className="lb-time" style={{ color: 'var(--accent-glow)' }} data-label="Total">
                              ${purchase.total_amount?.toFixed(2)}
                            </td>
                            <td data-label="Acción">
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

        {activeTab === 'leaderboard' && (
          <>
            <div className="admin-card">
              <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
                ➕ Agregar Nuevo Récord
              </h3>
              <form onSubmit={handleAddRecord} className="admin-form">
                <div className="admin-form-group">
                  <label>Nombre del Piloto / Steam</label>
                  <input
                    type="text"
                    placeholder="Ej: SpeedDemon_99"
                    value={recordForm.name}
                    onChange={(e) => setRecordForm({ ...recordForm, name: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-grid-3">
                  <div className="admin-form-group">
                    <label>Minutos</label>
                    <input
                      type="number" min="0" max="60"
                      value={recordForm.min}
                      onChange={(e) => setRecordForm({ ...recordForm, min: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Segundos</label>
                    <input
                      type="number" min="0" max="59"
                      value={recordForm.sec}
                      onChange={(e) => setRecordForm({ ...recordForm, sec: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Milisegundos</label>
                    <input
                      type="number" min="0" max="999"
                      value={recordForm.ms}
                      onChange={(e) => setRecordForm({ ...recordForm, ms: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>
                {formError && <p className="admin-error">{formError}</p>}
                {formSuccess && <p className="admin-success">{formSuccess}</p>}
                <button type="submit" className="btn" disabled={loading} style={{ marginTop: '15px' }}>
                  {loading ? 'Guardando...' : 'Guardar Récord'}
                </button>
              </form>
            </div>

            <div className="admin-card" style={{ marginTop: '30px' }}>
              <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
                📋 Tiempos Registrados ({records.length})
              </h3>
              {records.length === 0 ? (
                <p style={{ color: '#aaa' }}>No hay registros de tabla de clasificación todavía.</p>
              ) : (
                <div className="lb-table-wrapper">
                  <table className="lb-table" style={{ width: '100%', fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Posición</th>
                        <th>Piloto</th>
                        <th>Tiempo (mins:secs.ms)</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((rec, idx) => {
                         const totalSec = Math.floor(rec.tiempo / 1000);
                         const min = Math.floor(totalSec / 60);
                         const sec = totalSec % 60;
                         const ms = rec.tiempo % 1000;
                         const timeStr = `${min}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
                         return (
                           <tr key={rec.id}>
                             <td className="lb-pos" style={{ fontWeight: 'bold' }} data-label="Posición">{idx + 1}</td>
                             <td className="lb-pilot" data-label="Piloto">{rec.name}</td>
                             <td className="lb-time" style={{ color: 'var(--accent-glow)' }} data-label="Tiempo">{timeStr}</td>
                             <td data-label="Acción">
                               <button
                                 className="admin-delete-btn"
                                 onClick={() => handleDeleteRecord(rec.id, rec.name)}
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
