# CoinKeeper

CoinKeeper is an expense-tracking web application designed to help you keep track of your finances. With CoinKeeper, you can easily monitor your expenses, categorize them, and gain insights into your spending habits.

# Deployment

This web application is live. [Click here](https://coinkeeper-ngmb.onrender.com/)


## Features

- User registration and login with secure authentication
- Add, view, and delete expenses
- Categorize expenses into Savings, Expenditure, and Investment
- View total expenses by category for better financial insights

## Technologies Used

- `Node.js`: Backend runtime environment
- `Express.js`: Web framework for routing and middleware
- `MongoDB (with Mongoose)`: NoSQL database for storing user and expense data
- `EJS`: Embedded JavaScript templates for rendering dynamic views
- `Bootstrap`: Frontend framework for responsive design
- `bcrypt`: Library for secure password hashing
- `jsonwebtoken`: JWT-based authentication for sessions
- `node-cron`: Scheduler for automated tasks like deleting inactive users
- `connect-flash`: Middleware for displaying temporary flash messages (e.g., success or error notifications)

## Prerequisites

- Node.js and npm installed
- MongoDB installed and running
- Set up environment variables

## Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/coinkeeper.git
```

```
cd coinkeeper
```
2. Install dependencies:
   
```
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```
JWT_SECRET=""
MONGODB_URI=""
PORT=""
SESSION_SECRET_KEY=""
GUEST_JWT_SECRET=""


```

4. Run the application:
  
```
npm start
````

> The application will be available at `http://localhost:your_port.`


## Usage

### Register

1. Navigate to http://localhost:your_port.
2. Fill out the registration form and submit.

### Login
1. Navigate to http://localhost:your_port/login.
2. Fill out the login form and submit.
   
### Profile
1. After logging in, you will be redirected to your profile page.
2. Add expenses by selecting the expense type, entering a description, and amount.
3. View your total expenses by category.
4. Clear all expenses using the "Clear All" (`x`) button.
   
### Logout

- Click the` Log Out` button to log out of your account.

### Delete Account

- Click the` Delete Account` button to delete your account permanently. Deleting your account will remove all your data, including expenses, permanently from the system.
- 

## Project Structure

```
├── config
│   └── db.js
├── controllers
│   ├── authController.js
│   └── profileController.js
├── middlewares
│   └── middleware.js
├── models
│   ├── Amount.model.js
│   ├── Guest.model.js
│   └── User.model.js
├── public
│   ├── javascript
│   │   └── script.js
│   └── stylesheet
│       └── style.css
├── routes
│   ├── authRoutes.js
│   └── profileRoutes.js
├── utils
│   ├── passwordBcrypt.js
│   ├── utils.js
│   └── zodValidation.js
├── views
│   ├── 404.ejs
│   ├── error.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── register.ejs
├── .env
├── .env.sample
├── .gitignore
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
└── server.js

```

- **config**: Contains the database connection setup.
- **public**: Contains static assets such as CSS and JavaScript files.
- **controllers**: Contains the route handlers for the application.
- **views**: Contains the EJS templates for rendering HTML.
- **utils**: Contains utility functions used throughout the application, such as password hashing and validation.
- **middlewares**: Contains middleware functions such as authentication.
- **models**: Contains Mongoose models for interacting with the MongoDB database, including User, Guest, and Amount models.
- **routes**: Contains route definitions for authentication and profile-related actions.


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT [License](https://github.com/mk-manishkumar/coinkeeper/blob/main/LICENSE). See the LICENSE file for details.