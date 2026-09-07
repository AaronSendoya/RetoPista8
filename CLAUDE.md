@AGENTS.md

# Consulta de Asistencia — Track Mujeres, Pista 8

Documento maestro de reglas de desarrollo y directrices de sistema para este prototipo. **Toda generación de código en este repositorio debe cumplir obligatoriamente los puntos siguientes.** Si una petición del usuario entra en conflicto con estas reglas, señalar el conflicto antes de implementar.

## 1. Estado del proyecto y stack tecnológico

- **Framework**: Next.js (App Router, React, TypeScript). No usar el Pages Router.
- **Estilos**: Tailwind CSS. No introducir otra librería de estilos (CSS-in-JS, Bootstrap, etc.).
- **Iconografía**: prohibido rotundamente el uso de emojis en código, textos e interfaz. Usar exclusivamente `lucide-react` (iconos vectoriales).
- **Base de datos**: MongoDB.
- **Estado previo ya existente**: las dependencias `mongodb`, `dotenv`, `ts-node`, `xlsx` y el script [scripts/seed.ts](scripts/seed.ts) ya están en el proyecto. El comando de inicialización de datos es `npm run seed`. No reescribir ni duplicar este script.

## 2. Capa de datos y backend (seguridad estricta)

- **Conexión**: cliente singleton de MongoDB en [src/lib/mongodb.ts](src/lib/mongodb.ts), reutilizando la instancia en desarrollo vía `global._mongoClientPromise`.
- **Endpoint**: implementar únicamente el Route Handler `GET /api/asistencia/[ci]`. No crear endpoints adicionales sin autorización explícita.
- **Validación y aislamiento**:
  - Validar el parámetro `ci`. Si no es numérico, responder `HTTP 400` con `{ error: "C.I. inválido" }`.
  - Consultar con `db.collection('asistencias').findOne({ ci: Number(ci) }, { projection: { _id: 0 } })`.
  - Si existe: `HTTP 200` con la data de ese C.I.
  - Si no existe: `HTTP 404` con `{ error: "C.I. no encontrado en el registro" }`.
- **Restricción absoluta**:
  - Prohibido crear endpoints que listen todas las participantes.
  - Prohibido importar colecciones o JSONs completos en el frontend.
  - Cero exposición de PII (nombres, teléfonos, emails) en cualquier respuesta o payload del cliente.

## 3. Modelo de datos

Schema del documento en la colección `asistencias`:

```typescript
interface IAsistencia {
  ci: number;
  modulos: {
    numero: number; // 1 al 15
    nombre: string;
    asistio: boolean;
  }[];
  porcentaje_asistencia: number;
  estado_certificacion: 'Aprobado' | 'Reprobado';
}
```

No modificar este schema sin actualizar `scripts/seed.ts` en el mismo cambio.

## 4. Interfaz de usuario y reglas de negocio

- **Arquitectura de rutas**: `/` es la landing institucional estática (hero, pilares, banda de marca); `/consulta` es la herramienta interactiva de consulta de asistencia. `app/layout.tsx` provee Navbar (sticky) y Footer globales para todas las rutas.
- **Formulario de consulta**: input numérico para el C.I. y botón de acción "Consultar".
- **Estados explícitos en React**: `idle`, `loading` (spinner SVG), `not_found` (alerta de C.I. inexistente) y `success`. No mezclar estos estados ni omitir alguno.
- **Panel de resultados** (Bento Grid con cards):
  - **Tarjeta de resumen**: número de C.I. consultado y porcentaje total de asistencia.
  - **Tarjeta de certificación Univalle**: estado de aprobación ("Aprobado" o "Reprobado") con badges de color.
  - **Matriz de módulos**: cuadrícula con los 15 módulos, icono Check (verde) para asistencia e icono X (gris/rojo) para inasistencia.
  - **Tarjeta de soporte**: mensaje de protocolo visible indicando qué hacer y a qué canal acudir si la participante identifica inconsistencias en su registro.

## 5. Identidad visual (Manual de Marca Pista 8)

Tokens de color Tailwind (definir en `tailwind.config.ts` o `globals.css`):

| Uso | Color | Hex |
|---|---|---|
| Principal / acento / botones | Bright Red | `#FE4200` |
| Títulos y texto principal | Charcoal | `#323C41` |
| Texto secundario y bordes | Slate Gray | `#676E72` |
| Fondo | Pastel | `#F2F3EE` |
| Fondo | Blanco puro | `#FFFFFF` |

- **Tipografía**: sans-serif neutral (Inter, o la fuente nativa de Next.js como fallback de Gotham).
- **Logo**: proporciones bloqueadas, sin sombras CSS, sin distorsión, con espacio de respiración libre alrededor.

## 6. Responsividad

- La página debe ser completamente responsiva para todo tipo de tamaño de pantalla: móvil, tablet, laptop y desktop.
- Usar los breakpoints de Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`) en todo componente nuevo; ningún layout puede quedar fijo a un solo ancho.
- El Bento Grid de resultados y la matriz de 15 módulos deben reflowar (por ejemplo de varias columnas a una sola) en pantallas pequeñas sin generar scroll horizontal ni cortar contenido.
- Validar mentalmente (o en implementación real) los tamaños móvil (~375px), tablet (~768px) y desktop (~1280px+) antes de dar por terminado un componente visual.

## 7. Clean Code

- Nombres descriptivos y en español consistente con el dominio (`ci`, `porcentaje_asistencia`, `estado_certificacion`); nada de abreviaturas crípticas.
- Funciones y componentes pequeños con una sola responsabilidad. Si una función mezcla fetch, validación y render, dividirla.
- Sin código muerto, imports sin usar, ni lógica comentada "por si acaso".
- Evitar `any` y duplicación de lógica (ver [seed.ts](scripts/seed.ts) como referencia de tipado estricto).
- **Comentarios**: solo cuando aporten algo que el código no diga por sí solo (una regla de negocio no obvia, un workaround). Deben ser breves, de una línea. Prohibidos los bloques de comentarios largos o explicaciones redundantes de qué hace el código.
