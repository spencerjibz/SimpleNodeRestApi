let express = require('express')
let path = require('path')
let jwt = require('jsonwebtoken')
let User = require('../lib/User-model')
let config = require('../config')
let authCheck = require('./api-auth.js')

const {log} = console
// intial router instance
let router = express.Router()
//export our router
module.exports = router 
// routes
router.get('/',(req,res)=>{
   res.json({ message:'welcome to my Api'})
})
// route that create and get token 
router.post('/login',(req,res)=>{
    let test = Object.keys(req.body).length > 0
    log(test)
    if(test==true){
 
        
 let  username= req.body.email
 let {password}= req.body

 User.loginUser(username,password,(err,user)=>{
     if(err) {
         res.json({status:404,message:'Not Found'})
         log(err)
     }
     else{
         
         jwt.sign({user},config.TOKEN_SEC,{expiresIn:'1h'},(err,token)=>{
            if(err){
                log(err)
            }
            res.json({
                 token
             })
             req.user = user
             log(res.locals.user)
         })
     }
 }) 
}
else{
    res.json({
        code:404,
        error:{
            message:'NO named resource requested'
        }
    })
}
})
// using token 
router.post('/post',authCheck,(req,res)=>{
jwt.verify(req.token,config.TOKEN_SEC,(err,authdata)=>{
    if(err){
        res.sendStatus(404) 
        log(err)
        
    }
    else{
        User.getUserByUsername(authdata.user.username,(err,user)=>{

     err? res.sendStatus(404):
     delete user._doc.password
     delete user._doc.__v
     res.json({user})
           

        })
    
    }
})
})
// route that create a user 

router.post('/create',(req,res)=>{
      let test = Object.keys(req.body).length > 0
      if(test){
        let {name,password} = req.body
        let username = req.body.email
        let newUser = {name,username,password}
        User.createUser(newUser,function(err,user){
            if(err){
            res.json({code:404,message:`failed to create new user because the user already exists`})
            }
            else {
                res.json({message:'Acount created, you can now login '})
              
            }
        })
      }
})
// route to  fetch all the users from data 
router.post('/users',authCheck,(req,res)=>{
    jwt.verify(req.token,config.TOKEN_SEC,function(err,data){
        if(err) {
            res.sendStatus(401)
        }
        else {
            let test = new RegExp(config.ADMIN_NAME).test(data.user.username)
             log(config.ADMIN_NAME)
            // make sure the config.admin_name contains a name in the username (email) of the admin
     test ==true?
 User.collectedinfo(function(err,users){
     if(err){
         res.json({code:404,message:'opps, contact the administer'})
     }
     else{
         res.json(users.map(v=>{
             delete v._doc.password
             delete v._doc.__v
             return v._doc
         }))
     }
 }):res.json({message:'you are not an admin'})
}
})
})
// route to delete the username from the database 
router.post('/deleteone',(req,res)=>{
    log(req.token)
  User.deleteUser(req.body.email,(err,isdone)=>{
      if(err) {
          log(err)
      }
      if(isdone){
   res.json({message:'account deleted successfully'})
      }
      else{
          res.json({code:404,message:' Failed to delete account, username is incorrect'})
      }
  })
     
}) 
// router to Change any specific property of the user  except the password,username and anyunavailable properities

router.post('/changeinfo',authCheck,(req,res)=>{
    let username = req.body.email
//  makes this function change other values except the password, username or email
 let changable = Object.entries(req.body).filter(v=>{
     // get an array that contain only specific values(only including the specified values)
if(!v.includes('email')&&!v.includes('password')&&v!==undefined&&v!==null&&!v.includes('username')){
    return v
}


 }) 

// extract the desired attributes
  let query_name = changable[0][0]
  let query_value = changable[0][1]
  let filter = {[query_name]:[query_value]}
  // the function makes sure, a user can change only properties that exist in the database
  User.getUserByUsername(username,(err,info)=>{
    
      let test = Object.keys(info._doc).includes(query_name)
     //log(test)
     test!==true?res.json({err:` a ${query_name} property doesn't exist for the user   `}):
    User.findOneAndUpdate({
        username
    }, filter, (err, updated) => {
        err ? res.json({
                err: `failed to change your ${query_name}`
            }) :
            res.json({
                message: ` your ${query_name} was successfully changed  to ${updated[query_name]}`
            })
    })
        
})
  })

 

// route the reset the  users password (this is protected)
router.post('/pass_reset/:token',(req,res)=>{
    let {password} = req.body
   // log(req.params.token)
jwt.verify(req.params.token,config.TOKEN_SEC,(err,data)=>{
 if(err){
res.sendStatus(401)

 }
 else {
     User.changedinfo(data.user.username,password,(err,isdone)=>{
         if(err){
        res.json({message:'password enter the right password'})
         }
         else {
           
             res.json({
             message:`Hey ${isdone.name}, you have managed to reset your password, you can now login `
             })
         }
     })
 
 }
})
    


})