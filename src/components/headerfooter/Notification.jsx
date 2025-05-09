import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function Notification() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.UserID;
    } catch (err) {
      console.error("Lỗi giải mã token:", err);
      toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    }
  }

  const fetchNotifications = async () => {
    if (token && userId) {
      try {
        const response = await getNotifications(token);
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        toast.error("Không thể tải thông báo.");
      }
    }
  };

  // Gọi fetchNotifications khi component mount và polling mỗi 10 giây
  useEffect(() => {
    fetchNotifications(); // Gọi ngay khi mount
    const interval = setInterval(fetchNotifications, 10000); // Polling mỗi 10 giây
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [token, userId]); // Dependency để đảm bảo gọi lại khi token hoặc userId thay đổi

  const handleMarkAsRead = async (notificationId) => {
    if (token) {
      try {
        await markNotificationAsRead(notificationId, token);
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.NotificationID === notificationId
              ? { ...noti, IsRead: true }
              : noti
          )
        );
        toast.success("Đã đánh dấu thông báo là đã đọc.");
      } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo:", error);
        toast.error("Không thể đánh dấu thông báo là đã đọc.");
      }
    }
  };

  const unreadCount = notifications.filter((noti) => !noti.IsRead).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-8 h-8 flex items-center justify-center"
      ref={notificationRef}
    >
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-black hover:text-[#dd3333] w-full h-full flex items-center justify-center"
      >
        <Bell size={26} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 font-bold text-gray-800 border-b text-lg text-center">
            Thông báo
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((noti) => (
                <div
                  key={noti.NotificationID}
                  className="flex items-start gap-2 px-4 py-3 hover:bg-gray-100 transition text-sm cursor-pointer text-left"
                  onClick={() =>
                    !noti.IsRead && handleMarkAsRead(noti.NotificationID)
                  }
                >
                  {!noti.IsRead && (
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  )}
                  <div>
                    <div className="text-gray-700 font-medium">{noti.Title}</div>
                    <div className="text-gray-600">{noti.Message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                Không có thông báo
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;