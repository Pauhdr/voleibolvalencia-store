# Generación de Comprobante de Pedido

## 📋 Descripción

Se ha implementado la funcionalidad para generar un comprobante de pedido en formato imprimible/PDF similar a una factura profesional desde la página de éxito del pedido.

## ✨ Características

### 1. Diseño del Comprobante
El documento generado incluye:

#### Header
- **Logo del club** (placeholder)
- **Datos de la empresa**:
  - Nombre: Club Voleibol Valencia
  - NIF
  - Dirección
  - Teléfono
  - Email
- Barra naranja corporativa

#### Información del Cliente
- Nombre del jugador/a
- Equipo
- Nombre del padre/madre
- Email de contacto

#### Detalles del Pedido
- **Número de cliente**: Generado aleatoriamente
- **Fecha del pedido**: Formato DD | MM MM | A A A A
- **Número de presupuesto**: Igual al número de cliente
- **Fecha de entrega estimada**: 15 días después del pedido

#### Tabla de Productos
- Código del producto (8 primeros caracteres del ID)
- Artículo (nombre + opciones: talla, nombre, número)
- Cantidad
- Precio por unidad
- Total por línea

#### Totales
- **Subtotal sin IVA**: Calculado automáticamente
- **IVA 21%**: Calculado sobre el subtotal
- **TOTAL (EUR)**: Total con IVA incluido

#### Información de Pago
- Mensaje de confirmación
- Instrucciones de pago
- Línea para firma y sello

#### Footer
- Datos de la empresa (izquierda)
- Datos bancarios con IBAN (derecha)

### 2. Estilo Visual

#### Colores Corporativos
- **Naranja principal**: `#f97316` (títulos, destacados)
- **Naranja claro**: `#fff8f5` (fondos alternativos)
- **Gris oscuro**: `#333` (texto principal)
- **Gris medio**: `#666` (texto secundario)

#### Tipografía
- Fuente: Arial, sans-serif
- Tamaños: 10px-24px según jerarquía
- Line height: 1.6 para mejor legibilidad

#### Espaciado
- Padding general: 40px
- Márgenes entre secciones: 20-30px
- Bordes: 2-3px para énfasis

#### Tabla de Productos
- Header naranja con texto blanco
- Filas alternadas con fondo naranja claro
- Bordes sutiles en gris

## 💻 Implementación Técnica

### Persistencia de Datos

```typescript
// En checkout.vue - Antes de limpiar el carrito
const orderForReceipt = {
  buyer: {
    player_name: formData.value.player_name,
    team: formData.value.team,
    parent_name: formData.value.parent_name,
    email: formData.value.email,
  },
  items: cartStore.items.map(item => ({
    product_id: item.product_id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    options: item.options,
  })),
  total: cartStore.total,
  date: new Date().toISOString(),
  orderNumber: Math.floor(Math.random() * 1000000),
};
localStorage.setItem('lastOrder', JSON.stringify(orderForReceipt));
```

### Recuperación de Datos

```typescript
// En success.vue - Al montar el componente
onMounted(() => {
  const savedOrder = localStorage.getItem('lastOrder');
  if (savedOrder) {
    orderData.value = JSON.parse(savedOrder);
  }
});
```

### Generación del HTML

La función `generateReceipt()` crea:
1. Una nueva ventana emergente
2. HTML completo con estilos inline
3. Script para auto-imprimir al cargar
4. Cierre automático después de imprimir

```typescript
const generateReceipt = () => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  // Cálculos
  const subtotalSinIVA = orderData.value.total / 1.21;
  const iva = orderData.value.total - subtotalSinIVA;
  
  // Generar HTML con template literals
  const receiptHTML = `<!DOCTYPE html>...`;
  
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
};
```

### Auto-impresión

```javascript
<script>
  window.onload = function() {
    window.print();
    window.onafterprint = function() {
      window.close();
    };
  };
</script>
```

## 📄 Formato de Fechas

Las fechas se muestran en formato especial:
- **Formato**: `DD | MM MM | A A A A`
- **Ejemplo**: `15 | 10 10 | 2 0 2 5`

```javascript
const formatDate = (date) => {
  return `${date.getDate().toString().padStart(2, '0')} | ${(date.getMonth() + 1).toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')} | ${date.getFullYear().toString().split('').join(' ')}`;
};
```

## 🧮 Cálculos Automáticos

### IVA y Subtotales
```typescript
const subtotalSinIVA = total / 1.21;  // Base imponible
const iva = total - subtotalSinIVA;    // IVA 21%
```

### Fecha de Entrega
```typescript
const deliveryDate = new Date(orderDate);
deliveryDate.setDate(deliveryDate.getDate() + 15);  // +15 días
```

### Número de Pedido
```typescript
const orderNumber = Math.floor(Math.random() * 1000000);  // 0-999999
```

## 🖨️ Proceso de Impresión

### 1. Usuario hace clic en "Imprimir Comprobante"
### 2. Se validan los datos del pedido
### 3. Se abre ventana emergente (800x600px)
### 4. Se genera HTML completo
### 5. Auto-impresión al cargar
### 6. Cierre automático después de imprimir/cancelar

## 📱 Responsive y Print Media

```css
@media print {
  body {
    padding: 20px;  /* Reducir padding en impresión */
  }
}
```

## 🔧 Archivos Modificados

- `/pages/checkout.vue` - Guardado de datos del pedido en localStorage
- `/pages/success.vue` - Generación y impresión del comprobante

## ✅ Datos Incluidos en el Comprobante

### Empresa
- [x] Nombre del club
- [x] NIF
- [x] Dirección
- [x] Teléfono
- [x] Email
- [ ] Logo (placeholder)

### Cliente
- [x] Nombre del jugador/a
- [x] Equipo
- [x] Nombre del padre/madre
- [x] Email

### Pedido
- [x] Número de pedido
- [x] Fecha del pedido
- [x] Fecha de entrega estimada
- [x] Lista de productos
- [x] Opciones de productos (talla, nombre, número)
- [x] Cantidades
- [x] Precios unitarios
- [x] Totales por línea

### Financiero
- [x] Subtotal sin IVA
- [x] IVA 21%
- [x] Total con IVA
- [x] IBAN para pago
- [x] Titular de la cuenta

### Otros
- [x] Mensaje de agradecimiento
- [x] Instrucciones de pago
- [x] Línea de firma
- [x] Datos de contacto

## 🚀 Mejoras Futuras

- [ ] Incluir logo real del club (actualmente placeholder)
- [ ] Generar PDF directamente (sin diálogo de impresión)
- [ ] Envío automático por email
- [ ] QR code con información del pedido
- [ ] Número de pedido correlativo desde BD
- [ ] Histórico de comprobantes descargables
- [ ] Opción de guardar como PDF en servidor
- [ ] Personalización de textos y términos
- [ ] Multiidioma (valenciano, inglés)
- [ ] Diferentes diseños de comprobante

## ⚠️ Consideraciones

### Ventanas Emergentes
- El navegador debe permitir pop-ups
- Si están bloqueadas, se muestra alerta al usuario

### Datos en localStorage
- Se guardan automáticamente al completar pedido
- Persisten aunque se recargue la página
- Se sobreescriben con cada nuevo pedido

### Impresión
- Funciona en todos los navegadores modernos
- Compatible con "Guardar como PDF" en Chrome/Edge
- Cierre automático después de imprimir/cancelar

### Privacidad
- Datos sensibles solo en localStorage del cliente
- No se envían datos del comprobante al servidor
- El usuario controla si imprime o guarda

## 📝 Testing Checklist

- [ ] Comprobante se genera con todos los datos
- [ ] Formato de fechas es correcto
- [ ] Cálculos de IVA son precisos
- [ ] Tabla de productos muestra todas las opciones
- [ ] Ventana emergente se abre correctamente
- [ ] Auto-impresión funciona
- [ ] Cierre automático funciona
- [ ] Funciona con bloqueador de pop-ups desactivado
- [ ] Diseño responsive en print preview
- [ ] Colores corporativos correctos
- [ ] Todos los textos visibles y legibles
- [ ] Sin errores en consola
