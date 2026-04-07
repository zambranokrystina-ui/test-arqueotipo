const { Client } = require("@notionhq/client");

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
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const {
      participantName, date, primaryEmoji, primaryTitle, primaryTagline,
      secondaryEmoji, secondaryTitle, secondaryTagline,
      profile, openAnswers
    } = req.body;

    const HQ_PAGE_ID = "2b73cc7cabbe806cba68f50a8c394ed4";

    const children = [
      {
        object: "block", type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: "Resultado" } }] }
      },
      {
        object: "block", type: "paragraph",
        paragraph: { rich_text: [
          { type: "text", text: { content: "Arquetipo Primario: " }, annotations: { bold: true } },
          { type: "text", text: { content: primaryEmoji + " " + primaryTitle } },
        ]}
      },
      {
        object: "block", type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: primaryTagline }, annotations: { italic: true } }] }
      },
      {
        object: "block", type: "paragraph",
        paragraph: { rich_text: [
          { type: "text", text: { content: "Arquetipo Secundario: " }, annotations: { bold: true } },
          { type: "text", text: { content: secondaryEmoji + " " + secondaryTitle } },
        ]}
      },
      {
        object: "block", type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: secondaryTagline }, annotations: { italic: true } }] }
      },
      { object: "block", type: "divider", divider: {} },
    ];

    if (profile) {
      children.push({
        object: "block", type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: "Análisis Personalizado" } }] }
      });
      children.push({
        object: "block", type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: profile.resumen || "" } }] }
      });
      children.push({
        object: "block", type: "heading_3",
        heading_3: { rich_text: [{ type: "text", text: { content: "Fortalezas" } }] }
      });
      (profile.fortalezas || []).forEach(function(f) {
        children.push({
          object: "block", type: "bulleted_list_item",
          bulleted_list_item: { rich_text: [{ type: "text", text: { content: f } }] }
        });
      });
      children.push({
        object: "block", type: "heading_3",
        heading_3: { rich_text: [{ type: "text", text: { content: "Áreas de Trabajo" } }] }
      });
      (profile.areas_trabajo || []).forEach(function(a) {
        children.push({
          object: "block", type: "bulleted_list_item",
          bulleted_list_item: { rich_text: [{ type: "text", text: { content: a } }] }
        });
      });
      children.push({
        object: "block", type: "heading_3",
        heading_3: { rich_text: [{ type: "text", text: { content: "Recomendaciones para Coaching" } }] }
      });
      children.push({
        object: "block", type: "callout",
        callout: {
          icon: { type: "emoji", emoji: "💡" },
          rich_text: [{ type: "text", text: { content: profile.consejo_coaching || "" } }],
        }
      });
      children.push({
        object: "block", type: "heading_3",
        heading_3: { rich_text: [{ type: "text", text: { content: "Mensaje Personal" } }] }
      });
      children.push({
        object: "block", type: "quote",
        quote: { rich_text: [{ type: "text", text: { content: profile.mensaje_personal || "" } }] }
      });
      children.push({ object: "block", type: "divider", divider: {} });
    }

    children.push({
      object: "block", type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Respuestas Abiertas" } }] }
    });

    (openAnswers || []).forEach(function(oa) {
      children.push({
        object: "block", type: "paragraph",
        paragraph: { rich_text: [
          { type: "text", text: { content: oa.label }, annotations: { bold: true } },
        ]}
      });
      children.push({
        object: "block", type: "paragraph",
        paragraph: { rich_text: [
          { type: "text", text: { content: oa.answer }, annotations: { italic: true } },
        ]}
      });
    });

    children.push({ object: "block", type: "divider", divider: {} });
    children.push({
      object: "block", type: "paragraph",
      paragraph: { rich_text: [
        { type: "text", text: { content: "Generado automáticamente por el Test de Arquetipo — Mentes Abundantes" }, annotations: { italic: true, color: "gray" } },
      ]}
    });

    const response = await notion.pages.create({
      parent: { page_id: HQ_PAGE_ID },
      icon: { type: "emoji", emoji: primaryEmoji },
      properties: {
        title: {
          title: [{ text: { content: "Perfil Arquetipo — " + participantName + " (" + date + ")" } }],
        },
      },
      children: children,
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ success: true, pageId: response.id });
  } catch (error) {
    console.error("Notion error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Failed to save to Notion", details: error.message });
  }
};
