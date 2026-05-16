# 💰 Đề kiểm tra React - Expense Tracker

## Hướng dẫn chạy

```bash
npm install
npm run dev
```

## Cấu trúc thư mục

```
src/
 ├── components/
 │    ├── TransactionRow.jsx        (Câu 1 - memo, props)
 │    └── SearchBox.jsx             (Câu 1 - useRef)
 ├── hooks/
 │    ├── usePrevious.js            (Câu 4 - custom hook)
 │    └── useLocalStorage.js        (đã viết sẵn - dùng cho Câu 9)
 ├── pages/
 │    ├── DashboardPage.jsx         (Câu 4, 6 - useMemo + usePrevious)
 │    ├── TransactionListPage.jsx   (Câu 2, 6, 8)
 │    ├── TransactionDetailPage.jsx (Câu 5)
 │    ├── AddTransactionPage.jsx    (Câu 7 - useReducer)
 │    └── LoginPage.jsx             (Câu 9)
 ├── services/
 │    └── transactionApi.js         (axios)
 ├── store/
 │    └── atoms.js                  (Câu 3 - Recoil)
 ├── App.jsx                        (Câu 9, 10 - routes, ProtectedRoute)
 └── main.jsx
```

## Cấu trúc dữ liệu 1 giao dịch

```json
{
  "id": 1,
  "title": "Ăn trưa",
  "amount": 50000,
  "type": "expense",
  "category": "Ăn uống",
  "date": "2025-01-15",
  "note": "Quán phở Hùng"
}
```

- `type`: `"income"` (thu) hoặc `"expense"` (chi)
- `date`: định dạng `YYYY-MM-DD`
- `category` (expense): Ăn uống, Đi lại, Mua sắm, Giải trí, Y tế, Hóa đơn, Khác
- `category` (income): Lương, Thưởng, Đầu tư, Khác

## API

Tạo mockapi.io với resource `transactions` rồi thay `API_URL` trong `src/services/transactionApi.js`.

NOTE: Nếu endpoint API mock chưa hoạt động, `getTransactions()` sẽ trả về mảng dữ liệu mẫu tạm thời
để giao diện có thể hiển thị danh sách. Khi nộp bài, ưu tiên cấu hình mock API và thay `API_URL`.

## Nộp bài

Nén thư mục (KHÔNG kèm `node_modules`) thành `<MSSV>_<HoTen>.zip` và nộp lên LMS.
