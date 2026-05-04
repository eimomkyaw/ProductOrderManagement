# Order Management Frontend

A modern Vue.js frontend application for order management system built with Vue 3, Pinia, and Bootstrap 5.

## Features

### Core Functionality
- **User Authentication**: Secure login system with JWT tokens
- **Product Dashboard**: Browse and view available products
- **Shopping Cart**: Add/remove items with quantity management
- **Order Placement**: Submit orders with real-time feedback
- **Order History**: View past orders and their status

### Technical Features
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error notifications
- **Form Validation**: Client-side validation with visual feedback
- **State Management**: Centralized state with Pinia
- **Navigation Guards**: Protected routes and authentication checks

## Technology Stack

- **Vue 3** with Composition API
- **Pinia** for state management
- **Vue Router** for navigation
- **Axios** for HTTP requests
- **Bootstrap 5** for UI components
- **Bootstrap Icons** for icons
- **Vite** for build tooling

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── LoadingSpinner.vue
│   ├── NotificationToast.vue
│   └── Navbar.vue
├── stores/             # Pinia stores
│   ├── auth.js         # Authentication state
│   └── products.js     # Products and cart state
├── views/              # Page components
│   ├── Login.vue       # Login page
│   ├── OrderCreate.vue # Product dashboard and cart
│   └── OrderHistory.vue # Order history page
├── router/             # Vue Router configuration
│   └── index.js
├── axios.js            # Axios configuration with interceptors
├── App.vue             # Root component
└── main.js             # Application entry point
```

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Laravel backend API running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd order_management_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `DELETE /api/auth/logout` - User logout
email => dev@example.com
password => password

### Products
- `GET /api/products` - Get all products

### Orders
- `POST /api/auth/orders` - Create new order
- `GET /api/auth/orders` - Get user's order history

## Usage

### Login
1. Navigate to `/login`
2. Enter your credentials
3. Successful login redirects to the dashboard

### Dashboard
- View all available products
- Add items to cart with quantity controls
- See real-time cart total
- Submit orders with confirmation

### Order History
- View all past orders
- Check order status
- See order details and items

## State Management

### Auth Store (`stores/auth.js`)
- User authentication state
- Login/logout functionality
- Token management

### Products Store (`stores/products.js`)
- Product data management
- Shopping cart operations
- Order submission

## Styling

The application uses Bootstrap 5 for responsive design and includes:
- Custom CSS for enhanced UI
- Hover effects and transitions
- Mobile-responsive layouts
- Loading states and animations

## Error Handling

- Network error handling with user-friendly messages
- Form validation with visual feedback
- API error response handling
- Toast notifications for user feedback

## Development

### Adding New Features
1. Create components in `src/components/`
2. Add views in `src/views/`
3. Update router configuration
4. Manage state in Pinia stores

### Code Style
- Vue 3 Composition API
- ES6+ JavaScript
- Bootstrap 5 classes
- Component-based architecture

## Deployment

### Production Build
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.


## Contributing

1. Follow the existing code style
2. Use component-based architecture
3. Implement proper error handling
4. Add loading states for async operations
5. Test responsive design

## License

This project is part of the Jr. Full-Stack Developer Test (Laravel + Vue).
