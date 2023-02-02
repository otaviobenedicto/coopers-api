import jwt from 'jsonwebtoken'

// middleware to validate token
export default checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, "nossosecret");
    req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    return res.status(400).json({ message: "O Token é inválido!" });
  }
};

