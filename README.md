# Índices de Oxigenación Neonatal

Calculadora de apoyo clínico para falla respiratoria neonatal. Funciona sin conexión
y se instala en la pantalla de inicio del iPhone como una aplicación.

Dr. Jano Jaramillo — Médico Pediatra y Neonatólogo · Posgrado en Trastornos del Aprendizaje

---

## Publicar en GitHub Pages

1. Cree un repositorio nuevo, por ejemplo `oxigenacion-neonatal`.
2. Suba estos archivos **a la raíz** del repositorio:

   ```
   index.html
   sw.js
   manifest.webmanifest
   apple-touch-icon.png
   icon-192.png
   icon-512.png
   icon-maskable-512.png
   favicon-32.png
   ```

3. En el repositorio: **Settings → Pages → Source: Deploy from a branch**,
   rama `main`, carpeta `/ (root)`. Guarde.
4. En uno o dos minutos la dirección queda activa:
   `https://SUUSUARIO.github.io/oxigenacion-neonatal/`

GitHub Pages sirve por HTTPS, que es requisito para que el service worker
funcione. No hay compilación ni dependencias: son archivos estáticos.

## Instalar en el iPhone

1. Abra la dirección **en Safari** (no en Chrome: en iOS solo Safari instala
   aplicaciones web).
2. Toque el botón **Compartir** → **Añadir a pantalla de inicio**.
3. Confirme. Aparece el icono de la curva de disociación.

Ábrala una vez con internet: ahí se guarda todo en el teléfono. Desde ese
momento funciona en modo avión, en el ascensor o en una sala sin señal.
La cabecera indica el estado: *en línea* o *sin conexión*.

## Actualizar la aplicación

Cambie los archivos en GitHub y **suba el número de versión** en la primera
línea útil de `sw.js`:

```js
const CACHE = "oxigenacion-v1";   // v2, v3, ...
```

Sin ese cambio los teléfonos seguirán mostrando la versión guardada.
Con el cambio, la siguiente apertura con internet descarga la nueva.

## Qué calcula

**Severidad por IO.** Escala de falla respiratoria hipoxémica como clasificación
principal (≤15 leve, 16–25 moderada, 26–40 severa, >40 muy severa), que es la de
uso corriente en UCIN. Montreux 2017 queda como escala secundaria, desplegable,
con sus criterios no numéricos a la vista.

**Sin línea arterial.** OSI y SaFi con los umbrales de PALICC-2 2023, incluida la
titulación obligatoria a SpO₂ 88–97 % antes de calcular.

**Índices de apoyo.** PAO₂ por la ecuación de gas alveolar completa, gradiente A–a
interpretado solo cuando la FiO₂ lo permite, relación a/A, índice respiratorio,
P/F corregido por presión barométrica y gradiente pre/post-ductal.

**Prueba de reducción de oxígeno.** Hasta cuatro pares de FiO₂ y SpO₂ preductal,
con dos lecturas en paralelo para comparar:

- *Promedio por pares* — Berggren por saturación y Riley, promediados.
- *Ajuste de dos parámetros* — modelo de tres compartimentos que estima
  cortocircuito y V/Q simultáneamente, más el rango de cortocircuito que los
  datos no logran descartar.

**Mecánica.** ΔP, relación I:E y MAP estimada como control de coherencia contra
PIP, PEEP, Ti y FR.

## Advertencias que el código hace explícitas

El ajuste de dos parámetros es una reconstrucción de la estructura publicada,
no el programa validado. Tome la V/Q como orden de magnitud.

Los supuestos fijos son SvO₂ 75 %, PACO₂ 40 mmHg, R 0.8, P₅₀ 26.6, coeficiente
de Hill 2.7 y VA/Q total 0.85. En choque la SvO₂ asumida es la fuente de error
dominante: ingrese la medida si tiene gasometría venosa central.

La hemoglobina fetal desplaza la curva de disociación y el modelo no la corrige.

Herramienta de apoyo al cálculo. No sustituye el juicio clínico ni establece
indicación terapéutica.

## Icono

La curva de disociación de la oxihemoglobina, con el punto ámbar en el hombro
—la saturación de 94 a 97 % que es justamente el par que permite separar
cortocircuito de relación ventilación-perfusión baja.
