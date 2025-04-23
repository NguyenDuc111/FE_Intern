import { useState, useEffect } from "react";
import Header from "../headerfooter/Header";
import Footer from "../headerfooter/Footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { toast } from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    Address: "",
    Title: "",
    Location: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.UserID;

      axios
        .get(`http://localhost:8080/users-profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => {
          toast.error("Không thể tải thông tin người dùng.");
          console.error(err);
        });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.UserID;

    try {
      await axios.put(
        `http://localhost:8080/api/users/${userId}`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Cập nhật thành công!");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-10 text-gray-900 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-indigo-800">Cập nhật thông tin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="FullName" value={profile.FullName} onChange={handleChange} placeholder="Họ tên" className="w-full px-4 py-2 border rounded" />
            <input name="Email" value={profile.Email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded" />
            <input name="Phone" value={profile.Phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full px-4 py-2 border rounded" />
            <input name="Address" value={profile.Address} onChange={handleChange} placeholder="Địa chỉ" className="w-full px-4 py-2 border rounded" />
            <input name="Title" value={profile.Title || ""} onChange={handleChange} placeholder="Chức danh" className="w-full px-4 py-2 border rounded" />
            <input name="Location" value={profile.Location || ""} onChange={handleChange} placeholder="Vị trí" className="w-full px-4 py-2 border rounded" />
            <div className="flex justify-end gap-4">
              <button type="reset" className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Huỷ</button>
              <button type="submit" className="px-4 py-2 bg-indigo-800 text-white rounded">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
