# Sistema de Tablas de Tallas Separadas por Género

## 📋 Resumen

Se ha implementado la capacidad de crear **tablas de tallas separadas para chicos y chicas** dentro del mismo producto. El administrador puede elegir entre:
- **Tabla única (unisex)**: Una sola tabla para ambos géneros
- **Tablas separadas**: Tablas diferentes para chico y chica con sus propias medidas

## 🎯 Cambios Realizados

### 1. **Tipos Actualizados** (`types/index.ts`)

✅ La interfaz `SizeChart` ahora soporta ambos modos:

```typescript
export interface SizeChart {
  enabled: boolean;
  unit: 'cm' | 'inches';
  hasSeparateGenders: boolean;  // ← NUEVO
  
  // Modo tabla única (si hasSeparateGenders = false)
  columns?: SizeChartColumn[];
  rows?: SizeChartRow[];
  
  // Modo tablas separadas (si hasSeparateGenders = true)
  boys?: {
    columns: SizeChartColumn[];
    rows: SizeChartRow[];
  };
  girls?: {
    columns: SizeChartColumn[];
    rows: SizeChartRow[];
  };
}
```

### 2. **Modal de Visualización** (`components/SizeGuideModal.vue`)

✅ **YA ACTUALIZADO** - El modal ahora muestra:
- Tabla única si `hasSeparateGenders === false`
- Dos tablas separadas (chico y chica) si `hasSeparateGenders === true`
- Tablas por defecto si no hay tabla personalizada

### 3. **Formulario del Admin** (`pages/admin.vue`)

#### Cambios Necesarios:

##### A. Inicialización del Formulario (HECHO ✅)

```typescript
size_chart: {
  enabled: false,
  unit: 'cm' as 'cm' | 'inches',
  hasSeparateGenders: false,  // ← NUEVO
  columns: [],
  rows: [],
  boys: {
    columns: [],
    rows: [],
  },
  girls: {
    columns: [],
    rows: [],
  },
},
```

##### B. Selector de Tipo de Tabla (HECHO ✅ - línea ~740)

Se añadió un selector de radio después del selector de unidad:
- **Tabla única (unisex)**
- **Tablas separadas (chico/chica)**

##### C. Secciones del Formulario (POR COMPLETAR ⏳)

Necesitas agregar después de la línea 770 aproximadamente:

```vue
<!-- TABLA ÚNICA (unisex) -->
<div v-if="!productForm.size_chart.hasSeparateGenders">
  <!-- Gestión de columnas y filas ACTUALES -->
  <!-- Mantener todo el código existente de columnas/rows -->
</div>

<!-- TABLAS SEPARADAS POR GÉNERO -->
<div v-if="productForm.size_chart.hasSeparateGenders" class="space-y-6">
  <!-- ========== TABLA CHICO ========== -->
  <div class="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
    <h4 class="text-lg font-bold text-blue-900 mb-4 flex items-center">
      <span class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">Chico</span>
      Tabla de Tallas
    </h4>
    
    <!-- Columnas para chico -->
    <div class="bg-white p-4 rounded-lg mb-4">
      <div class="flex items-center justify-between mb-3">
        <h5 class="font-semibold text-gray-900">Medidas (Columnas)</h5>
        <button
          type="button"
          @click="addSizeChartColumn('boys')"
          class="btn-outline text-sm"
        >
          Añadir medida
        </button>
      </div>
      
      <div v-if="productForm.size_chart.boys.columns.length > 0" class="space-y-2">
        <div
          v-for="(column, index) in productForm.size_chart.boys.columns"
          :key="column.id"
          class="flex items-center gap-2"
        >
          <input
            v-model="column.name"
            type="text"
            class="input-field flex-1"
            placeholder="Ej: Pecho, Cintura, Largo..."
          />
          <button
            type="button"
            @click="removeSizeChartColumn('boys', index)"
            class="text-red-600 hover:text-red-800 p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-2">
        No hay medidas definidas
      </p>
    </div>

    <!-- Tallas para chico -->
    <div class="bg-white p-4 rounded-lg">
      <div class="flex items-center justify-between mb-3">
        <h5 class="font-semibold text-gray-900">Tallas y Medidas</h5>
        <button
          type="button"
          @click="addSizeChartRow('boys')"
          class="btn-outline text-sm"
          :disabled="productForm.size_chart.boys.columns.length === 0"
        >
          Añadir talla
        </button>
      </div>

      <div v-if="productForm.size_chart.boys.rows.length > 0 && productForm.size_chart.boys.columns.length > 0" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold">Talla</th>
              <th
                v-for="column in productForm.size_chart.boys.columns"
                :key="column.id"
                class="px-4 py-2 text-left text-sm font-semibold"
              >
                {{ column.name }}
              </th>
              <th class="px-4 py-2 w-20"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in productForm.size_chart.boys.rows"
              :key="rowIndex"
              class="border-t border-gray-200"
            >
              <td class="px-4 py-2">
                <input
                  v-model="row.size"
                  type="text"
                  class="input-field"
                  placeholder="S, M, L..."
                />
              </td>
              <td
                v-for="column in productForm.size_chart.boys.columns"
                :key="column.id"
                class="px-4 py-2"
              >
                <input
                  v-model="row.measurements[column.id]"
                  type="text"
                  class="input-field"
                  placeholder="Ej: 45-48"
                />
              </td>
              <td class="px-4 py-2 text-center">
                <button
                  type="button"
                  @click="removeSizeChartRow('boys', rowIndex)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-2">
        {{ productForm.size_chart.boys.columns.length === 0 
          ? 'Primero define las medidas' 
          : 'No hay tallas definidas' }}
      </p>
    </div>
  </div>

  <!-- ========== TABLA CHICA ========== -->
  <div class="border-2 border-pink-200 rounded-lg p-4 bg-pink-50">
    <h4 class="text-lg font-bold text-pink-900 mb-4 flex items-center">
      <span class="bg-pink-600 text-white px-3 py-1 rounded-lg mr-2">Chica</span>
      Tabla de Tallas
    </h4>
    
    <!-- Columnas para chica -->
    <div class="bg-white p-4 rounded-lg mb-4">
      <div class="flex items-center justify-between mb-3">
        <h5 class="font-semibold text-gray-900">Medidas (Columnas)</h5>
        <button
          type="button"
          @click="addSizeChartColumn('girls')"
          class="btn-outline text-sm"
        >
          Añadir medida
        </button>
      </div>
      
      <div v-if="productForm.size_chart.girls.columns.length > 0" class="space-y-2">
        <div
          v-for="(column, index) in productForm.size_chart.girls.columns"
          :key="column.id"
          class="flex items-center gap-2"
        >
          <input
            v-model="column.name"
            type="text"
            class="input-field flex-1"
            placeholder="Ej: Pecho, Cintura, Largo..."
          />
          <button
            type="button"
            @click="removeSizeChartColumn('girls', index)"
            class="text-red-600 hover:text-red-800 p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-2">
        No hay medidas definidas
      </p>
    </div>

    <!-- Tallas para chica -->
    <div class="bg-white p-4 rounded-lg">
      <div class="flex items-center justify-between mb-3">
        <h5 class="font-semibold text-gray-900">Tallas y Medidas</h5>
        <button
          type="button"
          @click="addSizeChartRow('girls')"
          class="btn-outline text-sm"
          :disabled="productForm.size_chart.girls.columns.length === 0"
        >
          Añadir talla
        </button>
      </div>

      <div v-if="productForm.size_chart.girls.rows.length > 0 && productForm.size_chart.girls.columns.length > 0" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead class="bg-pink-100">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold">Talla</th>
              <th
                v-for="column in productForm.size_chart.girls.columns"
                :key="column.id"
                class="px-4 py-2 text-left text-sm font-semibold"
              >
                {{ column.name }}
              </th>
              <th class="px-4 py-2 w-20"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in productForm.size_chart.girls.rows"
              :key="rowIndex"
              class="border-t border-gray-200"
            >
              <td class="px-4 py-2">
                <input
                  v-model="row.size"
                  type="text"
                  class="input-field"
                  placeholder="S, M, L..."
                />
              </td>
              <td
                v-for="column in productForm.size_chart.girls.columns"
                :key="column.id"
                class="px-4 py-2"
              >
                <input
                  v-model="row.measurements[column.id]"
                  type="text"
                  class="input-field"
                  placeholder="Ej: 42-45"
                />
              </td>
              <td class="px-4 py-2 text-center">
                <button
                  type="button"
                  @click="removeSizeChartRow('girls', rowIndex)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-2">
        {{ productForm.size_chart.girls.columns.length === 0 
          ? 'Primero define las medidas' 
          : 'No hay tallas definidas' }}
      </p>
    </div>
  </div>
</div>
```

##### D. Funciones JavaScript Actualizadas (POR ACTUALIZAR ⏳)

Reemplazar las funciones actuales (línea ~1240) por estas versiones:

```typescript
// Añadir columna (medida) a la tabla de tallas
const addSizeChartColumn = (gender?: 'boys' | 'girls') => {
  const columnId = `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  if (productForm.value.size_chart.hasSeparateGenders && gender) {
    // Tablas separadas
    productForm.value.size_chart[gender].columns.push({
      id: columnId,
      name: '',
    });
  } else {
    // Tabla única
    productForm.value.size_chart.columns!.push({
      id: columnId,
      name: '',
    });
  }
};

// Eliminar columna de la tabla de tallas
const removeSizeChartColumn = (genderOrIndex: 'boys' | 'girls' | number, indexIfGender?: number) => {
  if (productForm.value.size_chart.hasSeparateGenders && typeof genderOrIndex === 'string') {
    // Tablas separadas
    const gender = genderOrIndex;
    const index = indexIfGender!;
    const columnId = productForm.value.size_chart[gender].columns[index].id;
    productForm.value.size_chart[gender].columns.splice(index, 1);
    
    // Eliminar las medidas de esta columna en todas las filas
    productForm.value.size_chart[gender].rows.forEach(row => {
      delete row.measurements[columnId];
    });
  } else if (typeof genderOrIndex === 'number') {
    // Tabla única
    const index = genderOrIndex;
    const columnId = productForm.value.size_chart.columns![index].id;
    productForm.value.size_chart.columns!.splice(index, 1);
    
    // Eliminar las medidas de esta columna en todas las filas
    productForm.value.size_chart.rows!.forEach(row => {
      delete row.measurements[columnId];
    });
  }
};

// Añadir fila (talla) a la tabla de tallas
const addSizeChartRow = (gender?: 'boys' | 'girls') => {
  const measurements: Record<string, string> = {};
  
  if (productForm.value.size_chart.hasSeparateGenders && gender) {
    // Tablas separadas
    productForm.value.size_chart[gender].columns.forEach(column => {
      measurements[column.id] = '';
    });
    
    productForm.value.size_chart[gender].rows.push({
      size: '',
      measurements,
    });
  } else {
    // Tabla única
    productForm.value.size_chart.columns!.forEach(column => {
      measurements[column.id] = '';
    });
    
    productForm.value.size_chart.rows!.push({
      size: '',
      measurements,
    });
  }
};

// Eliminar fila de la tabla de tallas
const removeSizeChartRow = (genderOrIndex: 'boys' | 'girls' | number, indexIfGender?: number) => {
  if (productForm.value.size_chart.hasSeparateGenders && typeof genderOrIndex === 'string') {
    // Tablas separadas
    const gender = genderOrIndex;
    const index = indexIfGender!;
    productForm.value.size_chart[gender].rows.splice(index, 1);
  } else if (typeof genderOrIndex === 'number') {
    // Tabla única
    const index = genderOrIndex;
    productForm.value.size_chart.rows!.splice(index, 1);
  }
};
```

##### E. Actualizar openProductModal (línea ~1155)

Agregar soporte para cargar tablas separadas:

```typescript
const openProductModal = (product?: Product) => {
  if (product) {
    // ... código existente ...
    
    size_chart: product.size_chart || {
      enabled: false,
      unit: 'cm',
      hasSeparateGenders: false,
      columns: [],
      rows: [],
      boys: {
        columns: [],
        rows: [],
      },
      girls: {
        columns: [],
        rows: [],
      },
    },
  }
  // ... resto del código ...
};
```

## 🔄 Flujo de Uso

### Crear Producto con Tablas Separadas

1. Admin hace clic en "Añadir Producto"
2. Habilita la tabla de tallas
3. Selecciona "Tablas separadas (chico/chica)"
4. Define medidas para chicos (ej: Pecho, Cintura, Largo)
5. Añade tallas para chicos (S, M, L) con sus medidas
6. Define medidas para chicas (pueden ser las mismas o diferentes)
7. Añade tallas para chicas con sus medidas
8. Vista previa muestra ambas tablas
9. Guarda el producto

### Visualización Cliente

Cuando un cliente ve el producto:
- Si tiene tablas separadas → Modal muestra tabla de chicos y tabla de chicas
- Si tiene tabla única → Modal muestra una sola tabla
- Si no tiene tabla → Modal muestra las tablas por defecto

## 📊 Estructura de Datos

### Ejemplo: Tabla Única

```json
{
  "enabled": true,
  "unit": "cm",
  "hasSeparateGenders": false,
  "columns": [
    { "id": "col_123", "name": "Pecho" },
    { "id": "col_456", "name": "Cintura" }
  ],
  "rows": [
    { "size": "S", "measurements": { "col_123": "88-92", "col_456": "72-76" } }
  ]
}
```

### Ejemplo: Tablas Separadas

```json
{
  "enabled": true,
  "unit": "cm",
  "hasSeparateGenders": true,
  "boys": {
    "columns": [
      { "id": "col_123", "name": "Pecho" },
      { "id": "col_456", "name": "Cintura" }
    ],
    "rows": [
      { "size": "S", "measurements": { "col_123": "88-92", "col_456": "72-76" } }
    ]
  },
  "girls": {
    "columns": [
      { "id": "col_789", "name": "Pecho" },
      { "id": "col_012", "name": "Cintura" }
    ],
    "rows": [
      { "size": "S", "measurements": { "col_789": "82-86", "col_012": "66-70" } }
    ]
  }
}
```

## ✅ Checklist de Implementación

- [x] Actualizar tipos (`types/index.ts`)
- [x] Actualizar modal de visualización (`components/SizeGuideModal.vue`)
- [x] Actualizar inicialización del formulario
- [x] Agregar selector de tipo de tabla
- [ ] Agregar secciones del formulario para tablas separadas (HTML)
- [ ] Actualizar funciones JavaScript para manejar ambos modos
- [ ] Actualizar openProductModal para cargar correctamente
- [ ] Probar crear producto con tabla única
- [ ] Probar crear producto con tablas separadas
- [ ] Probar editar productos existentes
- [ ] Verificar visualización en el frontend

---

**Fecha**: 15 de octubre de 2025  
**Versión**: 2.0
