import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import NosotrosPage from './pages/NosotrosPage';
import TiendaPage from './pages/TiendaPage';
import ContactoPage from './pages/ContactoPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import CartSidebar from './components/CartSidebar';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-layout">
          <Header />
          <CartSidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/tienda" element={<TiendaPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
