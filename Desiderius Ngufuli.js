
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ======================= 1. SKILLS =======================
    const allDt = document.querySelectorAll('dl dt');
    const skillInsights = {
        '1. Programming': '💻 I have built several small projects using C, HTML, and Java. Programming teaches me logic and problem-solving. I aim to contribute to open-source soon.',
        '2. Soft skills': '🤝 Teamwork and communication are vital in group projects. I actively collaborate with classmates and manage my time using the Pomodoro technique.'
    };
    allDt.forEach(dt => {
        if (dt.querySelector('.skill-insight')) return;
        const category = dt.innerText.trim();
        const insightText = skillInsights[category] || '✨ I continuously improve this skill through practice and real-world projects.';
        const insightDiv = document.createElement('div');
        insightDiv.className = 'skill-insight hidden';
        insightDiv.style.cssText = 'margin-top: 10px; margin-bottom: 10px; padding: 10px 14px; background: rgba(0,255,204,0.1); border-left: 3px solid #00ffcc; border-radius: 12px; font-size: 0.95rem; line-height: 1.5;';
        insightDiv.innerHTML = `<p>${insightText}</p>`;
        dt.insertAdjacentElement('afterend', insightDiv);
        dt.style.cursor = 'pointer';
        dt.addEventListener('click', (e) => {
            e.stopPropagation();
            insightDiv.classList.toggle('hidden');
        });
    });

    // ======================= 2. TABLE SORT =======================
    const table = document.querySelector('table');
    if (table) {
        let sortAsc = true;
        let sortBtn = document.querySelector('.edu-sort-btn');
        if (!sortBtn) {
            sortBtn = document.createElement('button');
            sortBtn.className = 'edu-sort-btn';
            sortBtn.textContent = '📅 Sort by Year (Ascending)';
            sortBtn.style.cssText = 'margin: 20px 0 15px; padding: 8px 24px; background: #00ffcc; color: #1a1f2c; border: none; border-radius: 40px; cursor: pointer; font-weight: bold;';
            table.parentNode.insertBefore(sortBtn, table);
        }
        const extractStartYear = (yearStr) => {
            const match = yearStr.match(/\d{4}/);
            return match ? parseInt(match[0], 10) : 0;
        };
        const sortTableRows = () => {
            const rowsArray = Array.from(table.querySelectorAll('tr')).slice(1);
            rowsArray.sort((a, b) => {
                const yearA = extractStartYear(a.cells[2]?.innerText || '');
                const yearB = extractStartYear(b.cells[2]?.innerText || '');
                return sortAsc ? yearA - yearB : yearB - yearA;
            });
            rowsArray.forEach(row => table.appendChild(row));
            sortBtn.textContent = sortAsc ? '📅 Sort by Year (Descending)' : '📅 Sort by Year (Ascending)';
        };
        sortBtn.addEventListener('click', () => {
            sortAsc = !sortAsc;
            sortTableRows();
        });
    }

  
    // ======================= 4. IMAGE LIGHTBOX =======================
    const profilePic = document.querySelector('.profile img');
    if (profilePic && !document.querySelector('.custom-lightbox-desi')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'custom-lightbox-desi';
        lightbox.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); display:flex; align-items:center; justify-content:center; visibility:hidden; opacity:0; transition:0.2s; z-index:5000;`;
        lightbox.innerHTML = `<button class="lb-close" style="position:absolute; top:30px; right:40px; font-size:44px; background:none; border:none; color:white; cursor:pointer;">&times;</button><img class="lb-img" style="max-width:90%; max-height:85%; border-radius:20px;" src="">`;
        document.body.appendChild(lightbox);
        const lbImg = lightbox.querySelector('.lb-img');
        const lbClose = lightbox.querySelector('.lb-close');
        profilePic.style.cursor = 'pointer';
        profilePic.addEventListener('click', () => {
            lbImg.src = profilePic.src;
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
    let scrollBtn = document.querySelector('.scroll-top-desi');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top-desi';
        scrollBtn.innerHTML = '⬆️ Back to Top';
        scrollBtn.style.cssText = `position:fixed; bottom:30px; right:30px; background:#ff6b6b; color:white; border:none; border-radius:50px; padding:12px 22px; cursor:pointer; opacity:0; visibility:hidden; transition:0.3s; z-index:1000; font-weight:bold;`;
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

    // ======================= 6. DARK / LIGHT MODE (FIXED – direct style override) =======================
    let themeBtn = document.querySelector('.desi-theme-toggle');
    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.className = 'desi-theme-toggle';
        themeBtn.textContent = '☀️ Light Mode';
        themeBtn.style.cssText = `position:fixed; top:20px; right:20px; background:#00ffcc; color:#1a1f2c; border:none; border-radius:30px; padding:8px 18px; cursor:pointer; z-index:10000; font-weight:bold;`;
        document.body.appendChild(themeBtn);
    }
    const applyTheme = (isLight) => {
        if (isLight) {
            document.body.style.backgroundColor = '#f0f4f8';
            document.body.style.color = '#1e2a3a';
            document.body.classList.add('desi-light-mode');
            const img = document.querySelector('.profile img');
            if (img) img.style.borderColor = '#3b82f6';
            themeBtn.textContent = '🌙 Dark Mode';
        } else {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.classList.remove('desi-light-mode');
            const img = document.querySelector('.profile img');
            if (img) img.style.borderColor = '';
            themeBtn.textContent = '☀️ Light Mode';
        }
    };
    if (localStorage.getItem('desiderius-theme') === 'light') {
        applyTheme(true);
    } else {
        applyTheme(false);
    }
    themeBtn.addEventListener('click', () => {
        const isLight = !document.body.classList.contains('desi-light-mode');
        localStorage.setItem('desiderius-theme', isLight ? 'light' : 'dark');
        applyTheme(isLight);
    });

    // ======================= 7. HIDDEN CLASS =======================
    if (!document.querySelector('#desi-base-styles')) {
        const style = document.createElement('style');
        style.id = 'desi-base-styles';
        style.textContent = '.hidden { display: none !important; }';
        document.head.appendChild(style);
    }
});