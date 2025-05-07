import { useState, useEffect } from "react";
import Header from "../headerfooter/Header";
import Footer from "../headerfooter/Footer";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../../api/api";

function Profile() {
  const [profile, setProfile] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    Address: "",
    Title: "",
    Location: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.UserID;
      getUserProfile(userId)
        .then((res) => {
          setProfile(res.data);
          setOriginalProfile(res.data);
        })
        .catch(() => toast.error("Không thể tải thông tin người dùng."));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);
    setIsChanged(
      JSON.stringify(updatedProfile) !== JSON.stringify(originalProfile)
    );
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.UserID;

    try {
      await updateUserProfile(userId, profile);
      toast.success("Cập nhật thành công!");
      setOriginalProfile(profile);
      setIsChanged(false);
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (
      passwordForm.oldPassword.length < 6 ||
      passwordForm.newPassword.length < 6
    ) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      const id = toast.loading("Đang thay đổi mật khẩu...");
      await changePassword(
        {
          OldPassword: passwordForm.oldPassword,
          NewPassword: passwordForm.newPassword,
        },
        token
      );
      toast.update(id, {
        render: "Thay đổi mật khẩu thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.dismiss();
      const message = err.response?.data?.error || "Có lỗi xảy ra.";
      toast.error(message);
    }
  };

  const handleCancel = () => setShowConfirm(true);

  const confirmCancel = () => {
    setIsCancelling(true);
    toast.loading("Đang huỷ thay đổi...");
    setTimeout(() => {
      toast.dismiss();
      toast.info("Đã huỷ thay đổi.");
      navigate(-1);
    }, 1500);
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-red-800 to-red-600 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl bg-white border-4 border-white rounded-3xl shadow-2xl p-15 space-y-20">

          {/* Tiêu đề chính */}
          <h1 className="text-2xl font-bold text-red-700 text-center uppercase tracking-wide">
            Thông tin cá nhân
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-center border-b text-lg font-semibold">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 transition ${
                activeTab === "profile"
                  ? "text-red-600 border-b-4 border-red-600"
                  : "text-gray-500 hover:text-red-600"
              }`}
            >
              👤 Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 transition ${
                activeTab === "security"
                  ? "text-red-600 border-b-4 border-red-600"
                  : "text-gray-500 hover:text-red-600"
              }`}
            >
              🔐 Đăng nhập & Bảo mật
            </button>
          </div>

          {/* Tab: Thông tin cá nhân */}
          {activeTab === "profile" && (
            <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Họ và tên</label>
              <input
                name="FullName"
                value={profile.FullName}
                onChange={handleChange}
                placeholder="Họ và tên"
                className="px-4 py-3 border rounded-lg shadow-sm"
              />
            </div>
          
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Email</label>
              <input
                name="Email"
                value={profile.Email}
                onChange={handleChange}
                placeholder="Email"
                className="px-4 py-3 border rounded-lg shadow-sm"
              />
            </div>
          
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Số điện thoại</label>
              <input
                name="Phone"
                value={profile.Phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="px-4 py-3 border rounded-lg shadow-sm"
              />
            </div>
          
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Địa chỉ</label>
              <input
                name="Address"
                value={profile.Address}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className="px-4 py-3 border rounded-lg shadow-sm"
              />
            </div>
          
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={!isChanged}
                className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
                  isChanged
                    ? "bg-indigo-700 hover:bg-indigo-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
          )}

          {/* Tab: Đăng nhập & Bảo mật */}
          {activeTab === "security" && (
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5 max-w-md mx-auto"
            >
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Mật khẩu cũ"
                required
                className="w-full px-4 py-3 border rounded-lg shadow-sm"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Mật khẩu mới"
                required
                className="w-full px-4 py-3 border rounded-lg shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition"
              >
                Đổi mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />

      {/* Modal xác nhận huỷ */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Huỷ thay đổi?</h3>
            <p className="mb-4 text-sm text-gray-700">
              Bạn có chắc muốn huỷ thay đổi không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Không
              </button>
              <button
                onClick={confirmCancel}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {isCancelling ? "Đang huỷ..." : "Đồng ý"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
