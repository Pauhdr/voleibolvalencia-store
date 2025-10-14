# 📋 Configuración de la Colección Orders en PocketBase

## ⚠️ IMPORTANTE: Estructura Correcta de Campos

Para que los pedidos se guarden correctamente, la colección `orders` debe tener exactamente estos campos:

### Campos Requeridos ✅

1. **player_name** (Text)
   - Tipo: `Text`
   - Requerido: ✅ Sí
   - Min: 1
   - Max: 200
   - Descripción: Nombre del jugador/a

2. **team** (Text)
   - Tipo: `Text`
   - Requerido: ✅ Sí
   - Min: 1
   - Max: 100
   - Descripción: Equipo al que pertenece

3. **parent_name** (Text)
   - Tipo: `Text`
   - Requerido: ✅ Sí
   - Min: 1
   - Max: 200
   - Descripción: Nombre del padre/madre o tutor

4. **email** (Email)
   - Tipo: `Email`
   - Requerido: ✅ Sí
   - Descripción: Email de contacto

5. **items** (JSON)
   - Tipo: `JSON`
   - Requerido: ✅ Sí
   - Descripción: Array de productos del pedido con sus opciones

6. **total** (Number)
   - Tipo: `Number`
   - Requerido: ✅ Sí
   - Min: 0
   - Descripción: Total del pedido en euros

7. **payment_proof** (File)
   - Tipo: `File`
   - Requerido: ✅ Sí
   - Max files: 1
   - Max size: 5MB
   - Descripción: Comprobante de pago (imagen o PDF)

8. **status** (Select)
   - Tipo: `Select`
   - Requerido: ✅ Sí
   - Max select: 1
   - Opciones (VALUES):
     - `en_revision`
     - `revisado`
     - `pedido_realizado`
     - `preparado`
     - `recogido`
     - `cancelado`

### Campos Opcionales ❌

9. **transfer_reference** (Text)
   - Tipo: `Text`
   - Requerido: ❌ No
   - Max: 100
   - Descripción: Referencia de la transferencia bancaria

---

## 🔧 Pasos para Crear/Actualizar la Colección

### Si la colección NO existe:

1. Abre PocketBase Admin UI: http://127.0.0.1:8090/_/
2. Haz clic en **"New collection"**
3. Selecciona **"Base collection"**
4. Nombre: `orders`
5. Agrega cada campo usando el botón **"New field"** según la tabla anterior
6. Configura las **API Rules**:
   - **listRule**: `@request.auth.id != ""`
   - **viewRule**: `@request.auth.id != ""`
   - **createRule**: (dejar vacío - público)
   - **updateRule**: `@request.auth.id != ""`
   - **deleteRule**: `@request.auth.id != ""`
7. Guarda la colección

### Si la colección YA existe pero tiene campos incorrectos:

1. Abre PocketBase Admin UI: http://127.0.0.1:8090/_/
2. Haz clic en la colección **orders**
3. Ve a la pestaña **"Fields"**
4. **ELIMINA** estos campos si existen:
   - `buyer_name`
   - `buyer_email`
   - `buyer_phone`
   - `buyer_address`
   - `notes`
   - `products` (solo si existe, usamos `items` en su lugar)
   - `proof` (solo si existe, usamos `payment_proof`)

5. **AGREGA** estos campos si no existen:
   - `player_name` (Text, requerido)
   - `team` (Text, requerido)
   - `parent_name` (Text, requerido)
   - `email` (Email, requerido)
   - `transfer_reference` (Text, opcional)

6. **VERIFICA** que estos campos existan y sean correctos:
   - `items` (JSON, requerido)
   - `total` (Number, requerido)
   - `payment_proof` (File, requerido)
   - `status` (Select, requerido, con los 6 valores)

7. Guarda los cambios

---

## ✅ Verificación

Una vez configurada la colección, verifica que:

1. ✅ Todos los campos requeridos están marcados como obligatorios
2. ✅ El campo `status` tiene las 6 opciones correctas
3. ✅ El campo `payment_proof` acepta archivos de hasta 5MB
4. ✅ Las API Rules permiten crear pedidos sin autenticación (createRule vacío)
5. ✅ Las API Rules requieren autenticación para ver/editar/eliminar

---

## 🧪 Probar la Configuración

Para probar que todo funciona:

1. Asegúrate de que PocketBase esté corriendo:
   ```bash
   cd /Users/pauu/Documents/code/voleibolvalencia-store
   ./pocketbase serve --http=127.0.0.1:8090
   ```

2. Asegúrate de que el frontend esté corriendo:
   ```bash
   cd /Users/pauu/Documents/code/voleibolvalencia-store/front
   npm run dev
   ```

3. Abre http://localhost:3000
4. Agrega productos al carrito
5. Ve al checkout
6. Completa el formulario:
   - Nombre del jugador
   - Equipo
   - Nombre del padre/madre
   - Email
   - (Opcional) Referencia de transferencia
   - Sube un comprobante de pago
7. Envía el pedido
8. Verifica en PocketBase Admin UI que el pedido se creó con todos los campos:
   - ✅ player_name tiene valor
   - ✅ team tiene valor
   - ✅ parent_name tiene valor
   - ✅ email tiene valor
   - ✅ items es un JSON con el array de productos
   - ✅ payment_proof tiene el archivo adjunto
   - ✅ status es "en_revision"
   - ✅ total tiene el valor correcto

---

## 🐛 Solución de Problemas

### Error: "Failed to create record"

**Causa**: Campos requeridos no están siendo enviados o la colección no existe.

**Solución**:
1. Verifica en la consola del navegador (F12) los logs que empiezan con 📦, 🛒, 📄
2. Verifica que todos los campos requeridos estén configurados en PocketBase
3. Asegúrate de que `createRule` esté vacío (público)

### Los campos aparecen vacíos en PocketBase

**Causa**: Los nombres de los campos no coinciden entre frontend y backend.

**Solución**:
1. Verifica que los nombres de los campos en PocketBase sean EXACTAMENTE:
   - `player_name` (no `playerName`, no `player-name`)
   - `team`
   - `parent_name` (no `parentName`)
   - `email`
   - `items` (no `products`)
   - `payment_proof` (no `proof`, no `paymentProof`)

### El archivo payment_proof no se guarda

**Causa**: El campo no está configurado como File o el tamaño supera el límite.

**Solución**:
1. Verifica que el campo `payment_proof` sea de tipo `File`
2. Verifica que el límite sea al menos 5MB
3. Comprueba que el archivo que subes no supere el límite

---

## 📊 Estructura de Datos de Ejemplo

Así se ve un pedido correctamente guardado en PocketBase:

```json
{
  "id": "abc123xyz",
  "player_name": "María García",
  "team": "Infantil Femenino",
  "parent_name": "Juan García López",
  "email": "juan.garcia@email.com",
  "transfer_reference": "TRF-2024-001",
  "items": [
    {
      "product_id": "prod1",
      "name": "Camiseta de Juego Blanca",
      "quantity": 1,
      "price": 30.00,
      "options": {
        "talla": "M",
        "genero": "Chica",
        "numero": "7",
        "nombre": "MARÍA"
      }
    }
  ],
  "total": 30.00,
  "payment_proof": "abc123xyz_payment_proof_xyz.jpg",
  "status": "en_revision",
  "created": "2024-10-14 10:30:00.000Z",
  "updated": "2024-10-14 10:30:00.000Z"
}
```

---

## 🎯 Resumen

**Campos que SÍ se usan:**
- ✅ player_name
- ✅ team
- ✅ parent_name
- ✅ email
- ✅ transfer_reference (opcional)
- ✅ items (JSON array)
- ✅ payment_proof (File)
- ✅ status
- ✅ total

**Campos que NO se usan (eliminar si existen):**
- ❌ buyer_name
- ❌ buyer_email
- ❌ buyer_phone
- ❌ buyer_address
- ❌ notes
- ❌ products (usar `items`)
- ❌ proof (usar `payment_proof`)
