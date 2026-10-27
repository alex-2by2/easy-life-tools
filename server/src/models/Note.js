import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},text:{type:String,required:true,trim:true,minlength:1,maxlength:3000}},{timestamps:true,versionKey:false});
schema.index({userId:1,createdAt:-1});export default mongoose.model('Note',schema);