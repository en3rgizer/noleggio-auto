'use strict';

const Car = require('./car');
const db = require('./db');

const createCar = function (row) {
    return new Car(row.carID, row.brand, row.model, row.category);
}

/**
 * Function to get cars' brands
 */
exports.getBrands = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT distinct brand FROM CAR ORDER BY brand";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let brands = rows.map((row) => row.brand);
                resolve(brands);
            }
        });
    });
}

/**
 * Function to get cars' categories
 */
exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT distinct category FROM CAR ORDER BY category";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let categories = rows.map((row) => row.category);
                resolve(categories);
            }
        });
    });
}

/**
 * Function to get cars based on the filters set by the user
 * @param {*} filtCategories array with the filtered categories
 * @param {*} filtBrands array with the filtered brands
 */
exports.getCars = function(filtCategories, filtBrands) {
    return new Promise((resolve, reject) => {
        let newfiltBrands = [];
        let newfiltCategories = [];
        let newFilters = [];
        let sql = "SELECT * FROM CAR";
        let queryParams;

        let filters = filtCategories==undefined ? (filtBrands==undefined ? "" : filtBrands) : (filtBrands==undefined ? filtCategories : filtBrands+","+filtCategories);
        
        if(filters!="")
            newFilters = filters.split(',');

        if(filtCategories==undefined && filtBrands==undefined) {
            //Nothing to do
        }

        else if(filtCategories==undefined || filtBrands==undefined) {
            if(filtCategories==undefined){
                newfiltBrands = filtBrands.split(',');
                
                newfiltBrands.map((filtBrand,index) => {
                    if(index==0) {
                        queryParams = " WHERE brand = ?";
                    }
                    
                    if(index > 0 && index<newfiltBrands.length)
                        queryParams = " OR brand = ?";
        
                    sql += queryParams;
                });
            }
            else {
                newfiltCategories = filtCategories.split(',');
                newfiltCategories.map((filtCategory,index) => {
                    if(index==0) 
                        queryParams =  " WHERE (category = ?";
                    
                    if(index > 0 && index<newfiltCategories.length)
                        queryParams = " OR category = ?";
        
                        sql += queryParams;
                });

                sql += ")";
            }
        }

        else {
            newfiltBrands = filtBrands.split(',');
            newfiltCategories = filtCategories.split(',');
            newfiltBrands.map((filtBrand,index) => {
                if(index==0) 
                    queryParams = " WHERE (brand = ?";
                
                if(index > 0 && index<newfiltBrands.length)
                    queryParams = " OR brand = ?";
    
                    sql += queryParams;
            }); 
    
            sql += ") AND";
    
            newfiltCategories.map((filtCategory,index) => {
                if(index==0) 
                    queryParams = " (category = ?";
                
                if(index > 0 && index<newfiltCategories.length)
                    queryParams = " OR category = ?";
    
                    sql += queryParams;
            }); 

            sql += ")";
        }

        sql += " ORDER BY brand,model COLLATE NOCASE";

        db.all(sql, [...newFilters],(err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => createCar(row));
                resolve(cars);
            }
        });

    });
}


/**
 * Function to check the available cars on the days and category set by the user
 * @param {*} startDate booking start date
 * @param {*} endDate booking end date
 * @param {*} category car's category
 */
exports.checkCars = function (startDate, endDate, category) {
    return new Promise((resolve, reject) => {

        /*
        const sqlBad = `SELECT MAX(carID) as selectedCarID,
        (SELECT COUNT(*)
        FROM CAR C
        WHERE C.category=? AND C.carID NOT IN (  	SELECT R.carID
                                                    FROM RENTAL R
                                                    WHERE ? BETWEEN R.startDate AND R.endDate OR
                                                    ? BETWEEN R.startDate AND R.endDate OR
                                                    (R.startDate  BETWEEN ? AND ? OR
                                                    R.endDate BETWEEN ? AND ?)
                                                    )) as carsNumber,
                                                    (SELECT COUNT(*) FROM CAR C2 WHERE C2.category=?) as totalCarsNumber
        FROM CAR C2
        WHERE C2.category=? AND C2.carID NOT IN ( SELECT R.carID
                                                    FROM RENTAL R
                                                    WHERE ? BETWEEN R.startDate AND R.endDate OR
                                                    ? BETWEEN R.startDate AND R.endDate OR
                                                    (R.startDate  BETWEEN ? AND ? OR
                                                    R.endDate BETWEEN ? AND ?)
                                                )`*/
                                    
        const sql = `SELECT MAX(carID) as selectedCarID,
        (SELECT COUNT(*)
        FROM CAR C
        WHERE C.category=? AND C.carID NOT IN (  	SELECT R.carID
                                                    FROM RENTAL R
                                                    WHERE R.endDate >= ? AND R.startDate <= ?)) as carsNumber,
                                                    (SELECT COUNT(*) FROM CAR C2 WHERE C2.category=?) as totalCarsNumber
        FROM CAR C2
        WHERE C2.category=? AND C2.carID NOT IN ( SELECT R.carID
                                                    FROM RENTAL R
                                                    WHERE R.endDate >= ? AND R.startDate <= ?
                                                )`
        
        //db.all(sql, [category,startDate,endDate,startDate,endDate,startDate,endDate,category,category,startDate,endDate,startDate,endDate,startDate,endDate], (err, rows) => {

        db.all(sql, [category,startDate,endDate,category,category,startDate,endDate], (err, rows) => {
            if (err) {
                reject(err);
            }
            else{
                resolve({selectedCarID: rows[0].selectedCarID, carsNumber: rows[0].carsNumber, totalCarsNumber: rows[0].totalCarsNumber});
            }
        });
    });
  }

/**
 * Function to calculate rental price with the options set by the user
 * @param {*} category car's category
 * @param {*} addDrivers additional drivers
 * @param {*} age driver age
 * @param {*} nDays number of days of the booking
 * @param {*} extraIns extra insurance (true/false)
 * @param {*} kmPerDay kilometers per day (0,1,2)
 * @param {*} bNumber number of user's past booking
 * @param {*} numbers object containing the amount of cars available in the days/category set by the user and the total amount of cars of the same category
 */
  exports.calcPrice = function(category, addDrivers, age, nDays, extraIns, kmPerDay, bNumber, numbers){
    return new Promise((resolve,reject) => {
        let catPrice;
        if(category=='A') catPrice=80;
        else if(category=='B') catPrice=70;
        else if(category=='C') catPrice=60;
        else if(category=='D') catPrice=50;
        else catPrice=40;

        let totalPrice = catPrice * nDays;
        if(age<25)
            totalPrice = totalPrice * 1.05;
        else if(age>65)
            totalPrice = totalPrice * 1.1;

        if(addDrivers > 0)
            totalPrice = totalPrice * 1.15;

        if(extraIns)
            totalPrice = totalPrice * 1.2;

        if(kmPerDay==0)
            totalPrice = totalPrice * 0.95;
        else if(kmPerDay==1)
            totalPrice = totalPrice * 1;
        else
            totalPrice = totalPrice * 1.05;

        if(bNumber>3)
            totalPrice = totalPrice * 0.9;

        let percentage = (numbers.carsNumber/numbers.totalCarsNumber)*100;

        if(percentage < 10) 
            totalPrice = totalPrice * 1.1;        

        resolve(totalPrice.toFixed(2));
    })

}


