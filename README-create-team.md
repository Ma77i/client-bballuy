# Create Team Flow - Basketball Mobile App

Este documento describe el flujo completo de creación de equipos implementado en la aplicación de baloncesto.

## 📱 Flujo de 3 Pasos

### Paso 1: Team Details
- **Campos obligatorios:**
  - Nombre del equipo (requerido, validado con Zod)
  - Tipo de equipo (Casual/Competitive, por defecto Casual)
- **Campos opcionales:**
  - Logo del equipo (subir desde galería o tomar foto)
  - Descripción/Bio del equipo
  - Cancha de casa (búsqueda conectada a Supabase)
- **Validaciones:**
  - Nombre mínimo 3 caracteres, máximo 50
  - Solo letras, números, espacios, guiones y guiones bajos
  - Descripción máxima 500 caracteres

### Paso 2: Invite Members
- **Búsqueda de usuarios:** Conectada a la tabla `users_public` de Supabase
- **Link de invitación:** Genera y copia URL de invitación al portapapeles
- **Roster actual:** Muestra avatares de miembros actuales e invitados
- **Configuración de privacidad:**
  - Público (cualquiera puede encontrar y unirse)
  - Privado (solo usuarios invitados)
  - Requiere aprobación de administrador
  - Número mínimo de jugadores (opcional)

### Paso 3: Review & Create
- **Resumen completo:** Muestra todos los detalles del equipo
- **Creación del equipo:** Inserta en base de datos y navega al detalle del equipo
- **Validación final:** Previene duplicados y muestra indicador de carga

## 🛠️ Componentes Técnicos

### Contexto Global (`TeamCreationContext`)
- Maneja el estado del flujo completo
- Persiste datos entre pantallas
- Integra con Supabase para operaciones de DB
- Maneja subida de imágenes y permisos

### Componentes UI Reutilizables
- `StepIndicator`: Indicador de progreso con puntos
- `ImagePicker`: Selector de imagen con galería y cámara
- `SearchInput`: Búsqueda con resultados en tiempo real
- `RadioButtonGroup`: Botones de radio personalizados
- `AvatarGroup`: Grupo de avatares con contador
- `ToggleSwitch`: Switch personalizado
- `Dropdown`: Selector desplegable

### Validaciones (`team-creation.ts`)
- Esquemas Zod para validación de tipos
- Validadores para cada paso del flujo
- Mensajes de error personalizados

## 🗄️ Integración con Supabase

### Tablas Utilizadas
- `teams`: Información del equipo
- `team_members`: Miembros del equipo y roles
- `courts`: Canchas para búsqueda de cancha de casa
- `users_public`: Usuarios para invitaciones

### Operaciones
- **Crear equipo:** INSERT en `teams`
- **Agregar capitán:** INSERT en `team_members` con rol 'captain'
- **Invitar miembros:** INSERT en `team_members` con estado 'pending'
- **Búsqueda de canchas:** SELECT con filtro ILIKE
- **Búsqueda de usuarios:** SELECT con filtro OR en nombre/email

## 🎨 Diseño y UX

### Tema Oscuro
- Consistente con el diseño existente de la app
- Colores primarios: `#0ea5e9` (azul), `#f97316` (naranja)
- Superficies: `#242b3d`, `#1a1f2e` (fondo)

### Navegación
- Stack navigation entre pasos
- Botones Previous/Next en pasos 2 y 3
- Navegación automática al completar creación
- Reset del formulario al salir

### Estados de Carga
- ActivityIndicator durante creación del equipo
- Estados de búsqueda en tiempo real
- Validación en tiempo real en campos

## 📁 Estructura de Archivos

```
client/
├── app/
│   └── create-team/
│       ├── _layout.tsx          # Layout con TeamCreationProvider
│       ├── index.tsx            # Redirección a step1
│       ├── step1.tsx            # Team Details
│       ├── step2.tsx            # Invite Members
│       └── step3.tsx            # Review & Create
├── contexts/
│   └── TeamCreationContext.tsx  # Contexto global del flujo
├── components/ui/
│   ├── step-indicator.tsx       # Indicador de progreso
│   ├── image-picker.tsx         # Selector de imagen
│   ├── search-input.tsx         # Input de búsqueda
│   ├── radio-button.tsx         # Botones de radio
│   └── avatar-group.tsx         # Grupo de avatares
└── lib/validation/
    └── team-creation.ts         # Esquemas de validación
```

## 🚀 Uso

1. **Iniciar flujo:** Desde la pantalla de Teams, tocar "Create Team"
2. **Navegar:** Usar botones Previous/Next o navegación del header
3. **Validar:** Los campos se validan en tiempo real
4. **Completar:** Al crear el equipo, navega automáticamente al detalle

## 🔧 Dependencias

- `expo-image-picker`: Para selección de imágenes
- `expo-clipboard`: Para copiar link de invitación
- `zod`: Para validación de esquemas
- `@supabase/supabase-js`: Para operaciones de base de datos

## ✅ Características Implementadas

- ✅ Flujo completo de 3 pasos
- ✅ Validaciones con Zod
- ✅ Integración con Supabase
- ✅ Componentes UI reutilizables
- ✅ Navegación entre pantallas
- ✅ Manejo de estado global
- ✅ Subida de imágenes
- ✅ Búsqueda en tiempo real
- ✅ Link de invitación
- ✅ Configuración de privacidad
- ✅ Indicadores de progreso
- ✅ Estados de carga
- ✅ Manejo de errores
