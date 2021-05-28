const messages = require('../model/messages.json');
const bcrypt = require('bcryptjs');
const Seller = require('../model/Seller');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SEND_GRID_API_KEY
  }
}));

module.exports.login = (req, res, next) => {
  res.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    messages: messages,
    showLogin: true,
    isNew: false,
    newPassword: false,
    loginError: req.flash('error'),
    token: null,
    sellerId: null
  });
};

module.exports.newUser = (req, res, next) => {
  res.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    messages: messages,
    showLogin: true,
    isNew: true,
    newPassword: false,
    loginError: req.flash('error'),
    token: null,
    sellerId: null
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


module.exports.resetPassword = (req, res) => {
  const {email} = req.body;

  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      return res.redirect("/login");
    }

    const token = buffer.toString("hex");

    Seller.findOne({email: email})
      .then(seller => {
        if (!seller) {
          req.flash('error', messages.noAccountWithEmail);
          return res.redirect("/login");
        }

        const thirtyMinutes = 1000 * 60 * 30;

        seller.resetToken = token;
        seller.resetTokenExpiration = Date.now() + thirtyMinutes;
        return seller.save();
      })
      .then(result => {
        transporter.sendMail({
          to: email,
          from: process.env.SERVER_EMAIL,
          subject: "Password Reset",
          html: `
            <h1>Password reset requested</h1>
            <p>${messages.pleaseClick} <a href="${req.protocol + '://' + req.get('host')}/reset-password/${token}">${messages.here}</a> ${messages.toResetPassword}</p>
            <p>${messages.ignoreIf}</p>
            <p>${messages.resetRequestExpires}</p>
          `
        }).then(() => {
          req.flash('error', "Reset email send successfully.");
          return res.redirect("/login");
        });
      })
      .catch(err => {
        console.error(err);
        return res.redirect("/login");
    });
  });
};

module.exports.userResetPassword = (req, res, next) => {
  const token = req.params["token"];

  Seller.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(seller => {
    res.render('pages/store', {
      title: 'Finding your dream car. Made easier.',
      path: '/',
      messages: messages,
      showLogin: true,
      isNew: false,
      newPassword: true,
      loginError: req.flash('error'),
      token: token,
      sellerId: seller._id
    });
  });
};

module.exports.replacePassword = (req, res, next) => {
  const {password, confirmPassword, token, sellerId} = req.body;

  if (password !== confirmPassword) {
    req.flash('error', messages.passwordsDoNotMatch);
    return req.session.save(() => {
      return res.redirect(`/reset-password/${token}`);
    });
  }

  return Seller.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}, _id: sellerId})
    .then(seller => {
      if (!seller) {
        req.flash('error', messages.genericIssue);
        return res.redirect(`/reset-password/${token}`);
      }
      return bcrypt.hash(password, 12).then(hashed => {
        seller.password = hashed;
        seller.save().then(user => {
          req.session.user = user;
          req.session.authenticated = true;
          return res.redirect("/");
        });
      });
    });
};