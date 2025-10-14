# 🔌 Guía de Integración con PocketBase

## ✅ Estado Actual

- ✅ PocketBase está instalado y corriendo
- ✅ Puerto: `http://127.0.0.1:8090`
- ✅ Admin UI: `http://127.0.0.1:8090/_/`
- ✅ Frontend configurado con la URL correcta en `.env`

---

## 📋 Paso 1: Acceder al Admin UI

1. Abre tu navegador y ve a: **http://127.0.0.1:8090/_/**
2. Si es la primera vez, te pedirá crear una cuenta de administrador
3. Completa el formulario:
   - **Email**: tu email de administrador
   - **Password**: una contraseña segura
   - Haz clic en **"Create and login"**

---

## 📦 Paso 2: Crear Colección de Productos

### 2.1 Crear la colección

1. En el Admin UI, haz clic en **"New collection"**
2. Selecciona **"Base collection"**
3. Configura:
   - **Name**: `products`
   - **API rules**: 
     - List/Search: Público (deja el campo vacío o pon `@request.auth.id != ""`)
     - View: Público
     - Create/Update/Delete: Solo admin

### 2.2 Agregar campos (Schema)

Haz clic en **"New field"** y crea estos campos:

| Campo | Tipo | Requerido | Opciones |
|-------|------|-----------|----------|
| `name` | Text | ✅ Sí | Min: 1, Max: 200 |
| `description` | Text | ❌ No | - |
| `price` | Number | ✅ Sí | Min: 0 |
| `image` | File | ❌ No | Max files: 1, Max size: 5MB, Types: image/jpeg, image/png, image/webp |
| `options` | JSON | ❌ No | - |
| `stock` | Number | ❌ No | Min: 0 |
| `active` | Bool | ❌ No | Default: true |

**⚠️ Importante sobre el campo `image`:**
- Este campo guarda el **nombre del archivo**, no la URL completa
- El frontend usa `pb.files.getUrl(record, record.image)` para construir la URL
- Las imágenes deben ser cuadradas (1:1) para mejor visualización
- Formatos aceptados: JPG, PNG, WEBP

### 2.3 Configurar API Rules

En la pestaña **"API Rules"**:
- **listRule**: Deja vacío (público)
- **viewRule**: Deja vacío (público)
- **createRule**: `@request.auth.id != ""` (solo admin)
- **updateRule**: `@request.auth.id != ""` (solo admin)
- **deleteRule**: `@request.auth.id != ""` (solo admin)

**Guarda** la colección.

---

## 📋 Paso 3: Crear Colección de Pedidos (Orders)

### 3.1 Crear la colección

1. Haz clic en **"New collection"**
2. Selecciona **"Base collection"**
3. Configura:
   - **Name**: `orders`

### 3.2 Agregar campos (Schema)

| Campo | Tipo | Requerido | Opciones |
|-------|------|-----------|----------|
| `player_name` | Text | ✅ Sí | Min: 1, Max: 200 |
| `team` | Text | ✅ Sí | Min: 1, Max: 100 |
| `parent_name` | Text | ✅ Sí | Min: 1, Max: 200 |
| `email` | Email | ✅ Sí | - |
| `transfer_reference` | Text | ❌ No | Max: 100 |
| `items` | JSON | ✅ Sí | - |
| `total` | Number | ✅ Sí | Min: 0 |
| `payment_proof` | File | ✅ Sí | Max files: 1, Max size: 5MB |
| `status` | Select | ✅ Sí | Values: `en_revision`, `revisado`, `pedido_realizado`, `preparado`, `recogido`, `cancelado` |

### 3.3 Configurar API Rules

- **listRule**: `@request.auth.id != ""` (solo admin puede ver todos)
- **viewRule**: `@request.auth.id != ""` (solo admin)
- **createRule**: Deja vacío (público - los clientes pueden crear pedidos)
- **updateRule**: `@request.auth.id != ""` (solo admin)
- **deleteRule**: `@request.auth.id != ""` (solo admin)

**Guarda** la colección.

### 3.4 Estados del Pedido

Los estados del pedido siguen este flujo:

| Estado | Valor | Descripción |
|--------|-------|-------------|
| 🔍 **En Revisión** | `en_revision` | Estado inicial cuando se crea el pedido. El admin debe revisar el comprobante de pago. |
| ✅ **Revisado** | `revisado` | El pago ha sido verificado y aprobado. |
| 📦 **Pedido Realizado** | `pedido_realizado` | El pedido ha sido confirmado al proveedor. |
| 🎽 **Preparado para Recoger** | `preparado` | Los productos están listos para ser recogidos en el club. |
| ✔️ **Recogido** | `recogido` | El cliente ha recogido su pedido. Estado final. |
| ❌ **Cancelado** | `cancelado` | El pedido ha sido cancelado (pago rechazado, sin stock, etc.). |

**Flujo típico**: `en_revision` → `revisado` → `pedido_realizado` → `preparado` → `recogido`

---

## 🎽 Paso 4: Agregar Productos de Ejemplo

### Método 1: Desde el Admin UI (Recomendado)

1. Ve a la colección **products**
2. Haz clic en **"New record"**
3. Completa los campos:

#### Producto 1: Sudadera Club 40 Aniversario
```json
{
  "name": "Sudadera Club 40 Aniversario",
  "description": "Sudadera conmemorativa del 40 aniversario del club",
  "price": 35.00,
  "active": true,
  "stock": 100,
  "options": {
    "hasTalla": true,
    "hasGenero": true,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
    "generos": ["Chico", "Chica"]
  }
}
```

#### Producto 2: Pantalón de Chándal Club
```json
{
  "name": "Pantalón de Chándal Club",
  "description": "Pantalón oficial del club para entrenamientos",
  "price": 25.00,
  "active": true,
  "stock": 100,
  "options": {
    "hasTalla": true,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"]
  }
}
```

#### Producto 3: Camiseta de Juego Blanca
```json
{
  "name": "Camiseta de Juego Blanca",
  "description": "Camiseta oficial de juego color blanco",
  "price": 30.00,
  "active": true,
  "stock": 100,
  "options": {
    "hasTalla": true,
    "hasGenero": true,
    "hasNumero": true,
    "hasNombre": true,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
    "generos": ["Chico", "Chica"]
  }
}
```

#### Producto 4: Camiseta de Juego Negra
```json
{
  "name": "Camiseta de Juego Negra",
  "description": "Camiseta oficial de juego color negro",
  "price": 30.00,
  "active": true,
  "stock": 100,
  "options": {
    "hasTalla": true,
    "hasGenero": true,
    "hasNumero": true,
    "hasNombre": true,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
    "generos": ["Chico", "Chica"]
  }
}
```

#### Producto 5: Camiseta de Calentamiento
```json
{
  "name": "Camiseta de Calentamiento",
  "description": "Camiseta de calentamiento oficial del club",
  "price": 22.00,
  "active": true,
  "stock": 100,
  "options": {
    "hasTalla": true,
    "hasGenero": true,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
    "generos": ["Chico", "Chica"]
  }
}
```

#### Producto 6: Mochila Club
```json
{
  "name": "Mochila Club",
  "description": "Mochila oficial del Club Voleibol Valencia",
  "price": 20.00,
  "active": true,
  "stock": 50,
  "options": {}
}
```

---

## 🖼️ Paso 5: Agregar Imágenes (Recomendado)

### 5.1 Importancia de las Imágenes

Las imágenes son **fundamentales** para una tienda online. Sin imágenes:
- Los productos muestran un icono placeholder 📷
- Los clientes no pueden ver el producto antes de comprarlo
- La experiencia de usuario es pobre

### 5.2 Cómo Agregar Imágenes

1. Edita cada producto en PocketBase Admin UI
2. En el campo **image**, arrastra una imagen o haz clic para seleccionar
3. Guarda el producto

### 5.3 Recomendaciones para las Imágenes

**Formato y Tamaño:**
- ✅ Formato: JPG, PNG o WEBP
- ✅ Aspecto: **Cuadrado (1:1)** - ejemplo: 800x800 px
- ✅ Peso: Menor a 5MB (recomendado < 500KB)
- ✅ Calidad: Buena resolución pero optimizada

**Contenido:**
- Fondo blanco o neutro preferiblemente
- Producto centrado y bien iluminado
- Sin marcas de agua (excepto logo del club si es necesario)

### 5.4 Cómo Funcionan las Imágenes

**Backend (PocketBase):**
- Guarda el archivo físicamente en el servidor
- Almacena solo el **nombre del archivo** en la base de datos
- Ejemplo: `sudadera-club.jpg`

**Frontend (Nuxt):**
- El composable `usePocketBase` construye la URL completa automáticamente
- Usa `pb.files.getUrl(record, record.image)`
- Resultado: `http://127.0.0.1:8090/api/files/products/abc123/sudadera-club.jpg`

### 5.5 Verificar que las Imágenes Funcionan

1. Abre http://localhost:3000
2. Deberías ver las imágenes de los productos
3. Si ves el icono placeholder (📷), significa que el producto no tiene imagen
4. Abre la consola del navegador (F12) y busca:
   ```
   ✅ Productos cargados desde PocketBase: X
   ```

**📘 Para más detalles, consulta:** `/GUIA_IMAGENES_PRODUCTOS.md`

---

## ✅ Paso 6: Verificar la Integración

### 6.1 Verificar productos en el frontend

1. Abre **http://localhost:3000**
2. Deberías ver los productos cargados desde PocketBase
3. Si no aparecen, revisa:
   - Que PocketBase esté corriendo
   - Que los productos tengan `active: true`
   - La consola del navegador para errores

### 6.2 Probar el flujo completo

1. Haz clic en un producto
2. Configura las opciones
3. Añade al carrito
4. Ve al carrito
5. Completa el checkout
6. Sube un comprobante de pago

### 6.3 Ver pedidos en Admin UI

1. Ve a **http://127.0.0.1:8090/_/**
2. Abre la colección **orders**
3. Deberías ver el pedido creado

---

## 🔧 Solución de Problemas

### El frontend no carga los productos

**Solución**:
1. Verifica que PocketBase esté corriendo: `ps aux | grep pocketbase`
2. Revisa el archivo `.env` tenga la URL correcta
3. Abre la consola del navegador y busca errores
4. Verifica que los productos tengan `active: true`

### Error de CORS

**Solución**:
PocketBase permite CORS por defecto en desarrollo. Si tienes problemas, agrega en el Admin UI:
- Settings → Application → Allowed origins: `http://localhost:3000`

### No puedo crear pedidos

**Solución**:
1. Verifica que la regla `createRule` de `orders` esté vacía (público)
2. Revisa que todos los campos requeridos se estén enviando

---

## 🚀 Comandos Útiles

### Iniciar PocketBase
```bash
cd /Users/pauu/Documents/code/voleibolvalencia-store
./pocketbase serve --http=127.0.0.1:8090
```

### Iniciar Frontend
```bash
cd /Users/pauu/Documents/code/voleibolvalencia-store/front
npm run dev
```

### Ver ambos servicios corriendo
```bash
# PocketBase
lsof -ti:8090

# Frontend (Nuxt)
lsof -ti:3000
```

---

## 📚 Recursos

- **PocketBase Admin UI**: http://127.0.0.1:8090/_/
- **PocketBase API**: http://127.0.0.1:8090/api/
- **Frontend**: http://localhost:3000
- **Documentación PocketBase**: https://pocketbase.io/docs/

---

## 🎉 ¡Listo!

Tu ecommerce ahora está completamente integrado con PocketBase:
- ✅ Productos dinámicos desde la base de datos
- ✅ Pedidos almacenados de forma persistente
- ✅ Admin UI para gestionar todo
- ✅ API REST lista para usar
