// Wait for the entire HTML document to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. TYPEWRITER EFFECT ON THE HEADER TITLE ==========
    // Find the main heading <h1> inside <header> (contains "PERSONAL PORTFOLIO")
    var mainTitle = document.querySelector('header h1');
    if (mainTitle) {
        // Save the original text
        var fullTitleText = mainTitle.innerText;
        // Clear the heading content
        mainTitle.innerHTML = '';
        var index = 0;
        
        // Type one character every 80 milliseconds (smooth typewriter)
        var typeInterval = setInterval(function() {
            if (index < fullTitleText.length) {
                mainTitle.innerHTML += fullTitleText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval); // stop when done
            }
        }, 80);
    }

    // ========== 2. CLICKABLE SKILLS (with nested sub-skills) ==========
    // Find all top-level <li> that contain a nested <ul> (i.e., the main category items: Sports, Technical, Other Activities)
    var skillCategories = document.querySelectorAll('ul > li');
    for (var i = 0; i < skillCategories.length; i++) {
        var category = skillCategories[i];
        // Check if this <li> contains a <ul> (meaning it has sub-skills)
        var subUl = category.querySelector('ul');
        if (subUl) {
            // Create a small detail paragraph that will appear when the category is clicked
            var detailPara = document.createElement('p');
            detailPara.className = 'skill-detail';
            detailPara.style.cssText = 'font-size: 0.8rem; color: #7dd3fc; margin-top: 6px; display: none;';
            detailPara.innerText = '✨ Click any sub-skill to learn more about it! ✨';
            category.appendChild(detailPara);
            
            // Make the category look clickable
            category.style.cursor = 'pointer';
            
            // Add click event to toggle the detail message
            category.addEventListener('click', function(e) {
                // Prevent the click from also triggering on nested items
                e.stopPropagation();
                var detail = this.querySelector('.skill-detail');
                if (detail.style.display === 'none') {
                    detail.style.display = 'block';
                } else {
                    detail.style.display = 'none';
                }
            });
            
            // Now also make each sub-skill (nested <li>) individually clickable
            var subSkills = subUl.querySelectorAll('li');
            for (var j = 0; j < subSkills.length; j++) {
                var subSkill = subSkills[j];
                // Create a hidden message specific to that sub-skill
                var subDetail = document.createElement('span');
                subDetail.className = 'sub-skill-detail';
                subDetail.style.cssText = 'font-size: 0.7rem; color: #94a3b8; display: block; margin-left: 20px; display: none;';
                subDetail.innerText = '💡 I am actively improving this skill!';
                subSkill.appendChild(subDetail);
                subSkill.style.cursor = 'pointer';
                
                // Toggle the sub-detail when the sub-skill is clicked
                subSkill.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var detailSpan = this.querySelector('.sub-skill-detail');
                    if (detailSpan.style.display === 'none') {
                        detailSpan.style.display = 'block';
                    } else {
                        detailSpan.style.display = 'none';
                    }
                });
            }
        }
    }

    // ========== 3. TABLE SORT (by Year column) ==========
    var educationTable = document.querySelector('table');
    if (educationTable) {
        // Create a sort button above the table
        var sortBtn = document.createElement('button');
        sortBtn.textContent = '📅 Sort by Year (Oldest First)';
        sortBtn.style.cssText = 'margin: 15px 0; padding: 6px 16px; background: #0f172a; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 30px; cursor: pointer; font-weight: bold; transition: 0.2s;';
        sortBtn.addEventListener('mouseenter', function() { this.style.background = '#1e293b'; });
        sortBtn.addEventListener('mouseleave', function() { this.style.background = '#0f172a'; });
        
        // Insert the button before the table (the table is inside a section)
        educationTable.parentNode.insertBefore(sortBtn, educationTable);
        
        var ascending = true;  // true = oldest year first (ascending), false = newest first
        
        // Helper function: extract a 4-digit year from a string (e.g., "2023-2025" -> 2023)
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
            // Get all table rows inside <tbody> (skip the header row)
            var tbody = educationTable.querySelector('tbody');
            if (!tbody) return;
            var rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Sort the array of rows based on the year in the second column (index 1)
            rows.sort(function(rowA, rowB) {
                var yearA = extractYear(rowA.cells[1].innerText);
                var yearB = extractYear(rowB.cells[1].innerText);
                if (ascending) {
                    return yearA - yearB;   // smaller year first
                } else {
                    return yearB - yearA;   // larger year first
                }
            });
            // Re-append the rows in the new order (this moves them inside tbody)
            for (var i = 0; i < rows.length; i++) {
                tbody.appendChild(rows[i]);
                // Add a temporary highlight effect
                rows[i].style.transition = 'background 0.2s';
                rows[i].style.background = 'rgba(56,189,248,0.2)';
                setTimeout(function(row) {
                    row.style.background = '';
                }, 300, rows[i]);
            }
            // Update button text for the next click
            if (ascending) {
                sortBtn.textContent = '📅 Sort by Year (Newest First)';
            } else {
                sortBtn.textContent = '📅 Sort by Year (Oldest First)';
            }
        }
        
        // When button is clicked, toggle sorting order and resort
        sortBtn.addEventListener('click', function() {
            ascending = !ascending;
            sortTable();
        });
    }

     // ========== 4. HOBBIES: Read More / Read Less (FIXED CLOSURE ISSUE) ==========
// Find the unordered list (ul) that is inside the element with class 'hobbies'
var hobbiesList = document.querySelector('.hobbies ul');
// Check if the hobbies list actually exists on the page (to avoid errors)
if (hobbiesList) {
    // Get all list items (li) inside the hobbies list
    var hobbyItems = hobbiesList.querySelectorAll('li');
    // Loop through each hobby item using a standard for loop
    // We'll use an IIFE (Immediately Invoked Function Expression) to capture the current index
    for (var i = 0; i < hobbyItems.length; i++) {
        // Create an IIFE that runs immediately, passing the current index 'i'
        (function(index) {
            // Get the current list item (hobby) using the captured index
            var hobby = hobbyItems[index];
            // Get the full text content of the hobby, trimming any extra whitespace
            var fullText = hobby.innerText.trim();
            
            // Only add the read-more feature if the text is longer than 40 characters
            // (This threshold ensures short hobbies don't get a button)
            if (fullText.length > 40) {
                // Create a shortened version: first 37 characters plus an ellipsis
                var shortText = fullText.slice(0, 37) + '…';
                // Boolean flag to track whether the full text is currently shown
                var expanded = false;
                
                // Clear the hobby's inner HTML so we can rebuild it with interactive elements
                hobby.innerHTML = '';
                
                // Create a <span> element to hold the short version of the text
                var shortSpan = document.createElement('span');
                // Give it a class name for potential CSS styling
                shortSpan.className = 'hobby-short';
                // Set its text content to the shortened text
                shortSpan.textContent = shortText;
                
                // Create another <span> element to hold the full version of the text
                var fullSpan = document.createElement('span');
                fullSpan.className = 'hobby-full';
                // Initially hide the full span (display: none)
                fullSpan.style.display = 'none';
                // Set its text content to the original full text
                fullSpan.textContent = fullText;
                
                // Create a <button> element that will toggle between "More" and "Less"
                var btn = document.createElement('button');
                btn.className = 'readmore-hobby';
                // Set initial button text to "+ More"
                btn.textContent = '+ More';
                // Apply CSS styles inline: no background, no border, gold color, pointer cursor, margin, bold text
                btn.style.cssText = 'background:none; border:none; color:#ffb74d; cursor:pointer; margin-left:8px; font-weight:bold;'; 
   
                
                // Append the short span, full span, and button to the hobby list item
                hobby.appendChild(shortSpan);
                hobby.appendChild(fullSpan);
                hobby.appendChild(btn);
                
                // Add a click event listener to the button
                btn.addEventListener('click', function(e) {
                    // Stop the click event from bubbling up to parent elements (prevents unwanted side effects)
                    e.stopPropagation();
                    // If currently not expanded (showing short version)
                    if (!expanded) {
                        // Hide the short span
                        shortSpan.style.display = 'none';
                        // Show the full span (display: inline keeps it inline with any surrounding text)
                        fullSpan.style.display = 'inline';
                        // Change button text to "− Less"
                        btn.textContent = '− Less';
                        // Update the expanded flag to true
                        expanded = true;
                    } else {
                        // If expanded, show the short span again
                        shortSpan.style.display = 'inline';
                        // Hide the full span
                        fullSpan.style.display = 'none';
                        // Change button text back to "+ More"
                        btn.textContent = '+ More';
                        // Update the expanded flag to false
                        expanded = false;
                    }
                }); // End of button click event listener
            } // End of if (fullText.length > 40)
        })(i); // Call the IIFE immediately with the current index i
    } // End of for loop through hobbyItems
} // End of if (hobbiesList exists)



    // ========== 5. LIGHTBOX: Enlarge profile image when clicked ==========
    var profileImg = document.querySelector('.profile img');
    if (profileImg) {
        // Create lightbox overlay div
        var lightbox = document.createElement('div');
        lightbox.id = 'lightboxOverlay';
        lightbox.style.cssText = 'position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; visibility: hidden; opacity: 0; transition: 0.25s; z-index: 10000;';
        // Add close button (X) and an enlarged image
        lightbox.innerHTML = '<span style="position:absolute; top:20px; right:30px; font-size:40px; color:white; cursor:pointer;">&times;</span>' +
                             '<img id="enlargedImg" style="max-width:85%; max-height:85%; border-radius:20px; border:4px solid #38bdf8;">';
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

    // ========== 6. SCROLL TO TOP BUTTON (floating) ==========
    var scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.textContent = '⬆️ Top';
        scrollTopBtn.style.cssText = 'position: fixed; bottom: 25px; right: 25px; background: #38bdf8; color: #0f172a; border: none; border-radius: 50px; padding: 10px 18px; cursor: pointer; font-weight: bold; opacity: 0; visibility: hidden; transition: 0.3s; z-index: 9999;';
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

    // ========== 7. DARK / LIGHT MODE TOGGLE (extra cool feature) ==========
    var themeBtn = document.querySelector('.theme-toggle-btn');
    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle-btn';
        themeBtn.textContent = '🌙 Dark Mode';
        themeBtn.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #0f172a; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 40px; padding: 6px 18px; cursor: pointer; font-weight: bold; z-index: 10001; transition: 0.2s;';
        document.body.appendChild(themeBtn);
    }
    
    // Function to switch between dark (original) and light mode
    function setTheme(isDark) {
        if (isDark) {
            document.body.style.backgroundColor = '#0f172a';   // dark blue background
            document.body.style.color = '#e2e8f0';           // light gray text
            themeBtn.textContent = '☀️ Light Mode';
            // Also adjust header styling if needed (original header has no explicit background)
            var headerElem = document.querySelector('header');
            if (headerElem) headerElem.style.backgroundColor = 'transparent';
        } else {
            document.body.style.backgroundColor = '#f8fafc';   // very light gray/white
            document.body.style.color = '#0f172a';            // dark text
            themeBtn.textContent = '🌙 Dark Mode';
            var headerElem = document.querySelector('header');
            if (headerElem) headerElem.style.backgroundColor = 'transparent';
        }
    }
    
    // Check localStorage for saved preference (default is dark)
    var savedTheme = localStorage.getItem('edwinTheme');
    if (savedTheme === 'light') {
        setTheme(false);
    } else {
        setTheme(true);  // dark mode default (matches original CSS)
    }
    
    // Toggle theme when button is clicked
    themeBtn.addEventListener('click', function() {
        // Check current background to determine if dark mode is active
        var isCurrentlyDark = (document.body.style.backgroundColor === 'rgb(15, 23, 42)');
        if (isCurrentlyDark) {
            setTheme(false);
            localStorage.setItem('edwinTheme', 'light');
        } else {
            setTheme(true);
            localStorage.setItem('edwinTheme', 'dark');
        }
    });

}); // end of DOMContentLoaded