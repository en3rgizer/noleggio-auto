'use strict';

const express = require('express');
const carDao = require('./car_dao');
const userDao = require('./user_dao');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const { check, validationResult } = require('express-validator');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const moment = require('moment');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 600; //seconds
// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

//create application
const app = express();
const PORT = 3001;

app.use(express.static('public'));

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

//GET /api/cars
//request body: empty
//response body: cars list
//error: 500 error
app.get('/api/cars', (req, res) => {
    carDao.getCars(req.query.categories, req.query.brands)
    .then((cars) => {
        res.json(cars);
    })
    .catch((err) => {
        res.status(500).json({
            errors: [{'msg': err}],
        });
    });
});

//GET /api/brands
//request body: empty
//response body: brands list
//error: 500 error
app.get('/api/brands', (req, res) => {
    carDao.getBrands()
    .then((brands) => {
        res.json(brands);
    })
    .catch((err) => {
        res.status(500).json({
            errors: [{'msg': err}],
        });
    });
});

//GET /api/categories
//request body: empty
//response body: categories list
//error: 500 error
app.get('/api/categories', (req, res) => {
    carDao.getCategories()
    .then((categories) => {
        res.json(categories);
    })
    .catch((err) => {
        res.status(500).json({
            errors: [{'msg': err}],
        });
    });
});

//POST /api/login
//request body: object containing user's credentials
//response body: { id: user.userID, email: user.email }
//errors: wrongPassword / wrongEmail / authErrorObj
app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userDao.getUser(email)
      .then((user) => {

        if(user === undefined) {
            res.status(404).json({
                errors: [{ 'param': 'Server', 'msg': 'e-mail non valida.' }] 
              });
        } else {
            userDao.checkPassword(user, password).then((result) => {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.userID }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({userID: user.userID, email: user.email});
            }).catch(
                (err) => {
                    res.status(401).json({
                        errors: [{ 'param': 'Server', 'msg': 'Password errata.' }] 
                      });
                }
            )
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
  });

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token
    })
  );

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
    }
  });

//GET /api/user
//request body: empty
//response body: { id: user.userID, email: user.email }
//error: authErrorObj
app.get('/api/user', (req,res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({userID: user.userID, email: user.email});
        }).catch(
        (err) => {
         res.status(401).json(authErrorObj);
        }
      );
});


//POST /api/checkPrice
//request body: object containing rental's informations
//response body: { carsNumber: numbers.carsNumber, price: price, selectedCarID: numbers.selectedCarID }
//errors: 422 error (formErrors) / authErrorObj
app.post('/api/checkPrice', 
        [
            check('startDate')
                .isDate().withMessage("'Giorno d'inizio' deve essere una data.")
                .custom(startDate => {
                    if(moment(startDate).isBefore(moment().format('YYYY-MM-DD'))) {
                        throw new Error("'Giorno d'Inizio' non può essere precedente alla data odierna.");
                    }
                    return true;
                }),
                /*.custom((startDate, { req }) => {
                    if(moment(startDate).isAfter(moment(req.body.endDate))) {
                        throw new Error("start date can't be after end date");
                    }
                    return true;
                }),*/
            check('endDate')
                .isDate().withMessage("'Giorno di fine' deve essere una data.")
                .custom(endDate => {
                    if(moment(endDate).isBefore(moment().format('YYYY-MM-DD'))) {
                        throw new Error("'Giorno di fine' non può essere precedente alla data odierna.");
                    }
                    return true;
                })
                .custom((endDate, { req }) => {
                    if(moment(endDate).isBefore(moment(req.body.startDate))) {
                        throw new Error("'Giorno di fine' non può precedere 'Giorno d'inizio'.");
                    }
                    return true;
                }),
            check('category')
                .isIn(["A","B","C","D","E"]).withMessage("'Categoria' non valida."),
            check('age')
                .isNumeric().withMessage("'Età guidatore' deve essere un valore numerico.")
                .isInt({gt: 17, lt: 101}).withMessage("'Età guidatore' non valida [18-100]."),
            check('addDrivers')
                .isNumeric().withMessage("'Guidatori addizionali' deve essere un valore numerico.")
                .isInt({gt: -1, lt: 6}).withMessage("'# guidatori addizionali' non valido [0-5]."),
            check('extraIns')
                .isBoolean().withMessage("'Assicurazione extra' può assumere solo uno dei seguenti valori: Vero o Falso."),
            check('kmPerDay')
                .isNumeric().withMessage("'Numero stimato di km da percorrere' non valido.")
                .isInt({gt: -1, lt: 3}).withMessage("'Numero stimato di km da percorrere' non valido."),
        ], (req, res) => {

    const formErrors = validationResult(req);
    if(!formErrors.isEmpty()) {
        return res.status(422).json({formErrors: formErrors.array()});
    }     

    const user = req.user && req.user.user;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const category = req.body.category;
    const age = req.body.age;
    const addDrivers = req.body.addDrivers;
    const extraIns = req.body.extraIns;
    const kmPerDay = req.body.kmPerDay;
    const today = moment().format('YYYY-MM-DD');
    let nDays = moment(endDate).diff(moment(startDate),'days');
    nDays++;
    
    userDao.getPastBookings(user,today).then((bNumber) => {
        carDao.checkCars(startDate, endDate, category)
        .then((numbers) => {
                carDao.calcPrice(category,addDrivers,age,nDays,extraIns,kmPerDay,bNumber,numbers)
                    .then((price) => {
                        res.json({carsNumber: numbers.carsNumber, price: price, selectedCarID: numbers.selectedCarID});
                    })
                    .catch(
                        (err) => res.status(401).json(authErrorObj)
                      );
            
        })
        .catch(
            (err) => res.status(401).json(authErrorObj)
          );
    })
    .catch(
        (err) => res.status(401).json(authErrorObj)
      );
    
});

//GET /api/bookings
//request body: empty
//response body: user's bookings list
//error: authErrorObj
app.get('/api/bookings', (req,res) => {
    const user = req.user && req.user.user;
    userDao.getBookings(user)
        .then((bookings) => {
            res.json(bookings);
        }).catch(
        (err) => {
         res.status(401).json(authErrorObj);
        }
      );
});

//POST /api/payment
//request body: object containing user's payment information
//response body: "OK"
//errors: 422 error (paymentErrors)
app.post('/api/payment',[
    check('name')
                .notEmpty()
                .custom(name => {
                    if(!/^[a-zA-Z ]+$/.test(name))
                        return false;
                    
                    return true;
                }),
    check('cardNumber')
                .isNumeric()
                .isLength({min: 16, max: 16}),
    check('cvv')
                .isNumeric()
                .isLength({min: 3, max: 4}),
    check('price')
                .notEmpty()
                .isNumeric(),
    check('expDateYear')
                .isInt({gt: parseInt(moment().format('YYYY'))-1})
                .isNumeric()
                .custom((expDateYear, { req }) => {
                    if(expDateYear==moment().format('YYYY')) {
                        let currentMonth = moment().format('MM');
                        if(req.body.expDateMonth < currentMonth) {
                            return false;
                        }
                    }
                    return true;
                }),
    
    ], (req,res) => {

    const user = req.user && req.user.user;
    const cardNumber = req.body.cardNumber;
    const name = req.body.name;
    const expDateMonth = req.body.expDateMonth;
    const expDateYear = req.body.expDateYear;
    const cvv = req.body.cvv;
    const price = req.body.price;

    const paymentErrors = validationResult(req);
    if(!paymentErrors.isEmpty()) {
        return res.status(422).json({msg: "Campi non validi."});
    }   

    res.status(201).json({msg: "OK"});
});


//POST /api/bookings
//request body: object containing user's booking information
//response body: rental ID
//errors: 500 error / authErrorObj
app.post('/api/bookings', (req,res) => {
    const user = req.user && req.user.user;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const selectedCarID = req.body.selectedCarID;
    const price = req.body.price;
    
    userDao.createBooking(user,selectedCarID,startDate,endDate,price)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
});

//DELETE /bookings/<rentalID>
//request parameters: rental ID
//response body: empty
//errors: 500 error / authErrorObj
app.delete('/api/bookings/:rentalID', (req,res) => {
    userDao.deleteBooking(req.params.rentalID)
        .then((result) => res.status(204).send())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});




app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));