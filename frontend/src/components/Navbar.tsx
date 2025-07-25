import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import GenericLogo from "@/assets/logos/genericlogo.jpeg";
import { getTeamLogo } from "@/utils/getTeamLogo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Links comuns a todos os usuários
  const navLinks = (
    <>
      <Link to="/teams" className="hover:text-nfl-red px-3 py-2" onClick={() => setMenuOpen(false)}>
        Teams
      </Link>
      <Link to="/players" className="hover:text-nfl-red px-3 py-2" onClick={() => setMenuOpen(false)}>
        Players
      </Link>
      <Link to="/schedule" className="hover:text-nfl-red px-3 py-2" onClick={() => setMenuOpen(false)}>
        Schedule
      </Link>
      <Link to="/stats" className="hover:text-nfl-red px-3 py-2" onClick={() => setMenuOpen(false)}>
        Stats
      </Link>
    </>
  );

  return (
    <nav className="bg-nfl-navy text-white p-4 shadow-md relative">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <img
            src={GenericLogo}
            alt="Liga Logo"
            className="w-10 h-10 rounded-full border border-white bg-white object-contain"
          />
          CAPErnam Fantasy
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks}
          {!user ? (
            <Link to="/login" className="hover:text-nfl-red px-3 py-2">
              Login
            </Link>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  👋 Olá, <strong>{user.alias || user.username}</strong>
                </span>
                <div className="flex items-center space-x-2">
                  <img
                    src={getTeamLogo((user.teams.afc as any).id || (user.teams.afc as any).nick || user.teams.afc)}
                    alt="AFC Team"
                    className="h-6 w-6"
                  />
                  <span className="text-sm">
                    {(user.teams.afc as any).name || user.teams.afc}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src={getTeamLogo((user.teams.nfc as any).id || (user.teams.nfc as any).nick || user.teams.nfc)}
                    alt="NFC Team"
                    className="h-6 w-6"
                  />
                  <span className="text-sm">
                    {(user.teams.nfc as any).name || user.teams.nfc}
                  </span>
                </div>
              </div>
              <Link to="/profile" className="hover:text-nfl-red px-3 py-2">
                Profile
              </Link>
              <button onClick={logout} className="hover:text-nfl-red text-sm px-3 py-2">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger Icon Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir Menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              // X icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              // Hamburger icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-nfl-navy shadow-lg z-50">
          <div className="flex flex-col space-y-2 px-4 pb-4">
            {navLinks}
            {!user ? (
              <Link
                to="/login"
                className="hover:text-nfl-red px-3 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm">
                    👋 Olá, <strong>{user.alias || user.username}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <img
                    src={getTeamLogo((user.teams.afc as any).id || (user.teams.afc as any).nick || user.teams.afc)}
                    alt="AFC Team"
                    className="h-6 w-6"
                  />
                  <span className="text-sm">
                    {(user.teams.afc as any).name || user.teams.afc}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <img
                    src={getTeamLogo((user.teams.nfc as any).id || (user.teams.nfc as any).nick || user.teams.nfc)}
                    alt="NFC Team"
                    className="h-6 w-6"
                  />
                  <span className="text-sm">
                    {(user.teams.nfc as any).name || user.teams.nfc}
                  </span>
                </div>
                <Link to="/profile" className="hover:text-nfl-red px-3 py-2 mt-2" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="hover:text-nfl-red text-sm px-3 py-2 mt-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
