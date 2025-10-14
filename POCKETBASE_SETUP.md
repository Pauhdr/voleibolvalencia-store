# Configuración de PocketBase para Voleibol Valencia Store

## Instalación de PocketBase

### Linux/macOS
```bash
# Descargar la última versión
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip

# Descomprimir
unzip pocketbase_0.22.0_linux_amd64.zip

# Dar permisos de ejecución
chmod +x pocketbase

# Iniciar el servidor
./pocketbase serve
```

### Windows
1. Descarga el archivo ZIP desde https://github.com/pocketbase/pocketbase/releases
2. Descomprime el archivo
3. Ejecuta `pocketbase.exe serve` desde la terminal

### macOS (Apple Silicon)
```bash
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_arm64.zip
unzip pocketbase_0.22.0_darwin_arm64.zip
chmod +x pocketbase
./pocketbase serve
```

## Configuración Inicial

1. Abre tu navegador en http://127.0.0.1:8090/_/
2. Crea tu cuenta de administrador
3. Configura las colecciones siguiendo las instrucciones a continuación

## Colecciones

### 1. Colección: products

**Configuración:**
- Nombre: `products`
- Tipo: Base collection
- API rules: 
  - List: `@request.auth.id != ""`
  - View: `@request.auth.id != ""`
  - Create: Solo admin
  - Update: Solo admin
  - Delete: Solo admin

**Campos:**

| Campo | Tipo | Requerido | Opciones |
|-------|------|-----------|----------|
| name | Text | Sí | Max: 200 |
| price | Number | Sí | Min: 0 |
| description | Text | No | Max: 500 |
| image | File | No | Max files: 1, Max size: 5MB, Types: image/* |
| options | JSON | Sí | - |
| category | Text | No | Max: 100 |

**Ejemplo de datos para products:**

```json
{
  "name": "Sudadera Club 40 Aniversario",
  "price": 35.00,
  "description": "Sudadera conmemorativa del 40 aniversario del club",
  "image": null,
  "options": {
    "hasTalla": true,
    "hasGenero": true,
    "hasNumero": false,
    "hasNombre": false,
    "hasColor": false,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
    "generos": ["Chico", "Chica"]
  },
  "category": "Ropa"
}
```

```json
{
  "name": "Camiseta de Juego Blanca",
  "price": 30.00,
  "description": "Camiseta oficial de juego color blanco",
  "image": null,
  "options": {
    "hasTalla": true,
    "hasGenero": true,
    "hasNumero": true,
    "hasNombre": true,
    "hasColor": false,
    "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL"],
    "generos": ["Chico", "Chica"]
  },
  "category": "Ropa"
}
```

```json
{
  "name": "Mochila Club",
  "price": 20.00,
  "description": "Mochila oficial del Club Voleibol Valencia",
  "image": null,
  "options": {
    "hasTalla": false,
    "hasGenero": false,
    "hasNumero": false,
    "hasNombre": false,
    "hasColor": false
  },
  "category": "Accesorios"
}
```

### 2. Colección: orders

**Configuración:**
- Nombre: `orders`
- Tipo: Base collection
- API rules:
  - List: Solo admin
  - View: Solo admin
  - Create: `@request.auth.id != ""` (cualquier usuario autenticado puede crear)
  - Update: Solo admin
  - Delete: Solo admin

**Campos:**

| Campo | Tipo | Requerido | Opciones |
|-------|------|-----------|----------|
| buyer_name | Text | Sí | Max: 200 |
| buyer_email | Email | Sí | - |
| player_name | Text | Sí | Max: 200 |
| team | Text | Sí | Max: 100 |
| products | JSON | Sí | - |
| proof | File | No | Max files: 1, Max size: 10MB, Types: image/*, .pdf |
| status | Select | Sí | Options: pendiente, revisado, entregado |
| total | Number | Sí | Min: 0 |
| transfer_reference | Text | No | Max: 200 |

**Valor por defecto para status:** `pendiente`

**Ejemplo de datos para orders:**

```json
{
  "buyer_name": "Juan García",
  "buyer_email": "juan.garcia@example.com",
  "player_name": "María García",
  "team": "Infantil Femenino",
  "products": [
    {
      "product_id": "abc123",
      "name": "Camiseta de Juego Blanca",
      "quantity": 1,
      "price": 30.00,
      "options": {
        "talla": "M",
        "genero": "Chica",
        "numero": "10",
        "nombre": "GARCÍA"
      }
    }
  ],
  "proof": null,
  "status": "pendiente",
  "total": 30.00,
  "transfer_reference": "TRF123456"
}
```

### 3. Usuarios Administradores

La colección `users` ya existe por defecto en PocketBase.

Para crear un usuario administrador:
1. Ve a Settings > Admins en el panel de PocketBase
2. Crea un nuevo administrador con email y contraseña

## Reglas de API (API Rules)

### Products Collection

**List/Search rule:**
```javascript
@request.auth.id != ""
```
Permite que cualquier usuario autenticado pueda listar productos. Si quieres que sea público, usa `""` (cadena vacía).

**View rule:**
```javascript
@request.auth.id != ""
```

**Create/Update/Delete:**
Solo administradores (dejar en blanco o configurar en el panel)

### Orders Collection

**List/View rule:**
Solo administradores (dejar en blanco)

**Create rule:**
```javascript
@request.auth.id != ""
```
Permite que usuarios autenticados creen pedidos.

**Update/Delete:**
Solo administradores (dejar en blanco)

## Script SQL para crear datos de ejemplo

Puedes ejecutar este SQL desde la consola de PocketBase (pestaña "API Preview" > "Query"):

```sql
-- Insertar productos de ejemplo
INSERT INTO products (id, name, price, description, options, category, created, updated)
VALUES 
  ('prod001', 'Sudadera Club 40 Aniversario', 35.00, 'Sudadera conmemorativa del 40 aniversario del club', '{"hasTalla":true,"hasGenero":true,"tallas":["4XS","3XS","2XS","XS","S","M","L","XL"],"generos":["Chico","Chica"]}', 'Ropa', datetime('now'), datetime('now')),
  ('prod002', 'Pantalón de Chándal Club', 25.00, 'Pantalón oficial del club para entrenamientos', '{"hasTalla":true,"tallas":["4XS","3XS","2XS","XS","S","M","L","XL"]}', 'Ropa', datetime('now'), datetime('now')),
  ('prod003', 'Camiseta de Juego Blanca', 30.00, 'Camiseta oficial de juego color blanco', '{"hasTalla":true,"hasGenero":true,"hasNumero":true,"hasNombre":true,"tallas":["4XS","3XS","2XS","XS","S","M","L","XL"],"generos":["Chico","Chica"]}', 'Ropa', datetime('now'), datetime('now')),
  ('prod004', 'Camiseta de Juego Negra', 30.00, 'Camiseta oficial de juego color negro', '{"hasTalla":true,"hasGenero":true,"hasNumero":true,"hasNombre":true,"tallas":["4XS","3XS","2XS","XS","S","M","L","XL"],"generos":["Chico","Chica"]}', 'Ropa', datetime('now'), datetime('now')),
  ('prod005', 'Camiseta de Calentamiento', 22.00, 'Camiseta de calentamiento oficial del club', '{"hasTalla":true,"hasGenero":true,"tallas":["4XS","3XS","2XS","XS","S","M","L","XL"],"generos":["Chico","Chica"]}', 'Ropa', datetime('now'), datetime('now')),
  ('prod006', 'Mochila Club', 20.00, 'Mochila oficial del Club Voleibol Valencia', '{}', 'Accesorios', datetime('now'), datetime('now'));
```

## Variables de Entorno del Frontend

Crea un archivo `.env` en el directorio `front/`:

```bash
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

Para producción, cambia la URL a la de tu servidor de PocketBase.

## Despliegue de PocketBase en Producción

### Opción 1: VPS o Servidor dedicado

```bash
# Iniciar PocketBase en un puerto específico
./pocketbase serve --http="0.0.0.0:8090"

# Usar systemd para mantenerlo ejecutándose
sudo nano /etc/systemd/system/pocketbase.service
```

Contenido del archivo de servicio:

```ini
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/pocketbase
ExecStart=/var/www/pocketbase/pocketbase serve --http="0.0.0.0:8090"
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
```

### Opción 2: Docker

```dockerfile
FROM alpine:latest

RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget

WORKDIR /pb

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip \
    && unzip pocketbase_0.22.0_linux_amd64.zip \
    && rm pocketbase_0.22.0_linux_amd64.zip

EXPOSE 8090

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
```

### Opción 3: Plataformas Cloud

- **Fly.io**: Soporta PocketBase directamente
- **Railway**: Deploy con un click
- **DigitalOcean App Platform**: Compatible con Docker

## Backup de la Base de Datos

PocketBase usa SQLite, así que puedes hacer backup fácilmente:

```bash
# Backup manual
cp pb_data/data.db pb_data/data.db.backup

# Backup automático (cron)
0 2 * * * cp /path/to/pb_data/data.db /path/to/backups/data_$(date +\%Y\%m\%d).db
```

## Solución de Problemas

### Error de CORS

Si tienes problemas de CORS, configura el middleware en PocketBase:

```go
// En pb_hooks/main.go
package main

import (
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/apis"
    "github.com/pocketbase/pocketbase/core"
)

func main() {
    app := pocketbase.New()

    app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
        e.Router.Use(apis.ActivityLogger(app))
        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
```

### Error de permisos de archivo

```bash
chmod -R 755 pb_data/
chown -R www-data:www-data pb_data/
```

## Recursos Adicionales

- Documentación oficial: https://pocketbase.io/docs/
- GitHub: https://github.com/pocketbase/pocketbase
- Discord: https://discord.gg/pocketbase

---

**Nota**: Recuerda cambiar las credenciales por defecto y configurar un firewall adecuado en producción.
