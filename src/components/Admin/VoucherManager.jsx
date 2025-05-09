import { useEffect, useState } from "react";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../../api/api";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Gift,
  PlusCircle,
} from "lucide-react";

export default function VoucherManager() {
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    discount: "",
    pointsRequired: "",
    redemptionLimit: "",
    expiryDays: "",
    minOrderValue: "",
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchVouchers = async () => {
    try {
      const res = await getAllVouchers(token);
      const data = res.data;
  
      const vouchersArray = Array.isArray(data)
        ? data
        : Array.isArray(data.vouchers)
        ? data.vouchers
        : [];
  
      setVouchers(vouchersArray);
    } catch {
      toast.error("Không thể tải danh sách voucher.");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateVoucher(editId, form, token);
        toast.success("Đã cập nhật voucher.");
      } else {
        await createVoucher(form, token);
        toast.success("Đã thêm voucher.");
      }
      fetchVouchers();
      setForm({
        name: "",
        discount: "",
        pointsRequired: "",
        redemptionLimit: "",
        expiryDays: "",
        minOrderValue: "",
      });
      setEditId(null);
    } catch {
      toast.error("Lỗi khi lưu voucher.");
    }
  };

  const handleEdit = (v) => {
    setForm({
      name: v.name,
      discount: v.discount,
      pointsRequired: v.pointsRequired,
      redemptionLimit: v.redemptionLimit,
      expiryDays: v.expiryDays,
      minOrderValue: v.minOrderValue,
    });
    setEditId(v.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xoá voucher này?")) return;
    try {
      await deleteVoucher(id, token);
      toast.success("Đã xoá voucher.");
      fetchVouchers();
    } catch {
      toast.error("Lỗi khi xoá.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-red-600 ">
       
      🎟️ Quản lý Voucher
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên voucher"
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Giảm (%) hoặc số tiền"
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="pointsRequired"
          value={form.pointsRequired}
          onChange={handleChange}
          placeholder="Điểm cần để đổi"
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="redemptionLimit"
          value={form.redemptionLimit}
          onChange={handleChange}
          placeholder="Số lượt đổi tối đa"
          className="border rounded px-3 py-2"
        />
        <input
          name="expiryDays"
          value={form.expiryDays}
          onChange={handleChange}
          placeholder="Số ngày hết hạn"
          className="border rounded px-3 py-2"
        />
        <input
          name="minOrderValue"
          value={form.minOrderValue}
          onChange={handleChange}
          placeholder="Giá trị đơn hàng tối thiểu"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 col-span-1 md:col-span-3 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          {editId ? "Cập nhật Voucher" : "Thêm Voucher"}
        </button>
      </form>

      {/* Danh sách voucher */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Giảm</th>
              <th className="px-4 py-2">Điểm đổi</th>
              <th className="px-4 py-2">Giới hạn</th>
              <th className="px-4 py-2">Hết hạn (ngày)</th>
              <th className="px-4 py-2">Đơn tối thiểu</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{v.name}</td>
                <td className="px-4 py-2">
                  {v.discount}
                  {parseFloat(v.discount) <= 100 ? "%" : "₫"}
                </td>
                <td className="px-4 py-2">{v.pointsRequired}</td>
                <td className="px-4 py-2">{v.redemptionLimit}</td>
                <td className="px-4 py-2">{v.expiryDays}</td>
                <td className="px-4 py-2">
                  {parseInt(v.minOrderValue).toLocaleString()}₫
                </td>
                <td className="px-4 py-2 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(v)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    title="Sửa"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Xoá"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
