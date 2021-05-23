const fs = require('fs');


const getDefaultPage = () => '' +
  '<html>' +
    '<head>' +
      '<title>Add Username to List</title>' +
    '</head>' +
    '<body style="padding: 32px">' +
      '<h2>Enter a username to add to the user list:</h2>' +
      '<form action="/create-user" method="post">' +
        '<input type="text" style="height: 30px" name="username">' +
        '<button type="submit" style="height: 30px">Add</button>' +
      '</form>' +
    '</body>' +
  '</html>';


const createUser = (method, req, res) => {
  if (method === 'POST') {
    const body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const userName = parsedBody.split('=')[1];
      const userListString = fs.readFileSync('./prove01.txt', 'utf-8');
      const userList = userListString ? JSON.parse(userListString) : [];

      userList.push(decodeURIComponent(userName));

      fs.writeFileSync('./prove01.txt', JSON.stringify(userList));

      res.statusCode = 302;
      res.setHeader('Location', '/users');
      return res.end();
    });
  }
}


const getUserList = () => {
  let userList = JSON.parse(fs.readFileSync('./prove01.txt', 'utf-8')) || [];
  userList = userList.map(user => '<div>' + user + '</div>');
  return '' +
    '<html>' +
      '<head><title>User List</title></head>' +
      '<body style="padding: 32px">' +
        '<h2>List of users:</h2>' + userList.join('') +
        '<br>' +
        '<a href="/">Add new user</a>' +
      '</body>' +
    '</html>';
}


const routeHandler = (request, response) => {
  const {url, method} = request;
  switch(url) {
    case '/create-user':
      return createUser(method, request, response);
    case '/users':
      response.setHeader('Content-Type', 'text/html');
      response.write(getUserList());
      return response.end();
    case '/':
    default:
      response.setHeader('Content-Type', 'text/html');
      response.write(getDefaultPage());
      return response.end();
  }
}

module.exports = routeHandler;