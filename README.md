# Test de Arquetipo — Mentes Abundantes

Test interactivo de perfilamiento para participantes del programa de acompañamiento 1:1.

## ¿Qué hace?

1. La participante responde 15 preguntas sobre identidad, dinero, miedos y comunicación
2. Se calcula su arquetipo primario y secundario (de 6 posibles)
3. Claude AI genera un perfil personalizado con fortalezas, áreas de trabajo y recomendaciones
4. Todo se guarda automáticamente en Notion dentro del HQ de Mentes Abundantes

## Configuración en Vercel

### Paso 1: Conectar con Vercel
1. Ve a vercel.com e inicia sesión con tu cuenta de GitHub
2. Haz clic en "Add New" → "Project"
3. Importa este repositorio

### Paso 2: Variables de entorno
En Vercel → Settings → Environment Variables, agrega:

| Variable | Dónde obtenerla |
|----------|----------------|
| ANTHROPIC_API_KEY | console.anthropic.com → API Keys |
| NOTION_TOKEN | notion.so/my-integrations → Nueva integración |

### Paso 3: Conectar integración de Notion
1. Ve a notion.so/my-integrations
2. Crea una integración llamada "Test de Arquetipo"
3. Copia el token
4. Ve a tu HQ de Mentes Abundantes en Notion
5. Clic en "..." → "Connections" → busca "Test de Arquetipo" y conéctala

### Paso 4: Deploy
Haz clic en Deploy en Vercel. Listo!
