// Wait for the entire HTML document to be fully loaded before running
document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. TYPEWRITER EFFECT ON H1 ==========
    // Select the first <h1> element on the page (PERSONAL PORTFOLIO)
    const mainTitle = document.querySelector('h1');
    // Check if the h1 element actually exists (to avoid errors)
    if (mainTitle) {
        // Store the original text content of the h1
        const fullText = mainTitle.innerText;
        // Clear the h1 content so it starts empty
        mainTitle.innerHTML = '';
        // Initialize a counter to track which character we are typing
        let index = 0;
        // Set an interval that runs every 70 milliseconds
        const typeInterval = setInterval(() => {
            // If there are still characters left to type
            if (index < fullText.length) {
                // Add the next character to the h1's HTML
                mainTitle.innerHTML += fullText.charAt(index);
                // Move to the next character position
                index++;
            } else {
                // When all characters are typed, stop the interval
                clearInterval(typeInterval);
            }
        }, 70); // 70ms delay between characters gives a smooth typing effect
    } // End of typewriter if block

    // ========== 2. INTERACTIVE SKILLS (show hidden details on click) ==========
    // Select all elements with class 'skill-item' (the clickable skill names)
    const skillSpans = document.querySelectorAll('.skill-item');
    // Loop through each skill span using forEach
    skillSpans.forEach(span => {
        // Change the mouse cursor to a pointer to indicate it's clickable
        span.style.cursor = 'pointer';
        // Give the skill name a gold color to stand out
        span.style.color = '#fbbf24';
        // Make the skill name bold
        span.style.fontWeight = 'bold';
        // Add a click event listener to each skill span
        span.addEventListener('click', function(e) {
            // Stop the click event from bubbling up to parent elements
            e.stopPropagation();
            // Get the value of the 'data-target' attribute (the ID of the detail paragraph)
            const targetId = this.getAttribute('data-target');
            // Find the paragraph element with that ID
            const detailPara = document.getElementById(targetId);
            // If the detail paragraph exists
            if (detailPara) {
                // Check if it's currently hidden (display: none or not set)
                if (detailPara.style.display === 'none' || !detailPara.style.display) {
                    // Show the detail paragraph
                    detailPara.style.display = 'block';
                } else {
                    // Hide the detail paragraph
                    detailPara.style.display = 'none';
                }
            }
        }); // End of click event listener
    }); // End of forEach loop on skill spans

    // ========== 3. TABLE SORT (by YEAR column) ==========
    // Select the first table element on the page (the education table)
    const table = document.querySelector('table');
    // Only proceed if a table exists
    if (table) {
        // Create a new button element for sorting
        const sortBtn = document.createElement('button');
        // Set the button text
        sortBtn.textContent = '📅 Sort by Year (Oldest First)';
        // Apply inline CSS styles to make it look nice
        sortBtn.style.cssText = 'margin: 15px 0; padding: 6px 16px; background: #b45309; color: white; border: none; border-radius: 30px; cursor: pointer; font-weight: bold;';
        // Insert the button before the table (so it appears above the table)
        table.parentNode.insertBefore(sortBtn, table);
        
        // Variable to track sort order: true = ascending (oldest first), false = descending (newest first)
        let ascending = true;
        
        // Helper function: extract the first 4-digit year from a text string
        // e.g., "2025-CURRENT" returns 2025, "2019-2022" returns 2019
        function extractYear(text) {
            // Use regular expression to find any 4-digit number
            const match = text.match(/\d{4}/);
            // If a match is found, convert it to an integer and return it
            // Otherwise, return 0 (so it sorts at the beginning or end)
            return match ? parseInt(match[0], 10) : 0;
        } // End of extractYear function
        
        // Function to sort the table rows
        function sortTable() {
            // Get all rows inside the <tbody> as an array (skip the header row)
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            // Sort the rows array using a custom comparison function
            rows.sort((a, b) => {
                // Extract year from the second column (index 1) of each row
                const yearA = extractYear(a.cells[1].innerText);
                const yearB = extractYear(b.cells[1].innerText);
                // If ascending is true, sort smaller years first; otherwise, larger years first
                return ascending ? yearA - yearB : yearB - yearA;
            });
            // Re-append each row in the sorted order (appendChild moves existing elements)
            rows.forEach(row => {
                table.querySelector('tbody').appendChild(row);
                // Add a temporary highlight effect to show the row was sorted
                row.style.transition = 'background 0.2s';
                row.style.background = 'rgba(249,115,22,0.3)';
                // Remove the highlight after 400 milliseconds
                setTimeout(() => row.style.background = '', 400);
            });
            // Update the button text to indicate the next click will reverse order
            sortBtn.textContent = ascending ? '📅 Sort by Year (Newest First)' : '📅 Sort by Year (Oldest First)';
        } // End of sortTable function
        
        // Add a click event listener to the sort button
        sortBtn.addEventListener('click', () => {
            // Toggle the sorting order (if ascending, make descending, and vice versa)
            ascending = !ascending;
            // Call the sortTable function to re-sort with the new order
            sortTable();
        }); // End of button click listener
    } // End of if(table exists)

    // ========== 4. HOBBIES READ MORE / READ LESS (fixed closure bug) ==========
    // Select all hobby items (each <li> with class 'hobby-item')
    const hobbyItems = document.querySelectorAll('.hobby-item');
    // Loop through each hobby item using forEach
    hobbyItems.forEach((item, idx) => {
        // Find the description span inside this hobby item
        const descSpan = item.querySelector('.hobby-desc');
        // Find the toggle button inside this hobby item
        const btn = item.querySelector('.toggle-hobby-btn');
        // If either the description or button is missing, skip this hobby
        if (!descSpan || !btn) return;
        
        // Store the full text of the description
        const fullText = descSpan.innerText;
        // Set a character limit for the short preview (60 characters)
        const limit = 60;
        // If the text is shorter than or equal to the limit, no need for a button
        if (fullText.length <= limit) {
            btn.style.display = 'none'; // Hide the button
            return; // Skip to the next hobby
        }
        // Create a shortened version: first (limit-3) characters plus ellipsis
        const shortText = fullText.slice(0, limit - 3) + '…';
        // Replace the description with the short version initially
        descSpan.innerText = shortText;
        // Track whether the full text is currently visible (false = collapsed)
        let expanded = false;
        
        // Add click event listener to the button
        btn.addEventListener('click', function(e) {
            // Stop the click from bubbling up to parent elements
            e.stopPropagation();
            // If currently collapsed (showing short text)
            if (!expanded) {
                // Show the full text
                descSpan.innerText = fullText;
                // Change button text to 'Read Less'
                btn.textContent = 'Read Less';
                // Update expanded flag to true
                expanded = true;
            } else {
                // If expanded, show the short text again
                descSpan.innerText = shortText;
                // Change button text back to 'Read More'
                btn.textContent = 'Read More';
                // Update expanded flag to false
                expanded = false;
            }
        }); // End of button click listener
    }); // End of forEach loop on hobby items

    // ========== 5. LIGHTBOX FOR PROFILE IMAGE ==========
    // Select the profile image (class 'clickable-img')
    const img = document.querySelector('.clickable-img');
    // Only proceed if the image exists
    if (img) {
        // Create a div element for the lightbox overlay
        const lightbox = document.createElement('div');
        // Give it an ID for potential styling
        lightbox.id = 'lightbox';
        // Apply CSS styles: fixed full-screen, dark background with blur, centered flex
        lightbox.style.cssText = `position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; visibility: hidden; opacity: 0; transition: 0.25s; z-index: 10000;`;
        // Add inner HTML: a close button (X) and an image to show the enlarged photo
        lightbox.innerHTML = `<span style="position:absolute; top:20px; right:30px; font-size:40px; color:white; cursor:pointer;">&times;</span><img id="enlargedImg" style="max-width:85%; max-height:85%; border-radius:20px; border:3px solid #f97316;">`;
        // Append the lightbox to the document body
        document.body.appendChild(lightbox);
        // Get references to the close button and the inner image
        const closeSpan = lightbox.querySelector('span');
        const enlargedImg = lightbox.querySelector('#enlargedImg');
        
        // When the profile image is clicked
        img.addEventListener('click', () => {
            // Set the source of the enlarged image to the same as the profile image
            enlargedImg.src = img.src;
            // Make the lightbox visible
            lightbox.style.visibility = 'visible';
            // Fade it in
            lightbox.style.opacity = '1';
            // Prevent background scrolling while lightbox is open
            document.body.style.overflow = 'hidden';
        }); // End of profile image click listener
        
        // Function to close the lightbox
        function closeLightbox() {
            lightbox.style.visibility = 'hidden'; // Hide the lightbox
            lightbox.style.opacity = '0'; // Fade out
            document.body.style.overflow = ''; // Restore background scrolling
        } // End of closeLightbox function
        
        // Close when the X button is clicked
        closeSpan.addEventListener('click', closeLightbox);
        // Close when the overlay background (not the image) is clicked
        lightbox.addEventListener('click', (e) => { 
            if (e.target === lightbox) closeLightbox(); 
        });
    } // End of if(img exists)

    // ========== 6. SCROLL TO TOP BUTTON ==========
    // Try to find an existing scroll-to-top button (to avoid duplicates)
    let topBtn = document.querySelector('.scroll-top-btn');
    // If it doesn't exist, create it
    if (!topBtn) {
        topBtn = document.createElement('button'); // Create a new button
        topBtn.className = 'scroll-top-btn'; // Give it a class name
        topBtn.innerHTML = '⬆️ Top'; // Set button text
        // Apply CSS styles: fixed position at bottom-right, orange background
        topBtn.style.cssText = `position: fixed; bottom: 25px; right: 25px; background: #f97316; color: #2d1a0e; border: none; border-radius: 50px; padding: 10px 18px; cursor: pointer; font-weight: bold; opacity: 0; visibility: hidden; transition: 0.3s; z-index: 9999;`;
        // Add the button to the document body
        document.body.appendChild(topBtn);
    } // End of if(button doesn't exist)
    
    // Listen to scroll events on the window
    window.addEventListener('scroll', () => {
        // If the user has scrolled down more than 300 pixels
        if (window.scrollY > 300) {
            topBtn.style.opacity = '1'; // Make the button fully visible
            topBtn.style.visibility = 'visible'; // Ensure it's visible
        } else {
            topBtn.style.opacity = '0'; // Fade out the button
            topBtn.style.visibility = 'hidden'; // Hide it completely
        }
    }); // End of scroll event listener
    
    // When the button is clicked, smoothly scroll back to the top of the page
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    // ========== 7. DARK / LIGHT MODE TOGGLE ==========
    // Try to find an existing theme toggle button (to avoid duplicates)
    let themeBtn = document.querySelector('.theme-toggle');
    // If it doesn't exist, create it
    if (!themeBtn) {
        themeBtn = document.createElement('button'); // Create a new button
        themeBtn.className = 'theme-toggle'; // Give it a class name
        themeBtn.innerHTML = '🌙 Dark Mode'; // Set initial button text
        // Apply CSS styles: fixed position at top-right, dark background, gold border
        themeBtn.style.cssText = `position: fixed; top: 20px; right: 20px; background: #2d1a0e; color: #fbbf24; border: 1px solid #fbbf24; border-radius: 40px; padding: 6px 18px; cursor: pointer; font-weight: bold; z-index: 10001;`;
        // Add the button to the document body
        document.body.appendChild(themeBtn);
    } // End of if(theme button doesn't exist)
    
    // Function to switch between dark and light themes
    // Parameter 'isDark' is true for dark mode, false for light mode
    function setTheme(isDark) {
        if (isDark) {
            // Dark mode: dark warm gradient background, light text
            document.body.style.background = 'linear-gradient(145deg, #2d1a0e 0%, #3d2a1a 100%)';
            document.body.style.color = '#f5e6d3';
            // Update button text to indicate switching to light mode
            themeBtn.innerHTML = '☀️ Light Mode';
        } else {
            // Light mode: soft cream gradient background, dark text
            document.body.style.background = 'linear-gradient(145deg, #fef3c7 0%, #ffedd5 100%)';
            document.body.style.color = '#2d1a0e';
            // Update button text to indicate switching back to dark mode
            themeBtn.innerHTML = '🌙 Dark Mode';
        }
    } // End of setTheme function
    
    // Check localStorage for a saved theme preference
    const savedTheme = localStorage.getItem('angelTheme');
    // If the saved preference is 'light', apply light mode; otherwise, default to dark mode
    if (savedTheme === 'light') {
        setTheme(false); // Light mode
    } else {
        setTheme(true); // Dark mode (default)
    }
    
    // Add click event to the theme toggle button
    themeBtn.addEventListener('click', () => {
        // Determine the current mode by checking the button text
        // If button shows '☀️ Light Mode', we are currently in dark mode
        const isDark = themeBtn.innerHTML === '☀️ Light Mode';
        // Apply the opposite theme
        setTheme(!isDark);
        // Save the new preference to localStorage
        localStorage.setItem('angelTheme', isDark ? 'light' : 'dark');
    }); // End of theme button click listener

}); // End of DOMContentLoaded event listener