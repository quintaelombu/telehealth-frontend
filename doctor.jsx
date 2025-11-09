
import { useState } from 'react'
import { BACKEND } from '@/lib/config'

export default function Doctor() {
  const [email, setEmail] = useState('jegaldeano@hotmail.com')
  const [password, setPassword] = useState('jegal2364')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState(null)

  const login = async () => {
    setMessage(null)
    try {
      const res = await fetch(`${BACKEND}/auth/login`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Error al iniciar sesión')
      setToken(data?.access_token || '(token recibido)')
      setMessage('Ingreso correcto.')
    } catch (e) {
      setMessage(e.message || 'Error inesperado')
    }
  }

  return (
    <div className="container">
      <h1>Panel médico</h1>
      <div className="card">
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn-primary" onClick={login}>Ingresar</button>
        {message && <div className="card" style={{marginTop:12}}>{message}</div>}
        {token && <div className="card" style={{marginTop:12}}><div className="small">Token:</div><div className="small">{token}</div></div>}
      </div>
      <div className="footer small"><a className="link" href="/">← Volver al inicio</a></div>
    </div>
  )
}
