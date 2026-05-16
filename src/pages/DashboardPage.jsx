import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { transactionsState } from '../store/atoms'
import { usePrevious } from '../hooks/usePrevious'

// Hàm format tiền VND - đã viết sẵn
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
}

function DashboardPage() {
  const transactions = useRecoilValue(transactionsState)

  // TODO (Câu 6): Dùng useMemo tính các con số tổng quát:
  //   - totalIncome  : tổng tiền các giao dịch type === 'income'
  //   - totalExpense : tổng tiền các giao dịch type === 'expense'
  //   - balance      : totalIncome - totalExpense
  //   - byCategory   : object { categoryName: totalAmount } - CHỈ tính các giao dịch type === 'expense'
  //                    ví dụ: { 'Ăn uống': 500000, 'Đi lại': 200000 }
  const stats = useMemo(() => {
    let totalIncome = 0
    let totalExpense = 0
    const byCategory = {}

    transactions.forEach(t => {
      const amount = Number(t.amount) || 0
      if (t.type === 'income') {
        totalIncome += amount
      } else if (t.type === 'expense') {
        totalExpense += amount
        const cat = t.category || 'Khác'
        byCategory[cat] = (byCategory[cat] || 0) + amount
      }
    })

    const balance = totalIncome - totalExpense
    return { totalIncome, totalExpense, balance, byCategory }
  }, [transactions])

  // Giải thích: dùng `useMemo` để tránh tính toán lại (iterate qua transactions)
  // mỗi lần component render nếu `transactions` không thay đổi. Khi dữ liệu
  // tăng lên hàng nghìn giao dịch, việc lặp và cộng dồn nhiều lần sẽ tốn CPU
  // và làm chậm render; `useMemo` cache kết quả cho tới khi `transactions`
  // thay đổi, giúp cải thiện hiệu năng.

  // TODO (Câu 4): Dùng custom hook usePrevious để lưu balance ở lần render trước
  // Sau đó tính ra `balanceChange` để hiển thị mức tăng/giảm:
  //   - Nếu prev === undefined hoặc prev === stats.balance: không hiển thị
  //   - Ngược lại: hiển thị "▲ +500.000 ₫" (xanh) hoặc "▼ -200.000 ₫" (đỏ)
  const previousBalance = usePrevious(stats.balance)
  const balanceChange = previousBalance !== undefined ? stats.balance - previousBalance : 0

  // Tính category lớn nhất để xác định bar đầy 100%
  const maxCategoryAmount = Math.max(...Object.values(stats.byCategory), 1)

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>📊 Dashboard tài chính</h2>

      <div className="summary">
        <div className="summary-card income">
          <div className="label">💵 Tổng thu nhập</div>
          <div className="amount amount-income">{formatVND(stats.totalIncome)}</div>
        </div>
        <div className="summary-card expense">
          <div className="label">💸 Tổng chi tiêu</div>
          <div className="amount amount-expense">{formatVND(stats.totalExpense)}</div>
        </div>
        <div className="summary-card balance">
          <div className="label">💰 Số dư hiện tại</div>
          <div className="amount amount-balance">{formatVND(stats.balance)}</div>
          {balanceChange !== 0 && (
            <div style={{ fontSize: 13, marginTop: 6, color: balanceChange > 0 ? '#10b981' : '#dc2626' }}>
              {balanceChange > 0 ? '▲' : '▼'} {formatVND(Math.abs(balanceChange))} so với lần trước
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>📈 Phân bổ chi tiêu theo danh mục</h3>
        {Object.keys(stats.byCategory).length === 0 ? (
          <p style={{ marginTop: 10, color: '#6b7280' }}>Chưa có chi tiêu nào</p>
        ) : (
          <div className="category-bars">
            {Object.entries(stats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => (
                <div key={cat} className="category-row">
                  <span className="category-name">{cat}</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${(amount / maxCategoryAmount) * 100}%` }} />
                  </div>
                  <span className="category-amount">{formatVND(amount)}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
