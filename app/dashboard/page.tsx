"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/DashboardSidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchWithAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCartOutlined, 
  DollarOutlined,
  CalendarOutlined,
  ShopOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";

interface DashboardData {
  totalSalesCount: number;
  totalRevenue: number;
  salesByPaymentMethod: Record<string, number>;
  salesByStatus: Record<string, number>;
  hourlySales: Record<string, number>;
}

const PAYMENT_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];
const STATUS_COLORS = ["#10B981", "#EF4444"];

// Animated counter component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

// Custom tooltip for charts
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 shadow-lg rounded-xl border border-gray-100">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-bold text-[#5a9aa8]">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 h-32">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 h-80">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-48 bg-gray-100 rounded-xl"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [storeId, setStoreId] = useState("1"); // Default Aluva

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const start = `${startDate}T00:00:00`;
        const end = `${endDate}T23:59:59`;
        const res = await fetchWithAuth(
          `api/dashboard?startDate=${start}&endDate=${end}&storeId=${storeId}`
        );
        setData(res);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [startDate, endDate, storeId]);

  const paymentMethodData = data
    ? Object.entries(data.salesByPaymentMethod).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const salesStatusData = data
    ? Object.entries(data.salesByStatus).map(([status, value]) => ({
        name: status === "0" ? "Completed" : "Cancelled",
        value,
      }))
    : [];

  const hourlySalesData = data
    ? Object.entries(data.hourlySales)
        .map(([time, revenue]) => {
          const hour24 = time.slice(11, 16);
          const [hours, minutes] = hour24.split(':');
          const hour = parseInt(hours, 10);
          const period = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour % 12 || 12;
          return {
            time: `${hour12}:${minutes} ${period}`,
            sortKey: hour24,
            revenue,
          };
        })
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    : [];

  const completedOrders = data?.salesByStatus?.["0"] || 0;
  const cancelledOrders = data?.salesByStatus?.["1"] || 0;
  const completionRate = completedOrders + cancelledOrders > 0 
    ? ((completedOrders / (completedOrders + cancelledOrders)) * 100).toFixed(1)
    : "0";

  return (
    <Layout pageTitle="Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbfc] via-[#f0f7f9] to-[#e8f4f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-light text-gray-800">
              Welcome to <span className="font-semibold">Bean Barrel</span>
            </h1>
            <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening today</p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-[#b0e0e6]/30 p-6 mb-8"
          >
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <CalendarOutlined className="text-[#5a9aa8]" />
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#b0e0e6] focus:border-[#5a9aa8] transition-all outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <CalendarOutlined className="text-[#5a9aa8]" />
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#b0e0e6] focus:border-[#5a9aa8] transition-all outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <ShopOutlined className="text-[#5a9aa8]" />
                  Store Location
                </label>
                <select
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#b0e0e6] focus:border-[#5a9aa8] transition-all outline-none bg-white"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                >
                  <option value="1">Aluva</option>
                  <option value="0">Ernakulam</option>
                </select>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
              >
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </motion.div>
            ) : data ? (
              <motion.div
                key="data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total Sales */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[#b0e0e6]/30 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b0e0e6] to-[#7cb9c4] flex items-center justify-center">
                        <ShoppingCartOutlined className="text-white text-xl" />
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <RiseOutlined /> Live
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      <AnimatedCounter value={data.totalSalesCount} />
                    </p>
                  </motion.div>

                  {/* Total Revenue */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[#b0e0e6]/30 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                        <DollarOutlined className="text-white text-xl" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      <AnimatedCounter value={data.totalRevenue} prefix="₹" />
                    </p>
                  </motion.div>

                  {/* Completion Rate */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[#b0e0e6]/30 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center">
                        <RiseOutlined className="text-white text-xl" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      {completionRate}%
                    </p>
                  </motion.div>

                  {/* Cancelled Orders */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[#b0e0e6]/30 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
                        <FallOutlined className="text-white text-xl" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Cancelled</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      <AnimatedCounter value={cancelledOrders} />
                    </p>
                  </motion.div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Hourly Sales - Full Width on mobile */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#b0e0e6]/30"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                      Revenue Timeline
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={hourlySalesData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5a9aa8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#5a9aa8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                          tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#5a9aa8" 
                          strokeWidth={3}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Payment Methods */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[#b0e0e6]/30"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                      Payment Methods
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentMethodData.map((_, index) => (
                            <Cell 
                              key={index} 
                              fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Order Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[#b0e0e6]/30"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                      Order Status
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={salesStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {salesStatusData.map((_, index) => (
                            <Cell 
                              key={index} 
                              fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}