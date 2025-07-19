  document.addEventListener("DOMContentLoaded", function () {
    const imageElement = document.getElementById("founding-image");
    const imageList = [
      "images/FWimQzg.webp",
      "images/FWimZXa.webp",
      "images/FWsFfUb.webp",
      "images/FWsd1z7.webp"
    ];

    let index = 0;
    setInterval(() => {
      index = (index + 1) % imageList.length;
      imageElement.style.opacity = 0;
      setTimeout(() => {
        imageElement.src = imageList[index];
        imageElement.style.opacity = 1;
      }, 300);
    }, 4000);
  });

// //   SERVICES SECTION
//   const serviceCards = document.querySelectorAll('.service-card img');
//   const modal = document.getElementById('service-modal');
//   const modalImg = document.getElementById('modal-image');
//   const modalClose = document.getElementById('modal-close');

//   serviceCards.forEach(card => {
//     card.addEventListener('click', () => {
//       modal.style.display = 'flex';
//       modalImg.src = card.src;
//     });
//   });

//   modalClose.addEventListener('click', () => {
//     modal.style.display = 'none';
//   });

//   modal.addEventListener('click', (e) => {
//     if (e.target === modal) modal.style.display = 'none';
//   });


// SERVICES SECTION
document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.service-card img');
  const modal = document.getElementById('service-modal');
  const modalImg = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');
  const header = document.querySelector('header'); // Get header safely

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = card.src;

      if (header) {
        header.style.display = 'none'; // Hide header when modal opens
      }
    });
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';

    if (header) {
      header.style.display = ''; // Show header again
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';

      if (header) {
        header.style.display = '';
      }
    }
  });
});

// OFFERS PAGE FOR DESKTOP ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      } else {
        entry.target.classList.remove('animate-in');
      }
    });
  }, {
    threshold: 0.2
  });

  const rows = document.querySelectorAll('.desktop-offer-row');
  rows.forEach(row => observer.observe(row));
});


// REVIEW CARDS ANIMATION
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".review-card");
  const observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.4,
  });

  function handleIntersect(entries) {
    entries.forEach((entry, index) => {
      const card = entry.target;

      if (entry.isIntersecting) {
        // Detect screen size
        const isMobile = window.innerWidth <= 600;

        // Remove old animation classes
        card.classList.remove("review-slide-left", "review-slide-right");

        if (isMobile) {
          // Alternate based on index
          card.classList.add(index % 2 === 0 ? "review-slide-left" : "review-slide-right");
        } else {
          // Desktop or tablet: left or right in 2-column layout
          const isLeftColumn = index % 2 === 0;
          card.classList.add(isLeftColumn ? "review-slide-left" : "review-slide-right");
        }
      } else {
        // Remove animation classes to allow re-triggering
        card.classList.remove("review-slide-left", "review-slide-right");
      }
    });
  }

  // Observe each card
  cards.forEach((card) => {
    observer.observe(card);
  });
});
