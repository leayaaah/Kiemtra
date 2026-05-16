import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTransactionById } from '../services/transactionApi'

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
}

function TransactionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)

  // TODO (Câu 5): Dùng useEffect để:
  //   - Gọi getTransactionById(id), lưu kết quả vào state `transaction`
  //   - Có xử lý loading
  //   - Khi id thay đổi thì fetch lại
  useEffect(() => {
    let mounted = true
    const fetchDetail = async () => {
      setLoading(true)
      try {
        const data = await getTransactionById(id)
        if (mounted) setTransaction(data)
      } catch (err) {
        console.error('Failed to fetch transaction detail:', err)
        if (mounted) setTransaction(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (id) fetchDetail()
    return () => { mounted = false }
  }, [id])

  if (loading) return <p>⏳ Đang tải...</p>
  if (!transaction) return <p>Không tìm thấy giao dịch</p>

  const isIncome = transaction.type === 'income'

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Quay lại</button>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {isIncome ? '💵 Thu nhập' : '💸 Chi tiêu'}
        </span>
        <h2 style={{ marginTop: 16 }}>{transaction.title}</h2>
        <div className={`amount ${isIncome ? 'amount-income' : 'amount-expense'}`}
             style={{ fontSize: 36, fontWeight: 'bold', marginTop: 8 }}>
          {isIncome ? '+' : '−'} {formatVND(transaction.amount)}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, marginTop: 16 }}>
        <p style={{ marginBottom: 10 }}><b>📅 Ngày:</b> {transaction.date}</p>
        <p style={{ marginBottom: 10 }}><b>🏷️ Danh mục:</b> {transaction.category}</p>
        <p><b>📝 Ghi chú:</b> {transaction.note || '(không có)'}</p>
      </div>
    </div>
  )
}

export default TransactionDetailPage
