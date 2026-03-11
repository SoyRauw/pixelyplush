import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ pilot_name: '', minutes: '', seconds: '', milliseconds: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mantener sesión admin durante la visita
  useEffect(() => {
    const session = sessionStorage.getItem('px_admin');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchRecords();
  }, [isAuthenticated]);

  const fetchRecords = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .order('tiempo', { ascending: true });
    setRecords(data || []);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Auth con el SDK de Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setPasswordError('❌ Credenciales incorrectas');
    } else if (data.session) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/leaderboard');
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { pilot_name, minutes, seconds, milliseconds } = form;
    if (!pilot_name || minutes === '' || seconds === '' || milliseconds === '') {
      setFormError('Completa todos los campos.');
      return;
    }

    const min = parseInt(minutes);
    const sec = parseInt(seconds);
    const ms = parseInt(milliseconds);

    if (sec >= 60 || ms >= 1000) {
      setFormError('Segundos deben ser < 60 y milisegundos < 1000');
      return;
    }

    const lap_time_ms = min * 60000 + sec * 1000 + ms;
    const lap_time_display = `${min}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;

    setLoading(true);
    const { error } = await supabase
      .from('leaderboard')
      .insert([{ name: pilot_name, tiempo: lap_time_ms }]);
    setLoading(false);

    if (error) {
      setFormError('Error al guardar: ' + error.message);
    } else {
      setFormSuccess(`✅ ¡${pilot_name} agregado con tiempo ${lap_time_display}!`);
      setForm({ pilot_name: '', minutes: '', seconds: '', milliseconds: '' });
      fetchRecords();
    }
  };

  const handleDelete = async (id, pilotName) => {
    if (!confirm(`¿Eliminar el registro de ${pilotName}?`)) return;
    await supabase.from('leaderboard').delete().eq('id', id);
    fetchRecords();
  };

  const formatTime = (timeMs) => {
    if (!timeMs) return '0:00.000';
    const totalSec = Math.floor(timeMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const ms = timeMs % 1000;
    return `${min}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
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
                type="email"
                placeholder="Correo electrónico..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                autoFocus
              />
              <input
                type="password"
                placeholder="Contraseña..."
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

        {/* FORMULARIO AGREGAR */}
        <div className="admin-card">
          <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
            ➕ Agregar tiempo de vuelta
          </h3>
          <form onSubmit={handleAddRecord} className="admin-form">
            <div className="admin-form-group">
              <label>Nombre del Piloto</label>
              <input
                type="text"
                placeholder="Ej: Carlos Sainz"
                value={form.pilot_name}
                onChange={(e) => setForm({ ...form, pilot_name: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-time">
              <div className="admin-form-group">
                <label>Minutos</label>
                <input
                  type="number" min="0" max="59" placeholder="1"
                  value={form.minutes}
                  onChange={(e) => setForm({ ...form, minutes: e.target.value })}
                  className="admin-input admin-input--short"
                />
              </div>
              <span className="admin-time-sep">:</span>
              <div className="admin-form-group">
                <label>Segundos</label>
                <input
                  type="number" min="0" max="59" placeholder="23"
                  value={form.seconds}
                  onChange={(e) => setForm({ ...form, seconds: e.target.value })}
                  className="admin-input admin-input--short"
                />
              </div>
              <span className="admin-time-sep">.</span>
              <div className="admin-form-group">
                <label>Milisegundos</label>
                <input
                  type="number" min="0" max="999" placeholder="456"
                  value={form.milliseconds}
                  onChange={(e) => setForm({ ...form, milliseconds: e.target.value })}
                  className="admin-input admin-input--short"
                />
              </div>
            </div>
            {formError && <p className="admin-error">{formError}</p>}
            {formSuccess && <p className="admin-success">{formSuccess}</p>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Guardando...' : '🏁 Registrar Tiempo'}
            </button>
          </form>
        </div>

        {/* TABLA DE REGISTROS */}
        <div className="admin-card" style={{ marginTop: '30px' }}>
          <h3 style={{ color: 'var(--soft-lila)', marginBottom: '20px', fontSize: '1.4rem' }}>
            📋 Registros actuales ({records.length})
          </h3>
          {records.length === 0 ? (
            <p style={{ color: '#aaa' }}>No hay registros aún.</p>
          ) : (
            <div className="lb-table-wrapper">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Piloto</th>
                    <th>Tiempo</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr key={rec.id}>
                      <td className="lb-pos">{idx + 1}</td>
                      <td className="lb-pilot">{rec.name || 'Piloto Anónimo'}</td>
                      <td className="lb-time">{formatTime(rec.tiempo)}</td>
                      <td className="lb-date">
                        {new Date(rec.created_at).toLocaleDateString('es-VE')}
                      </td>
                      <td>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDelete(rec.id, rec.name)}
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
      </section>
    </main>
  );
}

export default AdminPage;
