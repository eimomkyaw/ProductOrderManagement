# Product Order Management

## Setup

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
