# Guía de Migración a Supabase

## 🎯 Estado Actual
✅ **Frontend completamente migrado**
- Todos los archivos actualizados para usar `useSupabase` en lugar de `usePocketBase`
- Paquete `@supabase/supabase-js` instalado
- Configuración de `nuxt.config.ts` preparada

⏳ **Pendiente: Configuración de Supabase**

---

## 📋 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (si no la tienes)
2. Haz clic en "New Project"
3. Rellena los datos:
   - **Name**: `voleibolvalencia-store` (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña segura (guárdala bien)
   - **Region**: Selecciona `Europe West (Ireland)` para menor latencia desde España
   - **Pricing Plan**: Selecciona **Free** (incluye 500 MB de almacenamiento y 2 GB de transferencia)
4. Espera 2-3 minutos mientras se crea el proyecto

### 2. Obtener Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** (⚙️ en el menú lateral)
2. Selecciona **API**
3. Busca estas dos credenciales:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon public key**: Una cadena larga que empieza con `eyJhbGc...`

### 3. Crear Archivo de Variables de Entorno

Crea un archivo `/front/.env` con las credenciales:

```bash
NUXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=tu-anon-key-aqui
```

**⚠️ IMPORTANTE**: Añade `.env` a tu `.gitignore` para no subir las credenciales a Git.

### 4. Crear Tabla de Productos

1. En Supabase, ve a **SQL Editor** (menú lateral)
2. Haz clic en **New Query**
3. Pega este código SQL:

```sql
-- Crear tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT, -- URL o path de la imagen
  category TEXT,
  sizes JSONB, -- Array de tallas disponibles
  colors JSONB, -- Array de colores disponibles
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer productos (sin autenticación)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Política: Solo admins autenticados pueden insertar/actualizar/eliminar
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');
```

4. Haz clic en **Run** (▶️)

### 5. Crear Tabla de Pedidos (Orders)

En el mismo SQL Editor, crea una **nueva query** y pega:

```sql
-- Crear tipo ENUM para estados de pedido
CREATE TYPE order_status AS ENUM (
  'en_revision',
  'revisado',
  'pedido_realizado',
  'preparado',
  'recogido',
  'cancelado'
);

-- Crear tabla de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  team TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  transfer_reference TEXT,
  items JSONB NOT NULL, -- Array de productos con configuración
  payment_proof_path TEXT, -- Path del archivo en Storage
  status order_status DEFAULT 'en_revision',
  total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Los pedidos solo son visibles para admins autenticados
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Cualquiera puede crear un pedido (checkout público)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Política: Solo admins pueden actualizar pedidos (cambiar status)
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');
```

Haz clic en **Run**.

### 6. Crear Buckets de Storage

Ve a **Storage** en el menú lateral de Supabase.

#### Bucket para Imágenes de Productos

1. Haz clic en **New Bucket**
2. Configura:
   - **Name**: `products`
   - **Public bucket**: ✅ **Activado** (las imágenes deben ser públicas)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`
   - **Max file size**: `5 MB`
3. Haz clic en **Create bucket**

#### Bucket para Comprobantes de Pago

1. Haz clic en **New Bucket**
2. Configura:
   - **Name**: `payment-proofs`
   - **Public bucket**: ❌ **Desactivado** (privado, solo para admins)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, application/pdf`
   - **Max file size**: `10 MB`
3. Haz clic en **Create bucket**

### 7. Configurar Políticas de Storage

#### Políticas para el bucket `products` (público)

Ve a **Storage** → **Policies** → selecciona bucket `products` → **New Policy**

```sql
-- Lectura pública de productos
CREATE POLICY "Public Access to Products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Solo admins pueden subir/eliminar imágenes
CREATE POLICY "Admins can upload products"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Admins can delete products"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' AND
  auth.role() = 'authenticated'
);
```

#### Políticas para el bucket `payment-proofs` (privado)

```sql
-- Cualquiera puede subir un comprobante (checkout público)
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

-- Solo admins pueden ver los comprobantes
CREATE POLICY "Admins can view payment proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated'
);
```

### 8. Crear Usuario Admin

Ve a **Authentication** → **Users** → **Invite user** (o **Add user**)

Configura:
- **Email**: `admin@voleibolvalencia.com` (o el email que quieras usar)
- **Password**: Elige una contraseña segura
- **Auto Confirm User**: ✅ Activado

Este usuario podrá acceder al panel de administración (`/admin`).

---

## 🚀 Probar la Aplicación

### 1. Iniciar el Servidor de Desarrollo

```bash
cd front
npm run dev
```

### 2. Checklist de Pruebas

- [ ] **Página principal** (`http://localhost:3000`): Se cargan los productos desde Supabase
- [ ] **Detalle de producto**: Se muestra la información correcta
- [ ] **Añadir al carrito**: Funciona correctamente
- [ ] **Checkout**: 
  - [ ] Formulario se rellena correctamente
  - [ ] Se sube el comprobante de pago a Storage
  - [ ] Se crea el pedido en la tabla `orders`
- [ ] **Admin** (`/admin`):
  - [ ] Login funciona con el usuario creado
  - [ ] Se listan los pedidos
  - [ ] Se puede cambiar el estado de un pedido
  - [ ] Se puede ver el comprobante de pago

---

## 📦 Migrar Datos desde PocketBase (Opcional)

Si tenías datos en PocketBase que quieres migrar:

### Productos

1. **Desde PocketBase**: Ve a la colección `products` y exporta como JSON
2. **Adaptar el formato**: Los productos deben tener este esquema:
   ```json
   {
     "name": "Camiseta Oficial",
     "description": "Camiseta del club",
     "price": 25.00,
     "image": "url-de-la-imagen",
     "category": "camisetas",
     "sizes": ["S", "M", "L", "XL"],
     "colors": ["naranja", "blanco"],
     "stock": 50
   }
   ```
3. **Subir imágenes**: 
   - Ve a **Storage** → `products` → **Upload files**
   - Sube las imágenes de productos
   - Copia las URLs públicas generadas
4. **Insertar en Supabase**: Ve al **SQL Editor** y usa:
   ```sql
   INSERT INTO products (name, description, price, image, category, sizes, colors, stock)
   VALUES 
     ('Camiseta Oficial', 'Camiseta del club', 25.00, 'https://...', 'camisetas', '["S","M","L"]'::jsonb, '["naranja"]'::jsonb, 50),
     -- más productos...
   ```

### Pedidos

Similar al proceso anterior, pero adaptando al esquema de `orders`.

---

## 🔧 Resolución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno en `.env` estén correctamente copiadas
- Reinicia el servidor de desarrollo (`Ctrl+C` y `npm run dev`)

### Error: "Row Level Security policy violation"
- Verifica que las políticas de RLS estén creadas correctamente
- Para tablas: Ejecuta las queries SQL de políticas proporcionadas
- Para Storage: Ve a **Storage** → **Policies** y verifica que existan

### Las imágenes no se cargan
- Verifica que el bucket `products` sea **público**
- Verifica que la política de lectura esté habilitada
- Comprueba que las URLs de imagen en la BD sean correctas

### El admin no puede hacer login
- Verifica que el usuario exista en **Authentication** → **Users**
- Verifica que el email y contraseña sean correctos
- Comprueba que el usuario esté **confirmado** (columna `email_confirmed_at` debe tener valor)

---

## 💰 Costos y Límites del Plan Free

**Supabase Free Tier incluye**:
- ✅ 500 MB de almacenamiento en base de datos
- ✅ 1 GB de almacenamiento en Storage
- ✅ 2 GB de transferencia de datos/mes
- ✅ 50,000 usuarios activos/mes
- ✅ Backups automáticos (7 días)

**Para un ecommerce pequeño/mediano**, esto es más que suficiente durante varios meses.

**Si necesitas más**, el plan Pro cuesta **$25/mes** e incluye:
- 8 GB de base de datos
- 100 GB de Storage
- 250 GB de transferencia/mes

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Nuxt + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nuxtjs)

---

## ✅ Resumen

1. ✅ Código frontend migrado
2. ⏳ Crear proyecto en Supabase
3. ⏳ Copiar credenciales a `.env`
4. ⏳ Ejecutar SQL para crear tablas
5. ⏳ Crear buckets de Storage
6. ⏳ Configurar políticas de seguridad
7. ⏳ Crear usuario admin
8. ⏳ Probar la aplicación

**Tiempo estimado**: 15-20 minutos

Una vez completados estos pasos, tu aplicación estará 100% funcional con Supabase. 🎉
