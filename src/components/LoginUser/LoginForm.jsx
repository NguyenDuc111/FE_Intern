import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../api/api"; // <-- Thêm dòng này
import "../LoginUser/LoginForm.css";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.includes("@")) {
      newErrors.email = "Email không hợp lệ";
    }
    if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
  } else {
    setErrors({});
    try {
      const res = await login(form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      alert("Đăng nhập thành công!");
      console.log("Dữ liệu từ server:", res.data);
      // navigate('/dashboard'); <-- nếu cần redirect
    } catch (err) {
      alert("Đăng nhập thất bại!");
      console.error(err.response?.data || err.message);
    }
  }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input
            id="remember"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          />
        </div>
        <label
          htmlFor="remember"
          className="ml-2 text-sm font-medium text-gray-900"
        >
          Ghi nhớ đăng nhập
        </label>
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        Đăng nhập
      </button>

      <p className="mt-4 text-sm text-center">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
