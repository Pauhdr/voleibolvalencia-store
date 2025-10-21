# 📸 Sistema de Múltiples Imágenes por Producto - Instrucciones

## ✅ Cambios Implementados en el Frontend

### 1. **Tipos TypeScript** (`types/index.ts`)
Se ha añadido soporte para múltiples imágenes en la interfaz `Product`:

```typescript
export interface Product {
  // ... campos existentes
  images?: ProductImage[]; // Array de imágenes adicionales
}

export interface ProductImage {
  id: string;              // ID único de la imagen
  url: string;             // URL pública de la imagen
  path: string;            // Path del archivo en Supabase Storage
  order: number;           // Orden de visualización
}
```

### 2. **Panel Admin** (`pages/admin.vue`)
- ✅ Nuevo componente de galería de imágenes
- ✅ Botón para añadir múltiples imágenes
- ✅ Miniaturas con preview
- ✅ Botones para reordenar imágenes (izquierda/derecha)
- ✅ Botón para eliminar imágenes
- ✅ Indicador de orden numérico
- ✅ Subida automática al guardar producto

### 3. **Página de Producto** (`pages/product/[id].vue`)
- ✅ Carrusel de imágenes con navegación
- ✅ Miniaturas clickeables debajo de la imagen principal
- ✅ Indicadores de posición (dots)
- ✅ Botones de navegación que aparecen al hacer hover
- ✅ Responsive y optimizado para móvil

### 4. **Backend** (`composables/useSupabase.ts`)
- ✅ Generación automática de URLs públicas para todas las imágenes
- ✅ Guardado de imágenes en `createProduct()`
- ✅ Actualización de imágenes en `updateProduct()`
- ✅ Carga de imágenes en `getProductById()` y `getProducts()`

---

## 🔧 Cambios Necesarios en Supabase

### 1. **Añadir columna `images` a la tabla `products`**

Ejecuta este SQL en el **SQL Editor** de tu proyecto Supabase:

```sql
-- Añadir columna para almacenar array de imágenes
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB;

-- Añadir comentario para documentación
COMMENT ON COLUMN products.images IS 'Array de imágenes adicionales del producto (formato: [{id, url, path, order}])';

-- Opcional: Crear índice para mejorar rendimiento en consultas
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);
```

### 2. **Verificar Bucket de Storage**

El bucket `products` debe existir y tener las políticas correctas:

#### Crear bucket (si no existe):
```sql
-- En la sección Storage, crear bucket "products" con:
-- - Public: SÍ (para acceso público a imágenes)
-- - File size limit: 5 MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp
```

#### Políticas RLS para el bucket:
```sql
-- Permitir lectura pública de todas las imágenes
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products');

-- Permitir subida solo a usuarios autenticados
CREATE POLICY "Authenticated Upload" ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- Permitir actualización solo a usuarios autenticados
CREATE POLICY "Authenticated Update" ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- Permitir eliminación solo a usuarios autenticados
CREATE POLICY "Authenticated Delete" ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

---

## 📊 Estructura de Datos

### Columna `images` (JSONB)
La columna almacena un array de objetos JSON con esta estructura:

```json
[
  {
    "id": "temp-1729518234567-0.123456",
    "url": "https://xxx.supabase.co/storage/v1/object/public/products/gallery-1729518234567-abc123.jpg",
    "path": "gallery-1729518234567-abc123.jpg",
    "order": 0
  },
  {
    "id": "temp-1729518234789-0.789012",
    "url": "https://xxx.supabase.co/storage/v1/object/public/products/gallery-1729518234789-def456.jpg",
    "path": "gallery-1729518234789-def456.jpg",
    "order": 1
  }
]
```

### Propiedades:
- **`id`**: Identificador único temporal (generado en frontend)
- **`url`**: URL pública completa para mostrar la imagen
- **`path`**: Path relativo en Supabase Storage (para regenerar URLs)
- **`order`**: Orden de visualización (0 = primera, 1 = segunda, etc.)

---

## 🎯 Flujo de Datos Completo

### Crear/Editar Producto:

1. **Admin sube imágenes** → Se guardan en `additionalImages` array
2. **Click en "Guardar"** → `saveProduct()` procesa cada imagen
3. **Por cada imagen nueva**:
   - Sube a Storage con prefijo `gallery-`
   - Devuelve el `path` del archivo
4. **Backend genera URLs públicas**:
   - `createProduct()`/`updateProduct()` llaman a `getPublicUrl()`
   - Añaden `url` a cada objeto imagen
5. **Guardar en BD**:
   - Columna `images` recibe array JSON completo
   - Incluye `id`, `url`, `path` y `order`

### Visualizar Producto:

1. **Frontend carga producto** → `getProductById(id)`
2. **Backend lee columna `images`**:
   - Si existe `path` pero no `url`, regenera URL pública
   - Asegura que todas las imágenes tengan URLs válidas
3. **Frontend muestra carrusel**:
   - Imagen principal + imágenes adicionales ordenadas
   - Miniaturas clickeables
   - Navegación con flechas

---

## 🧪 Pruebas Sugeridas

### Test 1: Crear Producto con Múltiples Imágenes
1. Ve al panel admin
2. Crea un nuevo producto
3. Sube la imagen principal
4. Añade 3-4 imágenes adicionales usando el botón "Añadir Imagen"
5. Reordena las imágenes usando los botones de flecha
6. Guarda el producto
7. **Resultado esperado**: 
   - Todas las imágenes se suben correctamente
   - El producto tiene imagen principal + imágenes adicionales
   - En la página del producto se ve el carrusel funcionando

### Test 2: Reordenar Imágenes
1. Edita un producto con múltiples imágenes
2. Usa los botones de flecha para cambiar el orden
3. Guarda
4. Recarga la página
5. **Resultado esperado**: El orden se mantiene tras guardar

### Test 3: Eliminar Imágenes
1. Edita un producto con múltiples imágenes
2. Haz click en el botón rojo de eliminar en una imagen
3. Guarda
4. **Resultado esperado**: La imagen se elimina del producto

### Test 4: Editar Producto Existente
1. Edita un producto que ya tiene imágenes
2. Añade 2 nuevas imágenes
3. Elimina 1 imagen antigua
4. Guarda
5. **Resultado esperado**: 
   - Las imágenes antiguas se mantienen
   - Las nuevas se añaden
   - La eliminada desaparece

### Test 5: Carrusel en Frontend
1. Abre la página de un producto con múltiples imágenes
2. Haz click en las flechas de navegación
3. Haz click en las miniaturas
4. Observa los indicadores de posición (dots)
5. **Resultado esperado**:
   - Navegación suave entre imágenes
   - Miniaturas resaltan la imagen actual
   - Responsive en móvil

---

## 🐛 Solución de Problemas

### Error: "Column 'images' does not exist"
- **Causa**: No se ejecutó el SQL para añadir la columna
- **Solución**: Ejecuta el ALTER TABLE en Supabase SQL Editor

### Imágenes no se suben
- **Causa**: Bucket 'products' no existe o no tiene permisos
- **Solución**: 
  1. Ve a Storage en Supabase
  2. Crea bucket 'products' con acceso público
  3. Configura políticas RLS

### Imágenes no se muestran (404)
- **Causa**: Bucket no es público o URLs incorrectas
- **Solución**:
  1. Verifica que el bucket es público
  2. Revisa las políticas RLS
  3. Inspecciona la consola para ver las URLs generadas

### Orden de imágenes no se guarda
- **Causa**: No se está actualizando el campo `order`
- **Solución**: 
  - Verifica que `moveImage()` actualiza correctamente
  - Comprueba los logs de consola al guardar

### Imágenes antiguas desaparecen al editar
- **Causa**: No se están preservando las imágenes existentes
- **Solución**: 
  - Verificar que `openProductModal()` carga `additionalImages`
  - Comprobar que `saveProduct()` distingue imágenes nuevas/existentes

---

## 📝 Nomenclatura de Archivos

Las imágenes se guardan en Supabase Storage con estos prefijos:

| Tipo | Prefijo | Ejemplo |
|------|---------|---------|
| Imagen principal | `product-` | `product-1729518234567-abc123.jpg` |
| Galería | `gallery-` | `gallery-1729518234567-def456.jpg` |
| Guía tallas unisex | `size-chart-` | `size-chart-1729518234567-ghi789.jpg` |
| Guía tallas chicos | `size-chart-boys-` | `size-chart-boys-1729518234567-jkl012.jpg` |
| Guía tallas chicas | `size-chart-girls-` | `size-chart-girls-1729518234567-mno345.jpg` |

**Formato completo**: `{prefijo}{timestamp}-{random}.{extension}`

---

## ✨ Características Implementadas

### Admin Panel
- ✅ Interfaz intuitiva para añadir múltiples imágenes
- ✅ Preview de todas las imágenes antes de guardar
- ✅ Reordenamiento visual con botones de flecha
- ✅ Eliminación de imágenes con confirmación visual
- ✅ Indicador numérico de orden
- ✅ Hover effects para mejor UX
- ✅ Validación de tamaño (5MB máx) y tipo de archivo

### Frontend Cliente
- ✅ Carrusel responsive con navegación
- ✅ Miniaturas clickeables
- ✅ Indicadores de posición (dots)
- ✅ Botones de navegación que aparecen al hover
- ✅ Transiciones suaves entre imágenes
- ✅ Optimizado para móvil y táctil
- ✅ Fallback a imagen única si solo hay una

### Backend
- ✅ Subida optimizada de múltiples archivos
- ✅ Generación automática de URLs públicas
- ✅ Gestión de orden de imágenes
- ✅ Compatibilidad con productos antiguos
- ✅ Logs detallados para debugging

---

## 🔄 Migración de Productos Existentes

Los productos existentes **NO necesitan migración**:
- Si no tienen columna `images`, se muestra solo la imagen principal
- El sistema es retrocompatible al 100%
- Puedes editar productos antiguos y añadir galería sin problemas

---

## 📊 Estadísticas de Implementación

| Componente | Líneas Añadidas | Archivos Modificados |
|-----------|-----------------|---------------------|
| Types | ~15 | 1 |
| Admin UI | ~80 | 1 |
| Admin Logic | ~60 | 1 |
| Product Page | ~90 | 1 |
| Backend | ~50 | 1 |
| **TOTAL** | **~295 líneas** | **4 archivos** |

---

## ✅ Checklist de Implementación

- [ ] Ejecutar SQL para añadir columna `images`
- [ ] Verificar que el bucket `products` existe
- [ ] Configurar políticas RLS del bucket
- [ ] Probar subir múltiples imágenes en admin
- [ ] Probar reordenar imágenes
- [ ] Probar eliminar imágenes
- [ ] Verificar carrusel en página de producto
- [ ] Probar en móvil
- [ ] Probar editar productos existentes
- [ ] Verificar que productos antiguos siguen funcionando

---

## 🚀 Próximas Mejoras (Opcional)

- [ ] Drag & drop para reordenar imágenes
- [ ] Zoom en imágenes al hacer click
- [ ] Lazy loading de imágenes
- [ ] Compresión automática de imágenes
- [ ] Soporte para videos
- [ ] Eliminación automática de archivos huérfanos en Storage

---

**Fecha de Implementación**: Octubre 2024  
**Versión**: 1.0  
**Documentación**: INSTRUCCIONES_MULTIPLES_IMAGENES.md
