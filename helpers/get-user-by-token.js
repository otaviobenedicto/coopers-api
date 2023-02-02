import jwt from 'jsonwebtoken'

import User from '../models/AuthModel.js'

// get user by jwt token
const getUserByToken = async (req, res, token) => {
  if (!token) return res.status(401).json({ error: "Acesso negado!" });

  // find user
  const decoded = jwt.verify(token, "nossosecret");

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return res.status(user);
};
export default getUserByToken;
