import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#dd3333] text-white flex flex-col">
        <div className="p-4 text-2xl font-bold tracking-wide">
          Cholimex Admin
        </div>
        <nav className="flex flex-col gap-2 p-4 text-lg">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-[#dd3333] font-semibold px-3 py-2 rounded-lg"
                : "px-3 py-2 rounded-lg hover:bg-white hover:text-[#dd3333]"
            }
          >
            Tổng Quan
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-[#dd3333] font-semibold px-3 py-2 rounded-lg"
                : "px-3 py-2 rounded-lg hover:bg-white hover:text-[#dd3333]"
            }
          >
            Sản Phẩm
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-[#dd3333] font-semibold px-3 py-2 rounded-lg"
                : "px-3 py-2 rounded-lg hover:bg-white hover:text-[#dd3333]"
            }
          >
            Danh Mục
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-[#dd3333] font-semibold px-3 py-2 rounded-lg"
                : "px-3 py-2 rounded-lg hover:bg-white hover:text-[#dd3333]"
            }
          >
            Đơn Hàng
          </NavLink>
          <NavLink
            to="/admin/loyalty"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-[#dd3333] font-semibold px-3 py-2 rounded-lg"
                : "px-3 py-2 rounded-lg hover:bg-white hover:text-[#dd3333]"
            }
          >
            Tích Lũy
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-[#dd3333] font-semibold px-3 py-2 rounded-lg"
                : "px-3 py-2 rounded-lg hover:bg-white hover:text-[#dd3333]"
            }
          >
            Người Dùng
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow-md px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#dd3333]">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Xin chào, Admin</span>
            <button className="text-[#dd3333] font-semibold hover:underline">Đăng xuất</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
