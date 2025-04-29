import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { getCartAPI } from "../../api/api";
import { jwtDecode } from "jwt-decode";

function MiniCart() {
  const [cartItems, setCartItems] = useState([]);
  const [setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      const userId = decoded?.UserID;

      getCartAPI(userId, storedToken)
        .then((res) => {
          setCartItems(res.data.cartItems || []);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy giỏ hàng:", err);
        });
    }
  }, []);

  return (
    <div className="bg-white shadow-xl border rounded-lg z-50 p-5 w-96">
      <h4 className="font-bold text-lg mb-4">🛒 Giỏ hàng của bạn</h4>

      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          Chưa có sản phẩm nào trong giỏ.
        </p>
      ) : (
        <ul className="space-y-4 max-h-[350px] overflow-y-auto">
          {cartItems.map((item) => (
            <li key={item.CartID} className="flex items-center gap-4">
              <img
                src={item.Product?.ImageURL}
                alt={item.Product?.ProductName}
                className="w-14 h-14 object-cover rounded border"
              />
              <div className="flex-1">
                <p className="text-base font-medium line-clamp-1">
                  {item.Product?.ProductName}
                </p>
                <p className="text-sm text-gray-500">
                  Số lượng: {item.Quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#dd3333]">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.Product?.Price * item.Quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <div className="mt-5 text-center">
          <Link
            to="/cart"
            className="inline-block text-sm bg-[#dd3333] text-white px-5 py-2 rounded hover:bg-red-600 transition font-medium"
          >
            Xem chi tiết giỏ hàng
          </Link>
        </div>
      )}
    </div>
  );
}

export default MiniCart;
