// packages
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/AuthModel.js'

// helpers

import getToken from '../helpers/get-token.js'
import createUserToken from '../helpers/create-user-token.js'

export default class UserController {
  static async register(req, res) {

    const name = req.body.name
    const username = req.body.username
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password
    const confirmpassword = req.body.confirmpassword

    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatario!' })
      return
    }
    if (!username) {
      res.status(422).json({ message: 'O nome de usuario é obrigatario!' })
      return
    }

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatorio!' })
      return
    }

    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' })
      return
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' })
      return
    }

    if (!confirmpassword) {
      res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
      return
    }

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: 'A senha e a confirmação precisam ser iguais!' })
      return
    }

    // check if user exists
    const userExists = await User.findOne({ email: email })

    if (userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
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
    const username = req.body.username
    const password = req.body.password

    if (!username) {
      res.status(422).json({ message: 'O nome de usuario é obrigatório!' })
      return
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatório!' })
      return
    }

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

    console.log(req.headers.authorization)

    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = jwt.verify(token, 'nossosecret')

      currentUser = await User.findById(decoded.id)

      currentUser.password = undefined
    } else {
      currentUser = null
    }

    return res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {
    const id = req.params.id

    const user = await User.findById(id)

    if (!user) {
      res.status(422).json({ message: 'Usuario não encontrado!' })
      return
    }
    res.status(200).json({ user })
  }

}
