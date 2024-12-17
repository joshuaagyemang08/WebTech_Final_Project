document.getElementById('learnMoreBtn').addEventListener('click', function() {
    alert('Thank you for your interest! Download our app to explore more features and stay connected.');
});

// Toggle dropdown menu
document.getElementById('moreBtn').addEventListener('click', function(event) {
    event.stopPropagation();
    document.getElementById('moreDropdown').classList.toggle('show');
});

// Close dropdown if clicked outside
window.addEventListener('click', function(event) {
    const moreDropdown = document.getElementById('moreDropdown');
    const moreBtn = document.getElementById('moreBtn');
    if (!moreDropdown.contains(event.target) && event.target !== moreBtn) {
        moreDropdown.classList.remove('show');
    }
});

// Alternate heading and text content
const headings = [
    "Reliable Car Rides",
    "Swift Motorbike Rides",
    "Stay Connected"
];

const texts = [
    "Experience the comfort and convenience of our car rides. Whether you're heading to class or exploring the city, our reliable car services ensure you reach your destination safely and on time.",
    "Navigate through traffic with ease using our motorbike rides. Perfect for quick trips and avoiding congestion, our motorbike services offer a fast and efficient way to get around.",
    "Stay connected and enjoy seamless communication with our app. Track your rides, communicate with drivers, and manage your bookings all from your phone."
];

let currentIndex = 0;
const headingElement = document.getElementById('dynamicHeading');
const textElement = document.getElementById('dynamicText');

function updateContent() {
    headingElement.textContent = headings[currentIndex];
    textElement.textContent = texts[currentIndex];
    currentIndex = (currentIndex + 1) % headings.length;
}

setInterval(updateContent, 5000); // Change content every 5 seconds


