# API Routes Documentation

## Overview
This document lists all available API routes in the Social Circle API.

---

## Base Routes
base_url/api/....
### App Controller

#### GET /
- **Description**: Returns a welcome message
- **Controller**: `AppController`
- **Method**: `getHello()`
- **Response**: `string`
- **Example Response**: `"Social Circle App By Sohrab"`

---

## Authentication Routes
*Coming soon*

---

## User Routes
*Coming soon*

---

## Post Routes
*Coming soon*

---

## Comment Routes
*Coming soon*

---

## Database Routes
*Coming soon*

---

## Notes
- All routes use MongoDB as the database
- Environment configuration is loaded from `.env` file
- MongoDB connection is established via `MongooseModule` in `app.module.ts`
