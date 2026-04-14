document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Logic for Animations (using Motion One)
    if (typeof Motion !== 'undefined') {
        const { animate, stagger, inView } = Motion;

        // Hero Animations
        animate(".fade-in", { opacity: [0, 1] }, { duration: 0.8, delay: 0.2 });
        animate(".fade-in-up", { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: stagger(0.15) });

        // Scroll Reveal
        inView(".stat-item", ({ target }) => {
            animate(target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
        });

        inView(".feature-li", ({ target }) => {
            animate(target, { opacity: [0, 1], x: [20, 0] }, { duration: 0.5 });
        });
    }

    // 2. LIVE AI Digest Integration (TechCrunch RSS via RSS2JSON)
    const fetchLiveDigest = async () => {
        const digestContainer = document.querySelector('.digest-items');
        if (!digestContainer) return;

        try {
            // Using TechCrunch RSS feed through rss2json
            const rssUrl = encodeURIComponent('https://techcrunch.com/feed/');
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 'ok' && data.items) {
                // Clear initial static items
                digestContainer.innerHTML = '';
                
                // Show top 3 latest tech news
                data.items.slice(0, 3).forEach((item, index) => {
                    const digestItem = document.createElement('div');
                    digestItem.className = 'digest-item';
                    digestItem.style.opacity = '0';
                    digestItem.innerHTML = `
                        <div class="pulse"></div>
                        <p>${item.title}</p>
                    `;
                    digestContainer.appendChild(digestItem);
                    
                    // Simple entrance animation
                    if (typeof Motion !== 'undefined') {
                        Motion.animate(digestItem, { opacity: [0, 1], x: [-10, 0] }, { delay: index * 0.1 });
                    } else {
                        digestItem.style.opacity = '1';
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching live digest:', error);
            // Keep original static content if fetch fails
        }
    };

    fetchLiveDigest();

    // 3. Form Submission Logic
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');
    const { animate: motionAnimate } = typeof Motion !== 'undefined' ? Motion : { animate: null };

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-input').value;
            console.log(`Adding ${email} to waitlist...`);
            
            if (motionAnimate) {
                motionAnimate(waitlistForm, { opacity: 0, scale: 0.9 }, { duration: 0.4 }).finished.then(() => {
                    waitlistForm.classList.add('hidden');
                    if (formMessage) {
                        formMessage.classList.remove('hidden');
                        motionAnimate(formMessage, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4 });
                    }
                });
            } else {
                waitlistForm.classList.add('hidden');
                if (formMessage) formMessage.classList.remove('hidden');
            }
        });
    }

    // 4. Navbar & Nav CTA Scroll Logic
    const nav = document.getElementById('navbar');
    const navCta = document.getElementById('nav-cta');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar transparency
        if (nav) {
            if (scrollY > 50) {
                nav.style.padding = '0.75rem 0';
                nav.style.background = 'rgba(5, 5, 5, 0.9)';
            } else {
                nav.style.padding = '1.5rem 0';
                nav.style.background = 'transparent';
            }
        }

        // Show/Hide Nav CTA based on Hero scroll depth
        if (navCta) {
            if (scrollY > 400) {
                navCta.classList.remove('hidden');
            } else {
                navCta.classList.add('hidden');
            }
        }
    });
});
