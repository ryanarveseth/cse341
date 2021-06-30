const messages = require('../model/messages');

const data = [
  {
    "name": "Tony Stark",
    "avenger": "Iron Man"
  },
  {
    "name": "Steve Rogers",
    "avenger": "Captain America"
  },
  {
    "name": "Thor Odinson",
    "avenger": "Thor"
  },
  {
    "name": "Bruce Banner",
    "avenger": "Hulk"
  },
  {
    "name": "Natasha Romanov",
    "avenger": "Black Widow"
  },
  {
    "name": "Clint Barton",
    "avenger": "Lame"
  }
];


module.exports.getAvengersPage = (req, res) => {
  res.render('pages/index', {
    title: "Prove 11",
    path: "/",
    messages: messages
  });
};

module.exports.fetchAllAvengers = (req, res, next) => {
  res.json(data);
};

module.exports.insertAvenger = (req, res, next) => {
  const {avenger, name} = req.body;
  let canPush = true;

  if (!avenger || !name) {
    return res.json(data);
  }

  data.forEach(existingAvenger => {
    if (avenger === existingAvenger.avenger && name === existingAvenger.name) {
      canPush = false;
    }
  });

  canPush && data.push({avenger: avenger, name: name});

  return res.json(data);
};