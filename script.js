(function () {
    let allImages = [];
    const grid = document.getElementById('portfolioGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const filterItems = document.querySelectorAll('.filter-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const videoContainer = document.getElementById('videoContainer');

    let currentFilter = 'photos'; 
    let currentIndex = 0;
    const imagesPerLoad = 3;

    async function loadImageData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            allImages = []; 
            if (data.photos) data.photos.forEach(p => allImages.push({ ...p, type: 'photo' }));
            if (data.videos) data.videos.forEach(v => allImages.push({ ...v, type: 'video' }));
            renderGallery(true);
        } catch (e) { console.error("Error:", e); }
    }

    function renderGallery(reset = false) {
        if (reset) {
            grid.innerHTML = '';
            currentIndex = 0;
            loadMoreBtn.classList.remove('hidden');
        }

        const filtered = allImages.filter(item => {
            if (currentFilter === 'photos') return item.type === 'photo';
            if (currentFilter === 'videos') return item.type === 'video';
            return false;
        });

        let htmlStr = '';
        const limit = Math.min(currentIndex + imagesPerLoad, filtered.length);

        for (let i = currentIndex; i < limit; i++) {
            const item = filtered[i];
            const isVid = item.type === 'video';
            htmlStr += `
                <div class="grid-item ${isVid ? 'video-card' : ''}" 
                     data-type="${item.type}" 
                     data-url="${isVid ? item.video_url : item.src}" 
                     data-title="${item.title}">
                    <img src="${item.src}" alt="${item.title}" loading="lazy">
                    <div class="overlay">
                        <h3>${item.title}</h3>
                        <p>${isVid ? 'VIDEO' : 'PHOTO'}</p>
                    </div>
                    ${isVid ? '<div class="video-icon"><i class="fas fa-play"></i></div>' : ''}
                </div>`;
        }
        grid.innerHTML += htmlStr;
        currentIndex = limit;
        if (currentIndex >= filtered.length) loadMoreBtn.classList.add('hidden');
    }

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.grid-item');
        if (!item) return;

        const type = item.getAttribute('data-type');
        const url = item.getAttribute('data-url');
        const title = item.getAttribute('data-title');

        if (type === 'video') {
            lightboxImg.style.display = 'none';
            videoContainer.style.display = 'block';
            
            // Sabse stable link format
            const embedUrl = `https://drive.google.com/file/d/${url}/preview`;
            
            videoContainer.innerHTML = `<iframe 
                src="${embedUrl}" 
                style="width:100%; height:100%; border:none;" 
                allow="autoplay; fullscreen" 
                allowfullscreen></iframe>`;
        } else {
            videoContainer.style.display = 'none';
            videoContainer.innerHTML = '';
            lightboxImg.style.display = 'block';
            lightboxImg.src = url;
        }

        lightboxModal.style.display = 'flex';
        document.getElementById('lightboxCaption').textContent = title;
        document.body.style.overflow = 'hidden';
    });

    document.getElementById('closeLightbox').addEventListener('click', () => {
        lightboxModal.style.display = 'none';
        videoContainer.innerHTML = ''; 
        document.body.style.overflow = 'auto';
    });

    filterItems.forEach(btn => {
        btn.addEventListener('click', function() {
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderGallery(true);
        });
    });

    loadMoreBtn.addEventListener('click', () => renderGallery());
    loadImageData();

    // Mobile Menu Logic
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Optional: Change icon from bars to 'X' when open
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked (useful for one-page sites)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });
}
})();
