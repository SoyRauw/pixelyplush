import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
              Qué Hacemos
            </NavLink>
          </li>
          <li>
            <NavLink to="/tienda" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              Peluches
            </NavLink>
          </li>
          <li>
            <NavLink to="/cyber" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              CyberZone
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacto" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              Contacto
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              🏁 Leaderboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active admin-link' : 'admin-link'} onClick={() => setMenuOpen(false)}>
              🔐 Admin
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
