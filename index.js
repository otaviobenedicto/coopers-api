dotenv.config();

// Import packages
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import bodyparser from 'body-parser'
import cors from 'cors'
import compression from 'compression';

// Routes
import ToDoRoutes from './routes/ToDoRoutes.js'
import AuthRoutes from './routes/AuthRoutes.js'

// APP
const app = express()

app.use(compression())
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())
app.use(express.json());


const connect = async () => {
    mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then((db) => console.log("Mongodb Connected on", db.connection.host))
        .catch((err) => console.error(err));
}

app.use("/todo", ToDoRoutes)
app.use("/users", AuthRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connect()
    console.log("Servidor rodando na porta " + PORT)
})


