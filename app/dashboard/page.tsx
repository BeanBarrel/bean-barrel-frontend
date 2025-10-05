"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/DashboardSidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { fetchWithAuth } from "@/lib/auth";

interface DashboardData {
  totalSalesCount: number;
  totalRevenue: number;
  salesByPaymentMethod: Record<string, number>;
  salesByStatus: Record<string, number>;
  hourlySales: Record<string, number>;
}

const COLORS = ["#6366F1", "#10B981", "#FACC15", "#F97316", "#00C49F"];
const STATUS_COLORS = ["#007200", "#c1121f"];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [storeId, setStoreId] = useState("0"); // Default Ernakulam

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const start = `${startDate}T00:00:00`;
        const end = `${endDate}T23:59:59`;
        const res = await fetchWithAuth(
          `api/dashboard?startDate=${start}&endDate=${end}&storeId=${storeId}`
        );
        setData(res);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [startDate, endDate, storeId]);

  if (loading) {
    return (
      <Layout pageTitle="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout pageTitle="Dashboard">
        <p className="text-red-500 text-center mt-10">Failed to load data.</p>
      </Layout>
    );
  }

  const paymentMethodData = Object.entries(data.salesByPaymentMethod).map(([name, value]) => ({
    name,
    value,
  }));

  const salesStatusData = Object.entries(data.salesByStatus).map(([status, value]) => ({
    name: status === "0" ? "Completed" : "Cancelled",
    value,
  }));

  const hourlySalesData = Object.entries(data.hourlySales).map(([time, revenue]) => ({
    time: time.slice(11, 16), // Extract HH:mm
    revenue,
  }));

  return (
    <Layout pageTitle="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Store</label>
            <select
              className="border p-2 rounded"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
            >
              <option value="0">Ernakulam</option>
              <option value="1">Aluva</option>
            </select>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
            <p className="text-gray-500 font-medium">Total Sales</p>
            <p className="text-3xl font-bold text-indigo-600">{data.totalSalesCount}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
            <p className="text-gray-500 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">₹{data.totalRevenue}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hourly Sales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Hourly Sales (Revenue)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Payment Methods</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" label outerRadius={80} dataKey="value">
                  {paymentMethodData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Order Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={salesStatusData} cx="50%" cy="50%" label outerRadius={80} dataKey="value">
                  {salesStatusData.map((_, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
