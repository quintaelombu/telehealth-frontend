// pages/index.js
import { useState } from "react";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://telehealth-backend-production-0021.up.railway.app";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("Consulta pediátrica");
  const [date, setDate] = useState("");     // YYYY-MM-DD
  const [time, setTime] = useState("");     // HH:MM (24h)
  const [loading, setLoading] = useState(false);

  // Para depurar SIEMPRE:
  const [rawText, setRawText] = useState("");      // respuesta como texto
  const [parsedObj, setParsedObj] = useState(null); // respuesta parseada (obj/array)
  const [joinUrl, setJoinUrl] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const price = 40000;
  const duration = 30;

  const buildStartAt = () => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  };

  const toPretty = (val) =>
    typeof val === "string" ? val : JSON.stringify(val, null, 2);

  const createAppointment = async () => {
    setLoading(true);
    setRawText("");
    setParsedObj(null);
    setJoinUrl(null);
    setStatusMsg("");

    try {
      const start_at = buildStartAt();
      if (!start_at) throw new Error("Elegí fecha y hora.");

      const res = await fetch(`${BACKEND}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  patient_name: name || "Paciente",
  patient_email: email || "paciente@example.com",
  reason,
  price,
  duration,
  when_at: start_at,  // 👈 cambio clave
}),      });

      const text = await res.text();
      setRawText(text); // SIEMPRE guardo el texto crudo

      let data = null;
      try {
        data = JSON.parse(text);
        setParsedObj(data); // también guardo el objeto (si es JSON)
      } catch {
        // no es JSON, listo
      }

      if (!res.ok) {
        const msg =
          (data && data.detail) ||
          text ||
          "No se pudo crear el turno.";
        throw new Error(msg);
      }

      if (data && typeof data === "object") {
        if (data.checkout_url) {
          setStatusMsg("Redirigiendo a Mercado Pago…");
          window.location.href = data.checkout_url;
          return;
        }
        if (data.join_url) {
          setJoinUrl(data.join_url);
          setStatusMsg("Turno confirmado. Enlace de videollamada abajo.");
          return;
        }
      }

      setStatusMsg("Turno creado. Respuesta recibida abajo.");
    } catch (err) {
      setStatusMsg(err.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrap: { maxWidth: 880, margin: "0 auto", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" },
    h1: { fontSize: 28, margin: 0 },
    h2: { fontSize: 16, color: "#5f6c7b", marginTop: 6 },
    card: { border: "1px solid #e6e9ec", borderRadius: 16, padding: 20, marginTop: 16 },
    row: { display: "flex", gap: 12, flexWrap: "wrap" },
    label: { fontSize: 14, color: "#5f6c7b", marginBottom: 6 },
    input: { width: "100%", padding: "12px 14px", border: "1px solid #d7dce1", borderRadius: 12, fontSize: 16 },
    btn: { border: 0, borderRadius: 12, padding: "14px 16px", fontWeight: 700, fontSize: 16, cursor: "pointer" },
    primary: { background: "#0a2540", color: "#fff" },
    ghost: { background: "#f5f7fa", color: "#0a2540" },
    badge: { display: "inline-block", background: "#eef3f8", color: "#0a2540", fontWeight: 600, padding: "6px 10px", borderRadius: 999, fontSize: 12, marginRight: 8 },
    box: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginTop: 12 },
    pre: { whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 13, margin: 0 },
  };

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Teleconsulta con el Dr. Emilio Galdeano</h1>
      <div style={styles.h2}>Pediatra Infectólogo — Atención online</div>

      <div style={{ marginTop: 8 }}>
        <span style={styles.badge}>Valor: $40.000</span>
        <span style={styles.badge}>Duración: 30 min</span>
        <span style={styles.badge}>Videollamada segura</span>
      </div>

      <div style={styles.card}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Solicitar turno y pagar</div>

        <div style={styles.row}>
          <div style={{ flex: "1 1 260px" }}>
            <div style={styles.label}>Nombre y apellido</div>
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del paciente" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <div style={styles.label}>Email</div>
            <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
          </div>
        </div>

        <div style={styles.label}>Motivo de consulta</div>
        <textarea rows={3} style={{ ...styles.input, height: 100 }} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Síntomas, edad, antecedentes..." />

        <div style={styles.row}>
          <div style={{ flex: "1 1 160px" }}>
            <div style={styles.label}>Fecha</div>
            <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <div style={styles.label}>Hora</div>
            <input style={styles.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <button
            style={{ ...styles.btn, ...styles.primary }}
            onClick={createAppointment}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Solicitar turno y pagar consulta"}
          </button>

          <a href="/doctor" style={{ ...styles.btn, ...styles.ghost, textDecoration: "none", display: "inline-block" }}>
            Panel médico
          </a>
        </div>

        {statusMsg && (
          <div style={styles.box}>
            <strong>{statusMsg}</strong>
          </div>
        )}

        {joinUrl && (
          <div style={styles.box}>
            <div style={{ marginBottom: 6 }}>Pago confirmado. Enlace de videollamada:</div>
            <a href={joinUrl} target="_blank" rel="noreferrer">Unirme a la videollamada</a>
          </div>
        )}

        {/* SIEMPRE muestra lo que devuelva el backend */}
        {rawText && (
          <div style={styles.box}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Respuesta cruda (texto):</div>
            <pre style={styles.pre}>{rawText}</pre>
          </div>
        )}

        {parsedObj !== null && (
          <div style={styles.box}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Respuesta parseada (JSON):</div>
            <pre style={styles.pre}>{toPretty(parsedObj)}</pre>
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, color: "#8a98a6", marginTop: 16 }}>
        Soporte: jegaldeano@hotmail.com
      </div>
    </div>
  );
}
