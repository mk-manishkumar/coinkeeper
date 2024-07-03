# CoinKeeper

CoinKeeper is an expense-tracking web application designed to help you keep track of your finances. With CoinTracker, you can easily monitor your expenses, categorize them, and gain insights into your spending habits.

# Deployment

This web application is live. [Click here](https://coinkeeper-ngmb.onrender.com/)


## Features

- User registration and login
- Add, view, and delete expenses
- View total expenses by category (Savings, Expenditure, Investment)

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- EJS (Embedded JavaScript templates)
- Bootstrap (for styling)
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)

## Prerequisites

- Node.js and npm installed
- MongoDB installed and running
- Environment variables set up

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
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongo_connection_string
PORT = your_port
SECRET_KEY = your_secret_key
```

4. Run the application:
  
```
npm start
````

> The application will be available at `http://localhost:your_port.`


## Usage

### Register

1. Navigate to http://localhost:your_port/register.
2. Fill out the registration form and submit.

### Login
1. Navigate to http://localhost:your_port.
2. Fill out the login form and submit.
   
### Profile
1. After logging in, you will be redirected to the profile page.
2. Add expenses by selecting the expense type, entering a description, and amount.
3. View your total expenses by category.
4. Clear all expenses using the "Clear All" (`x`) button.
   
### Logout

1. Click the` Log Out` button to log out of your account.

## Project Structure

```
├── public
│   ├── script.js
│   └── style.css
├── controllers
│   └── controller.js
├── views
│   ├── index.ejs
│   ├── login.ejs
│   └── register.ejs
├── .env
├── .gitignore
├── README.md
├── package.json
├── server.js
├── utils
│   └── utils.js
├── middlewares
│   └── middleware.js
└── models
    ├── amount.model.js
    └── user.model.js
```

- **public**: Contains static assets such as CSS and JavaScript files.
- **controllers**: Contains the route handlers for the application.
- **views**: Contains the EJS templates for rendering HTML.
- **utils**: Contains utility functions used throughout the application.
- **middlewares**: Contains middleware functions such as authentication.
- **models**: Contains Mongoose models for interacting with the MongoDB database.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT [License](https://github.com/mk-manishkumar/coinkeeper/blob/main/LICENSE). See the LICENSE file for details.