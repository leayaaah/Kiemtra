import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '../store/atoms'
import { useLocalStorage } from '../hooks/useLocalStorage'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const setUser = useSetRecoilState(userState)
  const navigate = useNavigate()

  // TODO (Câu 9): Dùng useLocalStorage để có biến savedUser
  //   const [savedUser, setSavedUser] = useLocalStorage('user', null)

  // TODO (Câu 9): Viết handleLogin:
  //   - Validate: username và password không rỗng
  //   - Đúng (user / 2025) -> setUser({ username }), setSavedUser({ username }), navigate('/')
  //   - Sai -> setError("Sai tài khoản hoặc mật khẩu")
  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu')
      return
    }

    if (username === 'user' && password === '2025') {
      setUser({ username })
      // Note: savedUser via useLocalStorage is part of Câu 9; omitted here
      navigate('/')
    } else {
      setError('Sai tài khoản hoặc mật khẩu')
    }
  }

  return (
    <div className="login-box">
      <h2 style={{ marginBottom: 20, textAlign: 'center', color: '#10b981' }}>🔐 ĐĂNG NHẬP</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Tên đăng nhập</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="error-text">⚠ {error}</p>}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 10 }}>
          Đăng nhập
        </button>
      </form>
      <p style={{ marginTop: 12, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
        Gợi ý: user / 2025
      </p>
    </div>
  )
}

export default LoginPage
