import Car from './Car';
import Brand from './Brand';
import Category from './Category';
import Booking from './Booking';
const baseURL = "/api";


/**
 * call REST API: GET '/api/user'
 */
async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

/**
 * call REST API: GET '/api/categories'
 */
async function getCategories() {
    let url = "/categories";
    
    const response = await fetch(baseURL + url);
    const catsJson = await response.json();
    if(response.ok){
        return catsJson.map((c,index) => {
                                            return new Category("c" + index, c, false);
                                        });
    } else {
        let err = {status: response.status, errObj:catsJson};
        throw err;  // An object with the error coming from the server
    }
}

/**
 * call REST API: GET '/api/brands'
 */
async function getBrands() {
    let url = "/brands";
    
    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
    if(response.ok){
        return brandsJson.map((b,index) => {
                                        return new Brand("b" + index, b, false);
                                    });
    } else {
        let err = {status: response.status, errObj:brandsJson};
        throw err;  // An object with the error coming from the server
    }
}


/**
 * call REST API: GET '/api/cars'
 */
async function getCars(filtBrands,filtCategories) {
    let url = "/cars";
    let queryParams = "";

    if(filtBrands===undefined && filtCategories===undefined){
        //Nothing to do
    }

    else if(filtBrands.length>0 && filtCategories.length===0){
        filtBrands.forEach((filtBrand,index) => {
            if(index===0) 
                queryParams = "?brands=" + filtBrand;
            
            if(index > 0 && index<filtBrands.length)
                queryParams = "," + filtBrand;

                url += queryParams;
        });
    } 

    else if(filtBrands.length===0 && filtCategories.length>0){
        filtCategories.forEach((filtCategory,index) => {
            if(index===0) 
                queryParams = "?categories=" + filtCategory;
            
            if(index > 0 && index<filtCategories.length)
                queryParams = "," + filtCategory;

                url += queryParams;
        }); 
    } 

    else if(filtBrands.length>0 && filtCategories.length>0){
        filtBrands.forEach((filtBrand,index) => {
            if(index===0) 
                queryParams = "?brands=" + filtBrand;
            
            if(index > 0 && index<filtBrands.length)
                queryParams = "," + filtBrand;

                url += queryParams;
        }); 

        url += "&";

        filtCategories.forEach((filtCategory,index) => {
            if(index===0) 
                queryParams = "categories=" + filtCategory;
            
            if(index > 0 && index<filtCategories.length)
                queryParams = "," + filtCategory;

                url += queryParams;
        }); 
    }
    

    const response = await fetch(baseURL + url);
    const carsJson = await response.json();
    if(response.ok){
        return carsJson.map((c) => {
                                        return new Car(c.carID, c.brand, c.model, c.category);
                                    });
    } else {
        let err = {status: response.status, errObj:carsJson};
        throw err;  // An object with the error coming from the server
    }
}


/**
 * call REST API: POST '/api/login'
 */
async function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


/**
 * call REST API: POST '/api/logout'
 */
async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

/**
 * call REST API: POST '/api/checkPrice'
 */
async function checkPrice(startDate, endDate, category, age, addDrivers, extraIns, kmPerDay) {
    const response = await fetch(baseURL + '/checkPrice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({startDate: startDate, endDate: endDate, category: category, age: age, addDrivers: addDrivers, extraIns: extraIns, kmPerDay: kmPerDay}),
        });
        const objJson = await response.json();
        if(response.ok){
            return objJson;

        } else {
            let err = {};
            if(response.status === 422)
                err = {status: response.status, formErrors:objJson.formErrors};
            else
                err = {status: response.status, errObj:objJson};
            throw err;  // An object with the error coming from the server
        }
}


/**
 * call REST API: GET '/api/bookings'
 */
async function getBookings() {
    let url = "/bookings";
    
    const response = await fetch(baseURL + url);
    const bookingsJson = await response.json();
    if(response.ok){
        return bookingsJson.map((b) => {
                                        return new Booking(b.rentalID,b.brand,b.model,b.category,b.startDate,b.endDate,b.price);
                                    });
    } else {
        let err = {status: response.status, errObj:bookingsJson};
        throw err;  // An object with the error coming from the server
    }
}


/**
 * call REST API: POST '/api/payment'
 */
async function makePayment(cardNumber, name, expDateMonth, expDateYear, cvv, price) {
    const response = await fetch(baseURL + '/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({cardNumber: cardNumber, name: name, expDateMonth: expDateMonth, expDateYear: expDateYear, cvv: cvv, price: price}),
        });
        const payJson = await response.json();
        if(response.ok){
            return payJson;

        } else {
            let err = {status: response.status, errMsg:payJson.msg};
            throw err;  // An object with the error coming from the server
        }
}

/**
 * call REST API: POST '/api/bookings'
 */
async function addBooking(selectedCarID, startDate, endDate, price) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/bookings", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({selectedCarID: selectedCarID, startDate: startDate, endDate: endDate, price: price}),
        }).then( (response) => {
            if(response.ok) {
                response.json().then((id) => {
                    resolve(id);
                });
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

/**
 * call REST API: DELETE '/api/bookings/rentalID'
 */
async function deleteBooking(rentalID) {
    const response = await fetch(baseURL + "/bookings/" + rentalID, {
            method: 'DELETE'
        });
        if(response.ok){
            return null;

        } else {
            const delJson = await response.json();
            let err = {status: response.status, errMsg:delJson.msg};
            throw err;  // An object with the error coming from the server
        }
}



const API = { isAuthenticated, getCars, getBrands, getCategories, userLogin, userLogout, checkPrice, getBookings, makePayment, addBooking, deleteBooking} ;
export default API;
