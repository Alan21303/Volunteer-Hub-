// This script should be run securely, not accessible to all users
function makeUserAdmin(uid) {
    firebase.database().ref('admins/' + uid).set(true)
      .then(() => {
        console.log('User successfully made admin');
      })
      .catch((error) => {
        console.error('Error making user admin:', error);
      });
  }
  
  // Usage: Call this function with the UID of the user you want to make admin
  // makeUserAdmin('USER_UID_HERE');