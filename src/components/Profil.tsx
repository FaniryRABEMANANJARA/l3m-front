import { faBars, faListAlt, faSignOutAlt, faTachometerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../store/authSlice';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';


interface User {
  id: number;
  name: string;
  email: string;
}
interface RootState {
  auth: {
      token: string | null;
      error: string | null;
      user: {
          id: string;
          email: string;
          name: string;
          balance: number;
      } | null;
  };
}
const Sidebar = ({ isOpen }: { isOpen: boolean; }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    // Fonction de déconnexion
    const handleLogout = () => {   
      dispatch(clearAuth());     
      localStorage.removeItem('token');
      // Rediriger vers la page de connexion
      router.push('/login');
    };
  
    return (
      <aside className={`bg-gray-900 text-white w-64 min-h-screen p-4 transition-all ${isOpen ? 'block' : 'hidden'} md:block`}>
        <ul className="space-y-4">
        <li>
                    <Link href="/dashboard" className="flex items-center p-3 hover:bg-gray-700 rounded">
                        <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" /> Dashboard
                    </Link>
                </li>  <li>
            <Link href="/transactions" className="flex items-center p-3 hover:bg-gray-700 rounded">
              <FontAwesomeIcon icon={faListAlt} className="mr-3" /> Transactions
            </Link>
          </li>
          <li>
            <Link href="/profile" className="flex items-center p-3 hover:bg-gray-700 rounded">
              <FontAwesomeIcon icon={faUser} className="mr-3" /> Profil
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout} 
              className="flex items-center p-3 hover:bg-red-600 rounded"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" /> Déconnexion
            </button>
          </li>
        </ul>
      </aside>
    );
  };
  const Profil: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');
    const token = useSelector((state: RootState) => state.auth.token);
    const userId = useSelector((state: RootState) => state.auth.user?.id);
const router = useRouter();
  
    useEffect(() => {
      const fetchProfile = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération du profil');
          }
  
          const data = await response.json();
          setUser(data);
          setNewName(data.name);
          setNewEmail(data.email);
        } catch (err: unknown) {
          if (err instanceof Error) {
              setError(err.message || 'Erreur de connexion');
          } else {
              setError('Une erreur inconnue est survenue');
              console.error('Unknown error:', err);
          }
      } finally {
          setLoading(false);
      }
      };
  
      if (token && userId) {
        fetchProfile();
      } else {
        router.push('/login');
      }
    }, [token, userId, router]);
  
    const handleSaveChanges = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/users/${userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newName,
            email: newEmail,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du profil');
        }
  
        const updatedUser = await response.json();
        setUser(updatedUser);
        setModalOpen(false); // Fermer la modal après sauvegarde
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message || 'Erreur lors de la mise à jour');
        } else {
            setError('Une erreur inconnue est survenue');
            console.error('Unknown error:', err);
        }
    }
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      );
    }
  
    if (error) {
      return <ErrorMessage message={error} />;
    }
  
    if (!user) {
      return <div>Profil non trouvé.</div>;
    }
  
    return (
      <div className="flex min-h-screen bg-gray-100">
       <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
  
        <div className="flex-1 flex flex-col">
          <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-700">
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
            <span className="text-xl font-semibold text-blue-600">L3m-holding</span>
            <div className="relative">
              <img 
                src="/images/profildefault.png" 
                alt="User" 
                className="w-10 h-10 rounded-full cursor-pointer" 
              />
            </div>
          </nav>
  
          <main className="p-6">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🧑 Mon Profil</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
                <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{user.name}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{user.email}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Solde</label>
                <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  {user.balance ? `${user.balance} €` : 'Solde non disponible'}
                </p>
              </div>
  
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
              >
                Modifier
              </button>
            </div>
          </main>
  
          <footer className="bg-gray-900 text-white p-4 text-center mt-auto">
            <p>&copy; 2025 L3m-holding. Tous droits réservés.</p>
          </footer>
        </div>
  
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Modifier le Profil</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Nom</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-800 p-2 rounded mr-4"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Profil;
  