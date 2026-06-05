document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ======================= 1. SKILLS: Slide down details with transform =======================
    document.querySelectorAll('ul > li, .skills li').forEach(li => {
        if (li.querySelector('ul') && !li.querySelector('.glass-detail')) {
            const detail = document.createElement('div');
            detail.className = 'glass-detail hidden';
            detail.style.cssText = `
                margin-top: 12px; padding: 12px; background: rgba(255,255,255,0.15);
                backdrop-filter: blur(8px); border-radius: 16px; font-size: 0.9rem;
                transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
                transform-origin: top; transform: scaleY(0); opacity: 0;
            `;
            detail.innerHTML = `<p>✨ ${li.innerText.split('\n')[0]} – I actively practice this skill weekly.</p>`;
            li.appendChild(detail);
            li.style.cursor = 'pointer';
            li.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') return;
                const isHidden = detail.classList.contains('hidden');
                if (isHidden) {
                    detail.classList.remove('hidden');
                    detail.style.transform = 'scaleY(1)';
                    detail.style.opacity = '1';
                } else {
                    detail.style.transform = 'scaleY(0)';
                    detail.style.opacity = '0';
                    setTimeout(() => detail.classList.add('hidden'), 300);
                }
            });
        }
    });

    // ======================= 2. TABLE SORT with row glow =======================
    const table = document.querySelector('#educationTable, table');
    if (table) {
        let sortAsc = true;
        let btn = document.querySelector('.glass-sort');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'glass-sort';
            btn.innerHTML = '🔮 Sort by Year 🔮';
            btn.style.cssText = `
                margin: 15px 0; padding: 8px 28px; background: rgba(255,255,255,0.2);
                backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.4);
                border-radius: 60px; cursor: pointer; font-weight: bold;
                transition: 0.2s; color: #fff;
            `;
            table.parentNode.insertBefore(btn, table);
        }
        const getYear = (s) => parseInt(s.match(/\d{4}/)?.[0] || 0, 10);
        const sortRows = () => {
            const rows = Array.from(table.querySelectorAll('tr')).slice(1);
            rows.sort((a, b) => {
                const ya = getYear(a.cells[2]?.innerText || '');
                const yb = getYear(b.cells[2]?.innerText || '');
                return sortAsc ? ya - yb : yb - ya;
            });
            rows.forEach((row, idx) => {
                table.appendChild(row);
                row.style.transition = 'background 0.2s';
                row.style.background = 'rgba(255,255,255,0.2)';
                setTimeout(() => { row.style.background = ''; }, 400);
            });
            btn.innerHTML = sortAsc ? '🔮 Sort by Year (Desc) 🔮' : '🔮 Sort by Year (Asc) 🔮';
        };
        btn.addEventListener('click', () => { sortAsc = !sortAsc; sortRows(); });
    }

    // ======================= 3. HOBBIES: Read More with blur reveal =======================
    const hobbiesSection = document.querySelector('.hobbies ul, ol');
    if (hobbiesSection) {
        hobbiesSection.querySelectorAll('li').forEach(li => {
            if (li.querySelector('.glass-readmore')) return;
            const full = li.innerText;
            if (full.length <= 80) return;
            const short = full.slice(0, 75) + '…';
            li.innerHTML = `
                <span class="glass-short">${short}</span>
                <span class="glass-full hidden">${full}</span>
                <button class="glass-readmore" style="background:none; border:none; color:#aaf; cursor:pointer; font-weight:bold;">+ More</button>
            `;
            const btn = li.querySelector('.glass-readmore');
            const shortSpan = li.querySelector('.glass-short');
            const fullSpan = li.querySelector('.glass-full');
            let expanded = false;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                expanded = !expanded;
                fullSpan.classList.toggle('hidden', !expanded);
                shortSpan.classList.toggle('hidden', expanded);
                btn.textContent = expanded ? '− Less' : '+ More';
            });
        });
    }

    // ======================= 4. LIGHTBOX with morphing background =======================
    const img = document.querySelector('.profile img');
    if (img && !document.querySelector('.glass-lightbox')) {
        const lb = document.createElement('div');
        lb.className = 'glass-lightbox';
        lb.style.cssText = `
            position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(12px);
            display: flex; align-items: center; justify-content: center;
            visibility: hidden; opacity: 0; transition: 0.25s; z-index: 10000;
        `;
        lb.innerHTML = `
            <span style="position:absolute; top:25px; right:35px; font-size:40px; color:white; cursor:pointer;">&times;</span>
            <img class="lb-img" style="max-width:85%; max-height:85%; border-radius:24px;">
        `;
        document.body.appendChild(lb);
        const lbImg = lb.querySelector('.lb-img');
        const close = lb.querySelector('span');
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lbImg.src = img.src;
            lb.style.visibility = 'visible';
            lb.style.opacity = '1';
            document.body.style.overflow = 'hidden';
        });
        const closeLB = () => {
            lb.style.visibility = 'hidden';
            lb.style.opacity = '0';
            document.body.style.overflow = '';
        };
        close.addEventListener('click', closeLB);
        lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
    }

    // ======================= 5. SCROLL TO TOP (floating glass orb) =======================
    let topGlass = document.querySelector('.glass-top');
    if (!topGlass) {
        topGlass = document.createElement('button');
        topGlass.className = 'glass-top';
        topGlass.innerHTML = '⬆️ Top';
        topGlass.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; background: rgba(255,255,255,0.25);
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.4);
            border-radius: 60px; padding: 12px 24px; cursor: pointer;
            opacity: 0; visibility: hidden; transition: 0.3s;
            font-weight: bold; color: white;
        `;
        document.body.appendChild(topGlass);
    }
    window.addEventListener('scroll', () => {
        const show = window.scrollY > 200;
        topGlass.style.opacity = show ? '1' : '0';
        topGlass.style.visibility = show ? 'visible' : 'hidden';
    });
    topGlass.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ======================= 6. GLASS DARK/LIGHT MODE =======================
    let glassTheme = document.querySelector('.glass-theme');
    if (!glassTheme) {
        glassTheme = document.createElement('button');
        glassTheme.className = 'glass-theme';
        glassTheme.innerHTML = '✨ Light Mode';
        glassTheme.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: rgba(255,255,255,0.2);
            backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3);
            border-radius: 40px; padding: 6px 18px; cursor: pointer;
            font-weight: bold; color: white; z-index: 10001;
        `;
        document.body.appendChild(glassTheme);
    }
    const setGlassTheme = (isDark) => {
        if (isDark) {
            document.body.style.backgroundColor = '#0f172a';
            document.body.style.color = '#f1f5f9';
            document.body.classList.add('glass-dark');
            glassTheme.innerHTML = '🌙 Dark Mode';
        } else {
            document.body.style.backgroundColor = '#eef2ff';
            document.body.style.color = '#0f172a';
            document.body.classList.remove('glass-dark');
            glassTheme.innerHTML = '☀️ Light Mode';
        }
    };
    if (localStorage.getItem('glass-theme') === 'light') setGlassTheme(false);
    else setGlassTheme(true);
    glassTheme.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('glass-dark');
        localStorage.setItem('glass-theme', isDark ? 'dark' : 'light');
        setGlassTheme(isDark);
    });

    // base hidden style
    if (!document.querySelector('#glass-base')) {
        const s = document.createElement('style');
        s.id = 'glass-base';
        s.textContent = '.hidden { display: none !important; }';
        document.head.appendChild(s);
    }
});