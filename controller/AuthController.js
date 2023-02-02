// packages
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/AuthModel.js'

// helpers
import getUserByToken from '../helpers/get-user-by-token.js'
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
      res.status(422).json({ message: 'O nome Ã© obrigatÃ³rio!' })
      return
    }
    if (!username) {
      res.status(422).json({ message: 'O nome de usuario é obrigatario!' })
      return
    }

    if (!email) {
      res.status(422).json({ message: 'O e-mail Ã© obrigatÃ³rio!' })
      return
    }

    if (!phone) {
      res.status(422).json({ message: 'O telefone Ã© obrigatÃ³rio!' })
      return
    }

    if (!password) {
      res.status(422).json({ message: 'A senha Ã© obrigatÃ³ria!' })
      return
    }

    if (!confirmpassword) {
      res.status(422).json({ message: 'A confirmaÃ§Ã£o de senha Ã© obrigatÃ³ria!' })
      return
    }

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: 'A senha e a confirmaÃ§Ã£o precisam ser iguais!' })
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
      res.status(500).json({ message: error })
    }
  }

  static async login(req, res) {
    const username = req.body.username
    const password = req.body.password

    if (!username) {
      res.status(422).json({ message: 'O nome de usuario obrigatório!' })
      return
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatório!' })
      return
    }

    // check if user exists
    const user = await User.findOne({ username:username })

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

    res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {
    const id = req.params.id

    const user = await User.findById(id)

    if (!user) {
      res.status(422).json({ message: 'UsuÃ¡rio nÃ£o encontrado!' })
      return
    }

    res.status(200).json({ user })
  }

  static async editUser(req, res) {

    const token = getToken(req)

    //console.log(token);

    const user = await getUserByToken(token)

    // console.log(user);
    // console.log(req.body)
    // console.log(req.file.filename)

    const name = req.body.name
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password
    const confirmpassword = req.body.confirmpassword

    let image = ''

    if (req.file) {
      image = req.file.filename
    }

    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome Ã© obrigatÃ³rio!' })
      return
    }

    user.name = name

    if (!email) {
      res.status(422).json({ message: 'O e-mail Ã© obrigatÃ³rio!' })
      return
    }

    // check if user exists
    const userExists = await User.findOne({ email: email })

    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
      return
    }

    user.email = email

    if (image) {
      const imageName = req.file.filename
      user.image = imageName
    }

    if (!phone) {
      res.status(422).json({ message: 'O telefone Ã© obrigatÃ³rio!' })
      return
    }

    user.phone = phone

    // check if password match
    if (password != confirmpassword) {
      res.status(422).json({ error: 'As senhas nÃ£o conferem.' })

      // change password
    } else if (password == confirmpassword && password != null) {
      // creating password
      const salt = await bcrypt.genSalt(12)
      const reqPassword = req.body.password

      const passwordHash = await bcrypt.hash(reqPassword, salt)

      user.password = passwordHash
    }

    try {
      // returns updated data
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true },
      )
      res.json({
        message: 'UsuÃ¡rio atualizado com sucesso!',
        data: updatedUser,
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }
}
