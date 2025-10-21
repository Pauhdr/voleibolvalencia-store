# 📋 Instrucciones de Implementación - Sistema de Imágenes para Tablas de Tallas

## ✅ Lo que ya está implementado

1. **Frontend completamente funcional**:
   - ✅ UI para subir imágenes (unisex y separadas por género)
   - ✅ Funciones de manejo de archivos y previews
   - ✅ Validación de tamaño (5MB máx) y tipo de archivo
   - ✅ Integración con `uploadProductImage()` con prefijos
   - ✅ Actualización del tipo `SizeChart` en TypeScript
   - ✅ Limpieza de funciones obsoletas de tablas dinámicas

2. **Lógica de guardado**:
   - ✅ `saveProduct()` sube las imágenes a Supabase Storage
   - ✅ Diferencia entre tabla unisex (1 imagen) y separadas (2 imágenes)
   - ✅ Mantiene imágenes existentes al editar productos

## 🔧 Tareas pendientes (DEBES HACER TÚ)

### 1. **Actualizar la base de datos en Supabase** 

Necesitas añadir las columnas para las imágenes en la tabla `products`:

```sql
-- Conecta a tu proyecto de Supabase y ejecuta este SQL

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size_chart_image TEXT,
ADD COLUMN IF NOT EXISTS size_chart_image_path TEXT,
ADD COLUMN IF NOT EXISTS size_chart_boys_image TEXT,
ADD COLUMN IF NOT EXISTS size_chart_boys_image_path TEXT,
ADD COLUMN IF NOT EXISTS size_chart_girls_image TEXT,
ADD COLUMN IF NOT EXISTS size_chart_girls_image_path TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN products.size_chart_image IS 'URL pública de la imagen de tabla de tallas (unisex)';
COMMENT ON COLUMN products.size_chart_image_path IS 'Path en Supabase Storage de la imagen (unisex)';
COMMENT ON COLUMN products.size_chart_boys_image IS 'URL pública de la imagen de tabla de tallas para chicos';
COMMENT ON COLUMN products.size_chart_boys_image_path IS 'Path en Supabase Storage de la imagen (chicos)';
COMMENT ON COLUMN products.size_chart_girls_image IS 'URL pública de la imagen de tabla de tallas para chicas';
COMMENT ON COLUMN products.size_chart_girls_image_path IS 'Path en Supabase Storage de la imagen (chicas)';
```

**Cómo hacerlo:**
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a **SQL Editor**
3. Copia y pega el código SQL de arriba
4. Haz clic en **Run** para ejecutar

---

### 2. **Actualizar `useSupabase.ts` para guardar las URLs de las imágenes**

El archivo `composables/useSupabase.ts` necesita guardar las URLs públicas de las imágenes en `size_chart`.

#### 2.1. Modificar `createProduct()`:

Busca la función `createProduct` (aprox. línea 289) y actualízala así:

```typescript
const createProduct = async (productData: any): Promise<boolean> => {
  try {
    console.log('💾 Guardando producto en BD:', productData);
    
    // Si hay image_path, generar la URL pública
    if (productData.image_path) {
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(productData.image_path);
      productData.image = data.publicUrl;
    }

    // NUEVO: Si hay size_chart con imágenes, generar URLs públicas
    if (productData.size_chart) {
      if (productData.size_chart.image_path) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(productData.size_chart.image_path);
        productData.size_chart.image = data.publicUrl;
      }
      if (productData.size_chart.boys_image_path) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(productData.size_chart.boys_image_path);
        productData.size_chart.boys_image = data.publicUrl;
      }
      if (productData.size_chart.girls_image_path) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(productData.size_chart.girls_image_path);
        productData.size_chart.girls_image = data.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        image_path: productData.image_path,
        options: productData.options,
        size_chart: productData.size_chart || null  // ✅ Ya incluye las URLs
      }])
      .select();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return false;
  }
};
```

#### 2.2. Modificar `updateProduct()`:

Busca la función `updateProduct` (aprox. línea 315) y actualízala de forma similar:

```typescript
const updateProduct = async (id: string, productData: any): Promise<boolean> => {
  try {
    console.log('💾 Guardando producto en BD:', productData);
    
    // Si hay image_path, generar la URL pública
    if (productData.image_path) {
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(productData.image_path);
      productData.image = data.publicUrl;
    }

    // NUEVO: Si hay size_chart con imágenes, generar URLs públicas
    if (productData.size_chart) {
      if (productData.size_chart.image_path) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(productData.size_chart.image_path);
        productData.size_chart.image = data.publicUrl;
      }
      if (productData.size_chart.boys_image_path) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(productData.size_chart.boys_image_path);
        productData.size_chart.boys_image = data.publicUrl;
      }
      if (productData.size_chart.girls_image_path) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(productData.size_chart.girls_image_path);
        productData.size_chart.girls_image = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        image_path: productData.image_path,
        options: productData.options,
        size_chart: productData.size_chart || null  // ✅ Ya incluye las URLs
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return false;
  }
};
```

---

### 3. **Actualizar la página del producto para mostrar las imágenes**

El archivo `pages/product/[id].vue` necesita mostrar las imágenes de las tablas de tallas.

Busca la sección donde se muestra el producto (aprox. líneas 50-120) y añade esta sección al final del template, antes de cerrar el `div` principal:

```vue
<!-- Tabla de Tallas -->
<div v-if="product.size_chart?.enabled" class="mt-12 border-t pt-8">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">📏 Tabla de Tallas</h2>
  
  <!-- Tabla única (unisex) -->
  <div v-if="!product.size_chart.hasSeparateGenders && product.size_chart.image">
    <img 
      :src="product.size_chart.image" 
      :alt="`Tabla de tallas de ${product.name}`"
      class="max-w-full h-auto rounded-lg shadow-lg border border-gray-200"
    />
  </div>

  <!-- Tablas separadas por género -->
  <div v-else-if="product.size_chart.hasSeparateGenders" class="space-y-8">
    <!-- Tabla Chicos -->
    <div v-if="product.size_chart.boys_image" class="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
      <h3 class="text-xl font-bold text-blue-900 mb-4">👦 Tabla para Chicos</h3>
      <img 
        :src="product.size_chart.boys_image" 
        :alt="`Tabla de tallas para chicos - ${product.name}`"
        class="max-w-full h-auto rounded-lg shadow-lg border border-blue-300"
      />
    </div>

    <!-- Tabla Chicas -->
    <div v-if="product.size_chart.girls_image" class="border-2 border-pink-200 rounded-lg p-6 bg-pink-50">
      <h3 class="text-xl font-bold text-pink-900 mb-4">👧 Tabla para Chicas</h3>
      <img 
        :src="product.size_chart.girls_image" 
        :alt="`Tabla de tallas para chicas - ${product.name}`"
        class="max-w-full h-auto rounded-lg shadow-lg border border-pink-300"
      />
    </div>
  </div>

  <p class="text-sm text-gray-500 mt-4 italic">
    💡 Consulta la tabla de tallas para elegir la talla correcta
  </p>
</div>
```

---

### 4. **Verificar el bucket de Supabase Storage**

Asegúrate de que el bucket `products` existe y tiene las políticas correctas:

1. Ve a **Storage** en tu proyecto de Supabase
2. Verifica que existe el bucket `products`
3. Si no existe, créalo con estas configuraciones:
   - **Name**: `products`
   - **Public**: ✅ Sí (para que las imágenes sean accesibles públicamente)
   - **File size limit**: 5 MB

4. Configurar políticas (RLS):
   ```sql
   -- Permitir lectura pública
   CREATE POLICY "Public Access" ON storage.objects 
   FOR SELECT USING (bucket_id = 'products');

   -- Permitir subida autenticada (solo admins)
   CREATE POLICY "Authenticated Upload" ON storage.objects 
   FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
   ```

---

## 🧪 Pruebas sugeridas

Una vez completados todos los pasos:

### Test 1: Crear producto con tabla unisex
1. Ve al panel admin
2. Crea un nuevo producto
3. Activa "Tabla de Tallas"
4. Selecciona "Tabla única (unisex)"
5. Sube una imagen
6. Guarda el producto
7. Verifica que aparece en la página del producto

### Test 2: Crear producto con tablas separadas
1. Crea un nuevo producto
2. Activa "Tabla de Tallas"
3. Selecciona "Tablas separadas (chico/chica)"
4. Sube una imagen para chicos
5. Sube una imagen para chicas
6. Guarda el producto
7. Verifica que ambas aparecen en la página del producto

### Test 3: Editar producto existente
1. Edita un producto que ya tenga tabla de tallas
2. Cambia la imagen
3. Guarda
4. Verifica que la imagen se actualiza correctamente

### Test 4: Eliminar imagen
1. Edita un producto con tabla de tallas
2. Haz clic en "Eliminar imagen"
3. Guarda
4. Verifica que ya no aparece la tabla en la página del producto

---

## 🐛 Solución de problemas comunes

### Error: "Failed to upload image"
- Verifica que el bucket `products` existe en Supabase Storage
- Verifica las políticas RLS del bucket
- Verifica que el archivo es menor a 5MB

### Error: "Image not loading" (404)
- Verifica que el bucket es **público**
- Verifica que las URLs públicas se están generando correctamente
- Inspecciona la consola del navegador para ver la URL generada

### Las imágenes no aparecen en el producto
- Verifica que `pages/product/[id].vue` tiene el código nuevo
- Verifica que `product.size_chart.image` tiene una URL válida
- Inspecciona el elemento con las DevTools del navegador

---

## 📝 Notas importantes

1. **Las propiedades antiguas (`columns`, `rows`, `boys`, `girls`) siguen existiendo** en el tipo `SizeChart` por compatibilidad con productos antiguos, pero están marcadas como **DEPRECADAS**.

2. **Migración de datos**: Si tienes productos antiguos con tablas dinámicas, necesitarás:
   - Exportar las tablas como imágenes
   - Subirlas manualmente usando el nuevo sistema
   - O crear un script de migración

3. **Rendimiento**: Las imágenes se cachean por el navegador, así que una vez cargadas son muy rápidas.

4. **SEO**: Las imágenes tienen atributos `alt` descriptivos para mejorar la accesibilidad.

---

## ✅ Checklist final

Marca cuando completes cada paso:

- [ ] Ejecutar SQL para añadir columnas a la base de datos
- [ ] Actualizar `createProduct()` en `useSupabase.ts`
- [ ] Actualizar `updateProduct()` en `useSupabase.ts`
- [ ] Añadir sección de tabla de tallas en `pages/product/[id].vue`
- [ ] Verificar configuración del bucket `products` en Supabase Storage
- [ ] Probar crear producto con tabla unisex
- [ ] Probar crear producto con tablas separadas
- [ ] Probar editar producto existente
- [ ] Probar eliminar imágenes de tabla

---

¿Necesitas ayuda con algún paso? ¡Pregúntame! 🚀
