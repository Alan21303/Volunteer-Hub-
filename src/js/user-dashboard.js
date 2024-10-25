// Check if user is logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        loadUserData(user.uid);
        loadUpcomingEvents();
        loadPastEvents();
        loadTestimonials();
    } else {
        // User is signed out
        window.location.href = 'login.html';
    }
});

function loadUserData(userId) {
    firebase.database().ref('users/' + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        document.getElementById('username').textContent = userData.username;
    });
}

function loadUpcomingEvents() {
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    firebase.database().ref('upcoming_events').on('value', (snapshot) => {
        upcomingEventsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const event = childSnapshot.val();
            const eventCard = createEventCard(event, childSnapshot.key);
            upcomingEventsList.appendChild(eventCard);
        });
    });
}

function loadPastEvents() {
    const pastEventsList = document.getElementById('pastEventsList');
    firebase.database().ref('past_events').on('value', (snapshot) => {
        pastEventsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const event = childSnapshot.val();
            const eventCard = createEventCard(event, childSnapshot.key, true);
            pastEventsList.appendChild(eventCard);
        });
    });
}

function createEventCard(event, eventId, isPast = false) {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg p-4';
    card.innerHTML = `
        <h4 class="text-xl font-bold mb-2">${event.title}</h4>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
    `;
    if (!isPast) {
        const registerBtn = document.createElement('button');
        registerBtn.textContent = 'Register';
        registerBtn.className = 'mt-4 bg-blue-500 text-white px-4 py-2 rounded';
        registerBtn.onclick = () => registerForEvent(eventId);
        card.appendChild(registerBtn);
    }
    return card;
}

function registerForEvent(eventId) {
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.database().ref(`users/${user.uid}/registered_events/${eventId}`).set(true)
            .then(() => {
                alert('Successfully registered for the event!');
            })
            .catch((error) => {
                console.error('Error registering for event:', error);
                alert('Failed to register for the event. Please try again.');
            });
    }
}

function loadTestimonials() {
    const testimonialsList = document.getElementById('testimonialsList');
    firebase.database().ref('testimonials').on('value', (snapshot) => {
        testimonialsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const testimonial = childSnapshot.val();
            const testimonialCard = createTestimonialCard(testimonial);
            testimonialsList.appendChild(testimonialCard);
        });
    });
}

function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg p-4';
    card.innerHTML = `
        <p class="italic">"${testimonial.text}"</p>
        <p class="mt-2 text-right">- ${testimonial.username}</p>
    `;
    return card;
}
document.getElementById('testimonialForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const user = firebase.auth().currentUser; // Get the current user from Firebase auth

    if (user) {
        const testimonialText = document.getElementById('testimonialText').value.trim(); // Get the testimonial text and trim whitespace

        // Check if testimonial text is empty
        if (testimonialText === '') {
            alert('Please enter a testimonial.'); // Alert for empty testimonial
            return; // Stop the function
        }

        // Use the user's email directly
        const email = user.email; // Get the user's email

        // Retrieve the user's username from the database
        firebase.database().ref('users/' + user.uid).once('value')
            .then((snapshot) => {
                let username = 'Anonymous'; // Default to 'Anonymous'
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    username = userData.username || 'Anonymous'; // Retrieve username if available
                }

                // Push the testimonial data to Firebase Realtime Database
                return firebase.database().ref('testimonials').push({
                    userId: user.uid, // User ID
                    email: email, // User's email
                    username: username, // User's username
                    text: testimonialText, // Testimonial text
                    timestamp: firebase.database.ServerValue.TIMESTAMP // Current timestamp
                });
            })
            .then(() => {
                alert('Testimonial submitted successfully!'); // Success alert
                document.getElementById('testimonialText').value = ''; // Clear the text area
            })
            .catch((error) => {
                console.error('Error submitting testimonial:', error); // Log error
                alert('Failed to submit testimonial. Please try again.'); // Error alert
            });
    } else {
        alert('You must be logged in to submit a testimonial.'); // Alert if user is not logged in
    }
});
