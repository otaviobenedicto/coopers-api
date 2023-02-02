import express from 'express'
import {
    saveToDo,
    deleteToDo,
    getAllToDo,
    deleteAllToDo,
    getAllToDoDone,
    deleteAllToDoDone,
    getAllToDoNotDone,
    completeTodo,
    updateToDo,
    deleteAllToDoNotDone
} from '../controller/ToDoController.js'

const router = express.Router()

router.post('/save', saveToDo)
router.delete('/deleteAll', deleteAllToDo)
router.delete('/deleteAllNotDone', deleteAllToDoNotDone)
router.delete('/deleteAllDone', deleteAllToDoDone)
router.post('/delete', deleteToDo)
router.post('/edit', updateToDo)
router.post('/complete', completeTodo)
router.get('/all', getAllToDo)
router.get('/notDone', getAllToDoNotDone)
router.get('/allDone', getAllToDoDone)

export default router
