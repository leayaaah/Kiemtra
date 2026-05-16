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
