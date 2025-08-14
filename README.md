# CoinKeeper

**CoinKeeper** is a full-stack MERN application for personal finance management. Users can register, log in, track expenses, manage savings, and visualize their financial data. The project is split into a React + TypeScript frontend and a Node.js + Express + MongoDB backend.

---

## Deployed Link

Both frontend & backend are deployed on Vercel. For live project, [Click here](https://coinkeeper-mk.vercel.app)

----

## Table of Contents

- [CoinKeeper](#coinkeeper)
  - [Deployed Link](#deployed-link)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Frontend (`frontend/`)](#frontend-frontend)
  - [Backend (`backend/`)](#backend-backend)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
      - [Backend](#backend)
      - [Frontend](#frontend)
    - [Installation](#installation)
      - [Backend](#backend-1)
      - [Frontend](#frontend-1)
    - [Running Locally](#running-locally)
      - [1. Start MongoDB](#1-start-mongodb)
      - [2. Start Backend](#2-start-backend)
      - [3. Start Frontend](#3-start-frontend)
  - [Deployment](#deployment)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Profile \& Expenses](#profile--expenses)
  - [Scripts](#scripts)
    - [Backend](#backend-2)
    - [Frontend](#frontend-2)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

---

## Features

- User authentication (register, login, logout)
- JWT-based session management
- Add, view, and delete expenses
- Categorize expenses (Savings, Expenditure, Investment)
- Expense statistics and visualization
- Responsive UI with React and Tailwind CSS
- Secure password hashing and validation
- Modular, scalable codebase
- **shadcn/ui** – For prebuilt, accessible, and customizable UI components.

---

## Tech Stack

* **Frontend:** React, TypeScript, Vite, Redux Toolkit, Axios, shadcn/ui
* **Backend:** Node.js, Express, MongoDB, Mongoose
* **Authentication:** JWT, bcrypt
* **Validation:** Zod
* **Deployment:** Vercel (config included)

---

## Project Structure

## Frontend (`frontend/`)

- `public/` — Static assets  
- `src/`  
  - `components/` — React components  
  - `lib/` — Utility functions  
  - `pages/` — Page components  
  - `services/` — API services  
  - `store/` — Redux store & slices  
- Static files: `vite.config.ts`, `.env.sample`  

---

## Backend (`backend/`)

- `config/` — Database config  
- `controllers/` — Route controllers  
- `middlewares/` — Express middlewares  
- `models/` — Mongoose models  
- `routes/` — API routes  
- `utils/` — Utility functions  
- Static files: `server.js`, `.env.sample`


---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or yarn
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Environment Variables

#### Backend
Copy `.env.sample` to `.env` in the `backend` folder and fill in your values:

```bash
cp backend/.env.sample backend/.env
```

- PORT=3005
- MONGODB_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- GUEST_JWT_SECRET=your_guest_jwt_secret
- NODE_ENV=development
- ALLOWED_ORIGINS=http://localhost:5173,

#### Frontend

Copy `.env.sample` to `.env` in the frontend folder and fill in your values:

```
cp frontend/.env.sample frontend/.env
```

- VITE_BACKEND_API=http://localhost:3005
- VITE_NODE_ENV=development





### Installation

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### Running Locally

#### 1. Start MongoDB

Make sure MongoDB is running locally or update your `.env` with your Atlas URI.

#### 2. Start Backend

```bash
cd backend
npm start
```

#### 3. Start Frontend

```bash
cd frontend
npm run dev
```

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:3005](http://localhost:3005)


----

## Deployment

- Both frontend and backend include `vercel.json` for deployment on [Vercel](https://vercel.com/).
- Set environment variables in your Vercel dashboard for both projects.
- For production, ensure CORS and secure cookie settings are properly configured.

---

## API Endpoints

### Auth
- `POST /api/v1/auth/register` — Register new user  
- `POST /api/v1/auth/login` — Login user  
- `GET /api/v1/auth/check-auth` — Check if user is authenticated  
- `POST /api/v1/auth/logout` — Logout user  

### Profile & Expenses
- `GET /api/v1/profile/:username` — Get user profile and expenses  
- `POST /api/v1/profile/addamount` — Add new expense  
- `DELETE /api/v1/profile/deleteexpense/:id` — Delete expense by ID  
- `DELETE /api/v1/profile/deleteallexpenses` — Delete all expenses  
- `DELETE /api/v1/profile/deleteaccount` — Delete user account  

---

## Scripts

### Backend
- `npm start` — Start server  
- `npm run dev` — Start server with nodemon  

### Frontend
- `npm run dev` — Start Vite dev server  
- `npm run build` — Build for production  
- `npm run preview` — Preview production build  

---

## Contributing

1. Fork the repo  
2. Create your feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request  

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or collaboration, reach out to me on [Twitter/x](https://x.com/_manishmk)