// This file can be used for any global JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            // You can add logic here to show/hide elements based on auth state
        } else {
            // No user is signed in
            console.log('No user is signed in');
        }
    });

    // Add any global event listeners or initialization code here
});

// Example of a global function that could be used across pages
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}