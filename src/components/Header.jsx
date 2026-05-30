import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, toggleSidebar } = useCart();
  const navigate = useNavigate();

  // Atajo secreto Ctrl+Shift+A para abrir el panel de admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        navigate('/admin');
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <header>
      <div className="logo">Pixel &amp; Plush</div>
      <nav>
        <div
          className="menu-toggle"
          id="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul id="nav-list" className={menuOpen ? 'active' : ''}>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/nosotros" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              Envíos
            </NavLink>
          </li>
          <li>
            <NavLink to="/tienda" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              Peluches
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacto" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              Contacto
            </NavLink>
          </li>
          <li>
            <button className="cart-icon-btn" onClick={toggleSidebar}>
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
