"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/DashboardSidebar";
import { message } from "antd";
import dayjs from "dayjs";
import { fetchWithAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarOutlined,
  ShopOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  DownOutlined,
  RightOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

// ---------------- Types ----------------
interface Item {
  id: number;
  quantity: number;
  item: {
    itemId: number;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
  };
}

interface Sale {
  id: number;
  billNumber: number;
  tokenNumber: number;
  status: number;
  store: number;
  totalAmount: number;
  dateTime: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Item[];
}

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-100 rounded w-48"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

// Animated counter
const AnimatedCounter = ({ value, prefix = "" }: { value: number; prefix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 40;
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

  return <span>{prefix}{displayValue.toLocaleString()}</span>;
};

// Sale row component
const SaleRow = ({ sale, index }: { sale: Sale; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isCancelled = sale.status === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-white rounded-xl border overflow-hidden transition-all duration-200 ${
        isCancelled 
          ? "border-red-200 bg-red-50/50" 
          : "border-[#b0e0e6]/30 hover:border-[#b0e0e6]"
      }`}
    >
      {/* Main Row */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Expand Icon */}
            <div className={`text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`}>
              <RightOutlined />
            </div>

            {/* Bill & Token */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">#{sale.billNumber}</span>
                {isCancelled ? (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                    <CloseCircleOutlined /> Cancelled
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                    <CheckCircleOutlined /> Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Token: {sale.tokenNumber}</p>
            </div>
          </div>

          {/* Middle Info */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <UserOutlined className="text-[#5a9aa8]" />
              <span className="text-sm">{sale.customerName || "Walk-in"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCardOutlined className="text-[#5a9aa8]" />
              <span className="text-sm">{sale.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <ClockCircleOutlined />
              <span className="text-sm">{dayjs(sale.dateTime).format("hh:mm A")}</span>
            </div>
          </div>

          {/* Amount */}
          <div className={`text-lg font-bold ${isCancelled ? "text-red-500 line-through" : "text-[#5a9aa8]"}`}>
            ₹{sale.totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Mobile Info */}
        <div className="flex md:hidden items-center gap-4 mt-3 text-sm text-gray-500">
          <span>{sale.customerName || "Walk-in"}</span>
          <span>•</span>
          <span>{sale.paymentMethod}</span>
          <span>•</span>
          <span>{dayjs(sale.dateTime).format("hh:mm A")}</span>
        </div>
      </div>

      {/* Expanded Items */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 bg-gray-50/50"
          >
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Order Items</h4>
              <div className="space-y-2">
                {sale.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.item.itemName}</p>
                      <p className="text-sm text-gray-500">{item.item.itemDescription}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-gray-500">₹{item.item.itemPrice} × {item.quantity}</span>
                      <span className="font-semibold text-gray-800">
                        ₹{(item.item.itemPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Details */}
              {(sale.customerEmail || sale.customerPhone) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Customer Details</h4>
                  <div className="flex gap-6 text-sm text-gray-600">
                    {sale.customerEmail && <span>Email: {sale.customerEmail}</span>}
                    {sale.customerPhone && <span>Phone: {sale.customerPhone}</span>}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------------- Component ----------------
export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [store, setStore] = useState(1); // Default: Aluva

  const pageSize = 20;
  const totalPages = Math.ceil(totalElements / pageSize);

  useEffect(() => {
    async function loadSales() {
      setLoading(true);
      try {
        const res = await fetchWithAuth(
          `api/sales/by-date-store?date=${date}&store=${store}&page=${page}&size=${pageSize}`
        );
        setSales(res.content || []);
        setTotalElements(res.totalElements || 0);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
        message.error("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, [date, page, store]);

  // Calculate stats
  const completedSales = sales.filter((s) => s.status !== 1);
  const cancelledSales = sales.filter((s) => s.status === 1);
  const totalSalesAmount = completedSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const cancelledAmount = cancelledSales.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <Layout pageTitle="Sales">
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbfc] via-[#f0f7f9] to-[#e8f4f6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-light text-gray-800">
              Sales <span className="font-semibold">History</span>
            </h1>
            <p className="text-gray-500 mt-1">View and manage your daily sales</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-[#b0e0e6]/30 p-6 mb-6"
          >
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <CalendarOutlined className="text-[#5a9aa8]" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setPage(0);
                    setDate(e.target.value || dayjs().format("YYYY-MM-DD"));
                  }}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#b0e0e6] focus:border-[#5a9aa8] transition-all outline-none"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <ShopOutlined className="text-[#5a9aa8]" />
                  Store Location
                </label>
                <select
                  value={store}
                  onChange={(e) => {
                    setPage(0);
                    setStore(Number(e.target.value));
                  }}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#b0e0e6] focus:border-[#5a9aa8] transition-all outline-none bg-white"
                >
                  <option value={1}>Aluva</option>
                  <option value={0}>Ernakulam</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#b0e0e6]/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                  <DollarOutlined className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                <AnimatedCounter value={totalSalesAmount} prefix="₹" />
              </p>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#b0e0e6]/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b0e0e6] to-[#7cb9c4] flex items-center justify-center">
                  <ShoppingCartOutlined className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalElements}</p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#b0e0e6]/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center">
                  <CheckCircleOutlined className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{completedSales.length}</p>
            </div>

            {/* Cancelled */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#b0e0e6]/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center">
                  <CloseCircleOutlined className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{cancelledSales.length}</p>
            </div>
          </motion.div>

          {/* Sales List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Orders for {dayjs(date).format("MMMM DD, YYYY")}
              </h2>
              <span className="text-sm text-gray-500">
                Showing {sales.length} of {totalElements} orders
              </span>
            </div>

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
              ) : sales.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#b0e0e6]/30"
                >
                  <ShoppingCartOutlined className="text-5xl text-gray-300 mb-4" />
                  <p className="text-gray-500">No sales found for this date</p>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {sales.map((sale, index) => (
                    <SaleRow key={sale.id} sale={sale} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                          page === pageNum
                            ? "bg-gradient-to-br from-[#7cb9c4] to-[#5a9aa8] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}