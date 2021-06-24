const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const bcrypt=require('bcryptjs');
const bodyParser=require('body-parser');
const User=require('./model/user');
const jwt = require('jsonwebtoken');
const app=express();
const dburl='mongodb+srv://raja:abc@123@cluster0.4qfd9.mongodb.net/users?retryWrites=true&w=majority';
mongoose.connect(dburl,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true});
app.use('/',express.static(path.join(__dirname,'static')));
app.use(bodyParser.json());//middleware to decode body;
app.post('/api/login',async (req,res)=>{
   const { username, password } = req.body;
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})
app.post('/api/register',async (req,res)=>{
   // console.log(req.body);

   const {username,password:plainTextPassword}=req.body;
     if(!username || typeof username!=='string'){
        return res.json({status:'error',error:'username is invalid'});
     }
     if(!plainTextPassword || typeof plainTextPassword!=='string'){
      return res.json({status:'error',error:'password is invalid'});
   }
   if(plainTextPassword.length<5){
      return res.json({status:'error',error:'password is too small'});  
   }
     const password = await bcrypt.hash(plainTextPassword,10);
     try{
        const response=User.create({
           username,
           password
        });
        console.log('user succefully created',response);

     }catch(error)
     {
        if(error.code===11000){
           return res.json({status:'error',error:'already in use'});
        }
        throw error

     }
        
     
   res.json({status:'ok'});
})
app.listen(3001,()=>{
   console.log("server is connected");
});