"use client";
import {
  faBars,
  faCheckCircle,
  faListAlt,
  faSignOutAlt,
  faTimesCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import { format, parseISO } from "date-fns";
import $ from "jquery";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../store/authSlice";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";


const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("token");
    // Rediriger vers la page de connexion
    router.push("/login");
  };

  return (
    <aside
      className={`bg-gray-900 text-white w-64 min-h-screen p-4 transition-all ${
        isOpen ? "block" : "hidden"
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

const Transactions = ({ isOpen, closeTransactionModal }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("credit");
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tableRef = useRef(null);

  const tokenFromStore = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);
  console.log("Token utilisé :", tokenFromStore);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = tokenFromStore || localStorage.getItem('token');

      if (!token) {
        console.error('Aucun token trouvé !');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Erreur dans la réponse API :', data);
          throw new Error('Erreur lors du chargement des utilisateurs');
        }

        setUsers(data.data || []); // Assurez-vous que c'est bien data.data
      } catch (error) {
        console.error('Erreur de récupération des utilisateurs :', error);
      }
    };

    fetchUsers();
  }, [tokenFromStore]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/users/${userId}/transactions`,
          {
            headers: { Authorization: `Bearer ${tokenFromStore}` },
          }
        );

        if (!response.ok) throw new Error(`Erreur ${response.status}`);

        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message || "Erreur de connexion");
      } finally {
        setLoading(false);
      }
    };

    if (tokenFromStore && userId) fetchTransactions();
  }, [tokenFromStore, userId]);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
  
    const transactionData = {
      amount: transactionAmount,
      sender_id: userId,
      receiver_id: selectedUser,
    };
  
    console.log("Données de la transaction :", transactionData);
    console.log("Token utilisé :", tokenFromStore);
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/make-transaction`, // URL modifiée
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenFromStore}`,
          },
          body: JSON.stringify(transactionData),
        }
      );
  
      if (!response.ok) {
        console.log("Réponse du serveur :", await response.text());
        throw new Error("Échec de la transaction");
      }
  
      const result = await response.json();
      console.log("Transaction réussie :", result);
  
      closeTransactionModal();
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (transactions.length > 0 && tableRef.current) {
      $(tableRef.current).DataTable({
        paging: true,
        searching: true,
        info: true,
        ordering: true,
        autoWidth: true,
      });
    }
  }, [transactions]);

  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
     
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-700"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <span className="text-xl font-semibold text-blue-600">
            L3m-holding
          </span>
          <div className="relative">
            <img
              src="/images/profildefault.png"
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </div>
        </nav>

      
        <main className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📜 Mes Transactions
            </h2>
            {loading ? (
              <Loader />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <table
                ref={tableRef}
                className="table-auto w-full border-collapse border border-gray-200"
              >
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3">Type</th>
                    <th className="p-3">Montant</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="p-3">
                        {transaction.type === "credit" ? "Crédit" : "Débit"}
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        ${transaction.amount}
                      </td>
                      <td className="p-3 text-gray-600">
                        {format(parseISO(transaction.created_at), "dd-MM-yyyy")}
                      </td>
                      <td className="p-3">
                        {transaction.status === "success" ? (
                          <span className="text-green-500 flex items-center">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="mr-2"
                            />{" "}
                            Réussie
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="mr-2"
                            />{" "}
                            Échouée
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600">
                        <button
                          onClick={() => setShowTransactionModal(true)}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-2"
                          />
                          Faire transaction
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {showTransactionModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={closeTransactionModal}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Faire une Transaction
                </h2>
                <form onSubmit={handleTransactionSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2">Montant</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Type de transaction</label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="credit">Crédit</option>
                      <option value="debit">Débit</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Utilisateur</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedUser} // Ajouter la valeur actuelle
                      onChange={(e) => setSelectedUser(e.target.value)} // Ajouter onChange
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
     
                  </div>
                  {error && <ErrorMessage message={error} />}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={closeTransactionModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Confirmer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Transactions;
