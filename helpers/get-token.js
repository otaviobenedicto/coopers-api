// get token from headers
const getToken = (req,res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  return res.json(token);
};

export default getToken;
