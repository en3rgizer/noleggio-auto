class User{    
    constructor(userID, email, hash) {
        if(userID)
            this.userID = userID;

        this.email = email;
        this.hash = hash;
    }
}

module.exports = User;
