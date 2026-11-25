const express=require('express');const jwt=require('jsonwebtoken');const session=require('express-session');const app=express();
app.use(express.json());
app.use('/customer',session({secret:process.env.SESSION_SECRET||'local-session-secret',resave:false,saveUninitialized:false}));
app.use('/customer/auth',(req,res,next)=>{try{const token=req.session.authorization?.token;req.user=jwt.verify(token,process.env.JWT_SECRET||'local-development-secret');next();}catch(e){res.status(401).json({message:'Please log in first'});}});
app.use('/customer',require('./router/auth_users').authenticated);
app.use('/',require('./router/general').general);
app.listen(5000,()=>console.log('Server is running'));