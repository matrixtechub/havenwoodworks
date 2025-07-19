document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuButton && navLinks) {
      mobileMenuButton.addEventListener('click', function() {
          navLinks.classList.toggle('active');
          const isExpanded = navLinks.classList.contains('active');
          mobileMenuButton.setAttribute('aria-expanded', isExpanded);
          if (isExpanded) {
              mobileMenuButton.innerHTML = '&times;'; // Change to X icon
          } else {
              mobileMenuButton.innerHTML = '&#9776;'; // Change back to hamburger
          }
      });
  }

  // Ensure correct active link is highlighted on page load
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];

  navAnchors.forEach(link => {
      link.classList.remove('active');
      // Ensure link.getAttribute('href') is not null before calling split
      const linkHref = link.getAttribute('href');
      if (linkHref && linkHref.split('/').pop() === currentPage) {
          link.classList.add('active');
      }
  });
   // Special case for root path if index.html is the target and currentPage is empty
  if (currentPage === '' && navLinks) {
      const homeLink = navLinks.querySelector('a[href="index.html"]');
      if (homeLink) {
           navAnchors.forEach(link => link.classList.remove('active')); // Clear others first
           homeLink.classList.add('active');
      }
  }


  // Adjust padding-top for main content based on actual header height
  const header = document.querySelector('header');
  const mainContent = document.querySelector('main');
  if (header && mainContent) {
      const setPadding = () => {
          const headerHeight = header.offsetHeight;
          mainContent.style.paddingTop = headerHeight + 'px';
          const footer = document.querySelector('footer');
          if (footer) {
              const footerHeight = footer.offsetHeight;
              mainContent.style.minHeight = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
          } else {
              mainContent.style.minHeight = `calc(100vh - ${headerHeight}px)`;
          }
      };
      setPadding(); // Set on load
      window.addEventListener('resize', setPadding); // Adjust on resize
  }

  // --- HERO CAROUSEL START ---
  const carousel = document.querySelector('.hero-section .carousel');
  if (carousel) {
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dotsContainer = carousel.querySelector('.carousel-dots');
      const dots = carousel.querySelectorAll('.carousel-dot');
      const prevArrow = carousel.querySelector('.carousel-arrow-prev');
      const nextArrow = carousel.querySelector('.carousel-arrow-next');
      const heroTextOverlay = document.querySelector('.hero-text-overlay'); // Get text overlay element
      let currentSlideIndex = 0;
      let slideInterval;
      const slideRotationTime = 5000; // 5 seconds

      function updateCarouselControls() {
          dots.forEach((dot, index) => {
              dot.classList.toggle('active', index === currentSlideIndex);
              dot.setAttribute('aria-selected', index === currentSlideIndex);
          });
          // ARIA updates for slides can also be done here if needed, e.g. aria-hidden
          slides.forEach((slide, index) => {
               slide.setAttribute('aria-hidden', index !== currentSlideIndex);
          });
      }

      function showSlide(index) {
          if (index >= slides.length) index = 0;
          if (index < 0) index = slides.length - 1;

          slides.forEach(slide => slide.classList.remove('active'));
          slides[currentSlideIndex].classList.remove('active'); // Ensure current is inactive before new one
          slides[index].classList.add('active');
          currentSlideIndex = index;
          updateCarouselControls();

          // Trigger text overlay animation
          if (heroTextOverlay) {
              if (window.innerWidth > 767) {
                  // Desktop: re-trigger desktop animation (.animate-active uses textPopIn keyframes)
                  heroTextOverlay.classList.remove('animate-active');
                  void heroTextOverlay.offsetWidth;
                  heroTextOverlay.classList.add('animate-active');
              } else {
                  // Mobile (<= 767px): CSS media query handles initial animation (mobilePopIn) directly on .hero-text-overlay.
                  // Ensure .animate-active (for desktop animation) is not present or its animation is none.
                  // The CSS rule `@media (max-width: 767px) { .hero-text-overlay.animate-active { animation-name: none; } }` helps.
                  // Additionally, explicitly remove it here on slide changes for mobile to be safe.
                  heroTextOverlay.classList.remove('animate-active');
              }
          }
      }

      function nextSlide() {
          showSlide(currentSlideIndex + 1);
      }

      function prevSlide() {
          showSlide(currentSlideIndex - 1);
      }

      function startAutoRotate() {
          stopAutoRotate(); // Clear existing interval first
          slideInterval = setInterval(nextSlide, slideRotationTime);
      }

      function stopAutoRotate() {
          clearInterval(slideInterval);
      }

      if (slides.length > 0) {
          // Initial animations on page load
          if (prevArrow) prevArrow.classList.add('loaded');
          if (nextArrow) nextArrow.classList.add('loaded');
          // Initial text overlay animation is triggered by the first call to showSlide()

          // Event Listeners
          if (nextArrow) {
              nextArrow.addEventListener('click', () => {
                  nextSlide();
                  stopAutoRotate();
              });
          }
          if (prevArrow) {
              prevArrow.addEventListener('click', () => {
                  prevSlide();
                  stopAutoRotate();
              });
          }

          if (dotsContainer && dots.length > 0) {
              dots.forEach((dot, index) => {
                  dot.addEventListener('click', () => {
                      showSlide(index);
                      stopAutoRotate();
                  });
              });
          }

          carousel.addEventListener('mouseenter', stopAutoRotate);
          carousel.addEventListener('mouseleave', startAutoRotate);

          // Initialize
          showSlide(currentSlideIndex); // This will also trigger initial text animation
          startAutoRotate();
      }
  }
  // --- HERO CAROUSEL END ---

  // --- SCROLL-TO-TOP BUTTON START ---
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollToTopBtn) {
      window.addEventListener('scroll', () => {
          if (window.pageYOffset > 200) { // Show after 200px of scrolling
              scrollToTopBtn.classList.add('visible');
          } else {
              scrollToTopBtn.classList.remove('visible');
          }
      });

      scrollToTopBtn.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }
  // --- SCROLL-TO-TOP BUTTON END ---

});

// WHAT WE DO SECTION ANIMATIONS (runs once)

function setupWhatWeDoAnimations() {
  const section = document.querySelector('.what-we-do');
  if (!section) return;

  // Elements to animate
  const popInElements = [
    section.querySelector('.image-content img'),
    section.querySelector('.text-content h3'),
    section.querySelector('.text-content h2'),
    section.querySelector('.text-content .description')
  ].filter(Boolean);

  const fadeInElements = [
    ...section.querySelectorAll('.feature-item'),
    section.querySelector('.cta-button')
  ].filter(Boolean);

  const allElements = [...popInElements, ...fadeInElements];

  // Add initial pre-animate class
  allElements.forEach(el => el.classList.add('pre-animate'));

  let isVisible = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const inView = entry.isIntersecting;

      if (inView && !isVisible) {
        animateElements();
        isVisible = true;
      }

      if (!inView && isVisible) {
        resetAnimations();
        isVisible = false;
      }
    });
  }, {
    threshold: 0.3
  });

  observer.observe(section);

  function animateElements() {
    popInElements.forEach(el => {
      el.classList.remove('pre-animate');
      el.classList.add('animate-pop-in');
    });

    fadeInElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.remove('pre-animate');
        el.classList.add('animate-fade-in');
      }, index * 200);
    });
  }

  function resetAnimations() {
    popInElements.forEach(el => {
      el.classList.remove('animate-pop-in');
      el.classList.add('pre-animate');
    });

    fadeInElements.forEach(el => {
      el.classList.remove('animate-fade-in');
      el.classList.add('pre-animate');
    });
  }
}

document.addEventListener('DOMContentLoaded', setupWhatWeDoAnimations);

document.addEventListener('DOMContentLoaded', function () {
  // Slider functionality
  const sliderTrack = document.querySelector('.slider-track');
  // const prevBtn = document.querySelector('.slider-prev');
  // const nextBtn = document.querySelector('.slider-next');
  const prevButtons = document.querySelectorAll('.slider-prev');
  const nextButtons = document.querySelectorAll('.slider-next');
  const slides = document.querySelectorAll('.project-slide');

  if (sliderTrack && slides.length > 0) {
    let slideWidth = slides[0].offsetWidth + 20; // includes the 20px gap

    const scrollToNext = () => {
      sliderTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
    };

    const scrollToPrev = () => {
      sliderTrack.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    };

    // if (nextBtn) nextBtn.addEventListener('click', scrollToNext);
    // if (prevBtn) prevBtn.addEventListener('click', scrollToPrev);

    prevButtons.forEach(btn => btn.addEventListener('click', scrollToPrev));
    nextButtons.forEach(btn => btn.addEventListener('click', scrollToNext));

    // Update slide width on window resize
    window.addEventListener('resize', () => {
      slideWidth = slides[0].offsetWidth + 20;
    });
  }

  // Modal functionality
  const modal = document.querySelector('.project-modal');
  const modalImg = document.querySelector('.modal-image');
  const viewButtons = document.querySelectorAll('.view-project');
  const closeModal = document.querySelector('.close-modal');
  const modalPrev = document.querySelector('.modal-prev');
  const modalNext = document.querySelector('.modal-next');

  let currentModalIndex = 0;
  const slidesArray = Array.from(document.querySelectorAll('.project-slide'));

  function openModal(index) {
    currentModalIndex = index;
    const imgSrc = slidesArray[index].querySelector('img').src;
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  if (modal && modalImg) {
    viewButtons.forEach((button, index) => {
      button.addEventListener('click', () => openModal(index));
    });

    if (closeModal) {
      closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });

    if (modalPrev) {
      modalPrev.addEventListener('click', () => {
        currentModalIndex = (currentModalIndex - 1 + slidesArray.length) % slidesArray.length;
        modalImg.src = slidesArray[currentModalIndex].querySelector('img').src;
      });
    }

    if (modalNext) {
      modalNext.addEventListener('click', () => {
        currentModalIndex = (currentModalIndex + 1) % slidesArray.length;
        modalImg.src = slidesArray[currentModalIndex].querySelector('img').src;
      });
    }
  }
});

// ANIMATE ON SCROLL FUNCTIONALITY
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        // Add the right animation based on element type
        if (el.classList.contains('main-heading-2')) {
          el.classList.add('animate-scale-pop');
        } else if (el.classList.contains('description-2')) {
          el.classList.add('animate-slide-up');
        } else if (el.classList.contains('image-slider')) {
          el.classList.add('animate-slide-up');
        } else {
          el.classList.add('animate-fade-in');
        }
      } else {
        // Remove to allow re-triggering
        el.classList.remove('animate-scale-pop', 'animate-slide-up', 'animate-fade-in');
      }
    });
  },
  {
    threshold: 0.4,
  }
);

// Attach observer to elements
document.querySelectorAll('.reveal-on-scroll').forEach(el => {
  observer.observe(el);
});

// WHAT WE OFFER SECTION
const offers = [
  {
    title: "Giving your home a new style.",
    desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form...",
    img: "images/FGhyVpe.webp",
    list: [
      "✔ Experienced, time-served engineers",
      "✔ Commitment to customer service",
      "✔ Commitment to taking the stress out of your project",
      "✔ Flexible with any structure of the building",
    ]
  },
  {
    title: "Elegant architectural solutions.",
    desc: "We merge practicality with elegant design, guaranteeing your spaces are not only structurally impeccable but also visually breathtaking in every detail.",
    img: "images/FGhsfzN.webp",
    list: [
      "✔ Innovative designs",
      "✔ Regulatory compliance ensured",
      "✔ Collaborative planning process",
      "✔ Timely delivery guaranteed"
    ]
  },
  {
    title: "Tailored corporate interiors.",
    desc: "Design a workspace that maximizes productivity through intelligent layout and ergonomic details, while embodying your brand’s visual identity and core values.",
    img: "images/FGhyjQj.webp",
    list: [
      "✔ Professional and modern finish",
      "✔ Space optimization",
      "✔ Cost-effective solutions",
      "✔ Minimal disruption to workflow"
    ]
  },
  {
    title: "Commercial interiors that work.",
    desc: "We meticulously blend function and form in every retail or service environment, ensuring practicality harmonizes with striking visual appeal and brand storytelling.",
    img: "images/FGhyXTu.webp",
    list: [
      "✔ Customer-friendly layouts",
      "✔ Durable material selection",
      "✔ Industry-specific detailing",
      "✔ Brand-consistent aesthetics"
    ]
  },
  {
    title: "Comfortable residential interiors.",
    desc: "We transform houses into warm, personalized homes by merging your unique style with enduring design principles and intentional, soulful details.",
    img: "images/FGhyMv9.webp",
    list: [
      "✔ Custom furniture integration",
      "✔ Warm, welcoming styles",
      "✔ Smart space usage",
      "✔ Materials tailored to family life"
    ]
  },
];

const buttons = document.querySelectorAll('.offer-btn');
const image = document.getElementById('offer-image-display');
const header = document.getElementById('offer-header');
const desc = document.getElementById('offer-description');
const list = document.getElementById('offer-list');

buttons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update content
    const offer = offers[index];
    image.src = offer.img;
    header.textContent = offer.title;
    desc.textContent = offer.desc;

    // Populate list
    list.innerHTML = '';
    offer.list.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  });
});

// WHAT WE CAN OFFER SECTION
document.addEventListener('DOMContentLoaded', function () {
  const offers = [
    {
      title: "Giving your home a new style.",
      desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form...",
      img: "images/FGXEI6b.webp",
      list: [
        "✔ Experienced, time-served engineers",
        "✔ Commitment to customer service",
        "✔ Commitment to taking the stress out of your project",
        "✔ Flexible with any structure of the building",
      ]
    },
    {
      title: "Elegant architectural solutions.",
      desc: "We merge practicality with elegant design, guaranteeing your spaces are not only structurally impeccable but also visually breathtaking in every detail.",
      img: "images/FGX14ZF.webp",
      list: [
        "✔ Innovative designs",
        "✔ Regulatory compliance ensured",
        "✔ Collaborative planning process",
        "✔ Timely delivery guaranteed"
      ]
    },
    {
      title: "Tailored corporate interiors.",
      desc: "Design a workspace that maximizes productivity through intelligent layout and ergonomic details, while embodying your brand’s visual identity and core values.",
      img: "images/FGXE79V.webp",
      list: [
        "✔ Professional and modern finish",
        "✔ Space optimization",
        "✔ Cost-effective solutions",
        "✔ Minimal disruption to workflow"
      ]
    },
    {
      title: "Commercial interiors that work.",
      desc: "We meticulously blend function and form in every retail or service environment, ensuring practicality harmonizes with striking visual appeal and brand storytelling.",
      img: "images/FGXEzMu.webp",
      list: [
        "✔ Customer-friendly layouts",
        "✔ Durable material selection",
        "✔ Industry-specific detailing",
        "✔ Brand-consistent aesthetics"
      ]
    },
    {
      title: "Comfortable residential interiors.",
      desc: "We transform houses into warm, personalized homes by merging your unique style with enduring design principles and intentional, soulful details.",
      img: "images/FGXEEPa.webp",
      list: [
        "✔ Custom furniture integration",
        "✔ Warm, welcoming styles",
        "✔ Smart space usage",
        "✔ Materials tailored to family life"
      ]
    },
  ];

  const buttons = document.querySelectorAll('.mobile-accordion-btn');
  const panel = document.getElementById('mobile-accordion-panel');
  const img = document.getElementById('mobile-display-img');
  const header = document.getElementById('mobile-display-header');
  const desc = document.getElementById('mobile-display-desc');
  const list = document.getElementById('mobile-display-list');

  // Handle click
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content
      const offer = offers[index];
      img.src = offer.img;
      header.textContent = offer.title;
      desc.textContent = offer.desc;

      list.innerHTML = '';
      offer.list.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });

      // 👇 Add pop-in animation class to image
      img.classList.add('pop-in');
      img.addEventListener('animationend', () => {
        img.classList.remove('pop-in');
      }, { once: true });

      // Move panel directly below clicked button
      const parent = btn.parentElement;
      parent.insertBefore(panel, btn.nextSibling);
    });
  });
});

// AWRADS AND ACHIEVEMENT SECTION
document.addEventListener('DOMContentLoaded', () => {
  const awardItems = document.querySelectorAll('.award-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        awardItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate-pop');
          }, index * 200);
        });
      } else {
        // Remove animation so it replays on scroll back in
        awardItems.forEach((item) => {
          item.classList.remove('animate-pop');
        });
      }
    });
  }, {
    threshold: 0.3
  });

  observer.observe(document.getElementById('awards'));
});

// RECENT CASE STUDY SECTION
document.addEventListener('DOMContentLoaded', function () {
  const slider = document.getElementById('case-slider');
  const dotsContainer = document.getElementById('case-dots');
  const slides = slider.children;
  const modal = document.getElementById('case-modal');
  const modalImg = document.getElementById('modal-img');
  const closeModal = document.getElementById('modal-close');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  let index = 0;
  let slidesToShow = 3;

  const updateSlider = () => {
    const slideWidth = slides[0].offsetWidth + 20;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
    updateDots();
  };

  const updateDots = () => {
    const totalPages = Math.ceil(slides.length / slidesToShow);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.classList.toggle('active', i === Math.floor(index / slidesToShow));
      dot.addEventListener('click', () => {
        index = i * slidesToShow;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 576) {
      slidesToShow = 1;
    } else if (window.innerWidth < 992) {
      slidesToShow = 2;
    } else {
      slidesToShow = 3;
    }
    updateSlider();
  };

  document.querySelector('.case-nav.next').addEventListener('click', () => {
    if (index + slidesToShow < slides.length) {
      index += slidesToShow;
      updateSlider();
    }
  });

  document.querySelector('.case-nav.prev').addEventListener('click', () => {
    if (index - slidesToShow >= 0) {
      index -= slidesToShow;
      updateSlider();
    }
  });

  Array.from(slides).forEach(slide => {
    slide.addEventListener('click', () => {
      const imgSrc = slide.querySelector('img').src;
      modalImg.src = imgSrc;
      modal.style.display = 'flex';
      modalCloseBtn.style.display = 'block';
      header.classList.add('hidden');
    });
  });
  const header = document.querySelector('.site-header');
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalCloseBtn.style.display = 'none';
    header.classList.remove('hidden');
  });

  modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalCloseBtn.style.display = 'none';
    header.classList.remove('hidden');
  });

  window.addEventListener('resize', handleResize);

  handleResize();
});

document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, observerOptions);

  // Observe the elements
  const animatables = document.querySelectorAll('.animate-fade-up, .animate-slide-up');
  animatables.forEach(el => observer.observe(el));
});

// CEO SECTION
document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = { threshold: 0.3 };

  // Animate fade-ups and pop-ups
  const animatedEls = document.querySelectorAll('.animate-fade-up, .animate-pop-up');
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, observerOptions);

  animatedEls.forEach(el => animationObserver.observe(el));

  // Scroll-triggered COUNTER animation (repeats when scrolled back)
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el, target) => {
    let count = 0;
    const speed = 100; // Adjust this to control speed

    const update = () => {
      if (count < target) {
        count += Math.ceil(target / speed);
        el.textContent = count > target ? target : count;
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    update();
  };

  const resetCount = (el) => {
    el.textContent = 0;
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const target = +el.getAttribute('data-target');

      if (entry.isIntersecting) {
        animateCount(el, target);
      } else {
        resetCount(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));
});

// TESTIMONIAL SLIDER
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('testimonial-dots');
  let current = 0;
  let interval;

  function showCard(index) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
      dotsContainer.children[i].classList.toggle('active', i === index);
    });
  }

  function nextCard() {
    current = (current + 1) % cards.length;
    showCard(current);
  }

  function startSlider() {
    interval = setInterval(nextCard, 4000);
  }

  function createDots() {
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => {
        clearInterval(interval);
        current = i;
        showCard(current);
        startSlider();
      });
      dotsContainer.appendChild(dot);
    });
  }

  createDots();
  showCard(current);
  startSlider();
});

// TESTIMONIAL ANIMATION
document.addEventListener('DOMContentLoaded', function () {
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    const testimonialElements = document.querySelectorAll('.testimonial-slide-left, .testimonial-slide-right');

    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.4 });

    testimonialElements.forEach(el => testimonialObserver.observe(el));
  }
});

// CONTACT SECTION
 document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.contact-slider');
    const image = slider?.querySelector('.slider-image');
    
    const imageUrls = [
      'images/FV5vZlf.webp',
      'images/FV5vsPs.webp',
      'images/FV5vtS4.webp',
      'images/FV5vQKG.webp',
      'images/FV5vbHl.webp'
    ];

    let currentIndex = 0;

    function showNextImage() {
      currentIndex = (currentIndex + 1) % imageUrls.length;
      if (image) {
        image.style.opacity = 0;
        setTimeout(() => {
          image.src = imageUrls[currentIndex];
          image.style.opacity = 1;
        }, 300);
      }
    }

    setInterval(showNextImage, 4000); // 4 seconds
  });

// ANIMATE OTHER HERO PAGES
document.addEventListener('DOMContentLoaded', function () {
  const heroSection = document.querySelector('.others-animate');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroSection.classList.add('in-view');
      } else {
        heroSection.classList.remove('in-view');
      }
    });
  }, { threshold: 0.4 });

  if (heroSection) {
    observer.observe(heroSection);
  }})

