# Alquilarte Backend

Backend para sistema de gestión inmobiliaria desarrollado con Node.js y Express.

## Descripción

Alquilarte Backend es un sistema de gestión para una inmobiliaria, desarrollado con Node.js y Express, siguiendo un patrón de arquitectura MVC (Modelo-Vista-Controlador). El proyecto forma parte de un trabajo práctico para la materia de Desarrollo Web Backend.

## Información Técnica

- **Plataforma**: Node.js
- **Framework**: Express.js
- **Almacenamiento de datos**: Archivos JSON
- **Motor de plantillas**: Pug
- **Versión actual**: 1.0.0
- **Puerto del servidor**: 5050

## Estructura del Proyecto

```
alquilarte-backend/
├── src/                     # Código fuente
│   ├── app.js               # Punto de entrada de la aplicación
│   ├── controllers/         # Controladores
│   ├── database/            # Archivos JSON de almacenamiento
│   ├── models/              # Definición de modelos
│   ├── repositories/        # Acceso a datos
│   ├── routes/              # Definición de rutas
│   │   ├── api/             # Rutas para API REST
│   │   └── views/           # Rutas para las vistas
│   ├── services/            # Servicios (lógica de negocio)
│   └── views/               # Plantillas Pug
├── .gitignore               # Archivos ignorados por Git
├── package.json             # Configuración y dependencias del proyecto
└── package-lock.json        # Versiones específicas de las dependencias
```
## Endpoints API

### Usuarios

| Método | Ruta               | Descripción                 | Parámetros de consulta    | Cuerpo de solicitud         | Códigos de respuesta |
|--------|--------------------|-----------------------------|---------------------------|------------------------------|----------------------|
| GET    | /api/usuarios      | Listar todos los usuarios   | email (opcional)          | N/A                          | 200, 404             |
| GET    | /api/usuarios/:id  | Obtener usuario por ID      | N/A                       | N/A                          | 200, 404             |
| POST   | /api/usuarios      | Crear nuevo usuario         | N/A                       | {nombre, rol, email}         | 201, 400             |
| DELETE | /api/usuarios/:id  | Eliminar usuario            | N/A                       | N/A                          | 200, 404, 400        |


### Propiedades
| Método | Ruta                      | Descripción                     | Parámetros de consulta                                    | Cuerpo de solicitud                                           | Códigos de respuesta |
|--------|---------------------------|---------------------------------|-----------------------------------------------------------|---------------------------------------------------------------|----------------------|
| GET    | /api/propiedades          | Listar todas las propiedades    | estado, tipo, id_propietario, precioMin, precioMax       | N/A                                                           | 200                  |
| GET    | /api/propiedades/:id      | Obtener propiedad por ID        | N/A                                                       | N/A                                                           | 200, 404             |
| POST   | /api/propiedades          | Crear nueva propiedad           | N/A                                                       | {titulo, descripcion, tipo, direccion, precio, id_propietario, estado} | 201, 400             |
| PUT    | /api/propiedades/:id      | Actualizar propiedad completa   | N/A                                                       | {titulo, descripcion, tipo, direccion, precio, estado}       | 200, 404, 400        |
| PATCH  | /api/propiedades/:id/estado | Cambiar estado de propiedad   | N/A                                                       | {estado}                                                      | 200, 400, 404        |
| DELETE | /api/propiedades/:id      | Eliminar propiedad              | N/A                                                       | N/A                                                           | 200, 404, 400        |

## Rutas de Vistas

| Ruta                   | Descripción                     | Método |
|------------------------|----------------------------------|--------|
| /usuarios              | Lista de usuarios               | GET    |
| /usuarios/nuevo        | Formulario de nuevo usuario     | GET    |
| /usuarios/:id          | Detalle de usuario              | GET    |
| /usuarios/:id/editar   | Formulario de edición           | GET    |
| /propiedades           | Lista de propiedades            | GET    |
| /propiedades/nueva     | Formulario de nueva propiedad   | GET    |
| /propiedades/:id       | Detalle de propiedad            | GET    |
| /propiedades/:id/editar| Formulario de edición           | GET    |
| /propiedades           | Crear propiedad desde formulario| POST   |
| /propiedades/:id       | Actualizar propiedad desde formulario | POST |

## Requisitos de Instalación y Ejecución

### Requisitos previos
- Node.js (v14 o superior)
- npm (v6 o superior)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Ailinci/back-ruleta.git

# Instalar dependencias
npm install
```

### Ejecución
```bash
npm run dev


El servidor estará disponible en `http://localhost:5050`
