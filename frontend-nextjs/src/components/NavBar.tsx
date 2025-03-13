'use client';

import Link from 'next/link';
import { useState } from 'react';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-semibold text-gray-800 flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
                    MaPlateforme
                </Link>
                <div className="hidden md:flex space-x-4">
                    <Link href="/transactions" className="text-gray-600 hover:text-gray-800 transition-colors">Transactions</Link>
                    <Link href="/profile" className="text-gray-600 hover:text-gray-800 transition-colors">Profil</Link>
                    <div className="relative group">
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                            Paramètres
                        </button>
                        <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md p-4 mt-2 w-48">
                            <Link href="/settings/account" className="block py-2 text-gray-600 hover:text-gray-800 transition-colors">Compte</Link>
                            <Link href="/settings/security" className="block py-2 text-gray-600 hover:text-gray-800 transition-colors">Sécurité</Link>
                        </div>
                    </div>
                    <Link href="/logout" className="text-gray-600 hover:text-gray-800 transition-colors">Déconnexion</Link>
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.829-4.828 4.829a1 1 0 0 1-1.414-1.414l4.829-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.828 4.829 4.829z" />
                            ) : (
                                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z" />
                            )}
                        </svg>
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full right-0 bg-white shadow-md rounded-md p-4 mt-2 w-full">
                        <Link href="/transactions" className="block py-2 text-gray-600 hover:text-gray-800 transition-colors">Transactions</Link>
                        <Link href="/profile" className="block py-2 text-gray-600 hover:text-gray-800 transition-colors">Profil</Link>
                        <Link href="/settings/account" className="block py-2 text-gray-600 hover:text-gray-800 transition-colors">Compte</Link>
                        <Link href="/settings/security" className="block py-2 text-gray-600 hover:text-gray-800 transition-colors">Sécurité</Link>
                        <Link href="/logout" className="block py-2 text-gray-600 hover:text-gray-800 transition-colors">Déconnexion</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;