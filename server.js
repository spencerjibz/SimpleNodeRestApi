let path = require('path')
let express = require('express')
let helmet = require('helmet')
let cors = require('cors')
const config = require('./config')
let port = config.PORT;
let parser = require('body-parser')
let db = require('mongoose')
let logger = require('morgan')
let override = require('method-override')

const {log} = console
// app instance
const app = express()
// middleware section
app.use(parser.json())
app.use(parser.urlencoded({extended:true}))
app.use(cors())
app.use(helmet())
app.use(logger('dev'))
// import router
let router = require('./api/routes')
app.use('/api',router)
app.use(override())
// error handling
app.use(function(err,req,res,next){
    if(err) { res.status(err.status||500)
    res.json({
       message: " opps something wrong , contact the administer"
    })
    log(err)
}
next()
})
// Globar variables
app.use(function(req,res,next){
    res.locals.user = req.user||null

    next()
})
// attach the user property to the app
app.use(function(req,res,next){
    req.user = ''
    log(req.user)
    next()
})
// init app
app.listen(port,()=>{
    log(`app started at ${config.URL}`)
    db.set({UseCreateIndexes:true})
   db.connect(config.MONGODB_URI,{useNewUrlParser:true}).then(()=>{
   let User = require('./lib/User-model')
       log('database started successfully')
    })
   .catch(e=> log(e))

})
//
