import { useState, useEffect } from "react";
import Header from "../headerfooter/Header";
import Footer from "../headerfooter/Footer";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../api/api";

function Profile() {
  const [profile, setProfile] = useState({ FullName: "", Email: "", Phone: "", Address: "", Title: "", Location: "" });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
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
    const updatedProfile = { ...profile, [e.target.FullName]: e.target.value };
    setProfile(updatedProfile);
    setIsChanged(JSON.stringify(updatedProfile) !== JSON.stringify(originalProfile));
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
      <div className="bg-gradient-to-r from-red-800 to-red-600 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-10 text-gray-900 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-black-800 text-center">Cập nhật thông tin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="FullName" value={profile.fullName} onChange={handleChange} placeholder="Họ tên" className="w-full px-4 py-2 border rounded" />
            <input name="Email" value={profile.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded" />
            <input name="Phone" value={profile.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full px-4 py-2 border rounded" />
            <input name="Address" value={profile.address} onChange={handleChange} placeholder="Địa chỉ" className="w-full px-4 py-2 border rounded" />
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Huỷ</button>
              <button
                type="submit"
                disabled={!isChanged}
                className={`px-4 py-2 rounded text-white transition ${isChanged ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {/* Modal xác nhận huỷ */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Huỷ thay đổi?</h3>
            <p className="mb-4 text-sm text-gray-700">Bạn có chắc muốn huỷ thay đổi không?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Không
              </button>
              <button onClick={confirmCancel} disabled={isCancelling} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
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
