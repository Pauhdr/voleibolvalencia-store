# 🖼️ Guía para Agregar Imágenes a los Productos en PocketBase

## 🎯 Problema Común

Las imágenes de los productos no se muestran correctamente porque:
1. PocketBase solo guarda el **nombre del archivo**, no la URL completa
2. Hay que usar `pb.files.getUrl()` para construir la URL correcta
3. El formato es: `http://127.0.0.1:8090/api/files/COLLECTION_NAME/RECORD_ID/FILENAME`

## ✅ Solución Implementada

El composable `usePocketBase.ts` ahora construye automáticamente las URLs correctas:

```typescript
// Antes (❌ NO funcionaba)
return records as unknown as Product[];

// Ahora (✅ SÍ funciona)
const products = records.map((record: any) => {
  const product: Product = {
    id: record.id,
    name: record.name,
    price: record.price,
    // ... otros campos
  };
  
  // Construir la URL completa de la imagen
  if (record.image) {
    product.image = pb.files.getUrl(record, record.image);
  }
  
  return product;
});
```

---

## 📝 Cómo Agregar Productos con Imágenes

### Paso 1: Preparar las Imágenes

**Recomendaciones:**
- Formato: JPG, PNG o WEBP
- Tamaño recomendado: 800x800 px (aspecto cuadrado 1:1)
- Peso máximo: 5MB (configurado en PocketBase)
- Nombres descriptivos: `sudadera-40-aniversario.jpg`, `camiseta-blanca.jpg`

### Paso 2: Agregar Producto en PocketBase

1. Abre PocketBase Admin UI: http://127.0.0.1:8090/_/
2. Ve a la colección **products**
3. Haz clic en **"New record"**
4. Completa los campos:

**Ejemplo: Sudadera del 40 Aniversario**

```
name: Sudadera Club 40 Aniversario
description: Sudadera conmemorativa del 40 aniversario del club
price: 35
active: ✅ (checked)
stock: 100
category: Ropa de entrenamiento
```

**Campo options (JSON):**
```json
{
  "hasTalla": true,
  "hasGenero": true,
  "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
  "generos": ["Chico", "Chica"]
}
```

5. **Campo image**: Haz clic en "Choose file" y selecciona la imagen
6. Haz clic en **"Create"**

### Paso 3: Verificar la Imagen

Una vez creado el producto:
1. Haz clic en el producto recién creado
2. Verás la imagen como un enlace (ej: `sudadera.jpg`)
3. Haz clic en el nombre de la imagen para previsualizarla
4. La URL completa será algo como:
   ```
   http://127.0.0.1:8090/api/files/products/RECORD_ID/sudadera.jpg
   ```

---

## 🧪 Verificar que Funciona

### En el Frontend

1. Abre http://localhost:3000
2. Deberías ver los productos con sus imágenes
3. Si ves el ícono de imagen placeholder (📷), significa que:
   - El producto no tiene imagen asignada, O
   - La URL no se está construyendo correctamente

### En la Consola del Navegador

Abre la consola (F12) y busca:
```
✅ Productos cargados desde PocketBase: 6
```

También puedes inspeccionar el HTML de una tarjeta de producto:
```html
<img src="http://127.0.0.1:8090/api/files/products/abc123/sudadera.jpg" alt="Sudadera Club">
```

---

## 🎨 Ejemplos de Productos

### Producto SIN opciones de personalización

```json
{
  "name": "Mochila Club",
  "description": "Mochila oficial del Club Voleibol Valencia",
  "price": 20.00,
  "active": true,
  "stock": 50,
  "category": "Accesorios",
  "options": {},
  "image": [SUBIR ARCHIVO]
}
```

### Producto CON talla solamente

```json
{
  "name": "Pantalón de Chándal Club",
  "description": "Pantalón oficial del club para entrenamientos",
  "price": 25.00,
  "active": true,
  "stock": 100,
  "category": "Ropa de entrenamiento",
  "options": {
    "hasTalla": true,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"]
  },
  "image": [SUBIR ARCHIVO]
}
```

### Producto CON todas las opciones

```json
{
  "name": "Camiseta de Juego Blanca",
  "description": "Camiseta oficial de juego color blanco",
  "price": 30.00,
  "active": true,
  "stock": 100,
  "category": "Equipación oficial",
  "options": {
    "hasTalla": true,
    "hasGenero": true,
    "hasNumero": true,
    "hasNombre": true,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
    "generos": ["Chico", "Chica"]
  },
  "image": [SUBIR ARCHIVO]
}
```

---

## 🔧 Solución de Problemas

### Las imágenes no se muestran

**Causa posible 1:** PocketBase no está corriendo
```bash
# Verificar si está corriendo
lsof -ti:8090

# Si no está corriendo, iniciarlo
cd /Users/pauu/Documents/code/voleibolvalencia-store
./pocketbase serve --http=127.0.0.1:8090
```

**Causa posible 2:** El campo `image` está vacío en PocketBase
- Abre PocketBase Admin UI
- Verifica que el producto tenga una imagen asignada
- Si no, edita el producto y sube una imagen

**Causa posible 3:** Error de CORS
- Verifica en la consola del navegador si hay errores de CORS
- PocketBase permite CORS por defecto en desarrollo

**Causa posible 4:** El campo `active` está en `false`
- El composable filtra productos con `filter: 'active = true'`
- Verifica que el producto esté marcado como activo

### Las imágenes se muestran rotas (icono 🖼️)

**Solución:**
1. Inspecciona el elemento en el navegador (clic derecho > Inspeccionar)
2. Busca el atributo `src` de la imagen
3. Copia la URL y ábrela en una nueva pestaña
4. Si da error 404, el archivo no existe en PocketBase
5. Si da error 403, hay un problema de permisos

---

## 📊 Estructura de URL de Imágenes

PocketBase genera URLs con este formato:

```
http://127.0.0.1:8090/api/files/{collection}/{record_id}/{filename}
```

**Ejemplo real:**
```
http://127.0.0.1:8090/api/files/products/abc123xyz/sudadera-club.jpg
```

Donde:
- `products` = nombre de la colección
- `abc123xyz` = ID del registro (producto)
- `sudadera-club.jpg` = nombre del archivo

---

## 🎯 Checklist Final

Antes de probar, verifica:

- [ ] PocketBase está corriendo en el puerto 8090
- [ ] La colección `products` existe
- [ ] Los productos tienen el campo `active = true`
- [ ] Los productos tienen imágenes asignadas
- [ ] El campo `image` en PocketBase es de tipo `File`
- [ ] Las imágenes son JPG, PNG o WEBP (< 5MB)
- [ ] El frontend está corriendo en el puerto 3000
- [ ] No hay errores en la consola del navegador

---

## 💡 Tips Adicionales

### Imágenes de Placeholder

Si no tienes imágenes aún, puedes usar servicios gratuitos:
- **Unsplash**: https://unsplash.com/s/photos/volleyball
- **Pexels**: https://www.pexels.com/search/volleyball/
- **Placeholder**: https://via.placeholder.com/800x800/ea580c/ffffff?text=Producto

### Optimizar Imágenes

Antes de subirlas a PocketBase, optimízalas:
- **TinyPNG**: https://tinypng.com/ (reduce el peso sin perder calidad)
- **Squoosh**: https://squoosh.app/ (herramienta de Google)
- Usa formato WEBP para mejor rendimiento

### Imágenes desde URLs externas

Si quieres usar una URL externa (no recomendado):
1. En lugar de subir archivo, guarda la URL en el campo `image` como texto
2. PocketBase puede aceptar URLs externas

---

## 📚 Documentación Relacionada

- `/INTEGRACION_POCKETBASE.md` - Configuración de colecciones
- `/CONFIGURACION_COLECCION_ORDERS.md` - Configuración de pedidos
- Documentación PocketBase Files: https://pocketbase.io/docs/files-handling/
