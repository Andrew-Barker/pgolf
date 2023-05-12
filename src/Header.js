import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { getAuth, signOut } from "firebase/auth";
import { getClaims } from "./utils/helper";



const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    getClaims(auth).then((adminStatus) => {
      setIsAdmin(adminStatus);
    });
  }, [auth.currentUser]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => window.location.href = "/")
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <header>
      <h1 onClick={() => window.location.href = '/'}>Pub Golf</h1>
      <button className="hamburger" onClick={() => setNavOpen(!navOpen)}>
        &#9776;
      </button>
      <nav className={navOpen ? "open" : "nav-closed"}>
        <ul>
          <li>
            <NavLink to="/leaderboard" onClick={() => setNavOpen(false)}>
              Leaderboard
            </NavLink>
          </li>
          {auth.currentUser && (
            <li>
              <NavLink to="/scorecard" onClick={() => setNavOpen(false)}>
                Scorecard
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/course" onClick={() => setNavOpen(false)}>
              Course
            </NavLink>
          </li>
          {isAdmin && (
          <li>
            <NavLink to="/players" onClick={() => setNavOpen(false)}>
              Players
            </NavLink>
          </li>
          )}
          <li>
            <NavLink to="/rules" onClick={() => setNavOpen(false)}>
              Rules
            </NavLink>
          </li>
          {auth.currentUser ? (
            <li>
              <a href="#" onClick={handleSignOut}>
                Sign Out
              </a>
            </li>
          ) : (
            <li>
              <NavLink to="/sign-in" onClick={() => setNavOpen(false)}>
                Sign In
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
