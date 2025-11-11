import { useState } from "react";
import { API_URL } from "../config";

export default function Home() {
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [reason, setReason] = useState("Consulta pediátrica");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [price] = useState(40000);
  const [duration] = useState(30);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      if (!date || !time) throw new Error("Debe seleccionar fecha y hora");

      // 🔹 Genera fecha ISO válida para el backend
      const start_at = new Date(`${date}T${time}`).toISOString();

      const res = await fetch(`${API_URL}/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName || "Paciente",
          patient_email: patientEmail || "paciente@example.com",
          reason,
          price,
          duration,
          start_at, // ✅ Backend espera este campo
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(JSON.stringify(data));

      // 🔹 Si todo va bien, redirige a Mercado Pago
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setMsg("No se pudo generar el link de pago.");
      }
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error al crear el turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <h1>Teleconsulta con el Dr. Emilio Galdeano</h1>
      <p>Pediatra Infectólogo — Atención online</p>
      <p>Valor: <b>${price.toLocaleString("es-AR")}</b> | Duración: {duration} min</p>
      <hr />

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Nombre y apellido</label>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Nombre del paciente"
        />

        <label>Email</label>
        <input
          type="email"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
          placeholder="paciente@example.com"
        />

        <label>Motivo de consulta</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <label>Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Hora</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : "Solicitar turno y pagar consulta"}
        </button>
      </form>

      {msg && (
        <pre style={styles.msgBox}>
          {msg}
        </pre>
      )}

      <footer style={styles.footer}>
        Soporte: <a href="mailto:jegaldeano@hotmail.com">jegaldeano@hotmail.com</a>
      </footer>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  msgBox: {
    backgroundColor: "#eee",
    padding: "10px",
    marginTop: "20px",
    whiteSpace: "pre-wrap",
    textAlign: "left",
  },
  footer: {
    marginTop: "40px",
    fontSize: "0.9em",
    color: "#666",
  },
};
