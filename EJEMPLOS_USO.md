# 📘 Ejemplos de Uso - Voleibol Valencia Store

## Para Usuarios Finales (Familias)

### Escenario 1: Compra Simple - Mochila

**Paso a paso:**

1. **Accede a la tienda**
   - Abre http://localhost:3000

2. **Busca el producto**
   - Encuentra "Mochila Club" en el catálogo

3. **Añade al carrito**
   - Click en "Añadir al carrito" (no requiere opciones)

4. **Ve al carrito**
   - Click en el icono del carrito en el header

5. **Finaliza el pedido**
   - Click en "Finalizar Pedido"
   - Completa el formulario:
     ```
     Nombre del Jugador: María García
     Equipo: Infantil Femenino
     Nombre del Padre/Madre: Juan García
     Email: juan.garcia@email.com
     ```

6. **Realiza la transferencia**
   - Usa los datos bancarios mostrados
   - Concepto: "María García - Infantil Femenino"

7. **Sube el comprobante**
   - Selecciona la imagen o PDF del comprobante

8. **Envía el pedido**
   - Click en "Enviar Pedido"
   - Verás la pantalla de confirmación

---

### Escenario 2: Compra con Personalización - Camiseta de Juego

**Paso a paso:**

1. **Accede al catálogo**
   - Navega a http://localhost:3000

2. **Consulta la guía de tallas**
   - Click en "Ver Guía de Tallas"
   - Verifica la talla para chica/chico
   - Cierra el modal

3. **Configura el producto "Camiseta de Juego Blanca"**
   - Selecciona talla: M
   - Selecciona género: Chica
   - Introduce número: 10
   - Introduce nombre: GARCÍA
   - Cantidad: 1

4. **Añade al carrito**
   - Click en "Añadir al carrito"

5. **Continúa comprando** (opcional)
   - Añade más productos si deseas

6. **Revisa el carrito**
   - Verifica que todo esté correcto
   - Modifica cantidades si es necesario

7. **Completa el pedido**
   - Sigue los pasos del escenario 1

---

### Escenario 3: Pedido Múltiple - Equipación Completa

**Productos a comprar:**
- Sudadera Club 40 Aniversario (Talla M, Chica)
- Pantalón de Chándal (Talla M)
- Camiseta de Juego Blanca (Talla M, Chica, #10, GARCÍA)
- Mochila Club

**Paso a paso:**

1. **Añade la sudadera**
   - Talla: M
   - Género: Chica
   - Añadir al carrito

2. **Añade el pantalón**
   - Talla: M
   - Añadir al carrito

3. **Añade la camiseta**
   - Talla: M
   - Género: Chica
   - Número: 10
   - Nombre: GARCÍA
   - Añadir al carrito

4. **Añade la mochila**
   - Añadir al carrito (sin opciones)

5. **Revisa el carrito**
   - Total: 35€ + 25€ + 30€ + 20€ = 110€

6. **Finaliza el pedido**
   - Completa datos y sube comprobante

---

## Para Administradores

### Escenario 1: Gestión de Nuevo Pedido

**Situación:** Acaba de llegar un nuevo pedido

1. **Accede al panel admin**
   ```
   URL: http://localhost:3000/admin
   Email: admin@voleibolvalencia.com
   Contraseña: [tu contraseña]
   ```

2. **Verifica el nuevo pedido**
   - Aparece con estado "pendiente"
   - Estadísticas muestran +1 en pendientes

3. **Revisa los detalles**
   - Nombre del jugador
   - Equipo
   - Productos solicitados
   - Total del pedido

4. **Descarga el comprobante**
   - Click en "Ver Comprobante"
   - Se abre en nueva pestaña
   - Verifica que la transferencia sea correcta

5. **Cambia el estado a "revisado"**
   - Usa el selector de estado
   - Selecciona "Revisado"

6. **Cuando el pedido esté listo**
   - Cambia el estado a "Entregado"

---

### Escenario 2: Filtrado de Pedidos

**Situación:** Necesitas ver solo los pedidos pendientes

1. **Accede al panel admin**

2. **Usa el filtro**
   - Selecciona "Pendientes" en el filtro
   - Solo se muestran pedidos pendientes

3. **Procesa cada uno**
   - Revisa comprobantes
   - Cambia estados según corresponda

4. **Ver todos los pedidos**
   - Cambia filtro a "Todos"

---

### Escenario 3: Gestión Diaria

**Rutina diaria recomendada:**

**Mañana (10:00)**
1. Login al panel admin
2. Revisar pedidos nuevos (pendientes)
3. Descargar y verificar comprobantes
4. Cambiar a "revisado" los que sean correctos
5. Contactar a familias si hay problemas

**Tarde (16:00)**
1. Verificar pedidos listos para entregar
2. Cambiar estado a "entregado" tras la entrega
3. Actualizar estadísticas

**Fin de semana**
1. Revisar acumulados de la semana
2. Exportar datos si es necesario
3. Planificar próxima producción

---

## Para Desarrolladores

### Escenario 1: Añadir Nuevo Producto en PocketBase

1. **Accede al panel de PocketBase**
   ```
   URL: http://127.0.0.1:8090/_/
   ```

2. **Ve a Collections > products**

3. **Click en "New record"**

4. **Completa los campos**
   ```json
   name: "Llavero Personalizado"
   price: 5.00
   description: "Llavero con nombre y número"
   options: {
     "hasNombre": true,
     "hasNumero": true,
     "hasColor": true,
     "colores": ["Naranja", "Negro", "Blanco", "Azul"]
   }
   category: "Accesorios"
   ```

5. **Guarda el producto**
   - Aparecerá automáticamente en el frontend

---

### Escenario 2: Modificar Opciones de Producto Existente

**Situación:** Quieres añadir talla XXL a las camisetas

1. **Accede a PocketBase**

2. **Edita el producto "Camiseta de Juego Blanca"**

3. **Modifica el campo options**
   ```json
   {
     "hasTalla": true,
     "hasGenero": true,
     "hasNumero": true,
     "hasNombre": true,
     "tallas": ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL", "XXL"],
     "generos": ["Chico", "Chica"]
   }
   ```

4. **Guarda los cambios**
   - La talla XXL aparecerá en el frontend

---

### Escenario 3: Backup de la Base de Datos

**Backup manual:**

```bash
# Desde la carpeta raíz del proyecto
cp pb_data/data.db backups/data_$(date +%Y%m%d_%H%M%S).db
```

**Backup automático (cron):**

```bash
# Editar crontab
crontab -e

# Añadir línea para backup diario a las 2 AM
0 2 * * * cp /ruta/a/pb_data/data.db /ruta/a/backups/data_$(date +\%Y\%m\%d).db
```

---

## Casos de Uso Especiales

### Caso 1: Pedido con Múltiples Tallas del Mismo Producto

**Situación:** Un entrenador quiere comprar camisetas para todo el equipo

1. **Añade cada talla por separado**
   - Camiseta Blanca, M, Chica, #1, PÉREZ
   - Camiseta Blanca, L, Chica, #2, GARCÍA
   - Camiseta Blanca, S, Chica, #3, LÓPEZ
   - etc.

2. **Todas aparecen como items separados en el carrito**

3. **El administrador ve todos los items con sus personalizaciones**

---

### Caso 2: Corrección de Pedido

**Situación:** Usuario se equivocó en la talla

**Solución 1 - Antes de enviar:**
1. Ir al carrito
2. Eliminar el producto incorrecto
3. Añadir el producto con la talla correcta

**Solución 2 - Después de enviar:**
1. Contactar con el club
2. El administrador modifica el pedido directamente en PocketBase
3. O se crea un nuevo pedido con la corrección

---

### Caso 3: Pedido Sin Comprobante Inmediato

**Situación:** Usuario quiere hacer el pedido pero aún no ha realizado la transferencia

**Solución:**
1. Realizar transferencia primero
2. Esperar confirmación bancaria
3. Descargar comprobante
4. Realizar pedido en la web

**Alternativa (no recomendada):**
1. Subir un documento temporal indicando "Transferencia pendiente"
2. Administrador marca como "pendiente"
3. Usuario envía comprobante real por email
4. Administrador actualiza manualmente

---

## Tips y Mejores Prácticas

### Para Usuarios

✅ **Hacer:**
- Verificar la guía de tallas antes de pedir
- Usar el concepto correcto en la transferencia
- Guardar el comprobante en formato imagen o PDF
- Revisar el carrito antes de finalizar

❌ **Evitar:**
- Cerrar la ventana durante el proceso de envío
- Usar imágenes muy grandes (> 10MB)
- Olvidar subir el comprobante
- Poner datos incorrectos en el formulario

### Para Administradores

✅ **Hacer:**
- Revisar pedidos diariamente
- Verificar comprobantes cuidadosamente
- Comunicarse con las familias ante dudas
- Mantener backups regulares
- Documentar problemas comunes

❌ **Evitar:**
- Cambiar a "entregado" antes de entregar realmente
- Eliminar pedidos (mejor marcar como "cancelado" si añades ese estado)
- Perder comprobantes de pago
- No comunicar cambios de estado

### Para Desarrolladores

✅ **Hacer:**
- Probar cambios en local antes de desplegar
- Mantener PocketBase actualizado
- Documentar cambios importantes
- Hacer backups antes de cambios grandes
- Usar Git para control de versiones

❌ **Evitar:**
- Modificar directamente en producción
- Hardcodear credenciales
- Ignorar errores en la consola
- Saltarse pruebas de funcionalidad

---

## Preguntas Frecuentes (FAQ)

### Para Usuarios

**P: ¿Puedo modificar mi pedido después de enviarlo?**
R: No directamente. Contacta con el club para modificaciones.

**P: ¿Cuánto tarda en procesarse mi pedido?**
R: Normalmente 24-48 horas laborables.

**P: ¿Qué formato debe tener el comprobante?**
R: Imagen (JPG, PNG) o PDF, máximo 10MB.

**P: ¿Puedo hacer varios pedidos separados?**
R: Sí, pero es mejor hacer uno solo para facilitar la gestión.

### Para Administradores

**P: ¿Cómo añado nuevos productos?**
R: Desde el panel de PocketBase, colección "products".

**P: ¿Puedo recuperar un pedido eliminado?**
R: Sí, si tienes backup de la base de datos.

**P: ¿Cómo exporto los pedidos?**
R: Usa la API de PocketBase o descarga la base de datos SQLite.

**P: ¿Puedo tener múltiples administradores?**
R: Sí, crea más usuarios en PocketBase.

---

**¿Más dudas?**
Consulta la documentación completa en README.md o contacta al desarrollador.
