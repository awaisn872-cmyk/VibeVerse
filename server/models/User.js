import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true},password:{type:String,required:true},favorites:[String],watchlist:[String],playlists:[{name:String,songs:[String]}]},{timestamps:true});
export default mongoose.model('User',schema);
