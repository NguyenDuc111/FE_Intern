import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../api/api";
import Header from "../headerfooter/Header";
import Footer from "../headerfooter/Footer";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Token không hợp lệ. Vui lòng thử lại.");
      navigate("/home");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      const id = toast.loading("Đang đặt lại mật khẩu...");
      await resetPassword({ token, newPassword });
      toast.update(id, {
        render: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      toast.dismiss();
      const message = err.response?.data?.error || "Có lỗi xảy ra.";
      toast.error(message);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-red-800 to-red-600 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Đặt lại mật khẩu
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              required
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-[#dd3333] text-white font-bold py-2 rounded hover:bg-red-600 transition"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;