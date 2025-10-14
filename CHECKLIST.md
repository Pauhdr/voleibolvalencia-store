# ✅ Checklist de Verificación - Voleibol Valencia Store

## Pre-Deploy

### Configuración Inicial
- [ ] Node.js 18+ instalado
- [ ] npm/yarn/pnpm instalado
- [ ] PocketBase descargado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado

### PocketBase
- [ ] PocketBase iniciado (`./pocketbase serve`)
- [ ] Acceso al panel admin en http://127.0.0.1:8090/_/
- [ ] Cuenta de administrador creada
- [ ] Colección `products` creada con campos correctos
- [ ] Colección `orders` creada con campos correctos
- [ ] Reglas de API configuradas correctamente
- [ ] Al menos un producto de prueba añadido
- [ ] Usuario admin adicional creado (opcional)

### Frontend
- [ ] Servidor de desarrollo iniciado (`npm run dev`)
- [ ] Aplicación cargando en http://localhost:3000
- [ ] Sin errores en la consola del navegador
- [ ] Sin errores en la terminal
- [ ] Tailwind CSS aplicando estilos correctamente

## Pruebas de Funcionalidad

### Catálogo de Productos
- [ ] Productos cargando desde PocketBase (o productos de ejemplo)
- [ ] Imágenes de productos visibles (si existen)
- [ ] Precios mostrándose correctamente
- [ ] Aviso de tallas visible y destacado
- [ ] Botón "Ver Guía de Tallas" funciona

### Guía de Tallas
- [ ] Modal se abre correctamente
- [ ] Tablas de tallas chico y chica visibles
- [ ] Datos de tallas correctos
- [ ] Botón cerrar funciona
- [ ] Click fuera del modal lo cierra

### Configuración de Productos
- [ ] Selectores de talla aparecen cuando corresponde
- [ ] Botones de género aparecen cuando corresponde
- [ ] Campos de número y nombre aparecen cuando corresponde
- [ ] Validación de campos requeridos funciona
- [ ] Selector de cantidad funciona (+/-)
- [ ] Botón "Añadir al carrito" funcional

### Carrito de Compra
- [ ] Badge del carrito muestra cantidad correcta
- [ ] Productos añadidos aparecen en el carrito
- [ ] Opciones seleccionadas visibles en cada item
- [ ] Botones +/- de cantidad funcionan
- [ ] Botón eliminar funciona
- [ ] Subtotal calcula correctamente
- [ ] Total calcula correctamente
- [ ] Botón "Vaciar carrito" funciona
- [ ] Carrito persiste al recargar página

### Checkout
- [ ] Redirige a carrito si está vacío
- [ ] Formulario de datos visible
- [ ] Validación de email funciona
- [ ] Select de equipos muestra opciones
- [ ] Resumen de pedido correcto
- [ ] Datos bancarios visibles
- [ ] Concepto de transferencia se actualiza dinámicamente
- [ ] Subida de archivo funciona
- [ ] Validación de tipo de archivo (imagen/PDF)
- [ ] Validación de tamaño de archivo (10MB)
- [ ] Botón enviar deshabilitado si falta información
- [ ] Loading state mientras se envía

### Confirmación
- [ ] Página de éxito se muestra correctamente
- [ ] Mensaje de confirmación claro
- [ ] Próximos pasos visibles
- [ ] Datos bancarios de recordatorio visibles
- [ ] Botón "Volver a la Tienda" funciona
- [ ] Botón "Imprimir" funciona

### Panel de Administración
- [ ] Página de login visible en `/admin`
- [ ] Login con credenciales incorrectas muestra error
- [ ] Login con credenciales correctas da acceso
- [ ] Dashboard con estadísticas visible
- [ ] Contadores de pedidos correctos
- [ ] Lista de pedidos carga correctamente
- [ ] Filtro por estado funciona
- [ ] Estados de pedidos con colores correctos
- [ ] Botón "Actualizar" funciona
- [ ] Select de cambio de estado funciona
- [ ] Botón "Ver Comprobante" funciona
- [ ] Comprobante se abre en nueva pestaña
- [ ] Logout funciona correctamente

## Diseño Responsive

### Mobile (< 768px)
- [ ] Header se adapta correctamente
- [ ] Productos en una columna
- [ ] Carrito legible y usable
- [ ] Formulario de checkout usable
- [ ] Panel admin usable
- [ ] Modal de tallas se adapta

### Tablet (768px - 1024px)
- [ ] Productos en 2 columnas
- [ ] Layout general correcto
- [ ] Menú de navegación adecuado

### Desktop (> 1024px)
- [ ] Productos en 3 columnas
- [ ] Carrito con layout de 2 columnas
- [ ] Todo el contenido bien distribuido

## Compatibilidad de Navegadores

- [ ] Chrome/Edge - Funciona correctamente
- [ ] Firefox - Funciona correctamente
- [ ] Safari - Funciona correctamente
- [ ] Safari iOS - Funciona correctamente
- [ ] Chrome Android - Funciona correctamente

## Performance

- [ ] Página inicial carga en < 3 segundos
- [ ] Navegación entre páginas es fluida
- [ ] Sin lag al añadir productos al carrito
- [ ] Imágenes optimizadas (si existen)
- [ ] Sin memory leaks evidentes

## Seguridad

- [ ] Variables sensibles en `.env` (no en código)
- [ ] `.env` en `.gitignore`
- [ ] Validación de formularios funciona
- [ ] Archivos subidos se validan
- [ ] Panel admin requiere autenticación
- [ ] No hay credenciales hardcodeadas

## Datos de Prueba

### Producto de Prueba Añadido
- [ ] Nombre válido
- [ ] Precio válido
- [ ] Opciones JSON correcto
- [ ] Producto visible en frontend

### Pedido de Prueba Creado
- [ ] Formulario completado
- [ ] Comprobante subido
- [ ] Pedido aparece en admin
- [ ] Estado inicial "pendiente"
- [ ] Total calculado correctamente

### Estado de Pedido Cambiado
- [ ] De "pendiente" a "revisado"
- [ ] De "revisado" a "entregado"
- [ ] Cambio se refleja en estadísticas

## Documentación

- [ ] README.md completo y actualizado
- [ ] QUICKSTART.md revisado
- [ ] POCKETBASE_SETUP.md claro
- [ ] RESUMEN_PROYECTO.md actualizado
- [ ] Comentarios en código importantes

## Git y Control de Versiones

- [ ] Repositorio Git inicializado
- [ ] `.gitignore` configurado
- [ ] Commit inicial realizado
- [ ] Rama principal configurada
- [ ] Remote configurado (opcional)

## Pre-Producción

### Configuración
- [ ] Variable VITE_POCKETBASE_URL apunta a producción
- [ ] PocketBase configurado en servidor de producción
- [ ] Backup de base de datos configurado
- [ ] SSL/HTTPS configurado
- [ ] Dominio configurado

### Build
- [ ] `npm run build` ejecuta sin errores
- [ ] Build optimizado generado
- [ ] Assets minificados
- [ ] Preview funciona (`npm run preview`)

### Deploy
- [ ] Servidor configurado
- [ ] Aplicación desplegada
- [ ] Variables de entorno configuradas
- [ ] Dominio apuntando correctamente
- [ ] HTTPS funcionando

## Post-Deploy

- [ ] Aplicación accesible desde dominio público
- [ ] Todas las funcionalidades funcionan en producción
- [ ] Formulario de contacto para soporte configurado
- [ ] Monitoreo de errores configurado (opcional)
- [ ] Analytics configurado (opcional)
- [ ] Backup automático funcionando

## Entrenamiento del Cliente

- [ ] Demostración del flujo de usuario
- [ ] Demostración del panel admin
- [ ] Cómo añadir productos
- [ ] Cómo gestionar pedidos
- [ ] Cómo cambiar estados
- [ ] Cómo ver comprobantes
- [ ] Cómo hacer backup manual
- [ ] Documento de FAQ entregado

## Tareas Futuras Planificadas

- [ ] Llaveros personalizados
- [ ] Notificaciones por email
- [ ] Control de stock
- [ ] Sistema de descuentos
- [ ] PWA (Aplicación instalable)
- [ ] Modo oscuro
- [ ] Múltiples idiomas

---

## Notas

**Fecha de revisión**: ___/___/___

**Revisado por**: _____________

**Estado general**: 
- [ ] ✅ Listo para producción
- [ ] ⚠️ Requiere ajustes menores
- [ ] ❌ Requiere trabajo adicional

**Observaciones**:
_______________________________________
_______________________________________
_______________________________________
_______________________________________

---

**Firma del responsable**: _____________
