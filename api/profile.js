const Anthropic = require("@anthropic-ai/sdk");

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
    const { primaryTitle, primaryTagline, secondaryTitle, secondaryTagline, openText } = req.body;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: "Eres una coach experta en desarrollo personal y branding. Analiza estas respuestas de una participante del programa Mentes Abundantes y genera un perfil personalizado en español.\n\nARQUETIPO PRIMARIO: " + primaryTitle + " — " + primaryTagline + "\nARQUETIPO SECUNDARIO: " + secondaryTitle + " — " + secondaryTagline + "\n\nRESPUESTAS ABIERTAS:\n" + openText + "\n\nGenera un JSON con EXACTAMENTE esta estructura (sin markdown, sin backticks, solo JSON puro):\n{\"resumen\": \"Un párrafo de 3-4 oraciones describiendo la combinación única de arquetipos de esta persona y qué la hace especial\",\"fortalezas\": [\"fortaleza 1\", \"fortaleza 2\", \"fortaleza 3\"],\"areas_trabajo\": [\"área 1\", \"área 2\", \"área 3\"],\"consejo_coaching\": \"Un párrafo de 2-3 oraciones con recomendaciones específicas para Krystina y Franklin sobre cómo trabajar con esta participante\",\"mensaje_personal\": \"Un mensaje motivacional de 2-3 oraciones dirigido directamente a la participante usando tú\"}"
      }],
    });

    const text = message.content.find(b => b.type === "text")?.text || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ profile: parsed });
  } catch (error) {
    console.error("Profile generation error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Failed to generate profile" });
  }
};
