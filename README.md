
✂  CORTE & ARTE
Sistema de gestión de turnos para barbería


Materia: Plataformas de Desarrollo
Comisión: ACN4AP
Profesor: Fernando Gonzalo Gaitán
Integrantes: Andrei Iushkov — Anna Spiridenkova


1. DESCRIPCIÓN DEL PROYECTO
Corte & Arte es una aplicación web para la gestión de turnos de una barbería ficticia. La plataforma permite a los clientes registrarse, explorar el catálogo de servicios y maestros, y reservar un turno eligiendo maestro, servicio, fecha y horario disponible. El personal administrador cuenta con un panel dedicado para gestionar maestros, servicios y el estado de todos los turnos del negocio.
La aplicación fue diseñada para una empresa pequeña y ficticia que no contaba con presencia digital. El nombre y la identidad visual son originales.
2. USUARIOS Y ROLES
Rol: Cliente
•	Registro con nombre, correo y contraseña
•	Inicio y cierre de sesión
•	Consulta del catálogo de servicios disponibles
•	Consulta del listado de maestros y sus especialidades
•	Reserva de turnos: selección de maestro → servicio → fecha → horario
•	Visualización de sus propios turnos con estado actualizado
•	Cancelación de turnos propios

Rol: Administrador
•	Acceso al panel de administración exclusivo
•	Alta y edición de maestros (nombre, especialidad)
•	Desactivación de maestros
•	Alta y edición de servicios (nombre, descripción, precio, duración)
•	Desactivación de servicios
•	Visualización de todos los turnos del sistema
•	Actualización del estado de cualquier turno (pendiente / confirmado / completado / cancelado)
3. ARQUITECTURA Y STACK TECNOLÓGICO
El proyecto sigue una arquitectura de tres capas con frontend, backend y base de datos completamente desacoplados, orquestados mediante Docker Compose:
Componente	Detalle
Frontend	React 19 + Vite, Bootstrap 5 + React-Bootstrap, React Router v7
Backend	Node.js 26 + Express 4, arquitectura MVC (routes → controllers → models)
Base de datos	MySQL 9.7 con inicialización automática vía scripts SQL en Docker
Infraestructura	Docker Compose: MySQL + Node.js + Nginx como reverse proxy
Autenticación	JWT (JSON Web Tokens) con expiración de 8 horas y control de roles
Seguridad	Contraseñas hasheadas con bcrypt (salt rounds: 10)
Tipografía	Playfair Display (headings) + Inter (cuerpo de texto)

4. MODELO DE BASE DE DATOS
El sistema utiliza 5 tablas relacionadas entre sí:
Tabla	Campos principales
users	id, name, email, password (bcrypt), is_admin, created_at
masters	id, name, specialty, photo_url, is_active, created_at
services	id, name, description, price, duration (min), is_active, created_at
master_services	master_id (FK), service_id (FK) — tabla de relación N:M
appointments	id, user_id (FK), master_id (FK), service_id (FK), date, time, status (ENUM), notes, created_at

La relación entre masters y services es de tipo N:M (un maestro puede ofrecer varios servicios y un servicio puede ser ofrecido por varios maestros). Al reservar un turno se valida que el maestro seleccionado efectivamente ofrezca el servicio elegido.

5. ENDPOINTS PRINCIPALES DE LA API
Método	Ruta	Acceso	Descripción
POST	/users/register	Público	Registro de nuevo cliente
POST	/users/login	Público	Inicio de sesión — devuelve JWT
GET	/masters	Público	Listado de maestros activos
GET	/masters/:id	Público	Detalle de maestro con sus servicios
POST	/masters	Admin	Crear maestro
PUT	/masters/:id	Admin	Editar maestro
GET	/services	Público	Listado de servicios activos
POST	/services	Admin	Crear servicio
PUT	/services/:id	Admin	Editar servicio
GET	/appointments/available	Público	Horarios disponibles para maestro y fecha
GET	/appointments/my	Auth	Turnos del cliente autenticado
POST	/appointments	Auth	Reservar turno
PUT	/appointments/:id/cancel	Auth/Admin	Cancelar turno
GET	/appointments	Admin	Todos los turnos del sistema
PUT	/appointments/:id/status	Admin	Actualizar estado de turno

6. INSTRUCCIONES DE EJECUCIÓN
Requisitos previos: Docker Desktop instalado.
1.	Clonar el repositorio o descomprimir el archivo entregado.
2.	Copiar el archivo .env.example a .env y completar las variables (ya viene preconfigurado para desarrollo local).
3.	Abrir una terminal en la carpeta frontend y ejecutar:
npm install
npm run build
4.	Ejecutar en a la carpeta raíz del proyecto: docker compose up --build
5.	Acceder a http://localhost en el navegador.
6.	Credenciales de administrador: admin@cortearte.com / admin1234

Nota: la base de datos se inicializa automáticamente con la estructura y datos de ejemplo al primer inicio del contenedor MySQL.
