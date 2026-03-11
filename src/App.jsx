import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import NosotrosPage from './pages/NosotrosPage';
import TiendaPage from './pages/TiendaPage';
import CyberPage from './pages/CyberPage';
import ContactoPage from './pages/ContactoPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <HashRouter>
      <div className="app-layout">
        <Header />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/tienda" element={<TiendaPage />} />
            <Route path="/cyber" element={<CyberPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
