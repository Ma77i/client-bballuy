# Team Logo Upload Flow - Supabase Storage Integration

Este documento describe la implementación completa del flujo de subida de logos de equipos usando Supabase Storage.

## 🎯 Funcionalidades Implementadas

### ✅ **Subida de Imágenes**
- **Galería**: Selección desde la galería de fotos del dispositivo
- **Cámara**: Captura de foto directamente desde la cámara
- **Validación**: Archivos máximo 5MB, solo imágenes
- **Compresión**: Redimensionado a formato cuadrado (1:1) automático

### ✅ **Storage en Supabase**
- **Bucket**: `team_logos` (privado)
- **Path**: `${user.id}/${timestamp}.{extension}`
- **Signed URLs**: Generación automática con TTL de 1 hora
- **Cleanup**: Eliminación automática de imágenes anteriores al reemplazar

### ✅ **Estado y Persistencia**
- **Preview**: URL firmada para mostrar en UI
- **Path**: Ruta de storage para persistir en DB
- **Database**: Campo `logo_url` almacena la ruta de storage
- **Cleanup**: Limpieza automática de archivos huérfanos

## 🛠️ Componentes Técnicos

### **Funciones de Utilidad (`TeamCreationContext`)**

#### `uploadImageAsync(localUri: string)`
```typescript
// Sube imagen a Supabase Storage y genera signed URL
const { path, signedUrl } = await uploadImageAsync(localUri);
```

**Proceso:**
1. Obtiene usuario autenticado
2. Convierte URI local a blob
3. Valida tamaño (< 5MB) y tipo (imagen)
4. Genera path único: `${user.id}/${timestamp}.{ext}`
5. Sube a bucket `team_logos`
6. Genera signed URL (TTL 1 hora)
7. Retorna `{ path, signedUrl }`

#### `revokePreviousIfNeeded(prevPath?: string)`
```typescript
// Elimina imagen anterior si existe
await revokePreviousIfNeeded(data.teamDetails.logoPath);
```

**Proceso:**
1. Verifica si existe path anterior
2. Extrae path relativo del bucket
3. Elimina archivo de storage
4. Maneja errores silenciosamente (no crítico)

### **Componente ImagePicker Mejorado**

#### **Estados de Carga**
- **Uploading**: Indicador de progreso durante subida
- **Disabled**: Deshabilitado durante operaciones
- **Error**: Manejo de errores con mensajes específicos

#### **Funcionalidades**
- **Preview**: Muestra imagen seleccionada con botón de eliminar
- **Progress**: Overlay con spinner durante subida
- **Validation**: Mensajes de error específicos
- **Cleanup**: Eliminación de imágenes anteriores

#### **Props Interface**
```typescript
interface ImagePickerProps {
  imageUri: string | null;           // URL de preview
  onPickFromGallery: () => Promise<void>;
  onTakePhoto: () => Promise<void>;
  onRemove?: () => void;             // Función para eliminar
  placeholder?: string;
  disabled?: boolean;                // Estado deshabilitado
}
```

### **Flujo de Datos**

#### **1. Selección de Imagen**
```typescript
// Usuario selecciona imagen
const localUri = result.assets[0].uri;

// Revoca imagen anterior si existe
await revokePreviousIfNeeded(currentLogoPath);

// Sube nueva imagen
const { path, signedUrl } = await uploadImageAsync(localUri);

// Actualiza estado
updateTeamDetails({
  logoPreview: signedUrl,    // Para mostrar en UI
  logoPath: path,            // Para persistir en DB
});
```

#### **2. Creación de Equipo**
```typescript
// Inserta equipo con path de storage
const { data: team } = await supabase
  .from('teams')
  .insert({
    name: teamDetails.name,
    logo_url: teamDetails.logoPath,  // Ruta de storage
    captain_id: user.id,
    // ... otros campos
  });
```

#### **3. Recuperación de Imagen**
```typescript
// Obtiene signed URL desde path almacenado
const signedUrl = await getSignedUrlFromPath(team.logo_url);

// Usa signed URL para mostrar imagen
<Image source={{ uri: signedUrl }} />
```

## 🗄️ Estructura de Storage

### **Bucket: `team_logos`**
```
team_logos/
├── user_id_1/
│   ├── 1703123456789.jpg
│   ├── 1703123456790.png
│   └── 1703123456791.webp
├── user_id_2/
│   ├── 1703123456792.jpg
│   └── 1703123456793.jpg
└── ...
```

### **Path Pattern**
- **Formato**: `${user.id}/${timestamp}.{extension}`
- **Ejemplo**: `team_logos/550e8400-e29b-41d4-a716-446655440000/1703123456789.jpg`
- **Ventajas**: Organizado por usuario, único por timestamp

## 🔒 Seguridad y Permisos

### **RLS (Row Level Security)**
- **Bucket privado**: Solo acceso via signed URLs
- **Autenticación**: JWT requerido para todas las operaciones
- **Validación**: Usuario solo puede subir a su propia carpeta

### **Validaciones**
- **Tamaño**: Máximo 5MB por archivo
- **Tipo**: Solo archivos de imagen (image/*)
- **Usuario**: Solo usuarios autenticados pueden subir
- **Path**: Estructura controlada por aplicación

## 🎨 UI/UX Features

### **Estados Visuales**
- **Placeholder**: Imagen de placeholder con borde punteado
- **Preview**: Imagen seleccionada con botón de eliminar
- **Uploading**: Overlay con spinner y texto "Uploading..."
- **Error**: Alert con mensaje específico del error

### **Interacciones**
- **Gallery**: Botón para seleccionar desde galería
- **Camera**: Botón para tomar foto
- **Remove**: Botón X para eliminar imagen
- **Disabled**: Estados deshabilitados durante operaciones

### **Feedback**
- **Progress**: Indicador visual durante subida
- **Error Messages**: Mensajes específicos por tipo de error
- **Success**: Transición suave al completar subida
- **Caption**: Texto informativo sobre seguridad

## 📱 Flujo de Usuario

### **1. Selección Inicial**
1. Usuario toca "Upload from Gallery" o "Take Photo"
2. Se solicita permiso si es necesario
3. Se abre selector de imagen o cámara
4. Usuario selecciona/captura imagen

### **2. Procesamiento**
1. Se muestra indicador "Uploading..."
2. Imagen se redimensiona a cuadrado
3. Se valida tamaño y tipo
4. Se sube a Supabase Storage
5. Se genera signed URL

### **3. Finalización**
1. Se muestra preview de imagen
2. Se habilita botón de eliminar
3. Se actualiza estado del formulario
4. Usuario puede continuar con creación

### **4. Reemplazo**
1. Usuario selecciona nueva imagen
2. Se elimina imagen anterior automáticamente
3. Se sube nueva imagen
4. Se actualiza preview

## 🚀 Beneficios de la Implementación

### **Performance**
- **Lazy Loading**: Imágenes se cargan solo cuando se necesitan
- **Compression**: Redimensionado automático reduce tamaño
- **Cleanup**: Eliminación de archivos huérfanos

### **UX**
- **Progress Feedback**: Usuario ve progreso de subida
- **Error Handling**: Mensajes claros de error
- **Offline Resilience**: Manejo de errores de red

### **Security**
- **Private Bucket**: Solo acceso via signed URLs
- **User Isolation**: Cada usuario tiene su propia carpeta
- **Validation**: Múltiples capas de validación

### **Maintainability**
- **Type Safety**: TypeScript en toda la implementación
- **Error Boundaries**: Manejo robusto de errores
- **Clean Code**: Funciones separadas y reutilizables

## 🔧 Utilidades Adicionales

### **`getSignedUrlFromPath(path: string)`**
```typescript
// Genera nueva signed URL desde path almacenado
const signedUrl = await getSignedUrlFromPath(team.logo_url);
```

### **`deleteImageFromStorage(path: string)`**
```typescript
// Elimina imagen de storage
await deleteImageFromStorage(oldLogoPath);
```

### **`validateImageFile(file: File | Blob)`**
```typescript
// Valida archivo antes de subir
const { valid, error } = validateImageFile(blob);
if (!valid) throw new Error(error);
```

## ✅ Checklist de Implementación

- ✅ Subida desde galería
- ✅ Captura desde cámara
- ✅ Validación de archivos
- ✅ Compresión y redimensionado
- ✅ Storage en Supabase
- ✅ Generación de signed URLs
- ✅ Cleanup automático
- ✅ Estados de carga
- ✅ Manejo de errores
- ✅ UI responsiva
- ✅ TypeScript types
- ✅ Documentación completa

La implementación está completa y lista para producción con todas las características solicitadas.
