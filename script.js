document.documentElement.classList.add('js-ready');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-item, .profile-card__bio').forEach((element) => {
  element.classList.add('fade-in');
  observer.observe(element);
});

const mobileQuery = window.matchMedia('(max-width: 480px)');
const profileCard = document.querySelector('.profile-card');
const profileToggle = document.querySelector('.profile-card__toggle');
const profileDetails = document.querySelector('.profile-card__details');
const profilePhoto = document.querySelector('.profile-card__photo');
const footer = document.querySelector('.footer');
const serviceItems = Array.from(document.querySelectorAll('.service-item'));
const servicesViewport = document.querySelector('.services__viewport');
const servicesTrack = document.querySelector('.services__track');
const servicesPrevButton = document.querySelector('.services__nav--prev');
const servicesNextButton = document.querySelector('.services__nav--next');
const servicesDots = document.querySelector('.services__dots');
const cardsPerPage = 2;
let serviceCarouselPage = 0;

function syncFooterOffset() {
  if (!footer) {
    return;
  }

  document.documentElement.style.setProperty('--footer-offset', `${footer.offsetHeight}px`);
}

function getVisibleServiceItems() {
  return serviceItems.filter((item) => window.getComputedStyle(item).display !== 'none');
}

function getServicePageCount() {
  const visibleItems = getVisibleServiceItems();
  return Math.max(1, Math.ceil(visibleItems.length / cardsPerPage));
}

function clampServiceCarouselPage() {
  const maxPage = getServicePageCount() - 1;

  if (serviceCarouselPage > maxPage) {
    serviceCarouselPage = maxPage;
  }
}

function renderServiceDots(totalPages) {
  if (!servicesDots) {
    return;
  }

  if (servicesDots.childElementCount !== totalPages) {
    servicesDots.innerHTML = '';

    for (let index = 0; index < totalPages; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'services__dot';
      dot.setAttribute('aria-label', `Ir a la pagina ${index + 1} de servicios`);
      dot.addEventListener('click', () => {
        serviceCarouselPage = index;
        updateServiceCarousel();
      });
      servicesDots.appendChild(dot);
    }
  }

  servicesDots.setAttribute('aria-hidden', String(totalPages <= 1));
}

function updateServiceCarousel() {
  if (!servicesTrack || !servicesViewport) {
    return;
  }

  const totalPages = getServicePageCount();
  const hasMultiplePages = totalPages > 1;

  clampServiceCarouselPage();

  const viewportWidth = servicesViewport.getBoundingClientRect().width;
  const styles = window.getComputedStyle(servicesTrack);
  const gapValue = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
  const translateX = serviceCarouselPage * (viewportWidth + gapValue);

  renderServiceDots(totalPages);

  servicesTrack.style.transform = `translateX(-${translateX}px)`;

  if (servicesDots) {
    const dots = Array.from(servicesDots.querySelectorAll('.services__dot'));
    dots.forEach((dot, index) => {
      const isActive = index === serviceCarouselPage;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  if (servicesPrevButton) {
    servicesPrevButton.disabled = !hasMultiplePages || serviceCarouselPage <= 0;
  }

  if (servicesNextButton) {
    const maxPage = totalPages - 1;
    servicesNextButton.disabled = !hasMultiplePages || serviceCarouselPage >= maxPage;
  }
}

function moveServiceCarousel(direction) {
  const maxPage = getServicePageCount() - 1;
  const nextPage = serviceCarouselPage + direction;

  serviceCarouselPage = Math.min(Math.max(nextPage, 0), maxPage);
  updateServiceCarousel();
}

if (profilePhoto) {
  profilePhoto.addEventListener('error', () => {
    profilePhoto.style.display = 'none';
    profilePhoto.parentElement?.classList.add('is-fallback');
  }, { once: true });
}

function setProfileExpanded(isExpanded) {
  if (!profileCard || !profileToggle) {
    return;
  }

  profileCard.classList.toggle('is-expanded', isExpanded);
  profileToggle.setAttribute('aria-expanded', String(isExpanded));

  if (profileDetails && mobileQuery.matches) {
    profileDetails.style.maxHeight = isExpanded ? `${profileDetails.scrollHeight}px` : '0px';
  }
}

function resetProfileDetailsStyles() {
  if (!profileDetails) {
    return;
  }

  profileDetails.style.maxHeight = '';
}

function refreshProfileDetailsHeight() {
  if (!profileDetails || !mobileQuery.matches || !profileCard?.classList.contains('is-expanded')) {
    return;
  }

  profileDetails.style.maxHeight = `${profileDetails.scrollHeight}px`;
}

function setServiceOpen(itemToOpen) {
  serviceItems.forEach((item) => {
    const button = item.querySelector('.service-item__trigger');
    const content = item.querySelector('.service-item__content');
    const isOpen = item === itemToOpen;

    item.classList.toggle('is-open', isOpen);
    if (button) {
      button.setAttribute('aria-expanded', String(isOpen));
    }

    if (content && mobileQuery.matches) {
      content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : '0px';
    }
  });
}

function resetServicePanelStyles() {
  serviceItems.forEach((item) => {
    const content = item.querySelector('.service-item__content');

    if (content) {
      content.style.maxHeight = '';
    }
  });
}

function refreshOpenServiceHeight() {
  if (!mobileQuery.matches) {
    return;
  }

  serviceItems.forEach((item) => {
    if (!item.classList.contains('is-open')) {
      return;
    }

    const content = item.querySelector('.service-item__content');
    if (content) {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
}

function syncMobileState(event) {
  const isMobile = event.matches;

  if (!isMobile) {
    resetProfileDetailsStyles();
    setProfileExpanded(true);
    resetServicePanelStyles();
    serviceItems.forEach((item) => {
      item.classList.remove('is-open');
      const button = item.querySelector('.service-item__trigger');
      if (button) {
        button.setAttribute('aria-expanded', 'true');
      }
    });
    return;
  }

  setProfileExpanded(false);
  setServiceOpen(null);
}

if (profileToggle) {
  profileToggle.addEventListener('click', () => {
    if (!mobileQuery.matches) {
      return;
    }

    setProfileExpanded(!profileCard.classList.contains('is-expanded'));
  });
}

if (servicesPrevButton) {
  servicesPrevButton.addEventListener('click', () => {
    moveServiceCarousel(-1);
  });
}

if (servicesNextButton) {
  servicesNextButton.addEventListener('click', () => {
    moveServiceCarousel(1);
  });
}

serviceItems.forEach((item) => {
  const button = item.querySelector('.service-item__trigger');

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    if (!mobileQuery.matches) {
      return;
    }

    const willOpen = !item.classList.contains('is-open');
    setServiceOpen(willOpen ? item : null);
  });
});

// Coin flip functionality
const profileCoin = document.querySelector('#profileCoin');
if (profileCoin) {
  function flipCoin() {
    const isFlipped = profileCoin.classList.contains('flipped');
    
    // Cambiar z-index a mitad de la animación (300ms de 600ms)
    setTimeout(() => {
      if (!isFlipped) {
        const front = profileCoin.querySelector('.profile-card__coin-face--front');
        const back = profileCoin.querySelector('.profile-card__coin-face--back');
        front.style.zIndex = '1';
        back.style.zIndex = '2';
      } else {
        const front = profileCoin.querySelector('.profile-card__coin-face--front');
        const back = profileCoin.querySelector('.profile-card__coin-face--back');
        front.style.zIndex = '2';
        back.style.zIndex = '1';
      }
    }, 300);
    
    profileCoin.classList.toggle('flipped');
  }
  
  profileCoin.addEventListener('click', flipCoin);
  
  // Auto flip every 2 seconds
  setInterval(flipCoin, 2000);
}

syncMobileState(mobileQuery);
syncFooterOffset();
updateServiceCarousel();
mobileQuery.addEventListener('change', syncMobileState);
mobileQuery.addEventListener('change', syncFooterOffset);
mobileQuery.addEventListener('change', updateServiceCarousel);
window.addEventListener('resize', () => {
  syncFooterOffset();
  refreshProfileDetailsHeight();
  refreshOpenServiceHeight();
  updateServiceCarousel();
});
