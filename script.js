// ---- Toggle Icon Navbar ----
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// ---- Scroll Sections Active Link ----
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    let top = window.scrollY;

    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    // Remove toggle icon and navbar when clicking navbar link (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};


// ---- Scroll Reveal Animations ----
function reveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150; // threshold

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', reveal);
// Trigger once on load
reveal();


// ---- Custom Cursor ----
// Only enable on non-touch devices
if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    let mouseX = 0;
    let mouseY = 0;
    
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate transform on inner dot
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });
    
    // Smooth follow for outer circle
    function animate() {
        // Linear interpolation for smooth trailing
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Hover effects on interactive elements
    const linksAndButtons = document.querySelectorAll('a, button, .btn, input[type="submit"]');
    
    linksAndButtons.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(1.5)`;
            follower.style.background = 'rgba(0, 240, 255, 0.1)';
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0)`;
        });
        
        el.addEventListener('mouseleave', () => {
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(1)`;
            follower.style.background = 'transparent';
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
        });
    });
}

// ---- Certifications Filter Logic ----
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.cert-filters .filter-btn');
    const certCards = document.querySelectorAll('.cert-grid .cert-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            certCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                } else if (card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
});

// ---- Certificate Modal Logic ----
document.addEventListener('DOMContentLoaded', () => {
    const certCards = document.querySelectorAll('.cert-grid .cert-card');
    const modal = document.getElementById('certModal');
    if (!modal) return; // Prevent errors if modal isn't loaded

    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalOrg = document.getElementById('modalOrg');
    const modalYear = document.getElementById('modalYear');
    const modalDesc = document.getElementById('modalDesc');
    const modalClose = document.getElementById('modalClose');
    const modalDownload = document.getElementById('modalDownload');

    // Open Modal
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            // Extract data from card
            const imgSrc = card.querySelector('.cert-image img').src;
            const category = card.querySelector('.cert-badge').innerText;
            const title = card.querySelector('.cert-title').innerText;
            const org = card.querySelector('.cert-org').innerText;
            const yearText = card.querySelector('.cert-meta span').innerText.trim();
            const desc = card.querySelector('.cert-desc').innerText;

            // Populate modal
            modalImage.src = imgSrc;
            modalCategory.innerText = category;
            modalTitle.innerText = title;
            modalOrg.innerText = org;
            modalYear.innerText = yearText;
            modalDesc.innerText = desc;
            
            // Set download link
            modalDownload.href = imgSrc;
            // Creates a safe filename like "Build_A_Thon_Certificate.png"
            modalDownload.download = `${title.replace(/\s+/g, '_')}_Certificate.png`;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        // Clear image src after animation to prevent flashing old image on next open
        setTimeout(() => {
            if(!modal.classList.contains('active')) modalImage.src = '';
        }, 400); 
    };

    // Close on X button click
    if(modalClose) modalClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
// ---- Contact Form Submission ----
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.value = 'Sending...';
            submitBtn.disabled = true;
            formResult.style.display = 'block';
            formResult.style.color = 'var(--main-color)';
            formResult.innerText = 'Sending your message...';

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formResult.style.color = '#00ff64'; // Success green
                    formResult.innerText = 'Thanks for contacting me! I will get back to you soon.';
                    contactForm.reset();
                } else {
                    console.log(response);
                    formResult.style.color = '#ff3399'; // Error pink
                    formResult.innerText = json.message || 'Something went wrong. Please try again later.';
                }
            })
            .catch(error => {
                console.log(error);
                formResult.style.color = '#ff3399';
                formResult.innerText = 'Something went wrong. Please try again later.';
            })
            .then(function() {
                submitBtn.value = 'Send Message';
                submitBtn.disabled = false;
                // Optional: hide message after 5 seconds
                setTimeout(() => {
                    formResult.style.display = 'none';
                }, 5000);
            });
        });
    }
});
