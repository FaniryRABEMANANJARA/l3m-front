// components/Sidebar.tsx
import { faListAlt, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen , toggleSidebar}) => {
  return (
    <aside
      className={`bg-gray-900 text-white w-64 min-h-screen p-4 transition-all ${
        isOpen ? 'block' : 'hidden'
      } md:block`}
    >
      <ul className="space-y-4">
        <li>
          <Link
            href="/transactions"
            className="flex items-center p-3 hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faListAlt} className="mr-3" /> Transactions
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="flex items-center p-3 hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faUser} className="mr-3" /> Profil
          </Link>
        </li>
        <li>
          <a
            href="#" // Ajoutez votre logique de déconnexion ici
            className="flex items-center p-3 hover:bg-red-600 rounded"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" /> Déconnexion
          </a>
        </li>
      </ul>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={toggleSidebar}>Fermer</button>
    </div>
    </aside>
  );
};

export default Sidebar;