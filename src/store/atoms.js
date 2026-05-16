import { atom } from 'recoil'

// Các atom đã được khai báo sẵn. Câu 3 yêu cầu SV phải IMPORT và SỬ DỤNG ĐÚNG
// các atom này trong các trang thông qua useRecoilState / useRecoilValue / useSetRecoilState.

// Danh sách giao dịch (cả thu nhập và chi tiêu)
export const transactionsState = atom({
  key: 'transactionsState',
  default: [],
})

// User đang đăng nhập (null nếu chưa login, hoặc { username })
export const userState = atom({
  key: 'userState',
  default: null,
})

// Bộ lọc theo loại: 'all' | 'income' | 'expense'
export const typeFilterState = atom({
  key: 'typeFilterState',
  default: 'all',
})

// Bộ lọc theo tháng: 'all' hoặc '2025-01', '2025-02', ...
export const monthFilterState = atom({
  key: 'monthFilterState',
  default: 'all',
})

// Giải thích: Tách `typeFilterState` và `monthFilterState` thành 2 atom riêng thay
// vì các lý do sau:
// - Phân tách mối quan tâm (separation of concerns): mỗi atom chỉ lưu 1 mảnh
//   trạng thái độc lập (single responsibility), giúp code rõ ràng hơn.
// - Hiệu năng: Recoil cho phép các component chỉ subscribe vào atom mà chúng
//   cần. Nếu gộp cả hai vào một object chung, thay đổi một trường sẽ gây re-render
//   cho mọi component đọc object đó, kể cả khi họ chỉ quan tâm trường kia. Tách
//   atom giảm re-render không cần thiết.
// - Dễ cập nhật độc lập: việc set/clear một filter trở nên đơn giản với
//   `useSetRecoilState` hoặc `useRecoilState` mà không phải thao tác trên toàn bộ
//   object (tránh việc phải clone object và có thể gây lỗi khi merge).
