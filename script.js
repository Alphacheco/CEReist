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
const profilePhoto = document.querySelector('.profile-card__photo');
const footer = document.querySelector('.footer');
const serviceItems = Array.from(document.querySelectorAll('.service-item'));

function syncFooterOffset() {
  if (!footer) {
    return;
  }

  document.documentElement.style.setProperty('--footer-offset', `${footer.offsetHeight}px`);
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
}

function setServiceOpen(itemToOpen) {
  serviceItems.forEach((item) => {
    const button = item.querySelector('.service-item__trigger');
    const isOpen = item === itemToOpen;

    item.classList.toggle('is-open', isOpen);
    if (button) {
      button.setAttribute('aria-expanded', String(isOpen));
    }
  });
}

function syncMobileState(event) {
  const isMobile = event.matches;

  if (!isMobile) {
    setProfileExpanded(true);
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

syncMobileState(mobileQuery);
syncFooterOffset();
mobileQuery.addEventListener('change', syncMobileState);
mobileQuery.addEventListener('change', syncFooterOffset);
window.addEventListener('resize', syncFooterOffset);
