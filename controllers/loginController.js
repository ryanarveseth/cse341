const messages = require('../model/messages.json');
const bcrypt = require('bcryptjs');
const Seller = require('../model/Seller');

module.exports.login = (req, res, next) => {
  res.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    messages: messages,
    showLogin: true,
    isNew: false,
    loginError: req.flash('error'),
  });
};

module.exports.newUser = (req, res, next) => {
  res.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    messages: messages,
    showLogin: true,
    isNew: true,
    loginError: req.flash('error'),
  });
};


module.exports.postLogin = (req, res, next) => {
  const {name, email, phone, password, confirmPassword} = req.body;
  req.session.authenticated = false;

  if (name || phone) {

    return Seller.findOne({email: email}).then(user => {

      if (user) {
        req.flash('error', messages.userAlreadyExists);
        return res.redirect("/login");
      }

      if (password === confirmPassword) {
        return bcrypt.hash(password, 12).then(hashed => {
          const newUser = new Seller({
            name: name,
            email: email,
            phone: phone,
            password: hashed
          });

          newUser.save().then(user => {
            req.session.user = user;
            req.session.authenticated = true;
            return res.redirect("/");
          });
        });

      } else {
        req.flash('error', messages.passwordsDoNotMatch);
        return res.redirect("/login-new");
      }
    });
  } else {
    return Seller.findOne({email})
      .then(user => {
        if (!user || !user.password) {
          req.flash('error', messages.userDoesntExist);
          req.session.save(() => {
            return res.redirect("/login-new");
          });
        }

        return bcrypt.compare(password, user.password, (err, data) => {
          if (err) {
            req.flash('error', messages.genericIssue);
            return res.redirect(req.path);
          }
          if (data) {
            req.session.user = user;
            req.session.authenticated = true;
          } else {
            req.flash('error', messages.incorrectPassword);

            return req.session.save(() => {
              return res.redirect("/login");
            });
          }
          return req.session.save(() => {
            return res.redirect("/");
          });
        });
      });
  }
};

module.exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};