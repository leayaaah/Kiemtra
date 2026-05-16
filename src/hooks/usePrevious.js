import { useEffect, useRef } from 'react'

// TODO (Câu 4): Hoàn thiện custom hook usePrevious
export function usePrevious(value) {
  // tạo ref để lưu giá trị trước đó
  const prevRef = useRef()

  // cập nhật giá trị sau mỗi lần render
  useEffect(() => {
    prevRef.current = value
  }, [value])

  // trả về giá trị của lần render trước
  return prevRef.current
}

// TODO (Câu 4): Hoàn thiện custom hook usePrevious
// Mục đích: Lưu lại giá trị TRƯỚC ĐÓ của 1 biến (qua các lần render).
// Dùng để hiển thị mức tăng/giảm so với lần render trước.
//
// Cách dùng:
//   const totalBalance = ...    // tính từ state hiện tại
//   const previousBalance = usePrevious(totalBalance)
//   // Lần render đầu tiên: previousBalance === undefined
//   // Các lần render sau: previousBalance === giá trị `totalBalance` ở lần render trước
//
// Yêu cầu:
//   - Dùng useRef để lưu giá trị (không gây re-render khi đổi)
//   - Dùng useEffect (KHÔNG có dependency array hoặc có [value]) để cập nhật ref.current = value SAU mỗi lần render
//   - Trả về ref.current
//
// Gợi ý: vì useEffect chạy SAU khi render, lần render thứ N sẽ trả về giá trị từ lần render thứ N-1.
export function usePrevious(value) {
  // SV viết code ở đây
}
