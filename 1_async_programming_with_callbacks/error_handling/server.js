const users = {
  1234: { name: 'Aisha Patel', age: 29 },
  5678: { name: 'John Smith', age: 35 },
  9101: { name: 'Susan Green', age: 42 },
};

function fetchUserProfile(id, callback) {
  setTimeout(() => {
    let userData = users[id];
    if (userData) {
      callback(null, userData);
    } else {
      callback('User not found', null);
    }
  }, 2000);
}