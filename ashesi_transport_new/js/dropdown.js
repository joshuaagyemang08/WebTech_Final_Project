// JavaScript for "More" button dropdown
document.getElementById('moreBtn').addEventListener('click', function(event) {
    event.stopPropagation(); // Prevents the event from bubbling up
    document.getElementById('moreDropdown').classList.toggle('show');
});

// Close the dropdown when clicking outside of it
window.addEventListener('click', function(event) {
    const moreDropdown = document.getElementById('moreDropdown');
    const moreBtn = document.getElementById('moreBtn');
    if (!moreDropdown.contains(event.target) && event.target !== moreBtn) {
        moreDropdown.classList.remove('show');
    }
});
