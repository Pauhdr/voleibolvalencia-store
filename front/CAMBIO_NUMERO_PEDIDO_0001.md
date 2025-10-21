# 🔄 Cambio: Números de Pedido desde 0001

## 📊 Comparación Antes vs Ahora

### ANTES (1000-9999)
```
Primer pedido:    #1000
Segundo pedido:   #1001
Tercer pedido:    #1002
...
Pedido 9000:      #9999
Siguiente:        #1000 (reinicia)
```

### AHORA (0001-9999) ✅
```
Primer pedido:    #0001
Segundo pedido:   #0002
Tercer pedido:    #0003
...
Pedido 9999:      #9999
Siguiente:        #0001 (reinicia)
```

---

## ✅ Archivos Modificados

### 1. `composables/useSupabase.ts`
```typescript
// ANTES
return 1000  // Empezar desde 1000 si hay error
if (!data || !data.order_number) return 1000
return nextNumber > 9999 ? 1000 : nextNumber

// AHORA
return 1  // Empezar desde 1 si hay error
if (!data || !data.order_number) return 1
return nextNumber > 9999 ? 1 : nextNumber
```

**Líneas modificadas**: 3 cambios en la función `getNextOrderNumber()`

---

### 2. `pages/admin.vue`
```vue
<!-- ANTES -->
#{{ order.order_number || order.id?.substring(0, 4).toUpperCase() }}
<!-- Resultado: #1000, #1001, #1002 -->

<!-- AHORA -->
#{{ order.order_number ? String(order.order_number).padStart(4, '0') : order.id?.substring(0, 4).toUpperCase() }}
<!-- Resultado: #0001, #0002, #0003 -->
```

**Mejora**: Usa `padStart(4, '0')` para mostrar siempre 4 dígitos con ceros a la izquierda.

**Ejemplos**:
- `1` → `#0001`
- `42` → `#0042`
- `123` → `#0123`
- `9999` → `#9999`

---

### 3. `INSTRUCCIONES_NUMERO_PEDIDO.md`
- ✅ Actualizado rango de 1000-9999 a 0001-9999
- ✅ Actualizado SQL para empezar desde 1
- ✅ Actualizado ejemplos de datos
- ✅ Actualizado pruebas y verificaciones
- ✅ Actualizado ejemplos de consultas SQL

---

## 🗄️ Base de Datos

### Estructura (SIN CAMBIOS)
El SQL de Supabase sigue siendo el mismo:
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number INTEGER;

ALTER TABLE orders 
ADD CONSTRAINT unique_order_number UNIQUE (order_number);

COMMENT ON COLUMN orders.order_number IS 'Número de pedido consecutivo de 4 dígitos (0001-9999)';

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number DESC);
```

### Datos Almacenados
```
| order_number | Mostrado como |
|--------------|---------------|
| 1            | #0001         |
| 2            | #0002         |
| 42           | #0042         |
| 123          | #0123         |
| 9999         | #9999         |
```

**Importante**: 
- En la base de datos se guarda como `INTEGER` (1, 2, 3...)
- En la UI se muestra con padding (`#0001`, `#0002`, `#0003`...)
- Ahorra espacio en la BD y permite búsquedas numéricas eficientes

---

## 🎯 Ventajas del Cambio

### ✅ Más Números Disponibles
- **ANTES**: 9000 números (1000-9999)
- **AHORA**: 9999 números (0001-9999)

### ✅ Inicio Lógico
- Empieza desde el primer número natural
- Más intuitivo para los usuarios
- Números más pequeños al principio

### ✅ Formato Profesional
- Todos los números tienen 4 dígitos visualmente
- `#0001` se ve más profesional que `#1`
- Consistencia visual en listados

### ✅ Sin Cambios en BD
- El almacenamiento sigue siendo `INTEGER`
- Solo cambia la presentación visual
- No afecta rendimiento ni espacio

---

## 🧪 Ejemplos Visuales

### Admin Panel
```
┌─────────────────────────────────────────┐
│ 🟠 #0001                               │
│ Juan García                             │
│ Equipo Juvenil                          │
│ juan@example.com         45.50€  ✅     │
├─────────────────────────────────────────┤
│ 🟠 #0002                               │
│ María López                             │
│ Equipo Senior                           │
│ maria@example.com        62.00€  ⏳     │
└─────────────────────────────────────────┘
```

### Logs de Consola
```
✅ Pedido creado correctamente
📦 Número de pedido: 1
🎯 ID: 550e8400-e29b-41d4-a716-446655440000
```

### Base de Datos (vista SQL)
```sql
SELECT 
  order_number,
  LPAD(order_number::TEXT, 4, '0') as formatted,
  player_name
FROM orders
ORDER BY order_number;

 order_number | formatted | player_name
--------------+-----------+-------------
            1 | 0001      | Juan García
            2 | 0002      | María López
           42 | 0042      | Pedro Sánchez
          123 | 0123      | Ana Martínez
```

---

## 📋 Checklist de Implementación

- [x] Modificar `getNextOrderNumber()` para empezar desde 1
- [x] Actualizar badge en admin con `padStart(4, '0')`
- [x] Actualizar documentación completa
- [x] Actualizar ejemplos y pruebas
- [ ] Ejecutar SQL en Supabase (PENDIENTE - usuario)
- [ ] Probar crear primer pedido
- [ ] Verificar formato #0001 en admin

---

## 🚀 Próximos Pasos

1. **Ejecuta el SQL en Supabase** (si no lo has hecho):
   ```sql
   ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number INTEGER;
   ALTER TABLE orders ADD CONSTRAINT unique_order_number UNIQUE (order_number);
   CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number DESC);
   ```

2. **Crea un pedido de prueba** desde el frontend

3. **Verifica el número** en el panel admin:
   - Debería aparecer como `#0001`
   - Badge naranja
   - Formato con ceros a la izquierda

4. **Crea varios pedidos** para probar la secuencia:
   - `#0001`, `#0002`, `#0003`...

---

## 🎉 Resultado Final

Los números de pedido ahora empiezan desde **#0001** y se muestran con formato profesional de 4 dígitos, aprovechando todo el rango de 1 a 9999 (9999 pedidos únicos).

**Fecha**: 21 Octubre 2025  
**Cambio**: Inicio desde 0001 en lugar de 1000  
**Archivos modificados**: 2 (useSupabase.ts, admin.vue)  
**Documentación actualizada**: INSTRUCCIONES_NUMERO_PEDIDO.md
