// packages
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/AuthModel.js'

// helpers

import getToken from '../helpers/get-token.js'
import createUserToken from '../helpers/create-user-token.js'

export default class UserController {
  static async register(req, res) {

    const { name, username, email, phone, password, confirmpassword } = req.body

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: 'A senha e a confirmação precisam ser iguais!' })
      return
    }

    // check if user exists
    const userExists = await User.findOne({ username: username })

    if (userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro username' })
      return
    }

    // create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create user
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      username: username,
      password: passwordHash,
    })

    try {
      const newUser = await user.save()

      await createUserToken(newUser, req, res)
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  static async login(req, res) {

    const { username, password } = req.body

    // check if user exists
    const user = await User.findOne({ username: username })

    if (!user) {
      return res
        .status(422)
        .json({ message: 'Não ha usuario cadastrado com esse nome de usuário.' })
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(422).json({ message: 'Senha invalida.' })
    }

    await createUserToken(user, req, res)
  }

  static async checkUser(req, res) {
    let currentUser
    
    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = jwt.verify(token, process.env.SECRET_JWT)

      currentUser = await User.findById(decoded.id)

      currentUser.password = undefined
    } else {
      currentUser = null
    }

    return res.status(200).send(currentUser)
  }
}
