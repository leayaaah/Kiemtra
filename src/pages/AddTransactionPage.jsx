import { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { transactionsState } from '../store/atoms'
import { addTransaction } from '../services/transactionApi'

// Danh sách category cho từng loại - đã viết sẵn cho SV
const EXPENSE_CATEGORIES = ['Ăn uống', 'Đi lại', 'Mua sắm', 'Giải trí', 'Y tế', 'Hóa đơn', 'Khác']
const INCOME_CATEGORIES  = ['Lương', 'Thưởng', 'Đầu tư', 'Khác']

// TODO (Câu 7): Hoàn thiện reducer cho form thêm giao dịch.
// State gồm: title, amount, type ('expense'|'income'), category, date, note, error
//
// Action cần xử lý:
//   - { type: 'SET_FIELD', field, value }   -> cập nhật 1 trường thường
//   - { type: 'CHANGE_TYPE', value }        -> đổi type, đồng thời RESET category về '' (vì category phụ thuộc type)
//   - { type: 'SET_ERROR', error }          -> gán error
//   - { type: 'RESET' }                     -> reset về initialState

const initialState = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().substring(0, 10), // YYYY-MM-DD hôm nay
  note: '',
  error: '',
}

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'CHANGE_TYPE':
      return { ...state, type: action.value, category: '' }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

function AddTransactionPage() {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const setTransactions = useSetRecoilState(transactionsState)
  const navigate = useNavigate()

  const handleChange = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value })
  }

  // Tùy theo type mà danh sách category hiển thị khác nhau
  const categories = state.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  // TODO (Câu 7): handleSubmit phải:
  //   1. Validate:
  //       - title không rỗng
  //       - amount là số > 0
  //       - category không rỗng
  //       - date không rỗng (và đúng định dạng YYYY-MM-DD)
  //      Sai -> dispatch SET_ERROR và dừng.
  //   2. Chuẩn hóa: amount phải convert sang Number
  //   3. Gọi addTransaction(payload), cập nhật transactionsState (thêm vào ĐẦU danh sách để giao dịch mới nhất ở trên)
  //   4. dispatch RESET, navigate('/transactions')
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate
    if (!state.title || state.title.trim() === '') {
      dispatch({ type: 'SET_ERROR', error: 'Tiêu đề không được để trống' })
      return
    }

    const amountNum = Number(state.amount)
    if (!isFinite(amountNum) || amountNum <= 0) {
      dispatch({ type: 'SET_ERROR', error: 'Số tiền phải là số lớn hơn 0' })
      return
    }

    if (!state.category || state.category.trim() === '') {
      dispatch({ type: 'SET_ERROR', error: 'Vui lòng chọn danh mục' })
      return
    }

    if (!state.date || !/^\d{4}-\d{2}-\d{2}$/.test(state.date)) {
      dispatch({ type: 'SET_ERROR', error: 'Vui lòng chọn ngày hợp lệ' })
      return
    }

    // Chuẩn hóa payload
    const payload = {
      title: state.title.trim(),
      amount: amountNum,
      type: state.type,
      category: state.category,
      date: state.date,
      note: state.note || '',
    }

    try {
      const created = await addTransaction(payload)
      // Thêm vào đầu danh sách transactions
      setTransactions(prev => [created, ...prev])
      dispatch({ type: 'RESET' })
      navigate('/transactions')
    } catch (err) {
      console.error('Failed to add transaction:', err)
      dispatch({ type: 'SET_ERROR', error: 'Không thể lưu giao dịch. Vui lòng thử lại.' })
    }
  }

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>➕ Thêm giao dịch mới</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Loại giao dịch *</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className={state.type === 'expense' ? 'btn btn-danger' : 'btn btn-ghost'}
              onClick={() => dispatch({ type: 'CHANGE_TYPE', value: 'expense' })}
              style={{ flex: 1 }}
            >💸 Chi tiêu</button>
            <button
              type="button"
              className={state.type === 'income' ? 'btn btn-success' : 'btn btn-ghost'}
              onClick={() => dispatch({ type: 'CHANGE_TYPE', value: 'income' })}
              style={{ flex: 1 }}
            >💵 Thu nhập</button>
          </div>
        </div>

        <div className="form-group">
          <label>Tiêu đề *</label>
          <input name="title" value={state.title} onChange={handleChange} placeholder="vd: Ăn trưa quán phở" />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Số tiền (VND) *</label>
            <input type="number" name="amount" value={state.amount} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Ngày *</label>
            <input type="date" name="date" value={state.date} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Danh mục *</label>
          <select name="category" value={state.category} onChange={handleChange}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Ghi chú</label>
          <textarea name="note" value={state.note} onChange={handleChange} rows={3} />
        </div>

        {state.error && <p className="error-text">⚠ {state.error}</p>}

        <button type="submit" className="btn btn-primary">Lưu giao dịch</button>
        <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'RESET' })}>
          Làm mới
        </button>
      </form>
    </div>
  )
}

export default AddTransactionPage
