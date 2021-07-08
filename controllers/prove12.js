
let users = [];

module.exports.login = (req, res, next) => {
  const {userName} = req.body;

  if (users.includes(userName.trim())) {
    return res.status(409).send({errors: {code: 2, message: "Username already taken!"}});
  }

  users.push(userName.trim());
  req.session.user = userName;
  return res.status(200).send({userName: userName.trim()});
};

module.exports.logout = (req, res) => {
  const {userName} = req.body;

  users = users.filter(user => user !== userName);
  req.session.user = "";
  return res.json({success: "Success"});
}

module.exports.getUsersOnline = (req, res) => {
  return res.json({users: users.length});
}
