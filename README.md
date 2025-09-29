# 🌍 Tourly - Tours & Experiences Platform

Una plataforma moderna para descubrir y reservar experiencias turísticas únicas alrededor del mundo, construida con React, TypeScript, Firebase y Tailwind CSS.

## 🚀 Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Git
- Cuenta de Firebase

## 🛠️ Configuración del Proyecto

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd tourly_project
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 🌿 Flujo de Trabajo con Git

### Estructura de Ramas

```
main
├── develop
    ├── feature/nombre-feature
    ├── fix/nombre-fix
    └── hotfix/nombre-hotfix
```

### Reglas de Branching

1. **main**: Rama de producción, siempre estable
2. **develop**: Rama de desarrollo, integración de features
3. **feature/***: Para nuevas funcionalidades
4. **fix/***: Para correcciones de bugs
5. **hotfix/***: Para correcciones urgentes en producción

### Proceso de Desarrollo

1. **Crear nueva rama desde develop**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-descriptivo
   ```

2. **Trabajar en tu feature**:
   ```bash
   git add .
   git commit -m "tipo: descripción clara"
   git push origin feature/nombre-descriptivo
   ```

3. **Crear Pull Request**:
   - De tu feature branch → develop
   - Nunca directamente a main
   - Incluir descripción detallada
   - Asignar reviewers

4. **Merge a develop**:
   - Después de code review
   - Squash commits si es necesario
   - Eliminar branch después del merge

5. **Deploy a main**:
   - Solo desde develop
   - Crear release tag
   - Deploy automático

## 📝 Convenciones de Commits

### Formato
```
tipo(scope): descripción

[cuerpo opcional]

[footer opcional]
```

### Tipos de Commits

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento
- `perf`: Mejoras de performance
- `ci`: Cambios en CI/CD
- `build`: Cambios en el build system

### Ejemplos de Commits

```bash
# ✅ Buenos ejemplos
git commit -m "feat(auth): add Google OAuth login"
git commit -m "fix(navbar): correct responsive menu alignment"
git commit -m "style(components): improve button hover effects"
git commit -m "docs(readme): update installation guide"
git commit -m "refactor(hooks): extract navbar logic to useNavbar hook"

# ❌ Malos ejemplos
git commit -m "fix bug"
git commit -m "update code"
git commit -m "WIP"
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Configuración de la aplicación
│   ├── providers/         # Context providers
│   └── routes/           # Configuración de rutas
├── features/             # Features organizadas por dominio
│   ├── auth/            # Autenticación
│   ├── public/          # Páginas públicas
│   └── shared/          # Componentes compartidos
├── shared/              # Recursos compartidos
│   ├── components/      # Componentes reutilizables
│   ├── hooks/          # Custom hooks
│   ├── services/       # Servicios de API
│   └── utils/          # Utilidades
├── config/             # Configuraciones
└── types/              # Definiciones de tipos
```

## 🧩 Convenciones de Código

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: camelCase (`userService.ts`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse`)

## 🎨 Convenciones de Styling

### Tailwind CSS

- Usar clases de Tailwind CSS consistentemente
- Agrupar clases por tipo: layout → spacing → colors → effects
- Usar clases responsivas con prefijos (`sm:`, `md:`, `lg:`, `xl:`)


## 🔒 Seguridad

### Variables de Entorno

- Nunca commitear archivos `.env`
- Usar prefijo `VITE_` para variables de cliente
- Documentar todas las variables requeridas

### Firebase

- Usar reglas de seguridad apropiadas
- Validar datos en el cliente y servidor
- Implementar autenticación en todas las rutas protegidas

## 📋 Code Review Checklist

### Para el Autor

- [ ] Código sigue las convenciones del proyecto
- [ ] Tests pasan correctamente
- [ ] No hay console.logs en producción
- [ ] Documentación actualizada si es necesario
- [ ] Branch está actualizado con develop
- [ ] Commit messages siguen las convenciones

### Para el Reviewer

- [ ] Funcionalidad cumple los requisitos
- [ ] Código es legible y mantenible
- [ ] No hay duplicación innecesaria
- [ ] Performance es aceptable
- [ ] Seguridad es apropiada
- [ ] Tests cubren casos importantes

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build           # Build para producción
npm run preview         # Preview del build
npm run lint            # Linting con ESLint
npm run type-check      # Verificación de tipos TypeScript

# Testing
npm run test            # Ejecutar tests
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Tests con coverage

# Deployment
npm run deploy:dev      # Deploy a desarrollo
npm run deploy:prod     # Deploy a producción
```


**¡Recuerda siempre hacer merge a `develop` primero, nunca directamente a `main`!**
