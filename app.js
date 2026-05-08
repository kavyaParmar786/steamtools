document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const vaultData = [
        { id: '271590', name: 'Grand Theft Auto V', category: 'aaa', tag: 'AAA / Action' },
        { id: '1174180', name: 'Red Dead Redemption 2', category: 'aaa', tag: 'AAA / Adventure' },
        { id: '1245620', name: 'Elden Ring', category: 'aaa', tag: 'AAA / RPG' },
        { id: '1091500', name: 'Cyberpunk 2077', category: 'aaa', tag: 'AAA / Sci-Fi' },
        { id: '252490', name: 'Rust', category: 'survival', tag: 'Survival / PVP' },
        { id: '1086940', name: "Baldur's Gate 3", category: 'aaa', tag: 'AAA / RPG' },
        { id: '264710', name: 'Subnautica', category: 'survival', tag: 'Survival / Indie' },
        { id: '1145360', name: 'Hades', category: 'indie', tag: 'Indie / Roguelike' },
        { id: '413150', name: 'Stardew Valley', category: 'indie', tag: 'Indie / RPG' },
        { id: '311690', name: 'Gunpoint', category: 'indie', tag: 'Indie / Stealth' }
    ];

    // --- RENDER ENGINE ---
    const archive = document.getElementById('game-archive');

    function renderVault(filter = 'all') {
        archive.innerHTML = '';
        
        const filtered = filter === 'all' 
            ? vaultData 
            : vaultData.filter(game => game.category === filter);

        filtered.forEach(game => {
            // Steam CDN for Library Capsules (600x900)
            const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/library_600x900_2x.jpg`;
            
            const card = document.createElement('div');
            card.className = 'game-card animate-in';
            card.setAttribute('data-category', game.category);
            
            card.innerHTML = `
                <div class="game-img">
                    <img src="${imgUrl}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/600x900?text=Asset+Loading...'">
                    <div class="game-overlay">
                        <span class="game-status">Verified</span>
                        <button class="btn-download">Get Game</button>
                    </div>
                </div>
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <span class="game-tag">${game.tag}</span>
                </div>
            `;
            
            archive.appendChild(card);
        });
    }

    // Initial Render
    renderVault();

    // --- INTERACTIVITY ---
    
    // Custom Cursor Glow
    const glow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // Vault Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderVault(btn.getAttribute('data-filter'));
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.padding = '0.8rem 4rem';
            nav.style.background = 'rgba(5, 7, 10, 0.95)';
        } else {
            nav.style.padding = '1.5rem 4rem';
            nav.style.background = 'rgba(5, 7, 10, 0.8)';
        }
    });
});
