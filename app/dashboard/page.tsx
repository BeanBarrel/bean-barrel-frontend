"use client";

import { useEffect, useState } from "react";
import Layout from "@/app/dashboard/layout";
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
} from "recharts";
import { fetchWithAuth } from "@/lib/auth";

interface DashboardData {
  totalSalesCount: number;
  totalRevenue: number;
  salesByPaymentMethod: Record<string, number>;
  salesByStatus: Record<string, number>;
  monthlySales: { month: string; salesCount: number; revenue: number }[];
  storeSales: Record<string, number>;
}

const COLORS = ["#6366F1", "#10B981", "#FACC15", "#F97316", "#00C49F"];
const STATUS_COLORS = [ "#007200","#c1121f"]; 
// ... keep imports, fetchWithAuth, DashboardData, COLORS the same

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchWithAuth("api/dashboard");
        setData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

  const paymentMethodData = Object.entries(data.salesByPaymentMethod).map(
    ([name, value]) => ({ name, value })
  );

  const salesStatusData = Object.entries(data.salesByStatus).map(
    ([status, value]) => ({
      name: status === "0" ? "Completed" : "Cancelled", // updated
      value,
    })
  );

  const storeSalesData = Object.entries(data.storeSales).map(
    ([store, revenue]) => ({
      store: store === "1" ? "Ernakulam" : "Aluva", // updated
      revenue,
    })
  );

  return (
    <Layout pageTitle="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

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
          {/* Payment Method */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Sales by Payment Method</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {paymentMethodData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Sales by Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {salesStatusData.map((_, index) => (
                      <Cell
                        key={`cell-status-${index}`}
                        fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Sales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Monthly Sales</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="salesCount" fill="#6366F1" name="Sales Count" />
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Store Sales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Store Sales</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storeSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="store" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#FACC15" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
