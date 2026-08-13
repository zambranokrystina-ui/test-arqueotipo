// api/sheets.js
// Envía una fila de registro a Google Sheets a través de un webhook de Apps Script.
// Usa la variable de entorno SHEETS_WEBHOOK_URL si existe; si no, la URL de abajo.
// Este archivo corre en el servidor: la URL nunca queda expuesta en el navegador.

const WEBHOOK_POR_DEFECTO = "https://script.google.com/macros/s/AKfycbzyzUZfyCnGkSEJO9kLD6ZOS81X9eJimC4dctIKHEUDb08F5bizFZNLD-hc0l3ffu1j/exec";

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = process.env.SHEETS_WEBHOOK_URL || WEBHOOK_POR_DEFECTO;
    if (!url) {
      return res.status(500).json({ error: "No hay URL de webhook configurada" });
    }

    const {
      participantName, email, date,
      primaryTitle, secondaryTitle,
      notionUrl
    } = req.body;

    const fila = {
      fecha: date || new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString("es-US", { timeZone: "America/Chicago" }),
      nombre: participantName || "",
      email: email || "",
      arquetipo_primario: primaryTitle || "",
      arquetipo_secundario: secondaryTitle || "",
      notion: notionUrl || "",
      agendo: "",   // se marca a mano cuando agenda
      estado: "Nuevo",
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fila),
    });

    const texto = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ success: true, respuesta: texto.slice(0, 200) });
  } catch (error) {
    console.error("Sheets error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Failed to save to Sheets", details: error.message });
  }
};
