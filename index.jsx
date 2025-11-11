
import { useState } from 'react'
import { BACKEND } from '@/lib/config'

export default function Home() {
  const [name, setName] = useState('')
  const [reason, setReason] = useState('Consulta pediátrica')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [joinUrl, setJoinUrl] = useState(null)
  const price = 40000
  const duration = 30

  const createAppointment = async () => {
    setLoading(true); setMessage(null); setJoinUrl(null)
    try {
      const res = await fetch(`${BACKEND}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: name || 'Paciente',
          patient_email: email || 'paciente@example.com',
          reason, price, duration, start_at,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Error al crear turno')

      if (data.checkout_url) {
        window.location.href = data.checkout_url
        return
      }
      if (data.join_url) setJoinUrl(data.join_url)
      setMessage('Turno generado.')
    } catch (e) {
      setMessage(e.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Teleconsulta con el Dr. Emilio Galdeano</h1>
      <h2>Pediatra Infectólogo — Atención online</h2>
      <div className="row" style={{marginTop:8}}>
        <span className="badge">Valor: $40.000</span>
        <span className="badge">Duración: 30 minutos</span>
        <span className="badge">Videollamada segura</span>
      </div>

      <div className="card">
        <h2>Solicitar turno y pagar consulta</h2>
        <div className="row">
          <div style={{flex:'1 1 260px'}}>
            <label>Nombre y apellido</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del paciente" />
          </div>
          <div style={{flex:'1 1 260px'}}>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
          </div>
        </div>
        <label>Motivo de consulta</label>
        <textarea rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Síntomas, edad, antecedentes..." />

        <div className="row">
          <button className="btn-primary" onClick={createAppointment} disabled={loading}>
            {loading ? 'Procesando...' : 'Solicitar turno y pagar consulta'}
          </button>
          <a className="btn-ghost" href="/doctor">Ir al panel médico</a>
        </div>

        {message && <div className="card" style={{marginTop:12}}>{message}</div>}
        {joinUrl && (
          <div className="card success" style={{marginTop:12}}>
            <div style={{marginBottom:8}}>Pago confirmado. Podés entrar a la videollamada:</div>
            <a className="link" href={joinUrl} target="_blank" rel="noreferrer">Unirme a la videollamada</a>
          </div>
        )}
      </div>

      <div className="footer">
        <div>Soporte: jegaldeano@hotmail.com</div>
      </div>
    </div>
  )
}
