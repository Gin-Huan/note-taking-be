# Notes Backend API

A comprehensive, production-ready note-taking application backend built with NestJS, TypeScript, and MySQL. This application demonstrates industry best practices including proper authentication, authorization, comprehensive testing, and scalable architecture.

## 🚀 Features

### Core Functionality
- **CRUD Operations**: Create, read, update, and delete notes
- **Advanced Search**: Full-text search with filtering by category, tags, pinned status, and archived status
- **Authentication & Authorization**: JWT-based authentication with secure user registration and login
- **User Isolation**: Users can only access their own notes
- **Categorization**: Organize notes with categories and tags
- **Note Management**: Pin important notes and archive completed ones

### Technical Features
- **TypeScript**: Full type safety and modern JavaScript features
- **Database**: MySQL with TypeORM for robust data persistence
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Input Validation**: Robust validation using class-validator
- **Error Handling**: Global exception filtering with detailed error responses
- **Security**: Helmet for security headers, bcrypt for password hashing
- **Testing**: Unit and E2E tests with Jest
- **Pagination**: Efficient pagination for large datasets
- **Response Transformation**: Consistent API response format

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Security**: Helmet, bcrypt

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards
│   ├── strategies/      # Passport strategies
│   └── ...
├── users/               # User management module
│   ├── dto/
│   ├── entities/
│   └── ...
├── notes/               # Notes module
│   ├── dto/
│   ├── entities/
│   └── ...
├── common/              # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── ...
├── config/              # Configuration files
└── main.ts             # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=notes_db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=7d
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Create the database
   mysql -u root -p -e "CREATE DATABASE notes_db;"
   
   # Run migrations (if using production mode)
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/api/docs`

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login user |

### Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notes` | Get all notes (with filtering and pagination) |
| POST | `/api/v1/notes` | Create a new note |
| GET | `/api/v1/notes/:id` | Get note by ID |
| PATCH | `/api/v1/notes/:id` | Update note |
| DELETE | `/api/v1/notes/:id` | Delete note |
| GET | `/api/v1/notes/categories` | Get all categories |
| GET | `/api/v1/notes/tags` | Get all tags |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/profile` | Get current user profile |
| PATCH | `/api/v1/users/:id` | Update user |
| DELETE | `/api/v1/users/:id` | Delete user |

## 🔍 Search and Filtering

The notes API supports advanced search and filtering:

```bash
GET /api/v1/notes?q=meeting&category=work&tags=important&isPinned=true&page=1&limit=10&sortBy=createdAt&sortOrder=DESC
```

### Query Parameters

- `q`: Search in title and content
- `category`: Filter by category
- `tags`: Filter by tags (array)
- `isPinned`: Filter by pinned status
- `isArchived`: Filter by archived status
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Sort field (createdAt, updatedAt, title)
- `sortOrder`: Sort order (ASC, DESC)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation of all inputs
- **SQL Injection Protection**: TypeORM provides protection against SQL injection
- **CORS Configuration**: Configurable CORS settings
- **Helmet**: Security headers middleware
- **Rate Limiting**: Can be easily added with @nestjs/throttler

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure production database credentials
4. Set up proper CORS origins

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- CreateInitialTables

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Production Build

```bash
npm run build
npm run start:prod
```

## 📊 Performance Considerations

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Pagination**: Efficient pagination to handle large datasets
- **Query Optimization**: Optimized TypeORM queries
- **Caching**: Ready for Redis integration for caching
- **Connection Pooling**: Database connection pooling configured

## 🛡️ Best Practices Implemented

### Code Quality
- **TypeScript**: Full type safety
- **ESLint & Prettier**: Code formatting and linting
- **Modular Architecture**: Clean separation of concerns
- **SOLID Principles**: Following SOLID design principles
- **DRY Principle**: Don't repeat yourself

### Security
- **Input Validation**: All inputs validated
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control ready
- **Error Handling**: Secure error responses

### Testing
- **Unit Tests**: Comprehensive unit test coverage
- **E2E Tests**: End-to-end testing
- **Mocking**: Proper mocking strategies
- **Test Structure**: Well-organized test files

### Documentation
- **API Documentation**: Comprehensive Swagger documentation
- **Code Comments**: Clear code documentation
- **README**: Detailed setup and usage instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Create a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔧 Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Generate TypeORM migration
npm run migration:generate -- MigrationName

# Run migrations
npm run migration:run
```

## 📞 Support

For support and questions, please open an issue in the repository.