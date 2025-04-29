import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

function Notification() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const notifications = [
    { id: 1, message: "Có đơn hàng mới", time: "2 phút trước", read: false },
    { id: 2, message: "Người dùng mới đăng ký", time: "5 phút trước", read: true },
    { id: 3, message: "Sản phẩm hết hàng", time: "1 giờ trước", read: false },
  ];

  const unreadCount = notifications.filter(noti => !noti.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-8 h-8 flex items-center justify-center" ref={notificationRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-black hover:text-[#dd3333] w-full h-full flex items-center justify-center"
      >
        <Bell size={26} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 font-bold text-gray-800 border-b text-lg">Thông báo</div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((noti) => (
                <div
                  key={noti.id}
                  className="flex items-start gap-2 px-4 py-3 hover:bg-gray-100 transition text-sm"
                >
                  {!noti.read && <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>}
                  <div>
                    <div className="text-gray-700">{noti.message}</div>
                    <div className="text-xs text-gray-400">{noti.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                Không có thông báo
              </div>
            )}
          </div>
          <Link
            to="/admin/notifications"
            className="block text-center text-[#dd3333] font-semibold text-sm py-3 hover:bg-gray-100"
          >
            Xem tất cả
          </Link>
        </div>
      )}
    </div>
  );
}

export default Notification;
