# Lista Colapsable de Pedidos - Documentación

## 📋 Resumen de Cambios

Se ha modificado el panel de administración para mostrar los pedidos en un formato de lista colapsable más limpio y eficiente. Ahora cada pedido muestra solo la información esencial en la vista principal, con la opción de expandir para ver todos los detalles.

## ✨ Características

### Vista Compacta (Siempre Visible)
Cada fila de pedido muestra:
- **Nombre del jugador**
- **Equipo** (debajo del nombre)
- **Email** (con fecha de creación debajo)
- **Total del pedido** (con número de productos)
- **Selector de estado** (Pendiente/Revisado/Entregado)
- **Botón de expandir/colapsar** (icono de flecha)

### Vista Expandida (Al hacer clic)
Al expandir un pedido se muestra:
- **Información completa del pedido**:
  - Jugador/a
  - Equipo
  - Padre/Madre
  - Email
  - Total
  - Fecha completa (formato legible)

- **Lista detallada de productos**:
  - Nombre del producto
  - Cantidad
  - Precio unitario
  - Subtotal
  - Opciones seleccionadas (talla, género, número, nombre) mostradas como badges de colores

- **Botón "Ver Comprobante de Pago"** (si existe comprobante)

## 🎨 Mejoras de UX

### Interactividad
- **Hover effects**: Las filas tienen efecto hover al pasar el mouse
- **Animación suave**: Los detalles se expanden/colapsan con transición CSS
- **Icono rotativo**: La flecha rota 90° al expandir

### Organización Visual
- **Código de colores para estados**:
  - Pendiente: Amarillo (`bg-yellow-50`)
  - Revisado: Azul (`bg-blue-50`)
  - Entregado: Verde (`bg-green-50`)

- **Badges para opciones de productos**:
  - Opciones básicas (talla, género): Gris
  - Personalizaciones (número, nombre): Naranja

### Responsive
- Grid adaptativo que funciona en móvil, tablet y desktop
- En mobile cada campo ocupa el ancho completo
- En desktop se distribuyen en 4 columnas

## 🔧 Implementación Técnica

### Nuevas Variables Reactivas
```typescript
const expandedOrders = ref<string[]>([]); // IDs de pedidos expandidos
```

### Nueva Función
```typescript
const toggleOrderDetails = (orderId: string) => {
  const index = expandedOrders.value.indexOf(orderId);
  if (index > -1) {
    expandedOrders.value.splice(index, 1); // Colapsar
  } else {
    expandedOrders.value.push(orderId); // Expandir
  }
};
```

### Componentes Vue
- **Transición CSS**: Utiliza `<transition>` de Vue para animaciones suaves
- **Clases dinámicas**: El selector de estado cambia de color según el estado actual
- **Event handling**: `@click.stop` en el selector para evitar expandir al cambiar estado

## 📱 Estructura del Código

```vue
<!-- Fila principal (siempre visible) -->
<div @click="toggleOrderDetails(order.id!)">
  <!-- Botón expandir -->
  <!-- Información compacta en grid -->
  <!-- Selector de estado -->
</div>

<!-- Detalles expandibles (con transición) -->
<transition>
  <div v-if="expandedOrders.includes(order.id!)">
    <!-- Información completa -->
    <!-- Lista de productos -->
    <!-- Botón comprobante -->
  </div>
</transition>
```

## 🎯 Ventajas

1. **Menos scroll**: Vista más compacta muestra más pedidos en pantalla
2. **Acceso rápido**: Información clave visible sin expandir
3. **Cambio de estado rápido**: Selector siempre visible
4. **Navegación eficiente**: Solo expandir cuando necesites ver detalles
5. **Performance**: Menos DOM renderizado cuando los detalles están colapsados

## 🔄 Estados de Pedidos

Los contadores y filtros funcionan con 3 estados:
- `pendiente`: Pedido recién recibido
- `revisado`: Pedido verificado por el administrador
- `entregado`: Pedido completado y entregado al cliente

## 💡 Uso

1. **Ver pedidos**: La lista muestra todos los pedidos con info básica
2. **Filtrar**: Usa el selector "Filtrar por estado" arriba
3. **Expandir detalles**: Clic en cualquier parte de la fila
4. **Cambiar estado**: Usa el selector sin expandir (el clic no propaga)
5. **Ver comprobante**: Expande y haz clic en "Ver Comprobante de Pago"

## 🎨 Personalización

Los colores y estilos están definidos con Tailwind CSS:
- Puedes ajustar los colores en las clases de los badges
- Las transiciones se pueden modificar en las clases `transition-*`
- El grid es responsive y se puede ajustar cambiando `md:grid-cols-4`

---

**Fecha de actualización**: 15 de octubre de 2025
