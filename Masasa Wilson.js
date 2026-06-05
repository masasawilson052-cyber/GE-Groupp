document.addEventListener('DOMContentLoaded', function() {

    // ==================== 1. TYPEWRITER EFFECT ON HEADER ====================
    // Select the first <h1> element that is a direct child of <header>
    var mainTitle = document.querySelector('header h1');
    // Check if that element actually exists on the page
    if (mainTitle) {
        // Store the original text content as a string
        var fullTitleText = mainTitle.innerText;
        // Clear the heading so it starts empty (typewriter effect)
        mainTitle.innerHTML = '';
        // Initialize a counter to track which character we are at
        var index = 0;
        
        // Set up an interval that runs every 80 milliseconds
        var typeInterval = setInterval(function() {
            // If there are still characters left to type...
            if (index < fullTitleText.length) {
                // Add the next character to the heading's HTML
                mainTitle.innerHTML += fullTitleText.charAt(index);
                // Move to the next character position
                index++;
            } else {
                // When all characters have been typed, stop the interval
                clearInterval(typeInterval);
            }
        }, 80); // 80ms delay between characters gives a smooth typing feel
    } // End of typewriter if block

    // ==================== 2. INTERACTIVE SKILLS (with nested sub-skills) ====================
    // Select every <li> that is a direct child of a <ul> (top-level list items)
    var allListItems = document.querySelectorAll('ul > li');
    // Loop through each top-level list item using a traditional for loop
    for (var i = 0; i < allListItems.length; i++) {
        // Store the current list item in a variable for clarity
        var li = allListItems[i];
        // Check if this <li> contains a nested <ul> (meaning it's a category like "Sports")
        if (li.querySelector('ul')) {
            // Create a new paragraph element to hold extra detail text
            var detailPara = document.createElement('p');
            // Give it a class name for potential CSS styling
            detailPara.className = 'skill-detail';
            // Apply inline CSS styles: small font, light blue color, top margin, hidden initially
            detailPara.style.cssText = 'font-size: 0.8rem; color: #7dd3fc; margin-top: 6px; display: none;';
            // Set the text content of the paragraph
            detailPara.innerText = '✨ Click any sub-skill below to learn more! ✨';
            // Append this paragraph as a child of the current list item
            li.appendChild(detailPara);
            
            // Change the mouse cursor to a pointer when hovering over the category
            li.style.cursor = 'pointer';
            
            // Add a click event listener to the category <li>
            li.addEventListener('click', function(e) {
                // Stop the click event from bubbling up to parent elements
                e.stopPropagation();
                // Find the '.skill-detail' paragraph inside this clicked element
                var detail = this.querySelector('.skill-detail');
                // If the paragraph is currently hidden (display: none), show it
                if (detail.style.display === 'none') {
                    detail.style.display = 'block';
                } else {
                    // Otherwise, hide it again
                    detail.style.display = 'none';
                }
            }); // End of category click listener
            
            // Now select all sub-skills (nested <li> elements inside the nested <ul>)
            var subSkills = li.querySelectorAll('ul li');
            // Loop through each sub-skill
            for (var j = 0; j < subSkills.length; j++) {
                var subSkill = subSkills[j];
                // Create a <span> element to hold a message specific to this sub-skill
                var subDetail = document.createElement('span');
                subDetail.className = 'sub-skill-detail';
                // Apply CSS: small font, gray color, block display, left margin, hidden initially
                subDetail.style.cssText = 'font-size: 0.7rem; color: #94a3b8; display: block; margin-left: 20px; display: none;';
                subDetail.innerText = '💡 I am actively improving this skill!';
                // Add the span to the sub-skill list item
                subSkill.appendChild(subDetail);
                // Make the sub-skill look clickable
                subSkill.style.cursor = 'pointer';
                
                // Add a click event listener to each sub-skill
                subSkill.addEventListener('click', function(e) {
                    // Prevent the click from also triggering the parent category click
                    e.stopPropagation();
                    // Find the detail span inside this sub-skill
                    var detailSpan = this.querySelector('.sub-skill-detail');
                    // Toggle its visibility: show if hidden, hide if shown
                    if (detailSpan.style.display === 'none') {
                        detailSpan.style.display = 'block';
                    } else {
                        detailSpan.style.display = 'none';
                    }
                }); // End of sub-skill click listener
            } // End of sub-skills for loop
        } // End of if(has nested ul)
    } // End of top-level list items for loop

    // ==================== 3. TABLE SORT (by Year) - FIXED ====================
    // Select the first <table> element on the page (the education table)
    var educationTable = document.querySelector('table');
    // Only proceed if a table exists
    if (educationTable) {
        // Create a new button element for sorting
        var sortBtn = document.createElement('button');
        // Set initial button text
        sortBtn.textContent = '📅 Sort by Year (Oldest First)';
        // Apply CSS styles: dark background, blue text, border, rounded corners, etc.
        sortBtn.style.cssText = 'margin: 15px 0; padding: 6px 16px; background: #0f172a; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 30px; cursor: pointer; font-weight: bold; transition: 0.2s;';
        // Add hover effect: darker background on mouse enter
        sortBtn.addEventListener('mouseenter', function() { this.style.background = '#1e293b'; });
        // Restore original background on mouse leave
        sortBtn.addEventListener('mouseleave', function() { this.style.background = '#0f172a'; });
        
        // Insert the button before the table in the DOM (so it appears above the table)
        educationTable.parentNode.insertBefore(sortBtn, educationTable);
        
        // Variable to track sort order: true = ascending (oldest first), false = descending (newest first)
        var ascending = true;
        
        // Helper function: extract the first 4-digit number from a text string
        // e.g., "2025-CURRENT" returns 2025, "2023-2025" returns 2023
        function extractYear(text) {
            // Use regular expression to find any 4-digit number
            var match = text.match(/\d{4}/);
            // If a match is found, convert it to an integer and return it
            if (match) {
                return parseInt(match[0], 10);
            } else {
                // If no year found, return 0 (so it sorts at the beginning or end)
                return 0;
            }
        } // End of extractYear function
        
        // Function to sort the table rows based on the Year column
        function sortTable() {
            // Get the <tbody> element that contains the actual data rows
            var tbody = educationTable.querySelector('tbody');
            // If there's no tbody, exit the function
            if (!tbody) return;
            // Get all rows inside tbody and convert the NodeList to an array for sorting
            var rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Sort the array of rows using a custom comparison function
            rows.sort(function(rowA, rowB) {
                // Extract year from the second column (index 1) of each row
                var yearA = extractYear(rowA.cells[1].innerText);
                var yearB = extractYear(rowB.cells[1].innerText);
                // If ascending is true, sort smaller years first (older)
                if (ascending) {
                    return yearA - yearB;
                } else {
                    // Otherwise, sort larger years first (newer)
                    return yearB - yearA;
                }
            }); // End of rows.sort
            
            // Now re-append each row in the sorted order
            // (appending an existing element automatically moves it in the DOM)
            for (var i = 0; i < rows.length; i++) {
                tbody.appendChild(rows[i]);
                // Add a temporary background highlight to show the row was sorted
                rows[i].style.transition = 'background 0.2s';
                rows[i].style.background = 'rgba(56,189,248,0.2)';
                // After 300 milliseconds, remove the highlight
                setTimeout(function(row) {
                    row.style.background = '';
                }, 300, rows[i]);
            } // End of for loop through rows
            
            // Update the button text to indicate the next click will reverse order
            if (ascending) {
                sortBtn.textContent = '📅 Sort by Year (Newest First)';
            } else {
                sortBtn.textContent = '📅 Sort by Year (Oldest First)';
            }
        } // End of sortTable function
        
        // Add a click event listener to the sort button
        sortBtn.addEventListener('click', function() {
            // Toggle the sorting order (if it was ascending, make it descending, and vice versa)
            ascending = !ascending;
            // Call the sortTable function to re-sort with the new order
            sortTable();
        }); // End of button click listener
    } // End of if(table exists)


  // ======================= 4. HOBBIES: READ MORE / READ LESS =======================
      var hobbiesList = document.querySelector('.hobbies ul');
    // If the hobbies list doesn't exist, stop the script
    if (!hobbiesList) return;

    // Get all list items inside the hobbies list
    var hobbyItems = hobbiesList.querySelectorAll('li');
    
    // Loop through each hobby using a for loop
    for (var i = 0; i < hobbyItems.length; i++) {
        // Use an IIFE (Immediately Invoked Function Expression) to capture the current hobby
        (function(index) {
            var hobby = hobbyItems[index];                // Current hobby <li>
            var originalText = hobby.innerText.trim();   // Full text of the hobby
            
            // Set a character limit (adjust as needed)
            var limit = 60;
            
            // Only add read-more if the text is longer than the limit
            if (originalText.length > limit) {
                // Create short version: first (limit - 3) characters + "..."
                var shortText = originalText.slice(0, limit - 3) + '…';
                var expanded = false;                     // Track expanded state
                
                // Save the original HTML (in case there are <strong> tags inside)
                var originalHtml = hobby.innerHTML;
                
                // Clear the hobby and rebuild with spans and a button
                hobby.innerHTML = '';  // Clear current content
                
                // Create short text span
                var shortSpan = document.createElement('span');
                shortSpan.className = 'hobby-short';
                shortSpan.textContent = shortText;
                
                // Create full text span (hidden initially)
                var fullSpan = document.createElement('span');
                fullSpan.className = 'hobby-full';
                fullSpan.style.display = 'none';
                fullSpan.innerHTML = originalHtml;  // Preserve <strong> tags
                
                // Create the toggle button
                var btn = document.createElement('button');
                btn.className = 'hobby-readmore-btn';
                btn.textContent = '+ More';
                btn.style.cssText = 'background: none; border: none; color: #ffb74d; cursor: pointer; margin-left: 8px; font-weight: bold;';
                
                // Append everything to the hobby
                hobby.appendChild(shortSpan);
                hobby.appendChild(fullSpan);
                hobby.appendChild(btn);
                
                // Add click event to the button
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();   // Prevent any unwanted parent clicks
                    if (!expanded) {
                        shortSpan.style.display = 'none';
                        fullSpan.style.display = 'inline';
                        this.textContent = '− Less';
                        expanded = true;
                    } else {
                        shortSpan.style.display = 'inline';
                        fullSpan.style.display = 'none';
                        this.textContent = '+ More';
                        expanded = false;
                    }
                });
            }
        })(i);  // Pass the current index to the IIFE
    }

    // ==================== 5. LIGHTBOX: ENLARGE PROFILE PICTURE ====================
    // Select the profile image inside .profile div
    var profileImg = document.querySelector('.profile img');
    // Only proceed if the image exists
    if (profileImg) {
        // Create a new div element to serve as the lightbox overlay
        var lightbox = document.createElement('div');
        // Give it an id for potential CSS or debugging
        lightbox.id = 'lightboxOverlay';
        // Apply CSS for fixed full-screen overlay with dark background and blur effect
        lightbox.style.cssText = 'position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; visibility: hidden; opacity: 0; transition: 0.25s; z-index: 10000;';
        // Add inner HTML: a close button (X) and an image that will show the enlarged photo
        lightbox.innerHTML = '<span style="position:absolute; top:20px; right:30px; font-size:40px; color:white; cursor:pointer;">&times;</span>' +
                             '<img id="enlargedImg" style="max-width:85%; max-height:85%; border-radius:20px; border:4px solid #38bdf8;">';
        // Append the lightbox to the document body (so it appears on top of everything)
        document.body.appendChild(lightbox);
        
        // Get references to the close button and the inner image
        var closeSpan = lightbox.querySelector('span');
        var enlargedImg = lightbox.querySelector('#enlargedImg');
        
        // Make the profile image cursor change to a pointer to indicate it's clickable
        profileImg.style.cursor = 'pointer';
        // When the profile image is clicked, show the lightbox
        profileImg.addEventListener('click', function() {
            // Set the src of the enlarged image to the same as the profile image
            enlargedImg.src = profileImg.src;
            // Make the lightbox visible (CSS visibility)
            lightbox.style.visibility = 'visible';
            // Fade it in (opacity 1)
            lightbox.style.opacity = '1';
            // Prevent the background page from scrolling while lightbox is open
            document.body.style.overflow = 'hidden';
        }); // End of profile image click listener
        
        // Function to close the lightbox (hide it)
        function closeLightbox() {
            lightbox.style.visibility = 'hidden';
            lightbox.style.opacity = '0';
            // Re-enable background scrolling
            document.body.style.overflow = '';
        } // End of closeLightbox function
        
        // When the close (X) button is clicked, call closeLightbox
        closeSpan.addEventListener('click', closeLightbox);
        // When the overlay background itself is clicked (but not the inner image), also close
        lightbox.addEventListener('click', function(e) {
            // If the clicked element is exactly the lightbox div (the background), close it
            if (e.target === lightbox) closeLightbox();
        });
    } // End of if(profileImg exists)

    // ==================== 6. SCROLL TO TOP BUTTON ====================
    // Try to find an existing scroll-to-top button (to avoid duplicates)
    var scrollTopBtn = document.querySelector('.scroll-top-btn');
    // If it doesn't exist, create it
    if (!scrollTopBtn) {
        // Create a new button element
        scrollTopBtn = document.createElement('button');
        // Give it a class name
        scrollTopBtn.className = 'scroll-top-btn';
        // Set button text
        scrollTopBtn.textContent = '⬆️ Top';
        // Apply CSS styles: fixed position at bottom-right, blue background, round edges
        scrollTopBtn.style.cssText = 'position: fixed; bottom: 25px; right: 25px; background: #38bdf8; color: #0f172a; border: none; border-radius: 50px; padding: 10px 18px; cursor: pointer; font-weight: bold; opacity: 0; visibility: hidden; transition: 0.3s; z-index: 9999;';
        // Add the button to the document body
        document.body.appendChild(scrollTopBtn);
    } // End of if(button doesn't exist)
    
    // Listen to scroll events on the window
    window.addEventListener('scroll', function() {
        // If the user has scrolled down more than 300 pixels
        if (window.scrollY > 300) {
            // Make the button fully visible (fade in)
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            // Otherwise, hide it (fade out)
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    }); // End of scroll event listener
    
    // When the scroll-to-top button is clicked, smoothly scroll back to the top of the page
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }); // End of button click listener

   // ======================= 6. DARK / LIGHT MODE TOGGLE =======================
    let themeBtn = document.querySelector('.theme-toggle-asaph');
    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle-asaph';
        themeBtn.textContent = '☀️ Light Mode';
        themeBtn.style.cssText = `position:fixed; top:20px; right:20px; background:#00e5ff; color:#0d1117; border:none; border-radius:30px; padding:8px 18px; cursor:pointer; z-index:1001; font-weight:bold;`;
        document.body.appendChild(themeBtn);
    }
    if (localStorage.getItem('Masasa-theme') === 'light') {
        document.body.classList.add('Masasa-light-mode');
        themeBtn.textContent = '🌙 Dark Mode';
    }
    // Inject light mode CSS if not present
    if (!document.getElementById('Masasa-light-styles')) {
        const style = document.createElement('style');
        style.id = 'Masasa-light-styles';
        style.textContent = `
            body.Masasa-light-mode { background: #f5f7fa !important; color: #1e293b !important; }
            body.Masasa-light-mode .profile img { border-color: #3b82f6; }
            body.Masasa-light-mode h1 { color: #2563eb; border-bottom-color: #2563eb; }
            body.Masasa-light-mode h2 { color: #7c3aed; }
            body.Masasa-light-mode p, body.asaph-light-mode li { color: #334155; }
            body.Masasa-light-mode ul, body.asaph-light-mode ol, body.Masasa-light-mode table { background: #ffffff; border-color: #e2e8f0; }
            body.Masasa-light-mode tr:hover { background: #f1f5f9; }
            body.Masasa-light-mode a { color: #2563eb; }
            body.Masasa-light-mode .skill-detail { background: rgba(37,99,235,0.08); border-left-color: #3b82f6; }
        `;
        document.head.appendChild(style);
    }
    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('Masasa-light-mode');
        localStorage.setItem('asaph-theme', isLight ? 'light' : 'dark');
        themeBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
    });

}); // End of DOMContentLoaded event listener