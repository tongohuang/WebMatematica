# WebMatemática

Una aplicación web educativa para la enseñanza de matemáticas, construida con React, Firebase y desplegada en Netlify.

## Características

- Autenticación de usuarios (estudiantes y administradores)
- Catálogo de cursos de matemáticas
- Sistema de seguimiento del progreso de estudiantes
- Panel de administración para gestionar cursos y contenidos

## Tecnologías

- React con Vite
- Firebase (Authentication, Firestore, Storage)
- Netlify para despliegue continuo
- GitHub Actions para CI/CD

## Instalación

1. Clona este repositorio:
```
git clone https://github.com/tu-usuario/webmatematica.git
cd webmatematica
```

2. Instala las dependencias:
```
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Firebase:
```
VITE_API_KEY=tu-api-key
VITE_AUTH_DOMAIN=tu-auth-domain
VITE_PROJECT_ID=tu-project-id
VITE_STORAGE_BUCKET=tu-storage-bucket
VITE_MESSAGING_SENDER_ID=tu-messaging-sender-id
VITE_APP_ID=tu-app-id
```

## Desarrollo local

### Ejecutar la aplicación

```
npm run dev
```

### Ejecutar emuladores de Firebase

```
firebase emulators:start
```

## Despliegue

### Despliegue manual a Firebase

```
npm run build
firebase deploy
```

### Despliegue manual a Netlify

```
npm run build
netlify deploy --prod
```

## Estructura del proyecto

```
src/
  ├── components/    # Componentes reutilizables
  ├── pages/         # Páginas de la aplicación
  ├── context/       # Contextos de React (Auth, etc.)
  ├── hooks/         # Hooks personalizados
  ├── services/      # Servicios para Firebase
  ├── utils/         # Utilidades y funciones auxiliares
  ├── App.jsx        # Componente principal
  └── main.jsx       # Punto de entrada
```

## Reglas de seguridad

El proyecto incluye reglas de seguridad para Firestore y Storage que aseguran que:

- Solo los administradores pueden crear/modificar cursos
- Los estudiantes solo pueden ver su propio progreso
- Solo usuarios autenticados pueden acceder a los recursos 