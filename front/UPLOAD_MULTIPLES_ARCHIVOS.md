# Upload de Archivo Único con Preview

## 📋 Descripción de la Implementación

Se ha implementado el componente de upload de comprobante de pago en la página de checkout para permitir la subida de **un único archivo** con preview visual.

## ✨ Características Principales

### 1. Subida de Archivo Único
- Permite seleccionar **solo un archivo**
- Sin atributo `multiple` en el input file
- Al seleccionar un nuevo archivo, reemplaza el anterior
- Validación de 10MB por archivo

### 2. Preview Visual
- **Imágenes**: Miniatura real del archivo (thumbnail 80x80px)
- **PDFs**: Icono de documento con etiqueta "PDF"
- Preview generado con `URL.createObjectURL()`
- Gestión automática de memoria (revocación de URLs)

### 3. Información Detallada
Para el archivo se muestra:
- **Miniatura/Preview** (80x80px, redondeada)
- **Nombre completo** del archivo (truncado si es muy largo)
- **Tamaño** en MB (2 decimales)
- **Estado**: "Listo para enviar" con check verde
- **Botón de eliminar**

### 4. Gestión del Archivo
- El componente de upload permanece visible siempre
- Al subir un nuevo archivo, reemplaza automáticamente el anterior
- Botón de eliminar para quitar el archivo y permitir seleccionar otro
- Liberación automática de memoria al reemplazar o eliminar

## 🎨 Diseño UI/UX

### Zona de Subida
```
┌─────────────────────────────────────┐
│         🔼 Icono de Upload          │
│   Haz clic para subir comprobantes  │
│  PNG, JPG o PDF (máx. 10MB c/u)    │
└─────────────────────────────────────┘
```

### Card de Preview
```
┌────────────────────────────────────────┐
│ [IMG]  archivo.jpg            [🗑️]    │
│        2.45 MB                          │
│        ✓ Listo para enviar             │
└────────────────────────────────────────┘
```

### Colores y Estados
- **Fondo**: `bg-gray-50` normal, `hover:bg-gray-100`
- **Preview de imagen**: Objeto cover completo
- **Preview PDF**: Icono gris con texto
- **Estado OK**: Verde (`text-green-600`, `text-green-700`)
- **Botón eliminar**: Rojo (`text-red-600`, `hover:bg-red-50`)

## 💻 Implementación Técnica

### Estado Reactivo

```typescript
const selectedFile = ref<File | null>(null);
const filePreview = ref<{ 
  url: string; 
  type: 'image' | 'pdf' 
} | null>(null);
```

### Función de Upload

```typescript
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validación de tamaño
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      return;
    }
    
    // Liberar URL anterior si existe
    if (filePreview.value) {
      URL.revokeObjectURL(filePreview.value.url);
    }
    
    // Guardar archivo
    selectedFile.value = file;
    
    // Crear preview
    const fileType = file.type.startsWith('image/') 
      ? 'image' 
      : 'pdf';
    const url = URL.createObjectURL(file);
    filePreview.value = { url, type: fileType };
  }
};
```

### Función de Eliminación

```typescript
const removeFile = () => {
  // Liberar URL del preview (importante!)
  if (filePreview.value) {
    URL.revokeObjectURL(filePreview.value.url);
  }
  
  selectedFile.value = null;
  filePreview.value = null;
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
```

### Limpieza de Memoria

```typescript
onUnmounted(() => {
  if (filePreview.value) {
    URL.revokeObjectURL(filePreview.value.url);
  }
});
```

## 📤 Envío al Servidor

### Datos del Pedido

```typescript
const orderData = {
  // ... otros campos
  payment_proof: selectedFile.value!,
};
```

### Log de Depuración

```typescript
console.log('📦 Enviando pedido:', {
  // ... otros campos
  proof_file: selectedFile.value?.name,
});
```

## 🔍 Validación

### Validación del Formulario
```typescript
const isFormValid = computed(() => {
  return (
    formData.value.player_name &&
    formData.value.team &&
    formData.value.parent_name &&
    formData.value.email &&
    selectedFile.value !== null  // Archivo requerido
  );
});
```

### Validaciones Individuales
- ✅ Tamaño máximo: 10MB
- ✅ Formatos: image/*, .pdf
- ✅ Un archivo requerido
- ✅ Reemplazo automático al subir nuevo archivo

## 📱 Responsive

### Mobile (< 768px)
- Cards apiladas verticalmente
- Miniatura 80x80px fija
- Nombre truncado con ellipsis
- Botón eliminar visible

### Desktop (≥ 768px)
- Same layout (optimizado para mobile-first)
- Mejor spacing
- Hover states más pronunciados

## 🎯 Mejoras Implementadas

| Característica | Implementación |
|---|---|
| Archivo único | ✅ Solo permite 1 archivo |
| Preview visual | ✅ Miniatura + info |
| Tipo de archivo visual | ✅ Icono para PDF |
| Tamaño del archivo | ✅ Visible en MB |
| Reemplazo automático | ✅ Nuevo archivo reemplaza anterior |
| Gestión de memoria | ✅ URL.revokeObjectURL |
| Validación de tamaño | ✅ 10MB máximo |

## 🚀 Mejoras Futuras Posibles

- [ ] Drag & drop de archivos
- [ ] Vista previa en modal al hacer clic
- [ ] Compresión automática de imágenes grandes
- [ ] Progress bar durante la subida
- [ ] Validación de contenido (no solo extensión)
- [ ] Preview de PDF (primera página)
- [ ] Recorte de imagen antes de subir
- [ ] Opción de rotar imagen

## 📝 Notas Importantes

### Gestión de Memoria
**CRÍTICO**: Es fundamental llamar a `URL.revokeObjectURL()` para liberar memoria:
- Al reemplazar un archivo con otro nuevo
- Al eliminar el archivo
- Al desmontar el componente

Sin esto, se crean memory leaks que pueden afectar el rendimiento.

### Compatibilidad con Backend
El backend recibe un único archivo:
- Campo `payment_proof`: El archivo subido
- Supabase Storage maneja el upload individual

### Validación de Seguridad
⚠️ Consideraciones de seguridad:
- Validar MIME type en servidor (no solo extensión)
- Escanear archivos con antivirus
- Validar que son imágenes/PDFs reales
- Limitar tamaño máximo (10MB)

## 🔧 Archivos Modificados

- `/pages/checkout.vue` - Componente principal con upload único y preview

## ✅ Testing Checklist

- [ ] Subir 1 archivo funciona
- [ ] Preview de imagen se muestra correctamente
- [ ] Preview de PDF muestra icono
- [ ] Tamaño se calcula correctamente
- [ ] Eliminación funciona
- [ ] Validación de 10MB funciona
- [ ] Reemplazar archivo funciona correctamente
- [ ] FormData se envía con el archivo
- [ ] Memory leaks están controlados
- [ ] Responsive funciona en mobile
- [ ] Accesibilidad (keyboard navigation)
- [ ] Al subir nuevo archivo, el anterior se reemplaza
- [ ] URL anterior se libera correctamente
