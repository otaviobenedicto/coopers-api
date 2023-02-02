// Imports
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import bodyparser from 'body-parser'
import cors from 'cors'

// Routes
import ToDoRoutes from './routes/ToDoRoutes.js'
import AuthRoutes from './routes/AuthRoutes.js'
dotenv.config();

const app = express()

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.ORIGIN }))
app.use(express.json());

const connect = async () => {
    mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Mongodb Connected..."))
    .catch((err) => console.error(err));
}

app.use("/todo",ToDoRoutes)
app.use("/users", AuthRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connect()
    console.log("Servidor rodando na porta " + PORT)
})


