import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
   task: {
      type: String,
      required: true
   },
   done: {
      type: Boolean,
      required: true
   }
});

export default mongoose.model('ToDo', todoSchema);