'use strict';

const User = require('./user');
const Booking = require('./booking');
const db = require('./db');
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */
const createUser = function (row) {
    const userID = row.userID;
    const email = row.email;
    const hash = row.password;
    
    return new User(userID, email, hash);
}

/**
 * Function to create a Booking object from a row of the cars and rentals tables
 * @param {*} row a row of the cars and rentals tables
 */
const createBooking = function (row) {
    const rentalID = row.rentalID;
    const brand = row.brand;
    const model = row.model;
    const category = row.category;
    const startDate = row.startDate;
    const endDate = row.endDate;
    const price = row.price;

    return new Booking(rentalID, brand, model, category, startDate, endDate, price);
}

/**
 * Function to get user by his email
 * @param {*} email user's email
 */
exports.getUser = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM USER WHERE email = ?"
        db.all(sql, [email], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
  };

/**
 * Function to get user by his id
 * @param {*} id user's id
 */
exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM USER WHERE userID = ?"
        db.all(sql, [id], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
  };

  
  const testPsw = function(password) {
    bcrypt.hash(password,10, (err, hash)=>console.log(hash));
  }


/**
 * Function to check if the user's password is correct
 * @param {*} user user's object
 * @param {*} password password typed by the user
 */
exports.checkPassword = function(user, password){
    //testPsw(password);
    return new Promise((resolve,reject) => {
        bcrypt.compare(password, user.hash, function(err, result) {
            if(err) 
                return reject(err);
            
            if(result == false) return reject("Auth failed");
            resolve(result);
        });
    })

}


/**
 * Function to get bookings' user by his id
 * @param {*} id user's id
 */
exports.getBookings = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT R.rentalID,C.brand,C.model,C.category,R.startDate,R.endDate,R.price FROM CAR C, RENTAL R WHERE C.carID=R.carID AND R.userID = ?"
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else if (rows.length === 0) {
                resolve(rows);
            }
            else{
                let bookings = rows.map((row) => createBooking(row));
                resolve(bookings);
            }
        });
    });
  };

/**
 * Function to get the amount of past bookings of the user through his ID
 * @param {*} id user's id
 * @param {*} today today date YYYY-MM-DD
 */
  exports.getPastBookings = function (id,today) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) as counter FROM RENTAL R WHERE R.userID = ? AND R.endDate < ?"
        db.all(sql, [id,today], (err, rows) => {
            if (err) {
                reject(err);
            }
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const bookingsNumber = rows[0].counter;
                resolve(bookingsNumber);
            }
        });
    });
  };


/**
 * Function to create a booking
 * @param {*} user user's id
 * @param {*} selectedCarID booking selected id car
 * @param {*} startDate booking start date
 * @param {*} endDate booking end date
 * @param {*} price booking's price
 */
  exports.createBooking = function(user,selectedCarID,startDate,endDate,price) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RENTAL(userID, carID, startDate, endDate, price) VALUES(?,?,?,?,?)';
        db.run(sql, [user, selectedCarID, startDate, endDate, price], function (err) {
            if(err){
                reject(err);
            }
            else{
                resolve(this.lastID);
            }
        });
    });
}


/**
 * Function to delete a booking with a given id
 * @param {*} id booking's id
 */
exports.deleteBooking = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RENTAL WHERE rentalID = ?';
        db.run(sql, [id], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}