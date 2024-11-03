
// Magnetic effect for nav links and buttons
const magneticItems = document.querySelectorAll('.nav-link, .action-btn');

magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const bounds = item.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        
        const deltaX = (mouseX - centerX) * 0.3;
        const deltaY = (mouseY - centerY) * 0.3;

        item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        item.style.transition = 'none';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translate(0, 0)';
        item.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
});

// Parallax depth effect for header background
document.addEventListener('mousemove', (e) => {
    const depth = 15;
    const moveX = (e.clientX - window.innerWidth / 2) / depth;
    const moveY = (e.clientY - window.innerHeight / 2) / depth;

    document.querySelector('.particles').style.transform = 
        `translate(${moveX}px, ${moveY}px)`;
});

// Add energy wave effect on click
document.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.className = 'energy-wave';
    wave.style.left = `${e.clientX}px`;
    wave.style.top = `${e.clientY}px`;
    document.body.appendChild(wave);
    
    wave.addEventListener('animationend', () => wave.remove());
});

// Dynamic gradient follow
document.addEventListener('mousemove', (e) => {
    const headerBg = document.querySelector('.header-bg');
    headerBg.classList.add('active');
    headerBg.style.setProperty('--x', `${e.clientX}px`);
    headerBg.style.setProperty('--y', `${e.clientY}px`);
});

document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#3b82f6'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#3b82f6',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 200,
                    line_linked: {
                        opacity: 0.4
                    }
                }
            }
        },
        retina_detect: true
    });
});
