# 🎽 Panel de Administración - Gestión de Productos

## ✅ Funcionalidades Implementadas

### 1. **Sistema de Pestañas**
- ✅ Pestaña "📦 Pedidos" - Gestión de pedidos del club
- ✅ Pestaña "🎽 Productos" - Gestión completa del catálogo

### 2. **Listado de Productos**
- Vista en grid (3 columnas en desktop)
- Muestra información clave:
  - Imagen del producto
  - Nombre y descripción
  - Precio
  - Opciones configurables (tallas, géneros, personalizaciones)
- Botones de acción: Editar y Eliminar

### 3. **Crear Producto**
Modal con formulario user-friendly que incluye:

#### Información Básica
- **Nombre del Producto** * (obligatorio)
- **Descripción** (opcional, multilinea)
- **Precio** * (obligatorio, en euros con decimales)
- **Categoría** (desplegable con opciones predefinidas):
  - Sin categoría
  - Camisetas
  - Sudaderas
  - Pantalones
  - Complementos

#### Subida de Imagen
- Selector de archivo con validación
- Preview automático de la imagen seleccionada
- Formatos aceptados: JPG, PNG, WEBP
- Tamaño máximo: 5MB
- Se sube automáticamente a Supabase Storage

#### Opciones de Configuración (Checkboxes Amigables)

**¿Tiene tallas?**
- Al activar, muestra selector visual de tallas
- Opciones: 4XS, 3XS, 2XS, XS, S, M, L, XL, XXL, 3XL, 4XL
- Selección múltiple con checkboxes

**¿Tiene opciones de género?**
- Al activar, muestra selector de géneros
- Opciones: Chico / Chica
- Útil para productos con cortes diferentes

**¿Permite número de dorsal personalizado?**
- Checkbox simple
- Texto explicativo: "El cliente podrá elegir el número que quiere en su camiseta"

**¿Permite nombre personalizado?**
- Checkbox simple
- Texto explicativo: "El cliente podrá poner un nombre en su camiseta (ej: apellido del jugador)"

### 4. **Editar Producto**
- Mismo formulario que crear
- Pre-carga todos los datos del producto existente
- Mantiene la imagen actual si no se sube una nueva
- Actualiza solo los campos modificados

### 5. **Eliminar Producto**
- Confirmación antes de eliminar
- Soft delete: marca el producto como `active: false`
- No se elimina de la base de datos (permite recuperación)

---

## 🔧 Implementación Técnica

### Archivos Modificados

#### 1. `/front/pages/admin.vue`
**Cambios principales:**
- Añadido sistema de pestañas (`activeTab`)
- Nuevo modal de producto con formulario completo
- Estados reactivos para gestión de productos
- Funciones CRUD completas
- Manejo de subida de imágenes con preview

**Nuevas variables de estado:**
```typescript
const activeTab = ref<'orders' | 'products'>('orders')
const products = ref<Product[]>([])
const loadingProducts = ref(false)
const showProductModal = ref(false)
const editingProduct = ref<Product | null>(null)
const savingProduct = ref(false)
const imagePreview = ref<string>('')
const selectedImageFile = ref<File | null>(null)
const availableSizes = ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']
```

**Nuevas funciones:**
```typescript
loadProducts()           // Cargar listado de productos
openProductModal()       // Abrir modal (crear o editar)
closeProductModal()      // Cerrar y resetear modal
resetProductForm()       // Limpiar formulario
handleImageUpload()      // Manejar selección de imagen
saveProduct()            // Guardar (crear o actualizar)
confirmDeleteProduct()   // Confirmar eliminación
deleteProductById()      // Eliminar producto
```

#### 2. `/front/composables/useSupabase.ts`
**Funciones añadidas:**

```typescript
// Crear producto
createProduct(productData): Promise<boolean>

// Actualizar producto  
updateProduct(productId, productData): Promise<boolean>

// Eliminar producto (soft delete)
deleteProduct(productId): Promise<boolean>

// Subir imagen a Storage
uploadProductImage(file): Promise<string | null>
```

**Lógica de subida de imágenes:**
```typescript
// Genera nombre único: timestamp + random
const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
const filePath = `productos/${fileName}`

// Sube al bucket 'products'
await supabase.storage.from('products').upload(filePath, file)

// Retorna el path para guardar en DB
return filePath
```

#### 3. `/front/types/index.ts`
**Actualización del tipo Product:**
```typescript
export interface Product {
  id: string
  name: string
  price: number
  description?: string
  image?: string          // URL pública (generada desde image_path)
  image_path?: string     // ⭐ NUEVO: Path en Storage
  options: ProductOptions
  category?: string
}
```

---

## 📊 Estructura de Datos en Supabase

### Tabla `products`

Los productos se almacenan con esta estructura:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_path TEXT,        -- Path del archivo en Storage
  category TEXT,
  options JSONB,          -- Configuración flexible
  active BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Ejemplo de JSONB `options`:

```json
{
  "hasTalla": true,
  "hasGenero": true,
  "hasNumero": true,
  "hasNombre": true,
  "tallas": ["XS", "S", "M", "L", "XL"],
  "generos": ["Chico", "Chica"]
}
```

### Storage Bucket `products`

```
products/
└── productos/
    ├── 1697389200000-abc123.jpg
    ├── 1697389201000-def456.jpg
    └── 1697389202000-ghi789.png
```

**Configuración del bucket:**
- Público: ✅ Sí (las imágenes deben ser accesibles)
- Max file size: 5 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

---

## 🎨 Características UX

### 1. **Interfaz No Técnica**
❌ **NO hace esto:**
```json
{
  "hasTalla": true,
  "tallas": ["S", "M", "L"]
}
```

✅ **SÍ hace esto:**
- Checkbox: "¿Tiene tallas?" 
- Al activar → Muestra selector visual con todas las tallas
- El usuario marca las tallas disponibles con clicks
- El JSON se genera automáticamente en segundo plano

### 2. **Validaciones en Tiempo Real**
- ✅ Campos obligatorios marcados con *
- ✅ Precio solo acepta números
- ✅ Tamaño de imagen validado antes de subir
- ✅ Tipos de archivo validados
- ✅ Preview instantáneo de la imagen

### 3. **Feedback Visual**
- Loading spinners durante operaciones
- Mensajes de confirmación al guardar/eliminar
- Preview de imagen antes de guardar
- Estados de botones (deshabilitados durante guardado)

### 4. **Diseño Responsive**
- Grid adaptativo (3 cols → 2 cols → 1 col)
- Modal con scroll interno
- Formulario organizado en secciones
- Touch-friendly para tablets

---

## 🚀 Cómo Usar

### Crear un Nuevo Producto

1. Haz login en el panel admin (`/admin`)
2. Clic en la pestaña "🎽 Productos"
3. Clic en "➕ Nuevo Producto"
4. Rellenar formulario:
   - **Nombre**: "Camiseta de Juego Blanca"
   - **Descripción**: "Camiseta oficial para partidos"
   - **Precio**: 30.00
   - **Categoría**: Camisetas
   - **Imagen**: Seleccionar archivo
5. Configurar opciones:
   - ☑ ¿Tiene tallas? → Marcar: S, M, L, XL
   - ☑ ¿Tiene opciones de género? → Marcar: Chico, Chica
   - ☑ ¿Permite número de dorsal?
   - ☑ ¿Permite nombre personalizado?
6. Clic en "Crear Producto"

### Editar un Producto

1. En la lista de productos, clic en "✏️ Editar"
2. Modificar los campos necesarios
3. (Opcional) Cambiar la imagen
4. Clic en "Guardar Cambios"

### Eliminar un Producto

1. Clic en "🗑️ Eliminar"
2. Confirmar en el diálogo
3. El producto se oculta del catálogo (soft delete)

---

## 🔒 Seguridad

### Row Level Security (RLS)

**Productos:**
```sql
-- Cualquiera puede ver productos activos
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (active = true);

-- Solo admins autenticados pueden crear/editar/eliminar
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');
```

**Storage:**
```sql
-- Lectura pública de imágenes
CREATE POLICY "Public Access to Products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Solo admins pueden subir/eliminar
CREATE POLICY "Admins can upload products"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' AND
  auth.role() = 'authenticated'
);
```

---

## 📝 Notas para el Usuario No Técnico

### ¿Qué significa cada opción?

**Categoría:**
- Ayuda a organizar los productos
- Los clientes pueden filtrar por categoría

**Tallas:**
- Marca las tallas que tienes disponibles
- El cliente elegirá una al comprar

**Géneros:**
- Útil si el corte de la prenda es diferente para chico/chica
- El cliente elegirá al comprar

**Número de dorsal:**
- Si el producto permite poner un número en la espalda
- El cliente escribirá el número que quiere

**Nombre personalizado:**
- Si el producto permite poner un texto (ej: apellido)
- El cliente escribirá el texto que quiere

### Consejos para Imágenes

✅ **Buenas prácticas:**
- Fondo blanco o neutro
- Producto centrado
- Buena iluminación
- Tamaño recomendado: 1000x1000 px
- Formato: JPG o PNG

❌ **Evitar:**
- Imágenes borrosas
- Fondos muy cargados
- Fotos muy oscuras
- Archivos muy pesados (>5MB)

---

## 🐛 Posibles Mejoras Futuras

1. **Drag & Drop para imágenes**
2. **Múltiples imágenes por producto**
3. **Gestión de stock en tiempo real**
4. **Duplicar producto existente**
5. **Filtros en el listado (categoría, precio)**
6. **Ordenar productos (drag & drop)**
7. **Vista previa del producto como lo verá el cliente**
8. **Importar productos desde CSV**
9. **Estadísticas (productos más vendidos)**
10. **Variantes de color con imágenes separadas**

---

## ✅ Estado Actual

**Implementado:** ✅ 100%
- CRUD completo de productos
- Subida de imágenes a Supabase Storage
- Interfaz user-friendly para opciones
- Validaciones y feedback visual
- Responsive design

**Pendiente:** ⏳
- Completar configuración de Supabase (ver `MIGRACION_SUPABASE.md`)
- Probar funcionalidad completa una vez creadas las tablas
- Ajustar estilos si es necesario

---

## 📞 Soporte

Si tienes dudas sobre cómo usar el panel:

1. Las opciones con checkbox se explican automáticamente al activarlas
2. Los campos obligatorios están marcados con *
3. Los errores muestran mensajes claros
4. Si algo falla, revisa la consola del navegador (F12)

¡Listo para gestionar productos de forma profesional! 🎉
