# Excuse Generator Pro

Generador de excusas creativas y creíbles usando OpenAI. Frontend en React + Vite y backend Express en el mismo proceso.

---

## 1. Requisitos Previos

| Requisito     | Versión recomendada |
| ------------- | ------------------- |
| Node.js       | >= 18.x (LTS)       |
| npm           | >= 9.x              |
| Cuenta OpenAI | API Key válida      |

Verifica versiones:

```powershell
node -v
npm -v
```

## 2. Clonar e Instalar Dependencias

```powershell
git clone <repo-url>
cd ExcuseGenPro
npm install
```

## 3. Scripts Disponibles

| Script       | Comando           | Descripción                                               |
| ------------ | ----------------- | --------------------------------------------------------- |
| Desarrollo   | `npm run dev`     | Levanta Express + Vite (HMR) en modo desarrollo           |
| Build        | `npm run build`   | Construye frontend (Vite) y bundle del servidor (esbuild) |
| Producción   | `npm start`       | Sirve `dist/index.js` + archivos estáticos compilados     |
| Type Check   | `npm run check`   | Ejecuta TypeScript para revisar tipos                     |
| Drizzle Push | `npm run db:push` | Aplica esquema a la base de datos (si usas Postgres)      |

## 4. Variables de Entorno

Archivo `.env` (crear en la raíz si usas base de datos o despliegue):

```
# Puerto opcional (default 5000)
PORT=5000
# Para drizzle / Postgres (si lo usas)
DATABASE_URL=postgres://user:password@host:5432/dbname
```

> La generación de excusas requiere que el usuario ingrese su propia API Key de OpenAI directamente en la interfaz. No se guarda en el servidor.

## 5. Ejecutar en Desarrollo

```powershell
npm run dev
```

Salida esperada:

```
serving on http://127.0.0.1:5000
```

Visita: http://127.0.0.1:5000

Hot Reload: cambios en `client/src` y en `server` recargan automáticamente.

## 6. Flujo de Build y Producción

1. Construir:

```powershell
npm run build
```

Esto genera:

- Frontend: `dist/public/*`
- Servidor bundle: `dist/index.js`

2. Ejecutar:

```powershell
npm start
```

3. Probar endpoint salud:

```powershell
curl http://127.0.0.1:5000/api/health
```

Respuesta esperada:

```json
{ "status": "ok", "timestamp": "..." }
```

## 7. Generar Excusas (API)

Petición POST:

```
POST /api/excuses/generate
Content-Type: application/json
{
  "situation": "Llegué tarde a la reunión",
  "audience": "boss",
  "creativity": 6,
  "urgency": "last-minute",
  "apiKey": "TU_API_KEY",
  "model": "gpt-4o-mini-2024-07-18"
}
```

Respuesta (ejemplo simplificado):

```json
{
  "excuses": [
    {
      "id": "...",
      "text": "Mi tren sufrió un retraso inesperado...",
      "credibilityScore": 8,
      "originalityScore": 5,
      "riskLevel": "low",
      "deliveryTip": "Mantén un tono sincero",
      "totalScore": 13
    }
  ],
  "sessionCount": 3
}
```

## 8. Estructura del Proyecto

```
server/            # Express + integración Vite en dev
client/            # React (entry: src/main.tsx)
shared/            # Schemas Zod compartidos
attached_assets/   # Recursos adicionales
```

## 9. Modelos y OpenAI

- Modelo por defecto: `gpt-4o-mini-2024-07-18`
- Ajustable en la UI antes de generar.
- Temperatura = creatividad/10.
- El backend exige JSON válido (usa response_format JSON).

## 10. Drizzle ORM (Opcional)

Si decides usar la base de datos:

```powershell
$env:DATABASE_URL="postgres://user:pass@localhost:5432/excuses"
npm run db:push
```

Actualmente el flujo de excusas no persiste en base de datos (usa almacenamiento local en el navegador).

## 11. Solución de Problemas

| Problema                          | Causa               | Solución                                     |
| --------------------------------- | ------------------- | -------------------------------------------- |
| `npm start` no responde           | No ejecutaste build | Ejecuta `npm run build` antes de `npm start` |
| 404 al cargar assets en prod      | Build incompleto    | Borra `dist` y vuelve a construir            |
| Error OpenAI (401)                | API Key inválida    | Verifica la key ingresada en la UI           |
| TypeError JSON / Zod              | Datos faltantes     | Asegura enviar todos los campos del schema   |
| Bloqueo firewall / puerto ocupado | Puerto 5000 usado   | Cambia `PORT` en `.env`                      |

## 12. Comandos Rápidos

```powershell
# Desarrollo
npm run dev

# Compilar todo
npm run build

# Producción local
npm start

# Chequeo de tipos
npm run check

# Migrar schema (si usas DB)
npm run db:push
```

## 13. Seguridad

- La API Key NO se guarda en el servidor.
- El front almacena datos de excusas en LocalStorage (ver `client/src/lib/excuse-storage.ts`).
- No se registra el contenido de excusas en logs del servidor (solo metadatos mínimos).

## 14. Futuras Mejoras (sugerencias)

- Persistir excusas en Postgres con Drizzle.
- Autenticación de usuario (session + Passport ya incluido parcialmente).
- Historial de generación multi-sesión.
- Rate limiting por IP.

## 15. Licencia

MIT

---

¡Listo! Ejecuta `npm run dev` y comienza a generar excusas creativas.
