# LIS — Sistema de Información de Laboratorio

## Resumen del Proyecto
Este proyecto es un Sistema de Información de Laboratorio (LIS) que permite gestionar el registro de pacientes, laboratoristas y resultados del perfil lipídico (colesterol total, HDL, LDL y triglicéridos).

El software está dividido en dos módulos:

- Backend: desarrollado en Django REST Framework (Python) y conectado a una base de datos MySQL.
- Frontend: consumiendo la API del backend mediante peticiones HTTP.

El objetivo es permitir una administración controlada de laboratorios clínicos, donde el laboratorista pueda iniciar sesión, registrar pacientes, ingresar resultados y consultar los valores asociados al código de ingreso del paciente.

------------------------------------------------------------

## Credenciales del Sistema

Usuarios para iniciar sesión en el frontend:

Usuario: aleja   | Contraseña: 2701
Usuario: Juanpi  | Contraseña: 0709
Usuario: meli    | Contraseña: 0703

Credenciales de la base de datos MySQL:

Usuario: root
Contraseña: 12345678
Base de datos: lis_db

Estas credenciales son únicamente para entorno de pruebas y desarrollo.

------------------------------------------------------------

## Cómo ejecutar el proyecto

1. Backend (Django)

Abrir una terminal y entrar a la carpeta backend. Ejecutar los siguientes comandos para crear un entorno virtual e instalar dependencias:

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

Con esto quedan instaladas todas las librerías necesarias para el backend.

------------------------------------------------------------

2. Configuración de la Base de Datos (MySQL)

Ejecutar en la terminal:

mysql -u root -p

Cuando solicite la contraseña, escribir:

12345678

Luego ejecutar dentro de MySQL:

CREATE DATABASE IF NOT EXISTS lis_db;
GRANT ALL PRIVILEGES ON lis_db.* TO 'root'@'localhost' IDENTIFIED BY '12345678';
FLUSH PRIVILEGES;

Para salir de MySQL:

exit

------------------------------------------------------------

3. Migraciones de Django (crear tablas)

Ejecutar en la terminal dentro de la carpeta backend:

python manage.py migrate

------------------------------------------------------------

4. Ejecutar el Backend

python manage.py runserver 0.0.0.0:8000

El backend quedará disponible en:

http://localhost:8000/

------------------------------------------------------------

5. Frontend

Abrir una nueva terminal, entrar en la carpeta frontend y ejecutar:

npm install
npm run dev

El frontend quedará disponible en la URL indicada por la terminal

------------------------------------------------------------

## Uso del Sistema

1. Abrir el frontend en el navegador.
2. Ingresar con cualquiera de los usuarios registrados:
   aleja / 2701
   Juanpi / 0709
   meli / 0703
3. Registrar pacientes, laboratoristas o ingresar resultados según el módulo correspondiente.



