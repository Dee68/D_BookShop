import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { FileText, FileDown } from "lucide-react";
import { adminCardClass } from "../styles/ui";
import Loader from "../components/Loader";


import {
    FiUsers,
    FiBookOpen,
    FiDollarSign,
    FiShoppingBag,
    FiAlertTriangle
} from "react-icons/fi";

export default function Dashboard() {

    const { token } = useContext(AuthContext);

    const [data, setData] = useState({
        system: null,
        sales: null,
        orders: []
    });

   
    const statusColors = {
        pending:
            "bg-yellow-500/20 text-yellow-200 dark:bg-yellow-500/30 dark:text-yellow-100 border border-yellow-500/30",

        shipped:
            "bg-blue-500/20 text-blue-200 dark:bg-blue-500/30 dark:text-blue-100 border border-blue-500/30",

        delivered:
            "bg-emerald-500/20 text-emerald-200 dark:bg-emerald-500/30 dark:text-emerald-100 border border-emerald-500/30",

        cancelled:
            "bg-red-500/20 text-red-200 dark:bg-red-500/30 dark:text-red-100 border border-red-500/30"
    };

    const [loading, setLoading] = useState(true);

    function formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    useEffect(() => {

        async function load() {

            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [systemRes, salesRes, ordersRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}api/admin/stats/system`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}api/admin/stats/sales`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}api/admin/stats/orders`, { headers })
            ]);

            const system = await systemRes.json();
            const sales = await salesRes.json();
            const orders = await ordersRes.json();

            setData({
                system,
                sales,
                orders
            });
        }

        load();

    }, [token]);

    if (!data.system || !data.sales) {
        return <Loader text="Loading dashboard..." />;
    }
   // Getting reports from database
    async function downloadReport(type) {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}api/reports/inventory/${type}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!res.ok) {
                throw new Error("Failed to download report");
            }

            const blob = await res.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;

            a.download =
                type === "pdf"
                    ? "inventory-report.pdf"
                    : type === "csv"
                    ? "inventory-report.csv"
                    : "inventory-report.txt";

            document.body.appendChild(a);

            a.click();

            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(err);
        }
    }
   

    return (
        <div className="space-y-8">

            {/* PAGE HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-1 text-gray-900 dark:text-white">
                    Welcome back, Admin.
                </p>
            </div>

            {/* STATS GRID */}
            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-3
                    gap-6
                    items-stretch
                "
            >

                <StatCard
                    title="Users"
                    value={data.system.totalUsers}
                    icon={<FiUsers size={18} />}
                    color="bg-blue-100 text-blue-600"
                />

                <StatCard
                    title="Products"
                    value={data.system.totalProducts}
                    icon={<FiBookOpen size={18} />}
                    color="bg-purple-100 text-purple-600"
                />

                <StatCard
                    title="Revenue"
                    value={`€${data.sales.totalRevenue.toFixed(2)}`}
                    icon={<FiDollarSign size={18} />}
                    color="bg-green-100 text-green-600"
                />

                <StatCard
                    title="Orders"
                    value={data.sales.totalOrders}
                    icon={<FiShoppingBag size={18} />}
                    color="bg-orange-100 text-orange-600"
                />

                <StatCard
                    title="Low Stock"
                    value={data.system.lowStock}
                    icon={<FiAlertTriangle size={18} />}
                    color="bg-red-100 text-red-600"
                />

            </div>

            {/* ORDER STATUS */}
            <div
                className={`${adminCardClass} p-6`}
            >

                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Order Status
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-white">
                            Current order processing overview
                        </p>
                    </div>

                </div>

                <div className="space-y-4">

                    {data.orders.map((o) => (

                        <div
                            key={o.status}
                            className="
                                flex items-center justify-between
                                p-4
                                rounded-xl
                                bg-gray-50
                            "
                        >

                            <div
                                className={`
                                    px-4 py-2
                                    rounded-full
                                    text-sm font-medium
                                    ${statusColors[o.status] || "bg-gray-100 text-gray-700"}
                                `}
                            >
                                {formatStatus(o.status)}
                            </div>

                            <div className="text-xl font-bold text-gray-900">
                                {o.count}
                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* REPORT SECTION */}
            <div className={`${adminCardClass} p-6 space-y-4`}>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Inventory Reports
                </h2>

                <div className="flex gap-4">

                    <button
                        onClick={() => downloadReport("txt")}
                        className="
                            flex items-center gap-2
                            px-4 py-2 rounded-xl
                            text-white
                            bg-emerald-600 hover:bg-emerald-700
                            transition
                        "
                    >
                        <FileText size={18} />

                        TXT Report
                    </button>

                    <button
                        onClick={() => downloadReport("pdf")}
                        className="
                            flex items-center gap-2
                            px-4 py-2 rounded-xl
                            bg-red-600 text-white
                            hover:bg-red-500 transition
                        "
                    >
                        <FileDown size={18} />

                        PDF Report
                    </button>
                    <button 
                        onClick={() => downloadReport("csv")}
                        className="
                            px-4 py-2
                            rounded-xl
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                        ">
                        <FileText size={18} />

                        CSV REPORT
                    </button>

                </div>

            </div>

        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div
            className={`
                ${adminCardClass}
                p-4
                min-h-[140px]
                flex items-center justify-between gap-4
            `}
        >
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {title}
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {value}
                </h3>
            </div>

            {/* RIGHT SIDE ICON */}
            <div
                className={`
                    w-10 h-10
                    flex items-center justify-center
                    rounded-xl
                    shrink-0
                    ${color}
                `}
            >
                <div className="flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    );
}