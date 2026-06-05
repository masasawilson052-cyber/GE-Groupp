// Wait for the entire HTML document to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {

    // ---------- 1. DIGITAL CLOCK IN THE HEADER (right side) ----------
    // Find the header element
    var header = document.querySelector('header');
    if (header) {
        // Create a new span element to hold the clock
        var clockSpan = document.createElement('span');
        clockSpan.id = 'liveClock';
        // Style it to look like the existing design
        clockSpan.style.cssText = 'font-family: monospace; font-size: 1rem; background: #1a1208; padding: 4px 12px; border-radius: 30px; border: 1px solid #c8702a;';
        // Insert the clock inside the header, but on the right side
        // The header already uses flexbox with space-between, so appending works
        header.appendChild(clockSpan);
        
        // Function to update the clock every second
        function updateClock() {
            var now = new Date();
            var timeString = now.toLocaleTimeString();  // e.g., "14:35:07"
            clockSpan.textContent = timeString;
        }
        updateClock();                 // show immediately
        setInterval(updateClock, 1000); // update every second
    }

    // ---------- 2. TYPEWRITER EFFECT ON THE HERO GREETING ----------
    // Find the <h1> element that contains "Hello! I'm Angel Mobily"
    var heroHeading = document.querySelector('h1');
    if (heroHeading) {
        // Save the full original text
        var fullText = heroHeading.innerText;
        // Clear the heading content
        heroHeading.innerHTML = '';
        var index = 0;
        
        // Type one character every 50 milliseconds
        var typeInterval = setInterval(function() {
            if (index < fullText.length) {
                heroHeading.innerHTML += fullText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval); // stop when done
            }
        }, 50);
    }

    // ---------- 3. SKILLS: Click on any skill to see an extra hint ----------
    // Select all list items inside .skills-grid
    var skillItems = document.querySelectorAll('.skills-grid li');
    for (var i = 0; i < skillItems.length; i++) {
        var skill = skillItems[i];
        // Store the skill name (remove any extra spaces)
        var skillName = skill.innerText.trim();
        
        // Create a small hidden paragraph that will appear when clicked
        var detailPara = document.createElement('p');
        detailPara.className = 'skill-detail';
        detailPara.style.cssText = 'font-size: 0.75rem; color: #c8702a; margin-top: 6px; display: none;';
        detailPara.innerText = '✨ I am improving this skill every week!';
        skill.appendChild(detailPara);
        
        // Make the skill look clickable
        skill.style.cursor = 'pointer';
        // Add click event listener
        skill.addEventListener('click', function(e) {
            // Prevent the click from bubbling up (just in case)
            e.stopPropagation();
            // Find the detail paragraph inside this skill
            var detail = this.querySelector('.skill-detail');
            // Toggle visibility: if hidden, show it; if visible, hide it
            if (detail.style.display === 'none') {
                detail.style.display = 'block';
            } else {
                detail.style.display = 'none';
            }
        });
    }

    // ---------- 4. TABLE SORT (sort by Year column only) ----------
    var educationTable = document.querySelector('table');
    if (educationTable) {
        // Create a sort button above the table
        var sortBtn = document.createElement('button');
        sortBtn.textContent = '📅 Sort by Year (Ascending)';
        sortBtn.style.cssText = 'margin: 15px 0; padding: 6px 16px; background: #1a1208; color: #c8702a; border: 1px solid #c8702a; border-radius: 30px; cursor: pointer; font-weight: bold;';
        // Insert the button before the table
        educationTable.parentNode.insertBefore(sortBtn, educationTable);
        
        var ascending = true;  // true = oldest first, false = newest first
        
        // Helper function: extract a 4-digit year from a string (e.g., "2008-2018" -> 2008)
        function extractYear(text) {
            var match = text.match(/\d{4}/);
            if (match) {
                return parseInt(match[0], 10);
            } else {
                return 0;
            }
        }
        
        // Function to sort the table rows
        function sortTable() {
            // Get all table rows except the header row (skip first row)
            var rows = Array.from(educationTable.querySelectorAll('tr')).slice(1);
            // Sort the array of rows based on the year in the third column (index 2)
            rows.sort(function(rowA, rowB) {
                var yearA = extractYear(rowA.cells[2].innerText);
                var yearB = extractYear(rowB.cells[2].innerText);
                if (ascending) {
                    return yearA - yearB;   // smaller year first
                } else {
                    return yearB - yearA;   // larger year first
                }
            });
            // Re-append the rows in the new order
            for (var i = 0; i < rows.length; i++) {
                educationTable.appendChild(rows[i]);
                // Add a temporary highlight effect
                rows[i].style.transition = 'background 0.2s';
                rows[i].style.background = '#2a1f10';
                setTimeout(function(row) {
                    row.style.background = '';
                }, 300, rows[i]);
            }
            // Update button text for the next click
            if (ascending) {
                sortBtn.textContent = '📅 Sort by Year (Descending)';
            } else {
                sortBtn.textContent = '📅 Sort by Year (Ascending)';
            }
        }
        
        // When button is clicked, toggle sorting order and resort
        sortBtn.addEventListener('click', function() {
            ascending = !ascending;
            sortTable();
        });
    }

   // ---------- 5. HOBBIES: Read More / Read Less (FIXED CLOSURE BUG) ----------

    var skillsList = document.querySelector('.skills-grid');
    // If the skills list doesn't exist, stop the script
    if (!skillsList) return;

    // Get all list items inside the skills list
    var skillItems = skillsList.querySelectorAll('li');
    
    // Loop through each skill using a for loop
    for (var i = 0; i < skillItems.length; i++) {
        // Use an IIFE (Immediately Invoked Function Expression) to capture the current skill
        (function(index) {
            var skill = skillItems[index];            // Current skill <li>
            var originalHtml = skill.innerHTML;       // Full HTML content (preserves <strong>)
            var originalText = skill.innerText.trim(); // Plain text for length check
            
            // Set a character limit (adjust as needed)
            var limit = 80;
            
            // Only add read-more if the text is longer than the limit
            if (originalText.length > limit) {
                // Extract the <strong> part and the description
                var strongTag = skill.querySelector('strong');
                var strongText = strongTag ? strongTag.outerHTML : '';
                
                // Get the description text (remove the strong part)
                var description = originalText.replace(strongTag ? strongTag.innerText : '', '').trim();
                
                // Shorten the description (first part up to limit characters, minus strong tag length)
                var shortDescription = description.substring(0, limit - strongText.length) + '…';
                
                // Create short version HTML
                var shortHtml = strongText + ' ' + shortDescription;
                
                var expanded = false;   // Track expanded state
                
                // Clear the skill and rebuild with spans and button
                skill.innerHTML = '';   // Clear current content
                
                // Create short text span
                var shortSpan = document.createElement('span');
                shortSpan.className = 'skill-short';
                shortSpan.innerHTML = shortHtml;
                
                // Create full text span (hidden initially)
                var fullSpan = document.createElement('span');
                fullSpan.className = 'skill-full';
                fullSpan.style.display = 'none';
                fullSpan.innerHTML = originalHtml;   // Preserve original formatting
                
                // Create the toggle button
                var btn = document.createElement('button');
                btn.className = 'skill-readmore-btn';
                btn.textContent = '+ More';
                btn.style.cssText = 'background: none; border: none; color: #ffb74d; cursor: pointer; margin-left: 8px; font-weight: bold;';
                
                // Append everything to the skill list item
                skill.appendChild(shortSpan);
                skill.appendChild(fullSpan);
                skill.appendChild(btn);
                
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

    // ---------- 6. LIGHTBOX: Enlarge profile image when clicked ----------
    var profileImg = document.querySelector('.profile-pic');
    if (profileImg) {
        // Create lightbox overlay div
        var lightbox = document.createElement('div');
        lightbox.id = 'lightboxOverlay';
        lightbox.style.cssText = 'position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; visibility: hidden; opacity: 0; transition: 0.25s; z-index: 10000;';
        // Add close button (X) and an enlarged image
        lightbox.innerHTML = '<span style="position:absolute; top:20px; right:30px; font-size:40px; color:white; cursor:pointer;">&times;</span>' +
                             '<img id="enlargedImg" style="max-width:85%; max-height:85%; border-radius:20px; border:4px solid #c8702a;">';
        document.body.appendChild(lightbox);
        
        var closeSpan = lightbox.querySelector('span');
        var enlargedImg = lightbox.querySelector('#enlargedImg');
        
        // When profile picture is clicked, show lightbox with the same image
        profileImg.style.cursor = 'pointer';
        profileImg.addEventListener('click', function() {
            enlargedImg.src = profileImg.src;
            lightbox.style.visibility = 'visible';
            lightbox.style.opacity = '1';
            document.body.style.overflow = 'hidden';  // prevent background scrolling
        });
        
        // Function to close the lightbox
        function closeLightbox() {
            lightbox.style.visibility = 'hidden';
            lightbox.style.opacity = '0';
            document.body.style.overflow = '';
        }
        // Close when clicking the X button or the background
        closeSpan.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // ---------- 7. SCROLL TO TOP BUTTON (floating) ----------
    var scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.textContent = '⬆️ Top';
        scrollTopBtn.style.cssText = 'position: fixed; bottom: 25px; right: 25px; background: #c8702a; color: #1a1208; border: none; border-radius: 50px; padding: 10px 18px; cursor: pointer; font-weight: bold; opacity: 0; visibility: hidden; transition: 0.3s; z-index: 9999;';
        document.body.appendChild(scrollTopBtn);
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Smooth scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- 8. DARK / LIGHT MODE TOGGLE (extra cool feature) ----------
    var themeBtn = document.querySelector('.theme-toggle-btn');
    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle-btn';
        themeBtn.textContent = '🌙 Dark Mode';
        themeBtn.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #1a1208; color: #c8702a; border: 1px solid #c8702a; border-radius: 40px; padding: 6px 18px; cursor: pointer; font-weight: bold; z-index: 10001;';
        document.body.appendChild(themeBtn);
    }
    
    // Function to switch between dark (original) and light mode
    function setTheme(isDark) {
        if (isDark) {
            document.body.style.backgroundColor = '#0f172a';
            document.body.style.color = 'whitesmoke';
            themeBtn.textContent = '☀️ Light Mode';
            // Also adjust header background
            var headerElem = document.querySelector('header');
            if (headerElem) headerElem.style.backgroundColor = '#1a1208';
        } else {
            document.body.style.backgroundColor = '#f5f0e8';
            document.body.style.color = '#1a1208';
            themeBtn.textContent = '🌙 Dark Mode';
            var headerElem = document.querySelector('header');
            if (headerElem) headerElem.style.backgroundColor = '#e0d6c0';
        }
    }
    
    // Check localStorage for saved preference (default is dark)
    var savedTheme = localStorage.getItem('angelTheme');
    if (savedTheme === 'light') {
        setTheme(false);
    } else {
        setTheme(true);  // dark mode default
    }
    
    // Toggle theme when button is clicked
    themeBtn.addEventListener('click', function() {
        var isCurrentlyDark = (document.body.style.backgroundColor === 'rgb(15, 23, 42)');
        if (isCurrentlyDark) {
            setTheme(false);
            localStorage.setItem('angelTheme', 'light');
        } else {
            setTheme(true);
            localStorage.setItem('angelTheme', 'dark');
        }
    });
    
}); // end of DOMContentLoaded