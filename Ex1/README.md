## Setup Instructions

### Install Dependencies

Run the following command to install Sequelize and MySQL2:

```sh
npm install sequelize mysql2
```

### Setup XAMPP on macOS

1. Download and install XAMPP from [Apache Friends](https://www.apachefriends.org/index.html).
2. Start the Apache and MySQL services from the XAMPP control panel.
3. Open phpMyAdmin by navigating to `http://localhost/phpmyadmin` in your web browser.
4. Create a new database for your project.

### Configure Sequelize

Update the Sequelize initialization in your `ex2.js` file to use the MySQL database:

```javascript
const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});
```

Replace `'database_name'`, `'username'`, and `'password'` with your MySQL database name, username, and password respectively.

### Run the Application

Start your application by running:

```sh
node ex2.js
```

Your server should now be running on `http://localhost:3000`.
