# Correcciones de Base de Datos

## 📋 Correcciones Implementadas

### 1. ✅ Estados de Pedidos Corregidos

Se ha corregido el enum `OrderStatus` para que coincida con los estados requeridos:

**Estados correctos:**
- `en_revision` - Estado inicial, pendiente de revisar comprobante
- `revisado` - Pago verificado y aprobado
- `pedido` - Pedido confirmado al proveedor *(antes era `pedido_realizado`)*
- `preparado` - Listo para recoger en el club
- `recogido` - Cliente ha recogido el pedido (final)
- `cancelado` - Pedido cancelado

### 2. ✅ Tabla de Tallas en Supabase

Se ha corregido el composable `useSupabase` para que **incluya** los campos `image_path` y `size_chart` al obtener productos desde Supabase.

**Problema anterior:**
- Al editar un producto, la tabla de tallas no se cargaba
- El campo `image_path` tampoco se recuperaba

**Solución:**
- Actualizado `getProducts()` para incluir `image_path` y `size_chart`
- Actualizado `getProductById()` para incluir `image_path` y `size_chart`

---

## 🗄️ Migraciones SQL Necesarias

### ⚠️ Si ya creaste la base de datos con el estado incorrecto

Si ya ejecutaste la migración anterior con `pedido_realizado`, necesitas actualizar el enum:

```sql
-- Opción 1: Alterar el enum existente (si no hay datos)
ALTER TYPE order_status RENAME VALUE 'pedido_realizado' TO 'pedido';
```

Si ya tienes pedidos en la base de datos con el estado antiguo:

```sql
-- Opción 2: Recrear el enum (con datos)
-- 1. Actualizar los pedidos existentes
UPDATE orders SET status = 'pedido' WHERE status = 'pedido_realizado';

-- 2. Alterar el enum
ALTER TYPE order_status RENAME VALUE 'pedido_realizado' TO 'pedido';
```

### ✅ Si aún NO has creado la base de datos

Usa directamente el SQL corregido que está en `MIGRACION_SUPABASE.md`:

```sql
-- Crear tipo ENUM para estados de pedido
CREATE TYPE order_status AS ENUM (
  'en_revision',
  'revisado',
  'pedido',
  'preparado',
  'recogido',
  'cancelado'
);
```

---

## 🔧 Verificación

### 1. Verificar el enum en Supabase

```sql
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'order_status'::regtype
ORDER BY enumsortorder;
```

Deberías ver:
```
en_revision
revisado
pedido
preparado
recogido
cancelado
```

### 2. Verificar la columna size_chart

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name IN ('size_chart', 'image_path');
```

Deberías ver:
```
column_name  | data_type
-------------+-----------
image_path   | text
size_chart   | jsonb
```

### 3. Probar en el Frontend

1. Inicia el servidor: `npm run dev`
2. Ve a `/admin`
3. Crea o edita un producto
4. Añade una tabla de tallas
5. Guarda el producto
6. Vuelve a editarlo → La tabla de tallas debería cargarse correctamente

---

## 📝 Resumen de Cambios

### Archivos Modificados

1. **`types/index.ts`**:
   - Cambiado `pedido_realizado` → `pedido` en el enum
   - Actualizado `ORDER_STATUS_LABELS`
   - Actualizado `ORDER_STATUS_COLORS`

2. **`composables/useSupabase.ts`**:
   - Añadido `image_path` al objeto Product en `getProducts()`
   - Añadido `size_chart` al objeto Product en `getProducts()`
   - Añadido `image_path` al objeto Product en `getProductById()`
   - Añadido `size_chart` al objeto Product en `getProductById()`

3. **`MIGRACION_SUPABASE.md`**:
   - Corregido el enum SQL de `pedido_realizado` a `pedido`

---

## ✅ Checklist Final

- [ ] Ejecutar migración SQL del enum corregido (si es necesario)
- [ ] Verificar que el enum tiene los 6 estados correctos
- [ ] Verificar que la tabla products tiene la columna `size_chart`
- [ ] Reiniciar el servidor de desarrollo
- [ ] Probar crear un producto con tabla de tallas
- [ ] Probar editar un producto existente (debería cargar la tabla)
- [ ] Verificar que los estados de pedidos se muestran correctamente

---

**Fecha**: 15 de octubre de 2025  
**Versión**: 1.1 (Correcciones)
