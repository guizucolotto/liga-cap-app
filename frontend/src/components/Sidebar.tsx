import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Home, Users, Calendar, Table, List } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const teams = [
  // AFC
  { id: 'ravens',   name: 'Baltimore Ravens',    conference: 'AFC', division: 'North' },
  { id: 'bills',    name: 'Buffalo Bills',       conference: 'AFC', division: 'East' },
  { id: 'bengals',  name: 'Cincinnati Bengals',  conference: 'AFC', division: 'North' },
  { id: 'browns',   name: 'Cleveland Browns',    conference: 'AFC', division: 'North' },
  { id: 'broncos',  name: 'Denver Broncos',      conference: 'AFC', division: 'West' },
  { id: 'texans',   name: 'Houston Texans',      conference: 'AFC', division: 'South' },
  { id: 'colts',    name: 'Indianapolis Colts',  conference: 'AFC', division: 'South' },
  { id: 'jaguars',  name: 'Jacksonville Jaguars',conference: 'AFC', division: 'South' },
  { id: 'chiefs',   name: 'Kansas City Chiefs',  conference: 'AFC', division: 'West' },
  { id: 'raiders',  name: 'Las Vegas Raiders',   conference: 'AFC', division: 'West' },
  { id: 'chargers', name: 'Los Angeles Chargers',conference: 'AFC', division: 'West' },
  { id: 'dolphins', name: 'Miami Dolphins',      conference: 'AFC', division: 'East' },
  { id: 'patriots', name: 'New England Patriots',conference: 'AFC', division: 'East' },
  { id: 'jets',     name: 'New York Jets',       conference: 'AFC', division: 'East' },
  { id: 'steelers', name: 'Pittsburgh Steelers', conference: 'AFC', division: 'North' },
  { id: 'titans',   name: 'Tennessee Titans',    conference: 'AFC', division: 'South' },

  // NFC
  { id: 'cardinals',   name: 'Arizona Cardinals',      conference: 'NFC', division: 'West' },
  { id: 'falcons',     name: 'Atlanta Falcons',        conference: 'NFC', division: 'South' },
  { id: 'panthers',    name: 'Carolina Panthers',      conference: 'NFC', division: 'South' },
  { id: 'bears',       name: 'Chicago Bears',          conference: 'NFC', division: 'North' },
  { id: 'cowboys',     name: 'Dallas Cowboys',         conference: 'NFC', division: 'East' },
  { id: 'lions',       name: 'Detroit Lions',          conference: 'NFC', division: 'North' },
  { id: 'packers',     name: 'Green Bay Packers',      conference: 'NFC', division: 'North' },
  { id: 'rams',        name: 'Los Angeles Rams',       conference: 'NFC', division: 'West' },
  { id: 'vikings',     name: 'Minnesota Vikings',      conference: 'NFC', division: 'North' },
  { id: 'saints',      name: 'New Orleans Saints',     conference: 'NFC', division: 'South' },
  { id: 'giants',      name: 'New York Giants',        conference: 'NFC', division: 'East' },
  { id: 'eagles',      name: 'Philadelphia Eagles',    conference: 'NFC', division: 'East' },
  { id: '49ers',       name: 'San Francisco 49ers',    conference: 'NFC', division: 'West' },
  { id: 'seahawks',    name: 'Seattle Seahawks',       conference: 'NFC', division: 'West' },
  { id: 'buccaneers',  name: 'Tampa Bay Buccaneers',   conference: 'NFC', division: 'South' },
  { id: 'commanders',  name: 'Washington Commanders',  conference: 'NFC', division: 'East' }
];

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = React.useState(true);
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-nfl-navy text-white h-[calc(100vh-64px)] overflow-y-auto transition-all ${expanded ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="mb-4 p-2 bg-blue-800 rounded hover:bg-blue-700 w-full flex items-center justify-center"
        >
          <List className="h-4 w-4" />
        </button>

        <nav className="space-y-1">

        {user && (
            <Link
              to="/profile"
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                isActive("/profile") ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white"
              )}
            >
              <Users className="h-5 w-5 mr-3" />
              {expanded && <span>Profile</span>}
            </Link>
          )}

          <Link
            to="/"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive("/") ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white"
            )}
          >
            <Home className="h-5 w-5 mr-3" />
            {expanded && <span>Dashboard</span>}
          </Link>

          <Link
            to="/teams"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive("/teams") ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white"
            )}
          >
            <Users className="h-5 w-5 mr-3" />
            {expanded && <span>Teams</span>}
          </Link>

          <Link
            to="/players"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive("/players") ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white"
            )}
          >
            <Users className="h-5 w-5 mr-3" />
            {expanded && <span>Players</span>}
          </Link>

          <Link
            to="/schedule"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive("/schedule") ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white"
            )}
          >
            <Calendar className="h-5 w-5 mr-3" />
            {expanded && <span>Schedule</span>}
          </Link>

          <Link
            to="/stats"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive("/stats") ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white"
            )}
          >
            <Table className="h-5 w-5 mr-3" />
            {expanded && <span>Stats</span>}
          </Link>

          
        </nav>

        {expanded && (
          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Teams
            </h3>
            <div className="mt-2 space-y-1">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    isActive(`/teams/${team.id}`) ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-800 hover:text-white"
                  )}
                >
                  <span className="truncate">{team.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {expanded && (
          <div className="mt-6 border-t border-gray-600 pt-4 space-y-2">
            {!user && (
              <>
                <Link to="/login" className="block text-sm hover:underline px-3">Login</Link>
                <Link to="/register" className="block text-sm hover:underline px-3">Register</Link>
              </>
            )}
            {user && (
              <>
                <Link to="/profile" className="block text-sm hover:underline px-3">Profile</Link>
                <button onClick={logout} className="block text-sm text-left hover:underline px-3">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

