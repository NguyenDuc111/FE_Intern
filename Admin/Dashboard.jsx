import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await axios.get("http://localhost:8080/static", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRevenueData(res.data.chart || []);
        setSummary({
          totalOrders: res.data.totalOrders || 0,
          totalRevenue: res.data.totalRevenue || 0,
          totalUsers: res.data.totalUsers || 0,
          totalProducts: res.data.totalProducts || 0,
        });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", err);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        📊 Thống kê tổng quan
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow text-center border-t-4 border-red-500">
          <h3 className="text-gray-500 text-sm">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-red-700">
            {summary.totalOrders}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow text-center border-t-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Doanh thu</h3>
          <p className="text-2xl font-bold text-green-700">
            {summary.totalRevenue.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow text-center border-t-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Người dùng</h3>
          <p className="text-2xl font-bold text-blue-700">
            {summary.totalUsers}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow text-center border-t-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm">Sản phẩm</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {summary.totalProducts}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          📈 Doanh thu theo tháng
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
