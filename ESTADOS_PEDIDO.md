# 📊 Estados del Pedido - Sistema Actualizado

## ✅ Cambios Realizados

Se han actualizado los estados del pedido para reflejar mejor el flujo real de trabajo del club.

---

## 🔄 Estados Anteriores vs Nuevos

### ❌ Estados Anteriores (Eliminados)
- `pendiente` → Muy genérico
- `revisado` → Se mantiene pero con mejor definición
- `entregado` → Cambio a "recogido" (más preciso)

### ✅ Estados Nuevos (Actualizados)

| Estado | Código | Descripción | Color UI |
|--------|--------|-------------|----------|
| 🔍 **En Revisión** | `en_revision` | Estado inicial cuando el cliente completa el pedido. El admin debe revisar el comprobante de pago. | Amarillo |
| ✅ **Revisado** | `revisado` | El comprobante de pago ha sido verificado y aprobado. El pedido es válido. | Azul |
| 📦 **Pedido Realizado** | `pedido_realizado` | El pedido ha sido confirmado al proveedor. Se está esperando la mercancía. | Morado |
| 🎽 **Preparado para Recoger** | `preparado` | Los productos han llegado y están listos para ser recogidos en el club. | Verde |
| ✔️ **Recogido** | `recogido` | El cliente ha recogido su pedido. Estado final exitoso. | Gris |
| ❌ **Cancelado** | `cancelado` | El pedido ha sido cancelado (pago rechazado, sin stock, cliente cancela, etc.). | Rojo |

---

## 🔄 Flujo Típico del Pedido

```
┌─────────────────┐
│  Cliente hace   │
│    pedido y     │ 
│ sube comprobante│
└────────┬────────┘
         │
         ▼
   🔍 En Revisión
         │
         │ Admin verifica pago
         ▼
     ✅ Revisado
         │
         │ Admin confirma al proveedor
         ▼
  📦 Pedido Realizado
         │
         │ Productos llegan al club
         ▼
  🎽 Preparado para Recoger
         │
         │ Cliente recoge en el club
         ▼
     ✔️ Recogido
```

### Flujo alternativo (Cancelación)

Desde cualquier estado (excepto `recogido`):
```
[Cualquier Estado] → ❌ Cancelado
```

---

## 📝 Archivos Actualizados

### 1. `/front/types/index.ts`
```typescript
export type OrderStatus = 
  | 'en_revision'        // Estado inicial
  | 'revisado'           // Pago verificado
  | 'pedido_realizado'   // Confirmado al proveedor
  | 'preparado'          // Listo para recoger
  | 'recogido'           // Recogido (final)
  | 'cancelado';         // Cancelado

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  en_revision: '🔍 En Revisión',
  revisado: '✅ Revisado',
  pedido_realizado: '📦 Pedido Realizado',
  preparado: '🎽 Preparado para Recoger',
  recogido: '✔️ Recogido',
  cancelado: '❌ Cancelado',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  en_revision: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  revisado: 'bg-blue-100 text-blue-800 border-blue-200',
  pedido_realizado: 'bg-purple-100 text-purple-800 border-purple-200',
  preparado: 'bg-green-100 text-green-800 border-green-200',
  recogido: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
};
```

### 2. `/front/composables/usePocketBase.ts`
- Estado inicial del pedido cambiado a: `en_revision`
- Campos actualizados: `items`, `payment_proof`, `buyer_phone`, `buyer_address`

### 3. `/front/pages/admin.vue`
- Contadores actualizados para los nuevos estados
- Se importan `ORDER_STATUS_LABELS` y `ORDER_STATUS_COLORS` para mostrar estados
- Función `viewProof` actualizada para usar `payment_proof`

### 4. `/INTEGRACION_POCKETBASE.md`
- Tabla de estados actualizada
- Descripción detallada del flujo de estados
- Configuración de PocketBase con los nuevos valores

---

## 🎨 Cómo Usar los Estados en la UI

### Mostrar el label del estado:
```typescript
import { ORDER_STATUS_LABELS } from '~/types';

const order = { status: 'en_revision' };
const label = ORDER_STATUS_LABELS[order.status]; 
// 🔍 En Revisión
```

### Aplicar colores al estado:
```vue
<span :class="ORDER_STATUS_COLORS[order.status]">
  {{ ORDER_STATUS_LABELS[order.status] }}
</span>
```

### Selector de estado en el admin:
```vue
<select v-model="order.status">
  <option value="en_revision">🔍 En Revisión</option>
  <option value="revisado">✅ Revisado</option>
  <option value="pedido_realizado">📦 Pedido Realizado</option>
  <option value="preparado">🎽 Preparado para Recoger</option>
  <option value="recogido">✔️ Recogido</option>
  <option value="cancelado">❌ Cancelado</option>
</select>
```

---

## 📋 Configuración en PocketBase

### Paso 1: Editar la colección `orders`
1. Ve al Admin UI: http://127.0.0.1:8090/_/
2. Abre la colección **orders**
3. Edita el campo **status**
4. En **Values**, actualiza con:

```
en_revision
revisado
pedido_realizado
preparado
recogido
cancelado
```

### Paso 2: Configurar valor por defecto
- **Default value**: `en_revision`

---

## 🔔 Notificaciones por Email (Próxima Fase)

Se pueden enviar emails automáticos en cada cambio de estado:

| Estado → | Email a Cliente |
|----------|----------------|
| `en_revision` | "Hemos recibido tu pedido. Estamos revisando el comprobante de pago." |
| `revisado` | "¡Pago confirmado! Tu pedido ha sido enviado al proveedor." |
| `pedido_realizado` | "Tu pedido está en camino. Te avisaremos cuando llegue." |
| `preparado` | "🎉 ¡Tu pedido está listo! Pasa por el club a recogerlo." |
| `recogido` | "Gracias por tu pedido. ¡Hasta la próxima!" |
| `cancelado` | "Tu pedido ha sido cancelado. [Razón]" |

---

## ✅ Checklist de Migración

Si ya tienes pedidos con los estados antiguos:

- [ ] Backup de la base de datos PocketBase (`pb_data/`)
- [ ] Actualizar el campo `status` en la colección `orders` con los nuevos valores
- [ ] Migrar pedidos existentes:
  - `pendiente` → `en_revision`
  - `entregado` → `recogido`
- [ ] Verificar que el frontend muestra correctamente los estados
- [ ] Probar el flujo completo desde el admin

---

## 🚀 Siguientes Pasos

1. ✅ **Actualizar PocketBase** con los nuevos valores del campo `status`
2. ✅ **Probar el flujo** creando un pedido de prueba
3. ⏳ **Mejorar el Admin UI** con botones rápidos para cambiar estados
4. ⏳ **Agregar filtros** por estado en el panel de admin
5. ⏳ **Implementar notificaciones** por email (opcional)

---

## 📞 Soporte

Si tienes problemas con los nuevos estados:
1. Verifica que PocketBase esté actualizado con los nuevos valores
2. Revisa la consola del navegador para errores
3. Asegúrate de que todos los archivos TypeScript estén sin errores

¡El sistema está listo para gestionar pedidos con el nuevo flujo! 🎉
