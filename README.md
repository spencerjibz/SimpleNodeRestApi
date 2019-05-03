## SIMPLE NODEJS REST API
A BASIC NODEJS REST API BUILT USING EXPRESS, MONGODB AND JWT
### Requirements
+ Nodejs
+ git 
+ Mongodb
+ cmd, powershell, Terminal or bash
+ POSTMAN or any other HTTPclient to test the API
### Features
- JWT Authentication
- CRUD operations // all the passwords of the created users are hashed for mongoDB
- User-based restapi(ideal for React backend) and other uses
- Extendable
### Routes
+ **GET http://hostname:port/api/** > index message from the api
+ **POST http://hostname:port/api/create** > create a new user (requires a requestbody ie = {name:'name of user',username:'',password:''}
+ **POST http://hostname:port/api/login** > logins a user (requires a reqBody similar to first one) and it returns the jwt token of user
+ **POST http://hostname:port/api/post** > returns the user's information (requires an authorization Header with the bearer <space> token)
+ **POST http://hostname:port/api/users** >  this is an admin route that returns all the users(requires an authorization Header mentioned above)  
+ **POST http://hostname:port/api/deleteone** > deletes a user's account from the database (requires a reqBody with {email:''}
+ **POST http://hostname:port/api/changeinfo** > Updates a user's information except the password and username  (requires a reqBody ) and  the authorization header
+ **POST http://hostname:port/api/pass_reset/:token** >  changes a user's password only (requires the token as request.param)
 ### Usage

 **For copy of the app**
 
 - clone the repo or download zipped folder
 
  ``` git clone https://github.com/spencerjibz/SimpleNodeRestApi.git && cd SimpleNodeRestApi && npm install ```
- Edit the config.js file , add  the mongodb uri and admin name Or array of authorized users
```
config.js

module.exports = {
    ENV:process.env.NODE_ENV||'development',
    PORT:process.env.PORT||5000,
    URL:process.env.BASE_URL||'http://localhost:5000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapi',
    TOKEN_SEC:process.env.TOKEN_SEC||'secretKey',
    ADMIN_NAME:''//['an array of authorized users']
    /*
    ADD AS MUCH CONFIG PROPS AS YOU LIKE FOR YOUR APP, 

    
    */
}


```
 + >> Start the App using command below and check it out at [http://localhost:5000](http://localhost:5000)
 
 ``` npm start ```
 
 **By default: the hostname is localhost and port is 5000**
 + To use the Api, use an HTTP client like POSTMAN,jquery's ajax calls or fetchApi
