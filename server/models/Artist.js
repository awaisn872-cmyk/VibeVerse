import mongoose from 'mongoose'; const schema=new mongoose.Schema({name:String,genre:String,image:String,bio:String,link:String}); export default mongoose.model('Artist',schema);
