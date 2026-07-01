# API Plan — Shreeji Art

## Base URL

- Development: `http://localhost:8080/api/v1`
- Production: `https://shreeji-art-api.railway.app/api/v1`

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt-token>
```

## Standard Response Envelope

```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

Error response:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": { "field": "error message" }
}
```

---

## Endpoints

### Auth

| Method | Endpoint               | Access  | Description              |
|--------|------------------------|---------|--------------------------|
| POST   | /auth/register         | Public  | Register new customer     |
| POST   | /auth/login            | Public  | Login, returns JWT        |
| GET    | /auth/me               | Auth    | Get current user info     |
| POST   | /auth/refresh          | Auth    | Refresh JWT token         |

**POST /auth/register**
```json
{
  "firstName": "Raj",
  "lastName": "Patel",
  "email": "raj@example.com",
  "phone": "9876543210",
  "password": "securePassword123"
}
```

**POST /auth/login**
```json
{
  "email": "raj@example.com",
  "password": "securePassword123"
}
```
Response:
```json
{
  "token": "eyJhbGci...",
  "tokenType": "Bearer",
  "user": { "id": 1, "email": "...", "role": "ROLE_CUSTOMER" }
}
```

---

### Users

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /users                 | ROLE_ADMIN   | List all users            |
| GET    | /users/{id}            | ROLE_ADMIN   | Get user by ID            |
| PUT    | /users/{id}            | ROLE_ADMIN   | Update user               |
| DELETE | /users/{id}            | ROLE_ADMIN   | Deactivate user           |

---

### Customers

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /customers             | ROLE_ADMIN   | List all customers        |
| GET    | /customers/{id}        | ROLE_ADMIN   | Get customer details      |
| PUT    | /customers/profile     | ROLE_CUSTOMER| Update own profile        |
| GET    | /customers/profile     | ROLE_CUSTOMER| Get own profile           |

---

### Leads

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| POST   | /leads                 | Public       | Submit quote request form |
| GET    | /leads                 | ROLE_ADMIN   | List all leads            |
| GET    | /leads/{id}            | ROLE_ADMIN   | Get lead detail           |
| PUT    | /leads/{id}            | ROLE_ADMIN   | Update lead status        |
| DELETE | /leads/{id}            | ROLE_ADMIN   | Delete lead               |

---

### Quotes

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| POST   | /quotes                | ROLE_ADMIN   | Create quote              |
| GET    | /quotes                | ROLE_ADMIN   | List all quotes           |
| GET    | /quotes/{id}           | Auth         | Get quote detail          |
| PUT    | /quotes/{id}           | ROLE_ADMIN   | Update quote              |
| DELETE | /quotes/{id}           | ROLE_ADMIN   | Delete quote              |
| GET    | /quotes/my             | ROLE_CUSTOMER| Customer's own quotes     |

---

### Projects

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| POST   | /projects              | ROLE_ADMIN   | Create project            |
| GET    | /projects              | ROLE_ADMIN   | List all projects         |
| GET    | /projects/{id}         | Auth         | Get project detail        |
| PUT    | /projects/{id}         | ROLE_ADMIN   | Update project status     |
| GET    | /projects/my           | ROLE_CUSTOMER| Customer's own projects   |

---

### Services

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /services              | Public       | List all active services  |
| GET    | /services/{slug}       | Public       | Get service detail        |
| POST   | /services              | ROLE_ADMIN   | Create service            |
| PUT    | /services/{id}         | ROLE_ADMIN   | Update service            |
| DELETE | /services/{id}         | ROLE_ADMIN   | Delete service            |

---

### Gallery

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /gallery               | Public       | List gallery items        |
| GET    | /gallery?category=X    | Public       | Filter by category        |
| POST   | /gallery               | ROLE_ADMIN   | Add gallery item          |
| PUT    | /gallery/{id}          | ROLE_ADMIN   | Update gallery item       |
| DELETE | /gallery/{id}          | ROLE_ADMIN   | Delete gallery item       |

---

### Portfolio

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /portfolio             | Public       | List portfolio items      |
| GET    | /portfolio/{slug}      | Public       | Get portfolio item detail |
| POST   | /portfolio             | ROLE_ADMIN   | Create portfolio item     |
| PUT    | /portfolio/{id}        | ROLE_ADMIN   | Update portfolio item     |
| DELETE | /portfolio/{id}        | ROLE_ADMIN   | Delete portfolio item     |

---

### Blog

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /blogs                 | Public       | List published posts      |
| GET    | /blogs/{slug}          | Public       | Get blog post detail      |
| POST   | /blogs                 | ROLE_ADMIN   | Create blog post          |
| PUT    | /blogs/{id}            | ROLE_ADMIN   | Update blog post          |
| DELETE | /blogs/{id}            | ROLE_ADMIN   | Delete blog post          |

---

### Contact

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| POST   | /contact               | Public       | Submit contact form       |
| GET    | /contact               | ROLE_ADMIN   | List contact requests     |
| PUT    | /contact/{id}/status   | ROLE_ADMIN   | Mark resolved/pending     |

---

### Testimonials

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /testimonials          | Public       | List approved testimonials|
| POST   | /testimonials          | ROLE_ADMIN   | Create testimonial        |
| PUT    | /testimonials/{id}     | ROLE_ADMIN   | Update / approve          |
| DELETE | /testimonials/{id}     | ROLE_ADMIN   | Delete testimonial        |

---

### Settings

| Method | Endpoint               | Access       | Description               |
|--------|------------------------|--------------|---------------------------|
| GET    | /settings              | Public       | Get public site settings  |
| PUT    | /settings              | ROLE_ADMIN   | Update settings (batch)   |

---

## HTTP Status Codes

| Code | Meaning                          |
|------|----------------------------------|
| 200  | OK                               |
| 201  | Created                          |
| 400  | Bad Request / Validation Error   |
| 401  | Unauthorized (no/invalid token)  |
| 403  | Forbidden (insufficient role)    |
| 404  | Not Found                        |
| 500  | Internal Server Error            |
