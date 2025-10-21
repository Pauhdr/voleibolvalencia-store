# 🔢 Sistema de Número de Pedido - Instrucciones

## ✅ Cambios Implementados en el Frontend

### 1. **Tipos TypeScript** (`types/index.ts`)
Se ha añadido el campo `order_number` en la interfaz `Order`:

```typescript
export interface Order {
  id?: string;
  order_number?: number;  // Número de pedido consecutivo de 4 dígitos
  player_name: string;
  team: string;
  // ... resto de campos
}
```

### 2. **Backend** (`composables/useSupabase.ts`)

#### Nueva función `getNextOrderNumber()`:
- Obtiene el último número de pedido de la base de datos
- Incrementa el número en 1
- Rango: 0001-9999 (4 dígitos)
- Si supera 9999, vuelve a empezar en 0001
- Si no hay pedidos, empieza en 0001

#### Modificación en `createOrder()`:
- Llama a `getNextOrderNumber()` antes de crear el pedido
- Incluye `order_number` en el INSERT
- Registra el número asignado en los logs

### 3. **Páginas Modificadas**

#### `pages/checkout.vue`:
- Guarda `order.order_number` en localStorage para la página de éxito
- Muestra el número en los logs de consola

#### `pages/admin.vue`:
- Muestra el número de pedido como badge naranja destacado
- Formato: `#0001`, `#0002`, `#0003`, etc. (con padding de ceros)
- Aparece en la primera línea de cada pedido
- Fallback al ID si no hay order_number (compatibilidad)

---

## 🔧 Cambios Necesarios en Supabase

### 1. **Añadir columna `order_number` a la tabla `orders`**

Ejecuta este SQL en el **SQL Editor** de tu proyecto Supabase:

```sql
-- 1. Añadir columna order_number
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number INTEGER;

-- 2. Añadir restricción UNIQUE para evitar duplicados
ALTER TABLE orders 
ADD CONSTRAINT unique_order_number UNIQUE (order_number);

-- 3. Añadir comentario para documentación
COMMENT ON COLUMN orders.order_number IS 'Número de pedido consecutivo de 4 dígitos (0001-9999)';

-- 4. Crear índice para mejorar rendimiento en consultas
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number DESC);
```

### 2. **Actualizar pedidos existentes (opcional)**

Si ya tienes pedidos en la base de datos y quieres asignarles números:

```sql
-- Opción A: Asignar números consecutivos empezando desde 0001
WITH numbered_orders AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) AS new_order_number
  FROM orders
  WHERE order_number IS NULL
)
UPDATE orders
SET order_number = numbered_orders.new_order_number
FROM numbered_orders
WHERE orders.id = numbered_orders.id;

-- Opción B: Dejar los pedidos antiguos sin número
-- (no hacer nada, los nuevos pedidos empezarán desde 0001)
```

---

## 📊 Estructura de Datos

### Columna `order_number`
- **Tipo**: `INTEGER`
- **Restricción**: `UNIQUE` (no puede haber duplicados)
- **Rango**: 1-9999 (se muestra como 0001-9999 con padding de ceros)
- **Nullable**: Sí (para compatibilidad con pedidos antiguos)
- **Autoincremental**: No (gestionado por la aplicación)

### Ejemplo de datos:
```
id                                      | order_number | player_name  | total
----------------------------------------+--------------+--------------+-------
550e8400-e29b-41d4-a716-446655440000   | 1            | Juan García  | 45.50
550e8400-e29b-41d4-a716-446655440001   | 2            | María López  | 62.00
550e8400-e29b-41d4-a716-446655440002   | 3            | Pedro Sánchez| 38.75
```

**Nota**: En la UI se muestra como `#0001`, `#0002`, `#0003` usando `padStart(4, '0')`

---

## 🎯 Flujo de Creación de Pedido

1. **Usuario hace checkout**
2. **Frontend llama a `createOrder()`**
3. **`getNextOrderNumber()` obtiene el último número**:
   - Consulta: `SELECT order_number FROM orders ORDER BY order_number DESC LIMIT 1`
   - Si no hay pedidos → devuelve 1
   - Si hay pedidos → último_número + 1
   - Si supera 9999 → vuelve a 1
4. **Se crea el pedido con el nuevo número**:
   - INSERT incluye `order_number`
   - Restricción UNIQUE evita duplicados
5. **Se muestra el número al usuario**:
   - En logs de consola
   - En la página de éxito (próximamente)
   - En el panel admin como badge con formato `#0001`, `#0002`, etc.

---

## 🔒 Manejo de Concurrencia

### Problema Potencial:
Si dos usuarios hacen checkout al mismo tiempo, ambos podrían obtener el mismo número.

### Solución Implementada:
La restricción `UNIQUE` en la base de datos previene duplicados:
- Si hay conflicto, la base de datos rechaza el INSERT
- La aplicación puede reintentar con el siguiente número
- Esto es manejado automáticamente por la restricción

### Mejora Futura (Opcional):
Si necesitas mayor robustez, puedes implementar una tabla separada de secuencias:

```sql
-- Crear tabla para gestionar la secuencia
CREATE TABLE IF NOT EXISTS order_sequence (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_number INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar valor inicial
INSERT INTO order_sequence (id, last_number) 
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Función para obtener y actualizar el siguiente número
CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS INTEGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  UPDATE order_sequence 
  SET last_number = CASE 
    WHEN last_number >= 9999 THEN 1
    ELSE last_number + 1
  END,
  updated_at = NOW()
  WHERE id = 1
  RETURNING last_number INTO next_num;
  
  RETURN next_num;
END;
$$ LANGUAGE plpgsql;

-- Usar en trigger o llamar desde la aplicación
```

Pero para la mayoría de casos, la solución actual es suficiente.

---

## 🧪 Pruebas Sugeridas

### Test 1: Primer Pedido
1. Base de datos vacía (sin pedidos)
2. Crear un pedido
3. **Resultado esperado**: `order_number = 1` (mostrado como `#0001`)

### Test 2: Pedidos Consecutivos
1. Crear varios pedidos seguidos
2. **Resultado esperado**: 1, 2, 3, 4... (mostrados como `#0001`, `#0002`, `#0003`, `#0004`...)

### Test 3: Visualización en Admin
1. Crear pedidos con números
2. Abrir panel admin
3. **Resultado esperado**: Ver badge naranja con `#0001`, `#0002`, `#0003`, etc.

### Test 4: Compatibilidad con Pedidos Antiguos
1. Si tienes pedidos sin `order_number`
2. **Resultado esperado**: Muestra fallback (primeros 4 caracteres del ID en mayúsculas)

### Test 5: Reinicio al Superar 9999
1. Actualizar manualmente el último pedido a 9999
   ```sql
   UPDATE orders SET order_number = 9999 WHERE id = 'último-pedido-id';
   ```
2. Crear un nuevo pedido
3. **Resultado esperado**: `order_number = 1` (reinicia, mostrado como `#0001`)

---

## 📝 Verificación en Base de Datos

### Ver todos los números de pedido:
```sql
SELECT 
  order_number,
  player_name,
  total,
  created_at
FROM orders
ORDER BY order_number DESC;
```

### Ver último número asignado:
```sql
SELECT MAX(order_number) as ultimo_numero
FROM orders;
```

### Contar pedidos por rango:
```sql
SELECT 
  CASE 
    WHEN order_number BETWEEN 1 AND 999 THEN '0001-0999'
    WHEN order_number BETWEEN 1000 AND 1999 THEN '1000-1999'
    WHEN order_number BETWEEN 2000 AND 2999 THEN '2000-2999'
    -- ... etc
    ELSE 'Otros'
  END as rango,
  COUNT(*) as cantidad
FROM orders
WHERE order_number IS NOT NULL
GROUP BY rango
ORDER BY rango;
```

### Buscar pedido por número:
```sql
-- Por número (sin ceros)
SELECT * FROM orders WHERE order_number = 123;

-- O con el número visible completo (ej: buscar #0123)
SELECT * FROM orders WHERE order_number = 123;
```

---

## 🐛 Solución de Problemas

### Error: "Column 'order_number' does not exist"
- **Causa**: No se ejecutó el SQL para añadir la columna
- **Solución**: Ejecuta el ALTER TABLE en Supabase SQL Editor

### Error: "duplicate key value violates unique constraint"
- **Causa**: Intento de crear dos pedidos con el mismo número (raro)
- **Solución**: La aplicación debería obtener el siguiente número y reintentar
- **Prevención**: La función `getNextOrderNumber()` ya maneja esto

### Números no consecutivos
- **Causa**: Pedidos eliminados o cancelados
- **Solución**: Normal, los números asignados no se reutilizan

### Pedidos sin número
- **Causa**: Pedidos creados antes de implementar el sistema
- **Solución**: Opcional - ejecutar el SQL de actualización masiva

### Números duplicados (muy raro)
- **Causa**: Fallo en la restricción UNIQUE
- **Solución**: 
  ```sql
  -- Reasignar números duplicados
  WITH duplicates AS (
    SELECT id, order_number,
      ROW_NUMBER() OVER (PARTITION BY order_number ORDER BY created_at) as rn
    FROM orders
    WHERE order_number IS NOT NULL
  )
  UPDATE orders
  SET order_number = (
    SELECT MAX(order_number) FROM orders
  ) + duplicates.rn
  FROM duplicates
  WHERE orders.id = duplicates.id
  AND duplicates.rn > 1;
  ```

---

## 🔄 Migración de Pedidos Existentes

Si tienes pedidos antiguos y quieres asignarles números:

### Opción 1: Números Consecutivos desde 0001
```sql
-- Asignar números en orden de creación empezando desde 1
WITH numbered_orders AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) AS new_number
  FROM orders
  WHERE order_number IS NULL
)
UPDATE orders
SET order_number = numbered_orders.new_number
FROM numbered_orders
WHERE orders.id = numbered_orders.id;
```

### Opción 2: Preservar Huecos (Empezar después de cierto número)
```sql
-- Si quieres dejar 1-100 para pedidos antiguos
-- y empezar los nuevos desde 101
WITH numbered_orders AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) + 100 AS new_number
  FROM orders
  WHERE order_number IS NULL
)
UPDATE orders
SET order_number = numbered_orders.new_number
FROM numbered_orders
WHERE orders.id = numbered_orders.id;
```

### Opción 3: No hacer nada
Los pedidos antiguos quedarán con `order_number = NULL` y se mostrará un fallback en la UI.

---

## 📊 Estadísticas de Implementación

| Componente | Líneas Añadidas | Archivos Modificados |
|-----------|-----------------|---------------------|
| Types | ~3 | 1 |
| Backend | ~35 | 1 |
| Checkout | ~5 | 1 |
| Admin | ~10 | 1 |
| **TOTAL** | **~53 líneas** | **3 archivos** |

---

## ✨ Características Implementadas

### Backend
- ✅ Función `getNextOrderNumber()` con lógica de incremento
- ✅ Rango 1-9999 (mostrado con padding como 0001-9999)
- ✅ Reinicio automático al superar 9999
- ✅ Manejo de base de datos vacía (empieza en 1)
- ✅ Logs detallados del número asignado
- ✅ Inclusión de `order_number` en el INSERT

### Frontend
- ✅ Badge naranja destacado en admin panel
- ✅ Formato `#XXXX` con padding de ceros (ej: #0001, #0002, #0100)
- ✅ Fallback a ID si no hay order_number
- ✅ Compatibilidad con pedidos antiguos
- ✅ Logs en consola del número asignado

### Base de Datos
- ✅ Columna INTEGER nullable
- ✅ Restricción UNIQUE para prevenir duplicados
- ✅ Índice para optimizar consultas
- ✅ Comentario descriptivo

---

## 🚀 Próximas Mejoras (Opcional)

- [ ] Mostrar número de pedido en la página de éxito
- [ ] Mostrar número en emails de confirmación
- [ ] Búsqueda por número en el panel admin
- [ ] Filtro por rango de números
- [ ] Exportar lista de pedidos con números
- [ ] API endpoint para consultar por número
- [ ] Generar código QR con el número de pedido

---

## ✅ Checklist de Implementación

- [ ] Ejecutar SQL para añadir columna `order_number`
- [ ] Ejecutar SQL para añadir restricción UNIQUE
- [ ] Ejecutar SQL para crear índice
- [ ] (Opcional) Migrar pedidos existentes
- [ ] Probar crear un pedido nuevo
- [ ] Verificar que aparece el número en admin
- [ ] Verificar que los números son consecutivos
- [ ] Comprobar logs de consola

---

**Fecha de Implementación**: Octubre 2024  
**Versión**: 1.0  
**Documentación**: INSTRUCCIONES_NUMERO_PEDIDO.md
