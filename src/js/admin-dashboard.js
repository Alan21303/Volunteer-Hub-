// Check if user is logged in and is an admin
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        firebase.database().ref('admins/' + user.uid).once('value', (snapshot) => {
            if (snapshot.exists()) {
                loadEvents();
                loadTestimonials();
            } else {
                alert('You do not have admin privileges.');
                window.location.href = '//public/index.html';
            }
        });
    } else {
        window.location.href = 'admin-login.html';
    }
});

document.getElementById('addEventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const description = document.getElementById('eventDescription').value;

    firebase.database().ref('upcoming_events').push({
        title: title,
        date: date,
        time: time,
        location: location,
        description: description
    })
    .then(() => {
        alert('Event added successfully!');
        document.getElementById('addEventForm').reset();
    })
    .catch((error) => {
        console.error('Error adding event:', error);
        alert('Failed to add event. Please try again.');
    });
});

function loadEvents() {
    const eventsList = document.getElementById('eventsList');
    firebase.database().ref('upcoming_events').on('value', (snapshot) => {
        eventsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const event = childSnapshot.val();
            const eventCard = createEventCard(event, childSnapshot.key);
            eventsList.appendChild(eventCard);
        });
    });
}

function createEventCard(event, eventId) {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg p-4';
    card.innerHTML = `
        <h4 class="text-xl font-bold mb-2">${event.title}</h4>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
    `;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Event';
    deleteBtn.className = 'mt-4 bg-red-500 text-white px-4 py-2 rounded';
    deleteBtn.onclick = () => deleteEvent(eventId);
    card.appendChild(deleteBtn);
    return card;
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        firebase.database().ref('upcoming_events/' + eventId).remove()
            .then(() => {
                alert('Event deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting event:', error);
                alert('Failed to delete event. Please try again.');
            });
    }
}

function loadTestimonials() {
    const testimonialsList = document.getElementById('testimonialsList');
    firebase.database().ref('testimonials').on('value', (snapshot) => {
        testimonialsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const testimonial = childSnapshot.val();
            const testimonialCard = createTestimonialCard(testimonial, childSnapshot.key);
            testimonialsList.appendChild(testimonialCard);
        });
    });
}

function createTestimonialCard(testimonial, testimonialId) {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg p-4';
    card.innerHTML = `
        <p class="italic">"${testimonial.text}"</p>
        <p class="mt-2 text-right">- ${testimonial.username}</p>
    `;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Testimonial';
    deleteBtn.className = 'mt-4 bg-red-500 text-white px-4 py-2 rounded';
    deleteBtn.onclick = () => deleteTestimonial(testimonialId);
    card.appendChild(deleteBtn);
    return card;
}

function deleteTestimonial(testimonialId) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        firebase.database().ref('testimonials/' + testimonialId).remove()
            .then(() => {
                alert('Testimonial deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting testimonial:', error);
                alert('Failed to delete testimonial. Please try again.');
            });
    }
}