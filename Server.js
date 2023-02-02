import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import bodyparser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

// Routes
import ToDoRoutes from './routes/ToDoRoutes.js'
import AuthRoutes from './routes/AuthRoutes.js'


const app = express()

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json());
app.use(morgan('tiny'))
dotenv.config();


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

const PORT = process.env.PORT | 5000

app.listen(PORT, () => {
    connect()
    console.log("Servidor rodando na porta " + PORT)
})


