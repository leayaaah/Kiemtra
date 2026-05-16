import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { transactionsState, typeFilterState, monthFilterState } from '../store/atoms'
import { getTransactions, deleteTransaction } from '../services/transactionApi'
import TransactionRow from '../components/TransactionRow'
import SearchBox from '../components/SearchBox'

function TransactionListPage() {
  const [transactions, setTransactions] = useRecoilState(transactionsState)
  const [typeFilter, setTypeFilter] = useRecoilState(typeFilterState)
  const [monthFilter, setMonthFilter] = useRecoilState(monthFilterState)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // TODO (Câu 2): Dùng useEffect để fetch danh sách giao dịch khi mount
  //   - Gọi getTransactions(), lưu vào transactionsState (Recoil)
  //   - Có loading
  //   - Có try/catch xử lý lỗi
  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getTransactions()
        if (mounted) setTransactions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch transactions:', err)
        if (mounted) setTransactions([])
        // Hiển thị lỗi đơn giản cho SV (có thể thay bằng toast)
        alert('Không thể tải danh sách giao dịch. Vui lòng thử lại sau.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  // Lấy danh sách tháng duy nhất (đã viết sẵn cho SV)
  // Tháng được lấy từ trường `date` của transaction (dạng 'YYYY-MM-DD' -> 'YYYY-MM')
  const months = useMemo(() => {
    const set = new Set()
    transactions.forEach(t => {
      if (t.date) set.add(t.date.substring(0, 7))
    })
    return ['all', ...Array.from(set).sort().reverse()]
  }, [transactions])

  // TODO (Câu 6): Lọc danh sách giao dịch hiển thị theo 3 điều kiện:
  //   - typeFilter: 'all' | 'income' | 'expense'
  //   - monthFilter: 'all' hoặc 'YYYY-MM' (so sánh với t.date.substring(0, 7))
  //   - keyword: tìm theo title (không phân biệt hoa thường)
  // Gợi ý: chỉ filter, KHÔNG cần useMemo (vì keyword đổi liên tục theo gõ phím).
  const displayedTransactions = transactions.filter(t => {
    // lọc theo loại
    if (typeFilter && typeFilter !== 'all' && t.type !== typeFilter) return false

    // lọc theo tháng
    if (monthFilter && monthFilter !== 'all') {
      if (!t.date || t.date.substring(0, 7) !== monthFilter) return false
    }

    // lọc theo từ khóa (title)
    if (keyword && keyword.trim() !== '') {
      const title = (t.title || '').toString().toLowerCase()
      if (!title.includes(keyword.toLowerCase())) return false
    }

    return true
  })

  // TODO (Câu 8): Viết handleDelete dùng useCallback
  //   - Có window.confirm trước khi xóa
  //   - Gọi deleteTransaction(id) bằng axios
  //   - Cập nhật transactionsState (loại bỏ giao dịch đã xóa)
  // Dùng useCallback giữ tham chiếu hàm `handleDelete` ổn định giữa các render.
  // Điều này giúp `TransactionRow` (được bọc bằng `memo`) tránh re-render
  // không cần thiết; nếu `handleDelete` được tạo lại mỗi lần (inline)
  // thì prop `onDelete` sẽ luôn khác và `memo` không có hiệu quả.
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa giao dịch này?')) return

    try {
      setLoading(true)
      await deleteTransaction(id)
      // Cập nhật Recoil state: loại bỏ giao dịch đã xóa
      setTransactions(prev => prev.filter(t => String(t.id) !== String(id)))
    } catch (err) {
      console.error('Failed to delete transaction:', err)
      alert('Không thể xóa giao dịch. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [setTransactions])

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>📋 Danh sách giao dịch</h2>

      <div className="filter-bar">
        <SearchBox value={keyword} onChange={setKeyword} />

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">Tất cả loại</option>
          <option value="income">Thu nhập</option>
          <option value="expense">Chi tiêu</option>
        </select>

        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          {months.map(m => (
            <option key={m} value={m}>{m === 'all' ? 'Tất cả tháng' : `Tháng ${m}`}</option>
          ))}
        </select>
      </div>

      {loading && <p>⏳ Đang tải dữ liệu...</p>}

      {!loading && displayedTransactions.length === 0 && (
        <div className="card empty-state">Không có giao dịch nào phù hợp 💼</div>
      )}

      {!loading && displayedTransactions.length > 0 && (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Loại</th>
                <th style={{ textAlign: 'right' }}>Số tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  onView={() => navigate(`/transactions/${t.id}`)}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TransactionListPage
