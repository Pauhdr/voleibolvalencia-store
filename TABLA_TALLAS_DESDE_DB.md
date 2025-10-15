# Corrección: Tabla de Tallas desde Base de Datos

## 📋 Resumen

Se ha corregido la vista de detalle de producto para que la **tabla de tallas se cargue desde la base de datos** en lugar de usar datos hardcodeados.

## 🔧 Cambios Realizados

### 1. **SizeGuideModal.vue** - Componente Modal de Guía de Tallas

✅ **Cambios en el template**:
- Añadida sección para mostrar tabla de tallas personalizada desde la base de datos
- La tabla personalizada se muestra si `sizeChart.enabled === true`
- Las tablas por defecto (Chico/Chica) solo se muestran si NO hay tabla personalizada
- La tabla muestra dinámicamente todas las columnas y filas configuradas en el admin

✅ **Cambios en el script**:
```typescript
import type { SizeChart } from '~/types';

interface Props {
  isOpen: boolean;
  sizeChart?: SizeChart | null;  // ← Nueva prop
}
```

**Comportamiento**:
- Si el producto tiene `size_chart` habilitado → Muestra tabla personalizada
- Si el producto NO tiene tabla o está deshabilitada → Muestra tablas por defecto (Chico/Chica)

### 2. **pages/product/[id].vue** - Página de Detalle del Producto

✅ **Cambio en el template**:
```vue
<!-- ANTES -->
<SizeGuideModal
  :is-open="showSizeGuide"
  @close="showSizeGuide = false"
/>

<!-- DESPUÉS -->
<SizeGuideModal
  :is-open="showSizeGuide"
  :size-chart="product?.size_chart"
  @close="showSizeGuide = false"
/>
```

Ahora el modal recibe la tabla de tallas del producto cargado desde Supabase.

### 3. **Composable useSupabase.ts** - Ya estaba correcto ✅

El composable ya estaba trayendo correctamente el campo `size_chart`:

```typescript
const product: Product = {
  id: data.id,
  name: data.name,
  price: data.price,
  description: data.description || '',
  options: data.options || {},
  category: data.category,
  image_path: data.image_path || '',
  size_chart: data.size_chart || undefined, // ← Ya estaba
}
```

## 🎯 Funcionamiento

### Caso 1: Producto CON Tabla de Tallas Personalizada

Cuando un producto tiene `size_chart` configurado en el admin:

```json
{
  "enabled": true,
  "unit": "cm",
  "columns": [
    { "id": "col_123", "name": "Pecho" },
    { "id": "col_456", "name": "Cintura" }
  ],
  "rows": [
    { "size": "S", "measurements": { "col_123": "88-92", "col_456": "72-76" } },
    { "size": "M", "measurements": { "col_123": "92-96", "col_456": "76-80" } }
  ]
}
```

**El modal muestra**:
```
┌──────┬───────────────┬────────────────┐
│ Talla │ Pecho (cm)    │ Cintura (cm)   │
├──────┼───────────────┼────────────────┤
│ S    │ 88-92         │ 72-76          │
│ M    │ 92-96         │ 76-80          │
└──────┴───────────────┴────────────────┘
```

### Caso 2: Producto SIN Tabla de Tallas

Cuando un producto tiene `size_chart: null` o `size_chart.enabled: false`:

**El modal muestra**:
- Aviso de diferencias entre chico y chica
- Tabla completa para Chico (4XS a XL)
- Tabla completa para Chica (4XS a XL)
- Consejos para elegir la talla

## 📊 Estructura de Datos

### En la Base de Datos (Supabase)

```sql
-- Columna en la tabla products
size_chart JSONB DEFAULT NULL
```

### En el Código (TypeScript)

```typescript
interface SizeChart {
  enabled: boolean;
  unit: 'cm' | 'inches';
  columns: SizeChartColumn[];
  rows: SizeChartRow[];
}

interface SizeChartColumn {
  id: string;      // Identificador único
  name: string;    // Nombre visible (ej: "Pecho", "Cintura")
}

interface SizeChartRow {
  size: string;    // Nombre de la talla (ej: "S", "M", "L")
  measurements: Record<string, string>;  // { columnId: valor }
}
```

## 🔄 Flujo Completo

```
1. Usuario accede a /product/123
   ↓
2. loadProduct() carga datos desde Supabase
   ↓
3. product.value incluye el campo size_chart
   ↓
4. Usuario hace clic en "Guía de Tallas"
   ↓
5. showSizeGuide = true
   ↓
6. SizeGuideModal recibe product.size_chart como prop
   ↓
7. Modal renderiza:
   - Si size_chart?.enabled === true → Tabla personalizada
   - Si no → Tablas por defecto (Chico/Chica)
```

## ✅ Ventajas

1. **Flexible**: Cada producto puede tener su propia tabla
2. **Dinámico**: Las columnas y filas se generan automáticamente
3. **Retrocompatible**: Productos sin tabla muestran las tablas por defecto
4. **Mantenible**: Los datos están en la base de datos, no hardcodeados

## 🧪 Pruebas Recomendadas

### 1. Producto con Tabla Personalizada
- Crear un producto en el admin con tabla de tallas habilitada
- Añadir columnas: "Pecho", "Cintura", "Largo"
- Añadir filas: S, M, L con sus medidas
- Acceder al producto en la web
- Hacer clic en "Guía de Tallas"
- ✅ Debería mostrar la tabla personalizada

### 2. Producto sin Tabla
- Crear un producto sin habilitar la tabla de tallas
- Acceder al producto en la web
- Hacer clic en "Guía de Tallas"
- ✅ Debería mostrar las tablas por defecto (Chico/Chica)

### 3. Producto Antiguo (null)
- Acceder a un producto creado antes de la migración
- Hacer clic en "Guía de Tallas"
- ✅ Debería mostrar las tablas por defecto sin errores

## 📝 Notas Adicionales

### Migración SQL Requerida

Si aún no has ejecutado la migración, necesitas añadir la columna `size_chart`:

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size_chart JSONB DEFAULT NULL;
```

### Productos de Ejemplo

Los productos de ejemplo en el código (si no hay en Supabase) no tienen `size_chart`, por lo que mostrarán las tablas por defecto. Esto es correcto y esperado.

### Personalización Futura

Puedes personalizar fácilmente:
- Los colores de las tablas personalizadas (actualmente naranja)
- Añadir validaciones de medidas
- Añadir iconos o imágenes explicativas
- Permitir importar/exportar tablas entre productos

---

**Fecha de implementación**: 15 de octubre de 2025  
**Versión**: 1.1  
**Archivos modificados**:
- `components/SizeGuideModal.vue`
- `pages/product/[id].vue`
- `composables/useSupabase.ts` (ya estaba correcto)
