module.exports = {
    ENV:process.env.NODE_ENV||'development',
    PORT:process.env.PORT||5000,
    URL:process.env.BASE_URL||'http://localhost:5000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapi',
    TOKEN_SEC:process.env.TOKEN_SEC||'secretKey',
    ADMIN_NAME:''//['an array of authorized users']
    /*
    ADD AS MUCH CONFIG PROPS AS YOU LIKE FProOR YOUR APP, 

    
    */
}