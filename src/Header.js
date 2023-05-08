import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header>
      <h1>Pub Golf</h1>
      <button className="hamburger" onClick={() => setNavOpen(!navOpen)}>
        &#9776;
      </button>
      <nav className={navOpen ? 'open' : 'nav-closed'}>
        <ul>
          <li>
            <NavLink to="/leaderboard" onClick={() => setNavOpen(false)}>
              Leaderboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/course" onClick={() => setNavOpen(false)}>
              Course
            </NavLink>
          </li>
          <li>
            <NavLink to="/management" onClick={() => setNavOpen(false)}>
              Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/rules" onClick={() => setNavOpen(false)}>
              Rules
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
