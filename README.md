# Nuxt Starter

A minimal Nuxt 4 starter with authentication, OpenAPI type generation, and Pinia state management.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate types from OpenAPI schema
npm run generate:types

# Build for production
npm run build
```

## Features

- **Nuxt 4** - Latest Vue 3 framework
- **TypeScript** - Full type safety with strict mode
- **OpenAPI Integration** - Auto-generated types from Backend APIs
- **Authentication** - JWT with refresh tokens (httpOnly cookies)
- **Pinia** - Type-safe state management
- **Tailwind CSS** - Utility-first styling
- **Nuxt UI** - Pre-built components

## Project Structure

```
app/
  ├── api/          # API client, repositories, types, errors
  ├── components/   # Vue components
  ├── layouts/      # Layout templates
  ├── pages/        # Route pages
  ├── stores/       # Pinia stores
  ├── middleware/   # Route middleware
  ├── plugins/      # Nuxt plugins
  └── utils/        # Utilities
```
