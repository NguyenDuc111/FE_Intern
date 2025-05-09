import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  getUserPointsByAdmin,
  updateLoyaltyPoint,
  deleteLoyaltyPoint,
  getAllUsers,
} from "../../api/api";

// Component for editing a point entry
const EditPointForm = ({ point, onSave, onCancel }) => {
  const [points, setPoints] = useState(point.Points);
  const [description, setDescription] = useState(point.Description || "");

  const handleSubmit = () => {
    if (!Number.isFinite(Number(points)) || points === 0) {
      toast.error("Points must be a non-zero number.");
      return;
    }
    onSave({ Points: Number(points), Description: description });
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="p-4 bg-gray-50 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="mb-4">
        <label className="block mb-1.5 font-medium text-gray-700">
          Points <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1.5 font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onCancel}
          className="px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md"
        >
          Cancel
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleSubmit}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md"
        >
          Save
        </motion.button>
      </div>
    </motion.div>
  );
};

// Component for viewing points details in a modal
const PointsDetailModal = ({
  user,
  points,
  totalPoints,
  onClose,
  onEdit,
  onDelete,
}) => {
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl w-[800px] max-w-[95vw] h-auto max-h-[95vh] relative flex flex-col shadow-2xl border border-gray-200 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Email: {user.Email}
          </p>
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Tổng điểm tích lũy của{" "}
            <strong>
              {user.FullName} : {totalPoints}
            </strong>
          </p>
          {points.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              Người dùng này chưa có điểm tích lũy nào
            </p>
          ) : (
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-200"
            >
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Point ID
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Points
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <motion.tr
                      key={point.PointID}
                      variants={rowVariants}
                      className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {point.PointID}
                      </td>
                      <td className="px-6 py-4">
                        {point.Points > 0 ? `+${point.Points}` : point.Points}
                      </td>
                      <td className="px-6 py-4">{point.Description}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => onEdit(point.PointID)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                          >
                            <PencilIcon className="h-5 w-5" />
                            Edit
                          </motion.button>
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => onDelete(point.PointID)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                          >
                            <TrashIcon className="h-5 w-5" />
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
        <div className="p-6 border-t">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md w-full"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const LoyaltyManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [points, setPoints] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingPointId, setEditingPointId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        toast.error("Please log in to continue.");
        navigate("/admin/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.RoleName !== "admin") {
          toast.error("You do not have access permission.");
          navigate("/admin/login");
          return;
        }

        setLoading(true);
        const res = await getAllUsers();
        // Filter users to only include those with RoleName "user"
        const filteredUsers = (res.data || []).filter(
          (user) => user.Role.RoleName === "user"
        );
        setUsers(filteredUsers);
      } catch (err) {
        toast.error(err.response?.data?.error || "Unable to load users list.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate, token]);

  const handleViewPoints = async (userId) => {
    try {
      setLoading(true);
      const res = await getUserPointsByAdmin(token, userId);
      const { user, totalPoints, history } = res.data;
      setSelectedUser(user);
      setPoints(history || []);
      setTotalPoints(totalPoints || 0);
    } catch (err) {
      toast.error(err.response?.data?.error || "Unable to load points list.");
      setPoints([]);
      setTotalPoints(0);
      setSelectedUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePoint = async (pointId, data) => {
    try {
      await updateLoyaltyPoint(pointId, data, token);
      const updatedPoints = points.map((point) =>
        point.PointID === pointId ? { ...point, ...data } : point
      );
      setPoints(updatedPoints);
      const updatedTotal = updatedPoints.reduce(
        (sum, point) => sum + point.Points,
        0
      );
      setTotalPoints(updatedTotal);
      setEditingPointId(null);
      toast.success("Points updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update points.");
    }
  };

  const handleDeletePoint = async (pointId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteLoyaltyPoint(pointId, token);
        const updatedPoints = points.filter(
          (point) => point.PointID !== pointId
        );
        setPoints(updatedPoints);
        const updatedTotal = updatedPoints.reduce(
          (sum, point) => sum + point.Points,
          0
        );
        setTotalPoints(updatedTotal);
        toast.success("Point record deleted successfully.");
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to delete record.");
      }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-800 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-600">
        📈 Loyalty Points Management
      </h1>

      {users.length === 0 ? (
        <motion.p
          className="text-center text-gray-600 text-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          No users available.
        </motion.p>
      ) : (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-200"
        >
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  User ID
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.UserID}
                  variants={rowVariants}
                  className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.UserID}
                  </td>
                  <td className="px-6 py-4">{user.FullName}</td>
                  <td className="px-6 py-4">{user.Email}</td>
                  <td className="px-6 py-4 text-center">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleViewPoints(user.UserID)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <EyeIcon className="h-5 w-5" />
                      View Points
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedUser && (
          <PointsDetailModal
            user={selectedUser}
            points={points}
            totalPoints={totalPoints}
            onClose={() => {
              setSelectedUser(null);
              setPoints([]);
              setTotalPoints(0);
            }}
            onEdit={setEditingPointId}
            onDelete={handleDeletePoint}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingPointId && (
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
            onClick={(e) =>
              e.target === e.currentTarget && setEditingPointId(null)
            }
          >
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl w-[600px] max-w-[95vw] h-auto max-h-[95vh] relative flex flex-col shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex-1 flex flex-col overflow-hidden">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  📝 Edit Loyalty Point
                </h2>
                <EditPointForm
                  point={points.find((p) => p.PointID === editingPointId)}
                  onSave={(data) => handleUpdatePoint(editingPointId, data)}
                  onCancel={() => setEditingPointId(null)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoyaltyManager;
