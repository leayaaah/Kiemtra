import { useState, useEffect } from 'react'

// Hook này đã được viết sẵn để SV sử dụng cho Câu 9. SV không cần sửa.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch {}
  }, [key, value])

  return [value, setValue]
}
