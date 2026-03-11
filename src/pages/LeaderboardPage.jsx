import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const MEDALS = ['🥇', '🥈', '🥉'];

function LeaderboardPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('tiempo', { ascending: true });

    if (!error) setRecords(data || []);
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-VE');
  };

  const formatTime = (timeMs) => {
    if (!timeMs) return '0:00.000';
    const totalSec = Math.floor(timeMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const ms = timeMs % 1000;
    return `${min}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="section-container">
        <h2 className="section-title">🏁 Leaderboard</h2>
        <p style={{ marginBottom: '40px', fontSize: '1.1rem', color: 'var(--soft-lila)' }}>
          Clasificación oficial del simulador · Mejores tiempos de vuelta
        </p>

        {loading ? (
          <div className="lb-loading">Cargando tiempos...</div>
        ) : records.length === 0 ? (
          <div className="lb-empty">
            <p>🏎️ Aún no hay tiempos registrados.</p>
            <p style={{ color: '#aaa', marginTop: '10px', fontSize: '0.95rem' }}>
              El admin puede agregar resultados desde el{' '}
              <Link to="/admin" style={{ color: 'var(--soft-lila)' }}>panel de administración</Link>.
            </p>
          </div>
        ) : (
          <div className="lb-table-wrapper">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Piloto</th>
                  <th>⏱ Tiempo</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => (
                  <tr key={rec.id} className={idx < 3 ? `lb-top-${idx + 1}` : ''}>
                    <td className="lb-pos">
                      {idx < 3 ? MEDALS[idx] : idx + 1}
                    </td>
                    <td className="lb-pilot">{rec.name || 'Piloto Anónimo'}</td>
                    <td className="lb-time">{formatTime(rec.tiempo)}</td>
                    <td className="lb-date">{formatDate(rec.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <br /><br />
        <Link to="/admin" className="btn btn-outline" style={{ fontSize: '1rem' }}>
          🔐 Panel Admin
        </Link>
      </section>
    </main>
  );
}

export default LeaderboardPage;
