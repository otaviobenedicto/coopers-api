import ToDoModel from '../models/ToDoModel.js'

export const getAllToDo = async (req, res) => {
    const todo = await ToDoModel.find();
    return res.json(todo);
}
export const getAllToDoDone = async (req, res) => {
    const todo = await ToDoModel.find({ done: true });
    return res.json(todo);
}
export const getAllToDoNotDone = async (req, res) => {
    const todo = await ToDoModel.find({ done: false });
    return res.json(todo);


}
export const saveToDo = async (req, res) => {

    const { task, done = false } = req.body;

    if (!task) {
        res.status(401).json({ message: "Task não adicionada!" })
        return
    }

    ToDoModel
        .create({
            task: task,
            done: done
        })
        .then(() => res.status(201).json(req.body))
        .catch((err) => console.log(err));
}
export const deleteToDo = async (req, res) => {
    const { _id } = req.body

    try {
        ToDoModel
            .findByIdAndDelete(_id)
            .then(() => res.status(200).send("Task deletada com sucesso!"))
            .catch((err) => console.log(err));
    } catch (error) {
        return res.status(301).json({ message: "Task deletada!" })
    }
}
export const updateToDo = async (req, res) => {
    const { _id, task } = req.body

    try {
        ToDoModel
            .findByIdAndUpdate(_id, {
                task: task
            })
            .then(() => res.status(200).send("Task alterada com sucesso!"))
            .catch((err) => console.log(err));
    } catch (error) {
        return res.status(301).json({ message: "Task deletada" })
    }
}
export const completeTodo = async (req, res) => {

    const { _id } = req.body

    if (!_id) {
        res.status(401).json({ message: "Id não adicionado" })
        return
    }
    ToDoModel.findByIdAndUpdate(_id, {
        done: true
    })
        .then(() => res.status(200).json({ message: "Task concluida" }))
        .catch((err) => console.log(err))
}
export const deleteAllToDo = async (req, res) => {
    await ToDoModel
        .deleteMany({})
        .then(() => res.status(200).json({ message: "Todos as tasks deletadas!" }))
        .catch((err) => console.log(err))
}
export const deleteAllToDoDone = async (req, res) => {
    await ToDoModel
        .deleteMany({ done: true })
        .then(() => res.status(200).json({ message: "Todos as tasks feitas foram deletadas!" }))
        .catch((err) => console.log(err))
}
export const deleteAllToDoNotDone = async (req, res) => {
    await ToDoModel
        .deleteMany({ done: false })
        .then(() => res.status(200).json({ message: "Todos as tasks não feitas foram deletadas!" }))
        .catch((err) => console.log(err))
}
