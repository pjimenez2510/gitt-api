# GITT API 🏦🎯

API RESTful para la gestión y control del inventario

## Características Clave ✨

- 🔐 Autenticación JWT con Passport
- 📈 CRUD completo para:
  - Usuarios
- 📧 Sistema de notificaciones:
  - Recordatorios programados (Cron Jobs)
  - Alertas de progreso
- 🛠️ Herramientas de desarrollo:
  - Pre-commits con Husky
  - Formateo automático (Prettier)
  - Linting (ESLint)

## Tecnologías 🛠️

| Categoría         | Tecnologías                |
| ----------------- | -------------------------- |
| Backend           | NestJS, Node.js 22.15, Bun |
| Base de Datos     | PostgreSQL 17, Drizzle ORM |
| Autenticación     | Passport-JWT               |
| DevOps            | Docker, Git                |
| Calidad de Código | Husky, Prettier, ESLint    |
| Testing           | Postman                    |

## Estructura del Proyecto 📂

```bash
src/
├── auth/ # Autenticación JWT
├── mail/ # Sistema de notificaciones
├── cron/ # Tareas programadas
├── common/ # Utilidades compartidas
└── prisma/ # Esquema y migraciones DB
```

## Requisitos 📋

- Node.js 22.15+
- Bun (opcional para desarrollo)
- PostgreSQL 17
- Docker (para desarrollo con contenedores)

## Configuración ⚙️

1. Clonar repositorio:

```bash
git clone [repo-url]
cd gitt-api
```

2. Instalar dependencias:

```bash
bun install
```

3. Configurar variables de entorno (crear archivo .env basado en el ejemplo):

```bash
PORT=3000
JWT_SECRET=top_secret

DATABASE_URL=postgres://postgres:postgres@localhost:5460/gitt-db
DB_PORT=5460
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gitt-db
```

4. Iniciar base de datos con Docker:

```bash
docker compose up -d
```

5. Ejecutar migraciones y seed inicial:

```bash
bun db:seed
```

6. Iniciar servidor en desarrollo:

```bash
bun dev
```

## Diagrama de Arquitectura 🏗️

![Diagrama de Arquitectura](public/arquitectura.png)
