import axios from 'axios'

export const API_URL = 'https://REPLACE_WITH_YOUR_MOCKAPI_URL/transactions'

// TODO (Câu 2): Viết hàm GET danh sách giao dịch bằng axios
export async function getTransactions() {
  try {
    const res = await axios.get(API_URL)
    return res.data
  } catch (err) {
    // Nếu API mock chưa cấu hình / offline, trả về dữ liệu mẫu tạm thời
    console.warn('getTransactions failed, returning fallback data:', err.message)
    return [
      { id: '1', title: 'Lương tháng 1', amount: 15000000, type: 'income', category: 'Lương', date: '2025-01-25', note: '' },
      { id: '2', title: 'Ăn trưa', amount: 60000, type: 'expense', category: 'Ăn uống', date: '2025-01-26', note: '' },
      { id: '3', title: 'Tiền điện', amount: 350000, type: 'expense', category: 'Hóa đơn', date: '2025-01-20', note: '' },
      { id: '4', title: 'Bán cổ phiếu', amount: 2000000, type: 'income', category: 'Đầu tư', date: '2025-01-15', note: '' }
    ]
  }
}

// TODO (Câu 5): Viết hàm GET chi tiết giao dịch theo id
export async function getTransactionById(id) {
  try {
    const res = await axios.get(`${API_URL}/${id}`)
    return res.data
  } catch (err) {
    // Re-throw để component caller có thể xử lý (show message, fallback...)
    throw err
  }
}

// TODO (Câu 7): Viết hàm POST thêm giao dịch mới
export async function addTransaction(transaction) {
  try {
    const res = await axios.post(API_URL, transaction)
    return res.data
  } catch (err) {
    // Nếu API không hoạt động, trả về đối tượng tạm với id sinh ra tại client
    console.warn('addTransaction failed, returning fallback object:', err.message)
    return { ...transaction, id: Date.now().toString() }
  }
}

// TODO (Câu 8): Viết hàm DELETE giao dịch theo id
export async function deleteTransaction(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`)
    return res.data
  } catch (err) {
    // Re-throw so caller có thể xử lý (component sẽ catch và hiển thị lỗi)
    throw err
  }
}

// TODO (Câu 8 - mở rộng): Viết hàm PUT cập nhật toàn bộ giao dịch
export async function updateTransaction(id, transaction) {
  // axios.put(`${API_URL}/${id}`, transaction)
}
