//pages/done.jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Done() {
  const router = useRouter();
  const [statusText, setStatusText] = useState("Procesando la información del pago…");

  const { status, collection_status, payment_id, preference_id } = router.query;

  useEffect(() => {
    const s = (status || collection_status || "").toString().toLowerCase();

    if (!s) {
      setStatusText("Pago recibido. Estamos confirmando la operación.");
      return;
    }

    if (s === "approved") {
      setStatusText("¡Pago aprobado! Tu turno quedó reservado.");
    } else if (s === "pending" || s === "in_process") {
      setStatusText("Pago pendiente. El turno se confirmará cuando el pago sea acreditado.");
    } else if (s === "failure" || s === "rejected" || s === "cancelled") {
      setStatusText("El pago no pudo completarse o fue cancelado.");
    } else {
      setStatusText("Pago recibido. Estamos confirmando la operación.");
    }
  }, [status, collection_status]);

  const styles = {
    wrap: {
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    card: {
      maxWidth: 520,
      width: "100%",
      borderRadius: 16,
      border: "1px solid #e6e9ec",
      padding: 24,
      boxSizing: "border-box",
    },
    h1: {
      fontSize: 24,
      margin: "0 0 4px",
      color: "#0a2540",
    },
    p: {
      fontSize: 15,
      lineHeight: 1.5,
      color: "#4b5563",
      margin: "8px 0",
    },
    smallBox: {
      marginTop: 12,
      padding: 12,
      borderRadius: 12,
      background: "#f9fafb",
      fontSize: 13,
      color: "#6b7280",
    },
    label: { fontWeight: 600 },
    link: {
      marginTop: 16,
      display: "inline-block",
      fontSize: 14,
      color: "#0a2540",
      textDecoration: "none",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Estado del pago</h1>
        <p style={styles.p}>{statusText}</p>

        <p style={styles.p}>
          En breve vas a recibir un correo con los detalles del turno y el enlace de
          videollamada para la consulta.
        </p>

        <p style={styles.p}>
          Si tenés cualquier duda, podés escribir a{" "}
          <a href="mailto:jegaldeano@hotmail.com">jegaldeano@hotmail.com</a>.
        </p>

        {(payment_id || preference_id) && (
          <div style={styles.smallBox}>
            {payment_id && (
              <div>
                <span style={styles.label}>ID de pago: </span>
                {payment_id}
              </div>
            )}
            {preference_id && (
              <div>
                <span style={styles.label}>ID de preferencia: </span>
                {preference_id}
              </div>
            )}
          </div>
        )}

        <a href="/" style={styles.link}>
          ← Volver a la página de turnos
        </a>
      </div>
    </div>
  );
}
