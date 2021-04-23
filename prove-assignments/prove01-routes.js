const fs = require('fs');


const getDefaultPage = () => '' +
  '<html>' +
    '<head>' +
      '<title>Add Username to List</title>' +
    '</head>' +
    '<body style="padding: 32px">' +
      '<h2>Enter a username to add to the user list:</h2>' +
      '<form action="/create-user" method="post">' +
        '<input type="text" name="username">' +
        '<button type="submit">Add</button>' +
      '</form>' +
    '</body>' +
  '</html>';


const createUser = (method, request, response) => {
  if (method === 'POST') {
    const body = [];

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    return request.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const userName = parsedBody.split('=')[1];
      const userListString = fs.readFileSync('./prove-assignments/prove01.txt', 'utf-8');
      const userList = userListString ? JSON.parse(userListString) : [];

      userList.push(decodeURIComponent(userName));

      fs.writeFileSync('./prove-assignments/prove01.txt', JSON.stringify(userList));

      response.statusCode = 302;
      response.setHeader('Location', '/users');
      return response.end();
    });
  }
}


const getUserList = () => {
  let userList = JSON.parse(fs.readFileSync('./prove-assignments/prove01.txt', 'utf-8')) || [];
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