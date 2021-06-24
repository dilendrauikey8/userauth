const mongoose = require('mongoose');

const UserSchema=new mongoose.Schema(
  {
     username:{type:String,required:true,uniqe:true},
     password:{type:String,required:true}

  },
  {
     collection:'users'
  }
  );
  const model=mongoose.model('UserSchema',UserSchema);
  module.exports=model;