# Proyecto Konecta

Este proyecto es una aplicación web completa que incluye un frontend basado en React y un backend basado en Express. La aplicación gestiona la autenticación de usuarios, empleados, solicitudes y administración de usuarios. La infraestructura está desplegada utilizando Docker y Docker Compose para facilitar el desarrollo y la implementación.

## Tabla de Contenidos

- [Proyecto Konecta](#proyecto-konecta)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
  - [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
  - [Pasos](#pasos)
- [Configuración](#configuración)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Uso](#uso)
  - [Testing](#testing)
- [Frontend](#frontend-1)
  - [Backend](#backend-1)
  - [GitHub Actions](#github-actions)
  - [Despliegue](#despliegue)
  - [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características

- **Frontend**: Interfaz de usuario basada en React con rutas protegidas para la gestión de empleados y administración de usuarios.
- **Backend**: API RESTful construida con Express, con autenticación, autorización y gestión de datos mediante PostgreSQL.
- **Dockerizado**: Todo el entorno de desarrollo y producción está encapsulado en contenedores Docker.
- **Autenticación y Autorización**: Implementación de autenticación JWT y roles de usuario.
- **Tests**: Configuración de pruebas unitarias y de integración para frontend y backend.

## Tecnologías Utilizadas

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Express, TypeORM, PostgreSQL, JWT, Swagger
- **Infraestructura**: Docker, Docker Compose
- **Testing**: Jest, Supertest, Testing Library

## Estructura del Proyecto

```bash
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── utils
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── routes
│   │   ├── styles
│   │   └── utils
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── docker-compose.yml
└── README.md
```

# Instalación
Requisitos
-  Docker
-  Docker Compose

## Pasos
Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/konecta.git
cd konecta
```
Configura los archivos .env en los directorios backend y frontend con tus variables de entorno.

Construye y levanta los contenedores Docker:

```bash
docker-compose up --build
```

# Configuración
## Backend
Rutas principales:

* /auth: Autenticación y registro de usuarios.
* /employees: Gestión de empleados.
* /requests: Gestión de solicitudes.
* /users: Administración de usuarios.
* Variables de entorno:
  * POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB: Configuración de la base de datos.
  * JWT_SECRET: Clave secreta para la generación de tokens JWT.

## Frontend
Rutas principales:

* /login: Página de inicio de sesión.
* /register: Página de registro de usuarios.
* /: Página de bienvenida y Dashboard.
* /employees: Gestión de empleados.
* /requests: Gestión de solicitudes.
* /users: Administración de usuarios (solo para administradores).


# Uso
Una vez que los contenedores estén en funcionamiento, puedes acceder a la aplicación en tu navegador en:

Frontend: http://localhost:<FRONTEND_PORT>
Backend: http://localhost:<BACKEND_PORT>


## Testing
# Frontend
Para ejecutar las pruebas unitarias del frontend:

```bash
cd frontend
npm test
```

## Backend
Para ejecutar las pruebas unitarias del backend:

```bash
cd backend
npm test
```

## GitHub Actions
El proyecto está configurado para ejecutar pruebas automáticas en cada pull request mediante GitHub Actions. Los archivos de configuración se encuentran en .github/workflows/.

## Despliegue
El despliegue se maneja a través de Docker y Docker Compose, lo que facilita la transición del entorno de desarrollo a producción.

## Contribuciones
Las contribuciones son bienvenidas. Por favor, sigue el flujo de trabajo estándar de GitHub para colaborar:

Haz un fork del repositorio.
Crea una nueva rama (git checkout -b feature/nueva-caracteristica).
Realiza tus cambios y haz un commit (git commit -am 'Agrega nueva característica').
Haz push a la rama (git push origin feature/nueva-caracteristica).
Abre un Pull Request.

# Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
