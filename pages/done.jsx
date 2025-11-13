//pages/done.jsx
export default function Done() {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      textAlign: "center"
    }}>
      
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        ¡Pago confirmado!
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
        Gracias por reservar tu consulta con el Dr. Emilio Galdeano.
      </p>

      <p style={{ fontSize: "16px", color: "#777" }}>
        En breve recibirás un correo con el enlace de videollamada
        y las instrucciones para tu consulta pediátrica.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "40px",
          padding: "12px 20px",
          background: "#0a2540",
          color: "white",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600"
        }}
      >
        Volver al inicio
      </a>
    </div>
  );
}
