import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
   id: {
      type: String,
      required: true
   },
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