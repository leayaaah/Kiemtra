import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import TransactionListPage from './pages/TransactionListPage.jsx'
import TransactionDetailPage from './pages/TransactionDetailPage.jsx'
import AddTransactionPage from './pages/AddTransactionPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  // TODO (Câu 9): Lấy user từ Recoil để hiển thị tên + nút Logout trên navbar
  // TODO (Câu 10): Bọc các route /add và /transactions/:id bằng ProtectedRoute

  return (
    <>
      <nav className="navbar">
        <h1>💰 EXPENSE TRACKER</h1>
        <div>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/transactions">Giao dịch</NavLink>
          <NavLink to="/add">Thêm giao dịch</NavLink>
          <NavLink to="/login">Đăng nhập</NavLink>
          {/* TODO (Câu 9): Khi đã login: ẩn link "Đăng nhập", hiện "Xin chào, {username}" + nút Logout */}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionListPage />} />
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          <Route path="/add" element={<AddTransactionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  )
}

export default App
