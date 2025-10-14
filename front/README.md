# 🏐 Voleibol Valencia - Tienda Online

MVP de tienda online para el Club Voleibol Valencia. Permite a las familias comprar equipación oficial del club con configuración de productos, carrito de compra y envío de pedidos con comprobante de pago.

## 🚀 Características

### Para Usuarios
- ✅ Catálogo de productos con opciones personalizables (talla, género, número, nombre)
- ✅ Guía de tallas interactiva con diferenciación chico/chica
- ✅ Carrito de compra con persistencia en localStorage
- ✅ Formulario de datos del comprador y jugador
- ✅ Subida de comprobante de transferencia bancaria
- ✅ Pantalla de confirmación de pedido
- ✅ Diseño responsive con colores del club (naranja, blanco, negro)

### Para Administradores
- ✅ Panel de administración con autenticación
- ✅ Vista de todos los pedidos con filtros por estado
- ✅ Gestión de estados (pendiente, revisado, entregado)
- ✅ Visualización de comprobantes de pago
- ✅ Estadísticas de pedidos

## 🛠️ Stack Tecnológico

- **Framework**: Nuxt 3 (Vue 3 Composition API)
- **Estilos**: Tailwind CSS
- **Estado**: Pinia con persistencia en localStorage
- **Backend**: PocketBase
- **Enrutamiento**: Vue Router (integrado en Nuxt)
- **TypeScript**: Tipado completo

## 📋 Requisitos Previos

- Node.js 18+ y npm/yarn/pnpm
- PocketBase instalado y corriendo

## � Instalación

### 1. Clonar e instalar dependencias

```bash
cd front
npm install
```

### 2. Configurar PocketBase

#### Instalación de PocketBase

```bash
# Descargar PocketBase desde https://pocketbase.io/docs/
# O usar el siguiente comando (Linux/macOS):
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase_0.22.0_linux_amd64.zip
chmod +x pocketbase

# Iniciar PocketBase
./pocketbase serve
```

PocketBase estará disponible en: http://127.0.0.1:8090

#### Configurar colecciones en PocketBase

1. Abre http://127.0.0.1:8090/_/ en tu navegador
2. Crea una cuenta de administrador
3. Crea las siguientes colecciones:

**Colección: products**
- name (text) - Nombre del producto
- price (number) - Precio
- description (text, opcional) - Descripción
- image (file, opcional) - Imagen del producto
- options (json) - Opciones del producto
- category (text, opcional) - Categoría

Ejemplo de campo `options`:
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

**Colección: orders**
- buyer_name (text) - Nombre del padre/madre
- buyer_email (email) - Email del padre/madre
- player_name (text) - Nombre del jugador/a
- team (text) - Equipo
- products (json) - Array de productos del carrito
- proof (file) - Comprobante de pago
- status (select) - Estado del pedido (pendiente, revisado, entregado)
- total (number) - Total del pedido
- transfer_reference (text, opcional) - Referencia de la transferencia

**Colección: users** (para administradores)
- Ya existe por defecto en PocketBase
- Crear un usuario administrador desde el panel

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
# VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## 📁 Estructura del Proyecto

```
front/
├── assets/
│   └── css/
│       └── tailwind.css          # Estilos de Tailwind
├── components/
│   ├── ProductCard.vue           # Tarjeta de producto
│   ├── ProductOptions.vue        # Opciones configurables del producto
│   ├── CartItem.vue              # Item del carrito
│   └── SizeGuideModal.vue        # Modal con guía de tallas
├── composables/
│   └── usePocketBase.ts          # Integración con PocketBase
├── layouts/
│   └── default.vue               # Layout principal con header y footer
├── pages/
│   ├── index.vue                 # Catálogo de productos
│   ├── cart.vue                  # Carrito de compra
│   ├── checkout.vue              # Finalizar pedido
│   ├── success.vue               # Confirmación del pedido
│   └── admin.vue                 # Panel de administración
├── stores/
│   └── cart.ts                   # Store de Pinia para el carrito
├── types/
│   └── index.ts                  # Tipos TypeScript
├── nuxt.config.ts                # Configuración de Nuxt
├── tailwind.config.js            # Configuración de Tailwind
└── package.json                  # Dependencias
```

## 🎨 Productos Incluidos

1. **Sudadera Club 40 Aniversario** - 35€
   - Opciones: Talla, Género
   
2. **Pantalón de Chándal Club** - 25€
   - Opciones: Talla
   
3. **Camiseta de Juego Blanca** - 30€
   - Opciones: Talla, Género, Número (opcional), Nombre (opcional)
   
4. **Camiseta de Juego Negra** - 30€
   - Opciones: Talla, Género, Número (opcional), Nombre (opcional)
   
5. **Camiseta de Calentamiento** - 22€
   - Opciones: Talla, Género
   
6. **Mochila Club** - 20€
   - Sin opciones

## 🔐 Panel de Administración

Accede al panel de administración en: http://localhost:3000/admin

Credenciales: Las que creaste en PocketBase

### Funcionalidades del Admin:
- Ver lista de todos los pedidos
- Filtrar por estado (pendiente, revisado, entregado)
- Cambiar el estado de los pedidos
- Ver detalles completos de cada pedido
- Descargar comprobantes de pago
- Estadísticas de pedidos

## � Flujo de Usuario

1. **Ver productos**: El usuario navega por el catálogo
2. **Consultar guía de tallas**: Puede ver las tallas diferenciadas por género
3. **Añadir al carrito**: Configura las opciones y añade productos
4. **Revisar carrito**: Ve el resumen y puede editar cantidades
5. **Finalizar pedido**: Completa datos personales
6. **Realizar transferencia**: Ve los datos bancarios
7. **Subir comprobante**: Sube el comprobante de pago
8. **Confirmación**: Recibe confirmación del pedido

## 🎯 Próximas Funcionalidades

- [ ] Sistema de llaveros personalizados con nombre, color y número
- [ ] Notificaciones por email automáticas
- [ ] Sistema de descuentos y cupones
- [ ] Control de stock
- [ ] Múltiples métodos de pago
- [ ] Historial de pedidos para usuarios
- [ ] Sistema de entregas por fechas

## 🚀 Despliegue

### Build para producción

```bash
npm run build
```

### Preview del build

```bash
npm run preview
```

### Generar sitio estático

```bash
npm run generate
```

## 🤝 Contribuir

Este es un MVP privado para el Club Voleibol Valencia. Para cualquier sugerencia o mejora, contacta con el equipo de desarrollo.

## 📄 Licencia

© 2025 Club Voleibol Valencia. Todos los derechos reservados.

## 📞 Contacto

- **Email**: tienda@voleibolvalencia.com
- **Web**: www.voleibolvalencia.com

---

Desarrollado con ❤️ para el Club Voleibol Valencia 🏐
