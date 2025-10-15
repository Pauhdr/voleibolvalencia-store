# Migración: Tabla de Tallas Personalizada

## 📋 Resumen

Se ha implementado un sistema de **tabla de tallas personalizada** para cada producto. Cada producto puede tener su propia tabla con medidas específicas (pecho, cintura, largo, etc.) en centímetros o pulgadas.

## 🎯 Características Implementadas

### En el Frontend

✅ **Nueva interfaz en el panel de admin**:
- Checkbox para habilitar/deshabilitar la tabla de tallas por producto
- Selector de unidad de medida (cm o pulgadas)
- Gestión de columnas (medidas): Añadir/eliminar medidas como "Pecho", "Cintura", "Largo", etc.
- Gestión de filas (tallas): Añadir/eliminar tallas con sus respectivas medidas
- Vista previa en tiempo real de cómo se verá la tabla para los clientes
- Tabla interactiva para rellenar las medidas de cada talla

✅ **Nuevos tipos en TypeScript** (`types/index.ts`):
```typescript
export interface SizeChart {
  enabled: boolean;
  unit: 'cm' | 'inches';
  columns: SizeChartColumn[];
  rows: SizeChartRow[];
}

export interface SizeChartColumn {
  id: string;
  name: string;
}

export interface SizeChartRow {
  size: string;
  measurements: Record<string, string>;
}
```

✅ **Funciones de gestión**:
- `addSizeChartColumn()` - Añadir nueva medida
- `removeSizeChartColumn(index)` - Eliminar medida
- `addSizeChartRow()` - Añadir nueva talla
- `removeSizeChartRow(index)` - Eliminar talla

## 🗄️ Migración de Base de Datos (Supabase)

### ⚠️ ACCIÓN REQUERIDA

Necesitas ejecutar esta migración SQL en Supabase para añadir el campo `size_chart` a la tabla `products`.

### Paso 1: Acceder al SQL Editor de Supabase

1. Entra a tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** en el menú lateral
3. Haz clic en **New Query**

### Paso 2: Ejecutar la Migración

Copia y pega este código SQL:

```sql
-- Añadir columna size_chart a la tabla products
-- Esta columna almacenará la tabla de tallas personalizada en formato JSONB

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size_chart JSONB DEFAULT NULL;

-- Crear índice GIN para búsquedas eficientes en JSONB
CREATE INDEX IF NOT EXISTS idx_products_size_chart 
ON products USING GIN (size_chart);

-- Añadir comentario descriptivo
COMMENT ON COLUMN products.size_chart IS 
'Tabla de tallas personalizada del producto (opcional). Estructura: { enabled: boolean, unit: "cm" | "inches", columns: [{id, name}], rows: [{size, measurements: {columnId: value}}] }';
```

### Paso 3: Ejecutar

Haz clic en el botón **Run** (▶️) en la esquina inferior derecha.

### Verificar la Migración

Para verificar que la columna se añadió correctamente, ejecuta:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'size_chart';
```

Deberías ver:
```
column_name  | data_type | is_nullable | column_default
-------------+-----------+-------------+---------------
size_chart   | jsonb     | YES         | NULL
```

## 📊 Estructura de Datos

### Ejemplo de `size_chart` en JSON

```json
{
  "enabled": true,
  "unit": "cm",
  "columns": [
    {
      "id": "col_1697394000000_abc123",
      "name": "Pecho"
    },
    {
      "id": "col_1697394000001_def456",
      "name": "Cintura"
    },
    {
      "id": "col_1697394000002_ghi789",
      "name": "Largo"
    }
  ],
  "rows": [
    {
      "size": "S",
      "measurements": {
        "col_1697394000000_abc123": "88-92",
        "col_1697394000001_def456": "72-76",
        "col_1697394000002_ghi789": "68"
      }
    },
    {
      "size": "M",
      "measurements": {
        "col_1697394000000_abc123": "92-96",
        "col_1697394000001_def456": "76-80",
        "col_1697394000002_ghi789": "70"
      }
    },
    {
      "size": "L",
      "measurements": {
        "col_1697394000000_abc123": "96-100",
        "col_1697394000001_def456": "80-84",
        "col_1697394000002_ghi789": "72"
      }
    }
  ]
}
```

### Si la tabla NO está habilitada

```json
{
  "enabled": false,
  "unit": "cm",
  "columns": [],
  "rows": []
}
```

O simplemente `null` en la base de datos.

## 🎨 Cómo Funciona en el Admin

### 1. Habilitar Tabla de Tallas
- Marca el checkbox "Habilitar tabla" en el formulario del producto
- Aparecerá toda la interfaz de gestión

### 2. Definir Unidad de Medida
- Selecciona entre **Centímetros (cm)** o **Pulgadas (inches)**
- Esta unidad se mostrará en la tabla para los clientes

### 3. Añadir Medidas (Columnas)
- Haz clic en "Añadir medida"
- Escribe el nombre de la medida (ej: "Pecho", "Cintura", "Largo", "Manga")
- Puedes añadir tantas medidas como necesites
- Puedes eliminar medidas con el botón de la papelera

### 4. Añadir Tallas (Filas)
- Haz clic en "Añadir talla"
- Rellena el nombre de la talla (ej: "S", "M", "L", "XL")
- Rellena las medidas para cada columna definida
- Formato recomendado: "88-92" para rangos o "45" para medidas exactas

### 5. Vista Previa
- Automáticamente verás cómo se muestra la tabla
- Esta es exactamente la vista que verán los clientes

## 💡 Casos de Uso

### Productos que necesitan tabla de tallas:
- ✅ Camisetas de juego
- ✅ Sudaderas
- ✅ Chándales
- ✅ Pantalones
- ✅ Cualquier ropa con tallas

### Productos que NO necesitan tabla de tallas:
- ❌ Balones (solo hay una talla)
- ❌ Accesorios sin talla
- ❌ Merchandising general

## 🔄 Compatibilidad

### Productos Existentes
- Los productos creados **antes** de esta migración tendrán `size_chart: null`
- Esto es completamente válido y no causará errores
- Puedes editarlos y añadir la tabla de tallas cuando quieras

### Productos Nuevos
- Pueden crearse con o sin tabla de tallas
- Es completamente opcional
- Si está deshabilitada, se guarda como `null`

## 🚀 Próximos Pasos (Futuro)

En el futuro, podrías:
1. **Mostrar la tabla de tallas** en la página pública del producto
2. **Añadir un modal "Guía de Tallas"** cuando el cliente seleccione una talla
3. **Importar/exportar tablas** para reutilizar en productos similares
4. **Templates de tablas** predefinidas para diferentes tipos de productos

## ❓ FAQ

### ¿Es obligatorio crear una tabla de tallas?
No, es completamente opcional. Solo créala si el producto realmente necesita esta información.

### ¿Puedo tener diferentes medidas para cada producto?
Sí, cada producto puede tener su propia tabla personalizada con las medidas que necesite.

### ¿Qué pasa si cambio las medidas de una columna después de tener tallas?
Las medidas ya ingresadas se mantienen. Solo el nombre de la columna cambia en la visualización.

### ¿Se puede desactivar después de crearla?
Sí, simplemente desmarca el checkbox "Habilitar tabla" y se guardará como `null`.

### ¿Los clientes ven la tabla?
Actualmente solo está la gestión en el admin. Para mostrarla a los clientes, necesitarás implementar la visualización en la página del producto.

---

**Fecha de implementación**: 15 de octubre de 2025  
**Versión**: 1.0
