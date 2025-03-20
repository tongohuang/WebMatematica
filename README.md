# Aplicación Web Educativa de Matemáticas

Aplicación web educativa modular y gratuita enfocada en contenidos de matemáticas, con un panel de administración para docentes y una interfaz intuitiva para estudiantes.

## Características

- **Panel de administración para docentes**
- **Interfaz intuitiva para estudiantes**
- **Cursos organizados por categorías**
- **Integración con videos de YouTube**
- **Soporte para applets de GeoGebra y simuladores PhET**
- **Visor de PDFs integrado**
- **Actividades de autoevaluación**
- **Ecuaciones matemáticas con LaTeX**

## Tecnologías

- React.js
- Firebase (autenticación y almacenamiento)
- Tailwind CSS
- Vite

## Instalación

1. Clonar el repositorio:
```
git clone <repository-url>
```

2. Instalar dependencias:
```
cd matematica-web
npm install
```

3. Configurar Firebase:
   - Crear un proyecto en Firebase
   - Habilitar autenticación por email/password
   - Crear una base de datos en Firestore
   - Configurar storage para PDFs
   - Copiar las credenciales a `/src/firebase/config.js`

4. Iniciar el servidor de desarrollo:
```
npm run dev
```

## Estructura de carpetas

- **/src**
  - **/components**: Componentes reutilizables
  - **/modules**: Módulos funcionales (Auth, Courses, Activities, ErrorLogger)
  - **/pages**: Páginas principales de la aplicación
  - **/utils**: Utilidades y funciones de ayuda

## Despliegue

La aplicación está configurada para despliegue en Netlify y GitHub Pages. 