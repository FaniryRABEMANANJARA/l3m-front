import Footer from "@/components/Footer";
import { clearAuth } from "@/store/authSlice";
import {
    faBars,
    faListAlt,
    faSignOutAlt,
    faTachometerAlt,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import $ from "jquery";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2"; // Utilisation de Chart.js avec react-chartjs-2
import { useDispatch, useSelector } from "react-redux";
// Enregistrer les composants nécessaires, y compris LineElement
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface RootState {
  auth: {
    token: string | null;
    error: string | null;
    user: {
      id: string;
      email: string;
      name: string;
    } | null;
  };
}

interface Transaction {
  created_at: string;
  type: "deposit" | "withdrawal";
  amount: number;
}

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("token");
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
            href="/dashboard"
            className="flex items-center p-3 hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />{" "}
            Dashboard
          </Link>
        </li>
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

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null); // État pour l'erreur
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const tableRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token absent !");
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/transactions/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setError(null);
        const dates = data.map(
          (transaction: Transaction) => transaction.created_at.split(" ")[0]
        );

        const deposits = data
          .filter((transaction: Transaction) => transaction.type === "deposit")
          .map((transaction: Transaction) => parseFloat(transaction.amount));

        const withdrawals = data
          .filter(
            (transaction: Transaction) => transaction.type === "withdrawal"
          )
          .map((transaction: Transaction) => parseFloat(transaction.amount));
        setChartData({
          labels: [...new Set(dates)],
          datasets: [
            {
              label: "Dépôts",
              data: dates.map((date) =>
                deposits
                  .filter((_, index) => dates[index] === date)
                  .reduce((a, b) => a + b, 0)
              ),
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.2)",
              fill: true,
              pointRadius: 5,
            },
            {
              label: "Retraits",
              data: dates.map((date) =>
                withdrawals
                  .filter((_, index) => dates[index] === date)
                  .reduce((a, b) => a + b, 0)
              ),
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              fill: true,
              pointRadius: 5,
            },
          ],
        });
      })
      .catch((error) => {
        setError("Erreur de récupération des transactions");
        console.error("Error fetching transactions:", error);
      });
  }, []);
  useEffect(() => {
    if (transactions.length > 0) {
      const table = tableRef.current;
      if (table) {
        $(table).DataTable({
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          lengthChange: true,
        });
      }
    }
  }, [transactions]);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />

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
          {error && <div className="text-red-600">{error}</div>}{" "}
          {/* Affichage de l'erreur */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4"></h1>

            <div>
              <h2>Transactions par jour</h2>
              {chartData && (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: "Dépôts et Retraits",
                      },
                      legend: {
                        position: "top",
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Date",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Montant",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </div>

            <h2>Détails des Transactions</h2>
            {transactions.length === 0 ? (
              <div>Chargement des transactions...</div> // Message de chargement
            ) : (
              <table
                ref={tableRef}
                className="table-auto w-full border-collapse border border-gray-200"
              >
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3">ID</th>
                    <th className="p-3">Envoyeur</th>
                    <th className="p-3">Receveur</th>
                    <th className="p-3">Montant</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="p-3">{transaction.id}</td>
                      <td className="p-3">{transaction.sender_name}</td>
                      <td className="p-3">{transaction.receiver_name}</td>
                      <td className="p-3">{transaction.amount}</td>
                      <td className="p-3">{transaction.type}</td>
                      <td className="p-3">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
