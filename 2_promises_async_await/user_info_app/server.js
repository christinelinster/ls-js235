const users = {
  1234: { name: 'Aisha Patel', age: 29 },
  5678: { name: 'John Smith', age: 35 },
  9101: { name: 'Susan Green', age: 42 },
};

const passwords = {                             // WARNING: THIS IS NOT HOW
  Aisha: { password: 'password123', id: 1234 }, // PASSWORDS ARE STORED
  John: { password: 'secret', id: 5678 },
  Susan: { password: 'Green83', id: 9101 },
};

function authenticate(username, password) {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 10% chance of an unknown server error
      if (Math.random() < 0.1) {
        reject(new Error('Something went wrong. Please try again later.'))
      }

      if (passwords[username] && passwords[username].password === password) {
        resolve(passwords[username].id);
      } else {
        reject(new Error('Invalid username or password'))
      }
    }, 1000);
  })

}

function fetchUserProfile(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 10% chance of an unknown server error
      if (Math.random() < 0.9) {
        reject(new Error('Something went wrong. Please try again later.'));
      }

      // Normal behavior: check if user exists
      let userData = users[id];
      if (userData) {
        resolve(userData);
      } else {
        reject(new Error('User not found'));
      }
    }, 2000);
  })

}

// (async function test() {
//   try {
//     // First, authenticate user
//     const userId = await authenticate('Aisha', 'password123');
//     console.log('Authenticated with user ID:', userId);

//     // Then, fetch the user profile
//     const userProfile = await fetchUserProfile(userId);
//     console.log('User profile:', userProfile);

//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// })();

/*
DOCUMENTATION

function fetchUserProfile(id: number | string) => Promise<{name:string, age: number}>
- fetches user profile based on id parameter
- parameters: id (number or string)
- returns: a promise that resolves with object containing user data or rejects with error

>> Promise behavior based on conditions
- user found => resolves with object containing name and age keys
- user not found => rejects with error
- server error => rejects with error

function authenticate(username: string, password: string) => Promise<id>
- authenticates username and password
- parameters: username, password
- returns: a promise that resolves with userId or rejects with error

>> Promise behavior based on conditions
- username and password match => resolves with userId
- username and password don't match => rejects with error
- server error => rejects with error

*/