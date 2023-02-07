import ToDoModel from '../models/ToDoModel.js'

export const getAllToDo = async (req, res) => {
    const { id } = req.params
    await ToDoModel.find({ id: id })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(402).json({ message: err }));
}
export const getToDo = async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(402).json({ message: "ID não adicionado!" })
    }

    await ToDoModel.findById(_id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(402).json({ message: err }));
}
export const saveToDo = async (req, res) => {

    const { id } = req.params

    const { task, done = false } = req.body

    if (!task) {
        res.status(401).json({ message: "Task não adicionada!" })
        return
    }

    ToDoModel
        .create({
            id: id,
            task: task,
            done: done
        })
        .then(() => res.status(201).json(req.body))
        .catch((err) => res.status(401).json({ message: err }));
}
export const deleteToDo = async (req, res) => {
    const { _id } = req.body

    try {
        ToDoModel
            .findByIdAndDelete(_id)
            .then(() => res.status(200).json({ message: "Task deletada com sucesso!" }))
            .catch((err) => res.status(401).json({ message: err }))
    } catch (error) {
        return res.status(301).json({ message: error })
    }
}
export const updateToDo = async (req, res) => {
    const { _id, task } = req.body

    try {
        ToDoModel
            .findByIdAndUpdate(_id, {
                task: task
            })
            .then(() => res.status(200).json({ message: "Task alterada com sucesso!" }))
            .catch((err) => res.status(401).json({ message: err }));
    } catch (error) {
        return res.status(301).json({ message: error })
    }
}
export const completeTodo = async (req, res) => {

    const { _id } = req.body

    if (!_id) {
        res.status(401).json({ message: "Id nÃ£o adicionado" })
        return
    }
    ToDoModel.findByIdAndUpdate(_id, {
        done: true
    })
        .then(() => res.status(200).json({ message: "Task concluida" }))
        .catch((err) => res.status(401).json({ message: err }))
}
export const deleteAllToDo = async (req, res) => {
    await ToDoModel
        .deleteMany({})
        .then(() => res.status(200).json({ message: "Todos as tasks deletadas!" }))
        .catch((err) => res.status(401).json({ message: err }))
}
export const deleteAllToDoDone = async (req, res) => {
    await ToDoModel
        .deleteMany({ done: true })
        .then(() => res.status(200).json({ message: "Todos as tasks feitas foram deletadas!" }))
        .catch((err) => res.status(401).json({ message: err }))
}
export const deleteAllToDoNotDone = async (req, res) => {
    await ToDoModel
        .deleteMany({ done: false })
        .then(() => res.status(200).json({ message: "Todos as tasks não feitas foram deletadas!" }))
        .catch((err) => res.status(401).json({ message: err }))
}
