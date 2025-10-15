# Checkout con Secciones Colapsables

## 📋 Descripción de la Implementación

Se ha modificado la página de checkout (`/pages/checkout.vue`) para organizar el formulario en 3 secciones colapsables que mejoran la experiencia de usuario.

## 🎯 Secciones

### 1. Resumen del Pedido (Colapsado por defecto)
- **Estado inicial**: Cerrado
- **Contenido**:
  - Lista de productos con cantidad
  - Subtotal por producto
  - Total general del pedido
  - Contador de productos en el encabezado
- **Color del badge**: Naranja (#1)

### 2. Datos del Pedido (Abierto por defecto)
- **Estado inicial**: Abierto
- **Contenido**:
  - Nombre del Jugador/a (requerido)
  - Equipo (selector, requerido)
  - Nombre del Padre/Madre (requerido)
  - Email (requerido)
- **Color del badge**: Naranja (#2)

### 3. Pago (Colapsado por defecto)
- **Estado inicial**: Cerrado
- **Contenido**:
  - **Información de Pago** (destacado en naranja):
    - IBAN del club
    - Beneficiario
    - Concepto de transferencia (generado dinámicamente)
    - Advertencia importante
  - **Comprobante de Pago**:
    - Referencia de transferencia (opcional)
    - Upload de archivo (imagen o PDF, requerido)
    - Visualización del archivo seleccionado
- **Color del badge**: Naranja (#3)

## 💻 Implementación Técnica

### Estado Reactivo
```typescript
const openSections = ref({
  summary: false,   // Resumen: colapsado
  data: true,       // Datos: abierto
  payment: false,   // Pago: colapsado
});
```

### Función Toggle
```typescript
const toggleSection = (section: 'summary' | 'data' | 'payment') => {
  openSections.value[section] = !openSections.value[section];
};
```

### Estructura HTML
Cada sección tiene:
1. **Botón de encabezado** (siempre visible):
   - Badge numerado (1, 2, 3)
   - Título de la sección
   - Info adicional (ej: contador de productos)
   - Icono de flecha (rota 180° cuando está abierto)
   - Hover effect

2. **Contenido colapsable** (`v-show`):
   - Se muestra/oculta según el estado
   - Separado por borde superior
   - Padding consistente

## 🎨 Características de Diseño

### Badges Numerados
- Círculos naranjas con números blancos
- Indican el orden del proceso
- 32px de diámetro
- Font bold

### Animaciones
- Rotación suave de la flecha (180°)
- Transición en hover del botón
- Clases: `transition-transform`, `transition-colors`

### Responsive
- Grid de 1 columna en móvil
- Grid de 2 columnas en desktop (md:)
- Campos de email y nombre del padre ocupan 2 columnas completas

### Colores
- Naranja principal: Badges y elementos destacados
- Naranja suave: Fondo de sección de pago (`bg-orange-50`)
- Verde: Confirmación de archivo subido
- Gris: Texto secundario y bordes

## 📱 Flujo de Usuario

1. Usuario llega a checkout con el carrito lleno
2. Ve directamente la sección "Datos del Pedido" abierta
3. Rellena sus datos (nombre, equipo, padre/madre, email)
4. Puede expandir "Resumen del Pedido" para revisar los productos
5. Expande "Pago" para ver los datos bancarios
6. Realiza la transferencia
7. Sube el comprobante
8. Envía el pedido

## ✅ Validación

El formulario mantiene la validación original:
- Todos los campos marcados con `*` son requeridos
- El comprobante de pago es obligatorio
- Email debe tener formato válido
- Archivo máximo: 10MB
- Formatos aceptados: PNG, JPG, PDF

## 🔧 Archivos Modificados

- `/pages/checkout.vue` - Implementación completa de secciones colapsables

## 🚀 Mejoras Futuras Posibles

- [ ] Animación suave de apertura/cierre (slide)
- [ ] Auto-scroll a la sección cuando se abre
- [ ] Progreso visual (pasos completados)
- [ ] Validación en tiempo real con feedback visual
- [ ] Preview de la imagen del comprobante antes de subir
- [ ] Copia rápida del IBAN al portapapeles
