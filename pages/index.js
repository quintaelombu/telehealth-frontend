//pages/index.js
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("Consulta pediátrica");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [joinUrl, setJoinUrl] = useState(null);

  const price = 40000;      // 💰 Prueba $100
  const duration = 30;    // minutos

  const buildStartAt = () => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  };

  const createAppointment = async () => {
    setLoading(true);
    setMsg(null);
    setJoinUrl(null);

    try {
      const start_at = buildStartAt();
      if (!start_at) throw new Error("Elegí fecha y hora.");

      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: name || "Paciente",
          patient_email: email || "paciente@example.com",
          reason,
          price,
          duration,
          start_at,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      // Si Mercado Pago devuelve checkout_url, redirigimos
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      // Si hubiera join_url (por ejemplo, link de videollamada)
      if (data.join_url) {
        setJoinUrl(data.join_url);
        setMsg("Turno creado correctamente.");
        return;
      }

      setMsg("Turno creado. Esperando confirmación de pago.");
    } catch (e) {
      setMsg(e.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrap: {
      maxWidth: 880,
      margin: "0 auto",
      padding: 24,
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    h1: { fontSize: 28, margin: 0 },
    h2: { fontSize: 16, color: "#5f6c7b", marginTop: 6 },
    card: {
      border: "1px solid #e6e9ec",
      borderRadius: 16,
      padding: 20,
      marginTop: 16,
      background: "#fff",
    },
    row: { display: "flex", gap: 12, flexWrap: "wrap" },
    label: { fontSize: 14, color: "#5f6c7b", margin: "12px 0 6px" },
    input: {
      width: "100%",
      padding: "12px 14px",
      border: "1px solid #d7dce1",
      borderRadius: 12,
      fontSize: 16,
    },
    btn: {
      border: 0,
      borderRadius: 12,
      padding: "14px 16px",
      fontWeight: 700,
      fontSize: 16,
      cursor: "pointer",
    },
    primary: { background: "#0a2540", color: "#fff" },
    ghost: { background: "#f5f7fa", color: "#0a2540" },
    badge: {
      display: "inline-block",
      background: "#eef3f8",
      color: "#0a2540",
      fontWeight: 600,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      marginRight: 8,
    },
    ok: {
      background: "#fff",
      border: "1px solid #e6e9ec",
      borderRadius: 12,
      padding: 12,
      marginTop: 12,
      fontSize: 14,
    },
  };

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Teleconsulta con el Dr. Emilio Galdeano</h1>
      <div style={styles.h2}>Pediatra Infectólogo — Atención online</div>

      <div style={{ marginTop: 8 }}>
        <span style={styles.badge}>Valor: ${price}</span>
        <span style={styles.badge}>Duración: {duration} min</span>
        <span style={styles.badge}>Videollamada segura</span>
      </div>

      <div style={styles.card}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>
          Solicitar turno y pagar
        </div>

        <div style={styles.row}>
          <div style={{ flex: "1 1 260px" }}>
            <div style={styles.label}>Nombre y apellido</div>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del paciente"
            />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <div style={styles.label}>Email</div>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        <div style={styles.label}>Motivo de consulta</div>
        <textarea
          rows={3}
          style={{ ...styles.input, height: 100 }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Síntomas, edad, antecedentes..."
        />

        <div style={styles.row}>
          <div style={{ flex: "1 1 160px" }}>
            <div style={styles.label}>Fecha</div>
            <input
              style={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <div style={styles.label}>Hora</div>
            <input
              style={styles.input}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button
            style={{ ...styles.btn, ...styles.primary }}
            onClick={createAppointment}
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : "Solicitar turno y pagar consulta"}
          </button>

          <a
            href="/doctor"
            style={{
              ...styles.btn,
              ...styles.ghost,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Panel médico
          </a>
        </div>

        {msg && <div style={styles.ok}>{msg}</div>}

        {joinUrl && (
          <div style={styles.ok}>
            <div style={{ marginBottom: 6 }}>
              Pago confirmado. Enlace de videollamada:
            </div>
            <a href={joinUrl} target="_blank" rel="noreferrer">
              Unirme a la videollamada
            </a>
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, color: "#8a98a6", marginTop: 16 }}>
        Soporte: jegaldeano@hotmail.com
      </div>
    </div>
  );
}
