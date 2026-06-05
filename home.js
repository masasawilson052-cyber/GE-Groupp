// Wait for the DOM to be fully loaded and parsed before executing any code inside
document.addEventListener('DOMContentLoaded', function () {
    // Call the function that creates and injects a digital clock into the navigation bar
    injectClockInNavbar();
    // Call the function that starts the typewriter effect on the hero paragraph
    startHeroTypewriter();
});

// ----------------------------------------------------------------------
// Function to dynamically create a digital clock and place it into the navigation container
// ----------------------------------------------------------------------
function injectClockInNavbar() { 
    // Find the first element with the CSS class 'nav-container' (assumed to be the navigation bar wrapper)
    var navContainer = document.querySelector('.nav-container');
    // If no such element exists, exit the function early (do nothing)
    if (!navContainer) return;

    // Create a new <div> element that will hold the clock display
    var clockPanel = document.createElement('div');
    // Set CSS style: white text color
    clockPanel.style.color = '#ffffff';
    // Use a monospace font for a digital / tech look
    clockPanel.style.fontFamily = 'monospace';
    // Set font size to 1.1rem (relative to root font size)
    clockPanel.style.fontSize = '1.1rem';
    // Make the text bold
    clockPanel.style.fontWeight = 'bold';
    // Add vertical and horizontal padding: 5px top/bottom, 12px left/right
    clockPanel.style.padding = '5px 12px';
    // Add a solid border with a teal/greenish color (#37c2a4)
    clockPanel.style.border = '1px solid #37c2a4';
    // Round the corners of the border slightly
    clockPanel.style.borderRadius = '4px';
    // Push the clock to the far right inside the flex container (using auto left margin)
    clockPanel.style.marginLeft = 'auto';
    // Add a right margin of 20px to separate from any right edge or content
    clockPanel.style.marginRight = '20px';
    // Add a little extra spacing between characters
    clockPanel.style.letterSpacing = '1px';
    // Override the previous padding with a slightly larger padding (6px top/bottom, 14px left/right)
    clockPanel.style.padding = '6px 14px';

    // Look for an element with class 'nav-links' (likely the menu links container)
    var navLinks = document.querySelector('.nav-links');
    // If the navigation links container exists...
    if (navLinks) {
        // ...insert the clock panel before the navLinks element (so clock appears to the left of the links)
        navContainer.insertBefore(clockPanel, navLinks);
    } else {
        // If no navLinks element is found, just append the clock panel at the end of the nav container
        navContainer.appendChild(clockPanel);
    }

    // Set up an interval that runs every 1000 milliseconds (1 second)
    setInterval(function () {
        // Get the current date and time
        var now = new Date();
        // Update the clock panel's text content with the local time string (e.g., "14:35:07")
        clockPanel.textContent = now.toLocaleTimeString();
    }, 1000);
}

// ----------------------------------------------------------------------
// Function to create a typewriter animation on the hero section's paragraph
// ----------------------------------------------------------------------
function startHeroTypewriter() {
    // Find the paragraph inside .hero-content (assumed to be the main hero text)
    var heroParagraph = document.querySelector('.hero-content p');
    // If no such paragraph exists, stop the function
    if (!heroParagraph) return;

    // Store the original text content, trimming any surrounding whitespace
    var fullText = heroParagraph.textContent.trim();
    // Variable to hold the slowly revealed text (starts empty)
    var currentText = "";
    // Index to track how many characters have been typed (start at 0)
    var index = 0;
    // Clear the paragraph's text content so it appears blank initially
    heroParagraph.textContent = "";

    // Set up an interval that runs every 20 milliseconds (very fast typing)
    var typingInterval = setInterval(function () {
        // If there are still characters left to type...
        if (index < fullText.length) {
            // Append the next character from the original text to the current display text
            currentText += fullText.charAt(index);
            // Update the paragraph's text with the new partially typed content
            heroParagraph.textContent = currentText;
            // Move to the next character position
            index++;
        } else {
            // When all characters have been typed, stop the interval (no more typing)
            clearInterval(typingInterval);
        }
    }, 20); // Delay of 20ms between each character (creates a smooth typewriter feel)
}