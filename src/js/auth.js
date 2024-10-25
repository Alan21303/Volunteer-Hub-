// Handle user login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            window.location.href = 'user-dashboard.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
        });
});

// Handle user registration
// Handle user registration
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const email = document.getElementById('email').value; // Get email
        const password = document.getElementById('password').value; // Get password
        const username = document.getElementById('username').value; // Get username

        // Create user with email and password
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user; // Get user object

                // Add user details to Firestore under 'users' collection
                return db.collection('users').doc(user.uid).set({
                    username: username, // Store username
                    email: email // Store email
                });
            })
            .then(() => {
                // Optionally retrieve the username here if needed
                const registeredUsername = username; // Retrieved username
                console.log('Registered username:', registeredUsername);

                // Redirect to user dashboard after successfully saving user data
                window.location.href = 'user-dashboard.html';
            })
            .catch((error) => {
                const errorCode = error.code; // Get error code
                const errorMessage = error.message; // Get error message
                alert(`Error: ${errorMessage}`); // Alert the user about the error
            });
    });
});

// Handle admin login
// Handle admin login
document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Sign in the user with email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user; // Get the signed-in user
            
            // Check if the signed-in user has admin privileges
            return firebase.database().ref('admins/' + user.uid).once('value');
        })
        .then((snapshot) => {
            if (snapshot.exists()) {
                // User is an admin, redirect to the admin dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                // User is not an admin, sign them out and alert
                alert('You do not have admin privileges.');
                return firebase.auth().signOut();
            }
        })
        .catch((error) => {
            // Handle errors during sign-in or database lookup
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        });
});
