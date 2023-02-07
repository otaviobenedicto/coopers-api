import express from 'express'
import { saveToDo,
     deleteToDo,
     getAllToDo, 
     deleteAllToDo,  
     deleteAllToDoDone,
     completeTodo,
     updateToDo,
     getToDo,
    deleteAllToDoNotDone} from '../controller/ToDoController.js'

const router = express.Router()

router.post('/save/:id', saveToDo)
router.delete('/deleteAll', deleteAllToDo)
router.delete('/deleteAllNotDone', deleteAllToDoNotDone)
router.delete('/deleteAllDone', deleteAllToDoDone)
router.post('/delete', deleteToDo)
router.post('/edit', updateToDo)
router.post('/complete', completeTodo)
router.get('/all/:id', getAllToDo)
router.post('/getTodo', getToDo)

export default router
