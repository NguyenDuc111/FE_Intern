import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserProfile } from "../../api/api";
import { toast } from "react-toastify";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    Email: "",
    Address: "",
    Phone: "",
    Password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      toast.error("Không thể tải danh sách người dùng.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    try {
      await deleteUser(id);
      toast.success("Xoá người dùng thành công.");
      fetchUsers();
    } catch {
      toast.error("Lỗi khi xoá người dùng.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      Email: user.Email || "",
      Address: user.Address || "",
      Phone: user.Phone || "",
      Password: "",
    });
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(editingUser.UserID, formData);
      toast.success("Cập nhật người dùng thành công.");
      setEditingUser(null);
      fetchUsers();
    } catch {
      toast.error("Lỗi khi cập nhật thông tin người dùng.");
    }
  };

  const renderTable = (data, title) => (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm text-gray-800">
          <thead className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Điện thoại</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.UserID} className="border-b hover:bg-red-50 transition">
                <td className="px-4 py-2">{u.UserID}</td>
                <td className="px-4 py-2">{u.FullName}</td>
                <td className="px-4 py-2 text-center">{u.Email}</td>
                <td className="px-4 py-2 text-center">{u.Phone}</td>
                <td className="px-4 py-2 text-center">{u.Address}</td>
                <td className="px-4 py-2">
                  {u.Role?.RoleName === "admin" ? (
                    <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                      Quản trị viên
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      Người dùng
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEditClick(u)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u.UserID)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  

  // Sắp xếp để admin lên đầu
  const sortedUsers = [...users].sort((a, b) => {
    if (a.Role?.RoleName === "admin" && b.Role?.RoleName !== "admin") return -1;
    if (a.Role?.RoleName !== "admin" && b.Role?.RoleName === "admin") return 1;
    return 0;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-red-600 mb-6">
        👥 Quản lý Người dùng & Quản trị viên
      </h2>
      {renderTable(sortedUsers, "👥 Danh sách tài khoản")}

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[450px] shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Chỉnh sửa người dùng
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Email"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={formData.Phone}
                onChange={(e) =>
                  setFormData({ ...formData, Phone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Địa chỉ"
                value={formData.Address}
                onChange={(e) =>
                  setFormData({ ...formData, Address: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Mật khẩu mới (bỏ trống nếu không đổi)"
                value={formData.Password}
                onChange={(e) =>
                  setFormData({ ...formData, Password: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
