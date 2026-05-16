import { memo } from 'react'

// CÂU 1 - Trả lời (bằng comment):
// 1) Các `props` mà `TransactionRow` nhận:
//    - `transaction` (object): chứa thông tin giao dịch (id, date, title,
//      category, type, amount). Dữ liệu này được dùng để hiển thị các ô trong
//      hàng.
//    - `onView` (function): callback để xử lý khi người dùng muốn xem chi tiết
//      giao dịch (được gán cho onClick của các ô và nút "Xem").
//    - `onDelete` (function): callback nhận `id` của giao dịch để xóa (gọi khi
//      bấm nút "Xóa").
//
// 2) Vì sao bọc bằng `React.memo` lại cần thiết khi danh sách giao dịch dài?
//    - `React.memo` làm một so sánh nông (shallow) giữa props cũ và mới, nếu
//      không thay đổi thì tránh re-render component. Với một danh sách dài,
//      tránh re-render không cần thiết cho mỗi hàng sẽ giảm công việc render
//      và cải thiện hiệu năng.
//    - Khi `memo` KHÔNG có tác dụng: nếu props luôn là giá trị mới ở mỗi
//      lần render (ví dụ parent tạo lại object `transaction` hoặc tạo callback
//      inline như `onDelete={() => ...}` mỗi lần), thì so sánh shallow luôn
//      nhận thấy khác nhau và `memo` không ngăn được re-render.
//    - Giải pháp: ở component cha, dùng `useCallback` để giữ tham chiếu cố định
//      cho các callback (`onView`, `onDelete`) và tránh tái tạo object `transaction`
//      khi không cần thiết. Hoặc cung cấp hàm so sánh tuỳ chỉnh cho `memo` nếu
//      cần so sánh sâu hơn.

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' ₫'
}

function TransactionRow({ transaction, onView, onDelete }) {
  const isIncome = transaction.type === 'income'

  return (
    <tr>
      <td onClick={onView}>{transaction.date || '—'}</td>
      <td onClick={onView}>{transaction.title}</td>
      <td onClick={onView}>{transaction.category}</td>
      <td onClick={onView}>
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {isIncome ? 'Thu' : 'Chi'}
        </span>
      </td>
      <td style={{ textAlign: 'right' }} onClick={onView}>
        <span className={`amount-cell ${isIncome ? 'positive' : 'negative'}`}>
          {isIncome ? '+' : '−'} {formatVND(transaction.amount)}
        </span>
      </td>
      <td>
        <button className="btn btn-ghost" onClick={onView}>Xem</button>
        <button className="btn btn-danger" onClick={() => onDelete(transaction.id)}>Xóa</button>
      </td>
    </tr>
  )
}

export default memo(TransactionRow)
