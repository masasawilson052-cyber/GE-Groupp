// asaph.js – Asaph Koroto | Complete interactive portfolio
// Features: skill expand, table sort, read more/less, lightbox, scroll-to-top, dark/light toggle
// All selectors work with the exact HTML structure provided. No invalid CSS selectors.

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ======================= 1. SKILLS: Click on category to see hidden details =======================
    // Find the "Skills" section by looking for an <h1> with text "Skills"
    const skillsHeading = Array.from(document.querySelectorAll('h1')).find(h => h.textContent.trim() === 'Skills');
    if (skillsHeading) {
        // Get the next sibling elements: after Skills heading, there's a subheading "Technical Skills" then a <ul>
        let next = skillsHeading.nextElementSibling;
        let skillItems = [];
        // Collect all <li> that contain nested <ul> (these are categories like "leadership skills")
        while (next && next.tagName !== 'H1') {
            if (next.tagName === 'UL') {
                const lis = next.querySelectorAll('li');
                lis.forEach(li => {
                    if (li.querySelector('ul')) {
                        skillItems.push(li);
                    }
                });
            }
            next = next.nextElementSibling;
        }
        // Define detail texts for each skill category
        const detailsMap = {
            'leadership skills': '🏅 I lead group projects and coach junior students. Leadership taught me communication, responsibility, and how to motivate teams – essential for software development.',
            'Excel': '📊 I use Excel for data analysis, budgeting, and dashboards. I’m learning advanced formulas and pivot tables.',
            'Problem Solving': '🧠 I break down complex problems into small steps. I practice daily with logic puzzles and coding challenges.',
            'Good in math and constructions': '📐 Math helps logical thinking. Construction gives precision – useful for debugging.',
            'Fast Learner': '⚡ I adapt quickly to new tools and technologies by building real projects.'
        };
        skillItems.forEach(li => {
            if (li.querySelector('.skill-detail')) return;
            const catText = li.innerText.split('\n')[0].trim().toLowerCase();
            let detail = detailsMap[catText] || '✨ I continuously improve this skill through practice and real-world projects.';
            const detailDiv = document.createElement('div');
            detailDiv.className = 'skill-detail hidden';
            detailDiv.style.cssText = 'margin-top: 12px; padding: 10px 14px; background: rgba(0,229,255,0.1); border-left: 3px solid #00e5ff; border-radius: 8px; font-size: 0.95rem;';
            detailDiv.innerHTML = `<p>${detail}</p>`;
            li.appendChild(detailDiv);
            li.style.cursor = 'pointer';
            li.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
                detailDiv.classList.toggle('hidden');
            });
        });
    }

    // ======================= 2. EDUCATION TABLE SORT =======================
    const table = document.querySelector('table');
    if (table) {
        // Find header row (first row with th)
        const headerRow = table.querySelector('tr');
        if (headerRow && headerRow.cells.length >= 3) {
            let sortAsc = true;
            let sortBtn = document.querySelector('.edu-sort-btn');
            if (!sortBtn) {
                sortBtn = document.createElement('button');
                sortBtn.className = 'edu-sort-btn';
                sortBtn.textContent = '📅 Sort by Year (Ascending)';
                sortBtn.style.cssText = 'margin: 20px 0 10px; padding: 8px 20px; background: #00e5ff; color: #0d1117; border: none; border-radius: 40px; cursor: pointer; font-weight: bold;';
                table.parentNode.insertBefore(sortBtn, table);
            }
            const getYear = (yearStr) => {
                const match = yearStr.match(/\d{4}/);
                return match ? parseInt(match[0], 10) : 0;
            };
            const sortRows = () => {
                const rows = Array.from(table.querySelectorAll('tr')).slice(1); // exclude header
                rows.sort((a, b) => {
                    const yearA = getYear(a.cells[2]?.innerText || '');
                    const yearB = getYear(b.cells[2]?.innerText || '');
                    return sortAsc ? yearA - yearB : yearB - yearA;
                });
                rows.forEach(row => table.appendChild(row));
                sortBtn.textContent = sortAsc ? '📅 Sort by Year (Descending)' : '📅 Sort by Year (Ascending)';
            };
            sortBtn.addEventListener('click', () => {
                sortAsc = !sortAsc;
                sortRows();
            });
        }
    }

    // ======================= 3. HOBBIES: READ MORE / READ LESS =======================
    const hobbiesHeading = Array.from(document.querySelectorAll('h1')).find(h => h.textContent.trim() === 'Hobbies & Interests');
    if (hobbiesHeading && hobbiesHeading.nextElementSibling && hobbiesHeading.nextElementSibling.tagName === 'UL') {
        const hobbyItems = hobbiesHeading.nextElementSibling.querySelectorAll('li');
        hobbyItems.forEach(item => {
            if (item.querySelector('.readmore-btn')) return;
            const fullText = item.innerText.trim();
            if (fullText.length <= 100) return;
            const shortText = fullText.slice(0, 95) + '…';
            const strongTag = item.querySelector('strong');
            const prefix = strongTag ? strongTag.outerHTML : '';
            const restText = fullText.replace(strongTag ? strongTag.innerText : '', '').trim();
            item.innerHTML = `${prefix} <span class="hobby-short">${shortText.replace(strongTag ? strongTag.innerText : '', '').trim()}</span><span class="hobby-full hidden">${restText}</span><button class="readmore-btn" style="background:none; border:none; color:#00e5ff; cursor:pointer; margin-left:8px; font-weight:bold;">Read More</button>`;
            const btn = item.querySelector('.readmore-btn');
            const shortSpan = item.querySelector('.hobby-short');
            const fullSpan = item.querySelector('.hobby-full');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const expanded = !fullSpan.classList.contains('hidden');
                fullSpan.classList.toggle('hidden', expanded);
                shortSpan.classList.toggle('hidden', !expanded);
                btn.textContent = expanded ? 'Read More' : 'Read Less';
            });
        });
    }

    // ======================= 4. IMAGE LIGHTBOX =======================
    const profileImg = document.querySelector('.profile img');
    if (profileImg && !document.querySelector('.custom-lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'custom-lightbox';
        lightbox.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); display:flex; align-items:center; justify-content:center; visibility:hidden; opacity:0; transition:0.2s; z-index:5000;`;
        lightbox.innerHTML = `<button class="lb-close" style="position:absolute; top:30px; right:40px; font-size:42px; background:none; border:none; color:white; cursor:pointer;">&times;</button><img class="lb-img" style="max-width:90%; max-height:85%; border-radius:16px;" src="">`;
        document.body.appendChild(lightbox);
        const lbImg = lightbox.querySelector('.lb-img');
        const lbClose = lightbox.querySelector('.lb-close');
        profileImg.style.cursor = 'pointer';
        profileImg.addEventListener('click', () => {
            lbImg.src = profileImg.src;
            lightbox.style.visibility = 'visible';
            lightbox.style.opacity = '1';
            document.body.style.overflow = 'hidden';
        });
        const closeLightbox = () => {
            lightbox.style.visibility = 'hidden';
            lightbox.style.opacity = '0';
            document.body.style.overflow = '';
        };
        lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    }

    // ======================= 5. SCROLL TO TOP BUTTON =======================
    let scrollBtn = document.querySelector('.scroll-top-btn');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top-btn';
        scrollBtn.innerHTML = '⬆️ Top';
        scrollBtn.style.cssText = `position:fixed; bottom:30px; right:30px; background:#9d4edd; color:white; border:none; border-radius:50px; padding:12px 22px; cursor:pointer; opacity:0; visibility:hidden; transition:0.3s; z-index:1000; font-weight:bold;`;
        document.body.appendChild(scrollBtn);
    }
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ======================= 6. DARK / LIGHT MODE TOGGLE =======================
    let themeBtn = document.querySelector('.theme-toggle-asaph');
    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle-asaph';
        themeBtn.textContent = '☀️ Light Mode';
        themeBtn.style.cssText = `position:fixed; top:20px; right:20px; background:#00e5ff; color:#0d1117; border:none; border-radius:30px; padding:8px 18px; cursor:pointer; z-index:1001; font-weight:bold;`;
        document.body.appendChild(themeBtn);
    }
    if (localStorage.getItem('asaph-theme') === 'light') {
        document.body.classList.add('asaph-light-mode');
        themeBtn.textContent = '🌙 Dark Mode';
    }
    // Inject light mode CSS if not present
    if (!document.getElementById('asaph-light-styles')) {
        const style = document.createElement('style');
        style.id = 'asaph-light-styles';
        style.textContent = `
            body.asaph-light-mode { background: #f5f7fa !important; color: #1e293b !important; }
            body.asaph-light-mode .profile img { border-color: #3b82f6; }
            body.asaph-light-mode h1 { color: #2563eb; border-bottom-color: #2563eb; }
            body.asaph-light-mode h2 { color: #7c3aed; }
            body.asaph-light-mode p, body.asaph-light-mode li { color: #334155; }
            body.asaph-light-mode ul, body.asaph-light-mode ol, body.asaph-light-mode table { background: #ffffff; border-color: #e2e8f0; }
            body.asaph-light-mode tr:hover { background: #f1f5f9; }
            body.asaph-light-mode a { color: #2563eb; }
            body.asaph-light-mode .skill-detail { background: rgba(37,99,235,0.08); border-left-color: #3b82f6; }
        `;
        document.head.appendChild(style);
    }
    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('asaph-light-mode');
        localStorage.setItem('asaph-theme', isLight ? 'light' : 'dark');
        themeBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
    });

    // ======================= 7. Ensure .hidden class exists =======================
    if (!document.querySelector('#base-hidden-style')) {
        const style = document.createElement('style');
        style.id = 'base-hidden-style';
        style.textContent = '.hidden { display: none !important; }';
        document.head.appendChild(style);
    }
});