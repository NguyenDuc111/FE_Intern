import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"; // Import motion for animations
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CubeIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

const Dashboard = () => {
  const [productData, setProductData] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/static", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductData(res.data.products || []);
      setSummary({
        totalOrders: res.data.totalOrders || 0,
        totalRevenue: res.data.totalRevenueAll || 0,
        totalUsers: res.data.totalUsers || 0,
        totalProducts: res.data.totalProducts || 0,
      });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [token]);

  // Định dạng tooltip hiển thị tiền tệ VND và số lượng
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">
            {payload[0].payload.ProductName}
          </p>
          <p className="text-green-600">
            Doanh thu: {payload[0].payload.totalRevenue.toLocaleString("vi-VN")}
            ₫
          </p>
          <p className="text-blue-600">
            Số lượng: {payload[0].payload.totalQuantity}
          </p>
        </div>
      );
    }
    return null;
  };

  // Hiệu ứng animation cho thẻ
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-250 to-gray-300 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 Thống kê tổng quan
        </h1>
        <button
          onClick={fetchStatistics}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {loading ? "Đang tải..." : "Làm mới dữ liệu"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-red-500 hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-3">
            <ShoppingCartIcon className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-medium">
                Tổng đơn hàng
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {summary.totalOrders}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-3">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-medium">
                Doanh thu
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {summary.totalRevenue.toLocaleString("vi-VN")}₫
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-medium">
                Người dùng
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {summary.totalUsers}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-yellow-500 hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-3">
            <CubeIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-medium">
                Sản phẩm
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {summary.totalProducts}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue and Quantity Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📈 Doanh thu và số lượng theo sản phẩm
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={productData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <XAxis
              dataKey="ProductName"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              tickFormatter={(value) => `${(value / 1000  ).toFixed(3)}₫`}
              tick={{ fontSize: 12 }}
              stroke="#ef4444"
            />
            <YAxis
              yAxisId="quantity"
              orientation="right"
              tickFormatter={(value) => value}
              tick={{ fontSize: 12 }}
              stroke="#3b82f6"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="top"
              wrapperStyle={{ padding: "0 20px" }}
            />
            <Bar
              yAxisId="revenue"
              dataKey="totalRevenue"
              name="Doanh thu (VND)"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="quantity"
              dataKey="totalQuantity"
              name="Số lượng"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Dashboard;
