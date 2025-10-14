# 🚀 Inicio Rápido - Voleibol Valencia Store

## Para empezar ahora mismo:

### 1. Terminal 1 - Iniciar PocketBase (Backend)

```bash
# Descargar e iniciar PocketBase
cd /Users/pauu/Documents/code/voleibolvalencia-store

# Si aún no has descargado PocketBase:
# macOS (Apple Silicon):
curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_arm64.zip -o pocketbase.zip
unzip pocketbase.zip
rm pocketbase.zip
chmod +x pocketbase

# Iniciar PocketBase
./pocketbase serve
```

**Luego:**
1. Abre http://127.0.0.1:8090/_/
2. Crea tu cuenta de administrador
3. Configura las colecciones según `POCKETBASE_SETUP.md`

### 2. Terminal 2 - Iniciar Frontend

```bash
cd /Users/pauu/Documents/code/voleibolvalencia-store/front
npm run dev
```

**Luego:**
- Abre http://localhost:3000

## 📋 Checklist de Configuración

- [ ] PocketBase descargado e iniciado
- [ ] Cuenta de administrador creada en PocketBase
- [ ] Colección `products` creada con los campos correctos
- [ ] Colección `orders` creada con los campos correctos
- [ ] Productos de ejemplo añadidos
- [ ] Frontend iniciado en http://localhost:3000
- [ ] Probado añadir productos al carrito
- [ ] Probado crear un pedido de prueba
- [ ] Accedido al panel de admin en http://localhost:3000/admin

## 🎯 Productos de Ejemplo para PocketBase

Una vez creadas las colecciones, añade estos productos desde el panel de PocketBase:

### Producto 1: Sudadera Club 40 Aniversario
- **name**: Sudadera Club 40 Aniversario
- **price**: 35
- **description**: Sudadera conmemorativa del 40 aniversario del club
- **options**:
```json
{
  "hasTalla": true,
  "hasGenero": true,
  "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
  "generos": ["Chico", "Chica"]
}
```

### Producto 2: Pantalón de Chándal Club
- **name**: Pantalón de Chándal Club
- **price**: 25
- **description**: Pantalón oficial del club para entrenamientos
- **options**:
```json
{
  "hasTalla": true,
  "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"]
}
```

### Producto 3: Camiseta de Juego Blanca
- **name**: Camiseta de Juego Blanca
- **price**: 30
- **description**: Camiseta oficial de juego color blanco
- **options**:
```json
{
  "hasTalla": true,
  "hasGenero": true,
  "hasNumero": true,
  "hasNombre": true,
  "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
  "generos": ["Chico", "Chica"]
}
```

### Producto 4: Camiseta de Juego Negra
- **name**: Camiseta de Juego Negra
- **price**: 30
- **description**: Camiseta oficial de juego color negro
- **options**:
```json
{
  "hasTalla": true,
  "hasGenero": true,
  "hasNumero": true,
  "hasNombre": true,
  "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
  "generos": ["Chico", "Chica"]
}
```

### Producto 5: Camiseta de Calentamiento
- **name**: Camiseta de Calentamiento
- **price**: 22
- **description**: Camiseta de calentamiento oficial del club
- **options**:
```json
{
  "hasTalla": true,
  "hasGenero": true,
  "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
  "generos": ["Chico", "Chica"]
}
```

### Producto 6: Mochila Club
- **name**: Mochila Club
- **price**: 20
- **description**: Mochila oficial del Club Voleibol Valencia
- **options**:
```json
{}
```

## 🔑 Acceso al Panel de Admin

- **URL**: http://localhost:3000/admin
- **Credenciales**: Las que creaste en PocketBase

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module 'pocketbase'"
```bash
cd front
npm install
```

### Error: CORS en PocketBase
PocketBase permite CORS por defecto para localhost. Si tienes problemas, verifica que estés usando http://127.0.0.1:8090 en .env

### El carrito no persiste
- Verifica que localStorage esté habilitado en tu navegador
- Abre la consola del navegador para ver errores

### No aparecen los productos
1. Verifica que PocketBase esté corriendo
2. Verifica que hayas creado productos en PocketBase
3. Si no hay productos, el frontend mostrará productos de ejemplo automáticamente

## 📚 Más Información

- Documentación completa: `README.md`
- Setup de PocketBase: `POCKETBASE_SETUP.md`
- Estructura del proyecto: Ver carpeta `front/`

## 🎉 ¡Listo!

Tu tienda debería estar funcionando ahora. Si tienes problemas, revisa los archivos de documentación o verifica la consola del navegador para errores.

**¡Buena suerte! 🏐**
