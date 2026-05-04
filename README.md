# Product Order Management System

A mini multi-user order and inventory management system built for the Jr. Full-Stack Developer Test using Laravel and Vue.

## Tech Stack

- Backend: Laravel, Laravel Sanctum
- Frontend: Vue 3, Vue Router, Pinia, Axios, Bootstrap
- Database: PostgreSQL
- Tooling: Vite, Docker Compose

## Project Structure

```text
ProductOrderManagement/
├── order_management_backend/     # Laravel API
├── order_management_frontend/    # Vue frontend
└── README.md                     # Main setup guide
```

## Features

- Login authentication with Laravel Sanctum
- Product listing with available stock
- Shopping cart with quantity controls
- Order placement with backend validation
- Automatic order total calculation
- Inventory stock update after order creation
- Order history for authenticated users
- Loading and error states in the frontend

## Demo Account

```text
Email: dev@example.com
Password: password
```

This account is created by the Laravel database seeder.

## Backend Setup

Go to the backend folder:

```bash
cd order_management_backend
```

Install PHP dependencies:

```bash
composer install
```

First, create the environment file:

```bash
cp .env.example .env
```

Build the Docker containers:

```bash
docker-compose build
```

Start the containers:

```bash
docker-compose up -d
```

Access the application container:

```bash
docker exec -it product_order_management bash
```

Run database migrations:

```bash
php artisan migrate
```

Run database seeders:

```bash
php artisan db:seed
```

Start the Laravel API server:

```bash
php artisan serve
```

The backend will run at:

```text
http://127.0.0.1:8000
```

## Frontend Setup

Open a second terminal and go to the frontend folder:

```bash
cd order_management_frontend
```

Install JavaScript dependencies:

```bash
npm install
```

Start the Vue development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

The frontend API base URL defaults to:

```text
http://127.0.0.1:8000/api
```

You can override it by creating a frontend `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## API Endpoints

### Authentication

```text
POST   /api/auth/login
DELETE /api/auth/logout
```

### Products

```text
GET /api/products
```

### Orders

```text
GET  /api/auth/orders
POST /api/auth/orders
```

Authenticated order routes require a bearer token returned from login.

Build the frontend for production:

```bash
cd order_management_frontend
npm run build
```

## pgAdmin

If pgAdmin is running from Docker Compose, open:

```text
http://localhost:8082
```

Default pgAdmin login:

```text
Email: admin@admin.com
Password: password
```

PostgreSQL server details:

```text
Host: pgsql
Port: 5432
Database: laravel
Username: sail
Password: password
```

Use `pgsql` as the host inside pgAdmin because pgAdmin runs inside Docker. Use `127.0.0.1` in Laravel `.env` when running Laravel directly on the local machine.

## Notes

- Keep both backend and frontend servers running while testing the app.
- If the frontend shows a network error, confirm Laravel is running on `http://127.0.0.1:8000`.
- If Laravel cannot connect to PostgreSQL, confirm Docker is running and the `.env` database host matches how Laravel is being started.
