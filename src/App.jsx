import { useEffect, useMemo, useRef, useState } from 'react';

const services = [
  {
    id: 'service-marcas',
    title: 'Registro de Marcas',
    description:
      'Es un proceso legal mediante el cual el INPI te otorgara un derecho exclusivo sobre un signo distintivo (como un nombre, logo o eslogan) que identifica tus productos o servicios en el mercado. Al registrarla, proteges tu marca de usos no autorizados y aseguras la exclusividad a nivel nacional.',
  },
  {
    id: 'service-patentes',
    title: 'Registro de Patentes de Invencion',
    description:
      'Es el tramite que permite proteger una invencion novedosa, otorgando a su creador derechos exclusivos de explotacion durante un periodo determinado. Las patentes fomentan la innovacion, ya que premian al inventor por su aporte tecnico.',
  },
  {
    id: 'service-modelos',
    title: 'Modelos de Utilidad',
    description:
      'Consisten en innovaciones menores que mejoran el funcionamiento o la forma de un objeto ya existente. A diferencia de las patentes, requieren menos requisitos para demostrar la originalidad. Es una via agil para proteger mejoras practicas ideadas sobre un bien.',
  },
  {
    id: 'service-disenos',
    title: 'Disenos y Modelos Industriales',
    description:
      'Estos se refieren a la apariencia estetica de un producto disenado, protegiendo su forma, color o diseno ornamental. Es un registro que evita copias o imitaciones de la estetica de un producto.',
  },
  {
    id: 'service-otros',
    title: 'Otros',
    extraTitleClass: 'otros',
    extraItemClass: 'service-item--extra',
    description:
      'Deposito en custodia de obras ineditas o publicadas ante la DNDA · Asesoramiento sobre politicas de privacidad en sitios web · Asesoramiento Civil y Comercial a empresas en general · Sucesiones · Divorcios',
  },
];

const brandImages = [
  'marca1.jpeg',
  'marca2.jpeg',
  'marca3.jpeg',
  'marca4.jpg',
  'marca5.jpeg',
  'marca6.png',
  'marca7.jpeg',
  'marca8.jpeg',
  'marca9.jpeg',
  'marca10.jpeg',
  'marca11.jpeg',
];

function App() {
  const cardsPerPage = 4;
  const profileDetailsRef = useRef(null);
  const footerRef = useRef(null);
  const servicesTrackRef = useRef(null);
  const servicesViewportRef = useRef(null);
  const profileCoinRef = useRef(null);
  const serviceContentRefs = useRef([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [openServiceIndex, setOpenServiceIndex] = useState(null);
  const [serviceCarouselPage, setServiceCarouselPage] = useState(0);
  const [serviceViewportWidth, setServiceViewportWidth] = useState(0);
  const [serviceGap, setServiceGap] = useState(0);

  const servicePageCount = useMemo(
    () => Math.max(1, Math.ceil(services.length / cardsPerPage)),
    [cardsPerPage],
  );

  useEffect(() => {
    document.documentElement.classList.add('js-ready');

    return () => {
      document.documentElement.classList.remove('js-ready');
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 480px)');
    const updateMobile = () => {
      setIsMobile(query.matches);
    };

    updateMobile();

    query.addEventListener('change', updateMobile);
    return () => {
      query.removeEventListener('change', updateMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsProfileExpanded(true);
      setOpenServiceIndex(null);
      return;
    }

    setIsProfileExpanded(false);
    setOpenServiceIndex(null);
  }, [isMobile]);

  useEffect(() => {
    const details = profileDetailsRef.current;
    if (!details) {
      return;
    }

    if (isMobile) {
      details.style.maxHeight = isProfileExpanded ? `${details.scrollHeight}px` : '0px';
      return;
    }

    details.style.maxHeight = '';
  }, [isMobile, isProfileExpanded]);

  useEffect(() => {
    services.forEach((_, index) => {
      const content = serviceContentRefs.current[index];
      if (!content) {
        return;
      }

      if (!isMobile) {
        content.style.maxHeight = '';
        return;
      }

      content.style.maxHeight = openServiceIndex === index ? `${content.scrollHeight}px` : '0px';
    });
  }, [isMobile, openServiceIndex]);

  useEffect(() => {
    const syncFooterOffset = () => {
      if (!footerRef.current) {
        return;
      }

      document.documentElement.style.setProperty('--footer-offset', `${footerRef.current.offsetHeight}px`);
    };

    const syncServiceMeasurements = () => {
      const viewport = servicesViewportRef.current;
      const track = servicesTrackRef.current;

      if (!viewport || !track) {
        return;
      }

      const viewportWidth = viewport.getBoundingClientRect().width;
      const computedTrackStyles = window.getComputedStyle(track);
      const currentGap = Number.parseFloat(computedTrackStyles.columnGap || computedTrackStyles.gap || '0') || 0;

      setServiceViewportWidth(viewportWidth);
      setServiceGap(currentGap);
    };

    const refreshDynamicHeights = () => {
      const details = profileDetailsRef.current;
      if (isMobile && details && isProfileExpanded) {
        details.style.maxHeight = `${details.scrollHeight}px`;
      }

      if (isMobile) {
        services.forEach((_, index) => {
          const content = serviceContentRefs.current[index];
          if (!content) {
            return;
          }

          content.style.maxHeight = openServiceIndex === index ? `${content.scrollHeight}px` : '0px';
        });
      }
    };

    const onResize = () => {
      syncFooterOffset();
      syncServiceMeasurements();
      refreshDynamicHeights();
    };

    syncFooterOffset();
    syncServiceMeasurements();
    refreshDynamicHeights();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile, isProfileExpanded, openServiceIndex]);

  useEffect(() => {
    setServiceCarouselPage((currentPage) => Math.min(currentPage, servicePageCount - 1));
  }, [servicePageCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    const targets = document.querySelectorAll('.service-item, .profile-card__bio');
    targets.forEach((target) => {
      target.classList.add('fade-in');
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const profileCoin = profileCoinRef.current;
    if (!profileCoin) {
      return undefined;
    }

    const flipCoin = () => {
      const isFlipped = profileCoin.classList.contains('flipped');

      setTimeout(() => {
        const front = profileCoin.querySelector('.profile-card__coin-face--front');
        const back = profileCoin.querySelector('.profile-card__coin-face--back');

        if (!front || !back) {
          return;
        }

        if (!isFlipped) {
          front.style.zIndex = '1';
          back.style.zIndex = '2';
        } else {
          front.style.zIndex = '2';
          back.style.zIndex = '1';
        }
      }, 300);

      profileCoin.classList.toggle('flipped');
    };

    const intervalId = window.setInterval(flipCoin, 2000);
    profileCoin.addEventListener('click', flipCoin);

    return () => {
      window.clearInterval(intervalId);
      profileCoin.removeEventListener('click', flipCoin);
    };
  }, []);

  const serviceTranslateX = serviceCarouselPage * (serviceViewportWidth + serviceGap);

  return (
    <>
      <header className="navbar">
        <div className="navbar__logo">
          <img src="/images/logo.svg" alt="Emanuel Reist - Servicios Jurídicos" />
          <span className="navbar__tagline">Servicios Jurídicos</span>
        </div>
      </header>

      <main className="main">
        <section className={`profile-card ${isProfileExpanded ? 'is-expanded' : ''}`}>
          <div className="profile-card__top">
            <div className="profile-card__text">
              <h1 className="profile-card__name">
                César Emanuel
                <br />
                Reist
              </h1>
              <p className="profile-card__titles">
                <strong>Abogado</strong>
                <br />
                Matricula Profesional 8672 CAER
                <br />
                <strong>Agente de la Propiedad Industrial</strong>
                <br />
                Matricula 3147 INPI
              </p>
            </div>
            <div className="profile-card__coin-wrapper">
              <div className="profile-card__coin" id="profileCoin" ref={profileCoinRef}>
                <div className="profile-card__coin-face profile-card__coin-face--front">
                  <img src="/images/image.png" alt="Emanuel Reist" />
                </div>
                <div className="profile-card__coin-face profile-card__coin-face--back">
                  <img src="/images/registrada.svg" alt="Registrada" />
                </div>
              </div>
            </div>
          </div>
          <button
            className="profile-card__toggle"
            type="button"
            aria-expanded={isProfileExpanded}
            aria-controls="profile-details"
            onClick={() => {
              if (!isMobile) {
                return;
              }

              setIsProfileExpanded((current) => !current);
            }}
          >
            <span className="profile-card__chevron" aria-hidden="true" />
          </button>
          <div className="profile-card__details" id="profile-details" ref={profileDetailsRef}>
            <h1>Queres conocer mas sobre mi?</h1>
            <h2>Mis valores</h2>
            <p>
              <strong>PROFESIONALISMO TRANSPARENCIA SOLIDEZ</strong>
            </p>
            <p className="profile-card__bio">
              Acompano a mis clientes en cada paso del proceso del registro frente a las oficinas
              correspondientes, brindando un servicio solido y especializado a nivel tecnico,
              responsable a nivel legal y humano, desde la transparencia en los procesos.
            </p>
            <h2>Mi Formacion</h2>
            <p className="profile-card__bio">
              Comence mi recorrido profesional como abogado en la rama de Derecho Civil y Comercial hace 15
              anos en la provincia de Entre Rios, Argentina. Ademas, desde muy joven estoy vinculado a la
              educacion y docencia en la formacion docente y la educacion secundaria. Otro punto de interes
              que devino del desempeno profesional es intervenir en situaciones de conflicto, por lo cual
              transite la formacion en Mediacion. Desde hace cinco anos vengo trabajando como Agente de la
              Propiedad Industrial, acompanando a numerosos clientes en la proteccion de sus creaciones,
              asegurando que sus derechos queden debidamente resguardados. Mis credenciales se pueden
              corroborar en los respectivos colegios con el numero de matricula.
            </p>
            <h2>Mis pasiones</h2>
            <p className="profile-card__bio">
              Mis pasiones son la educacion en los DDHH, la ciudadania y la Historia; tambien el desempeno
              profesional en el Derecho Civil y Comercial y el registro de marcas y patentes. Cada caso hay
              que estudiarlo en su particularidad para realizar el tramite y esto me permite conocer
              distintas personas, lugares e ideas que tienen los clientes sobre sus proyectos o empresas.
            </p>
          </div>
        </section>

        <section className="services">
          <div className="services__header">
            <p className="services__eyebrow">Estudio jurídico y propiedad industrial</p>
            <h2 className="services__title">Servicios que brindo</h2>
          </div>

          <div className="services__carousel" aria-label="Carrusel de servicios">
            <button
              className="services__nav services__nav--prev"
              type="button"
              aria-label="Ver servicios anteriores"
              onClick={() => {
                setServiceCarouselPage((current) => Math.max(0, current - 1));
              }}
              disabled={servicePageCount <= 1 || serviceCarouselPage <= 0}
            >
              <span aria-hidden="true">&#10094;</span>
            </button>

            <div className="services__viewport" ref={servicesViewportRef}>
              <div
                className="services__track"
                ref={servicesTrackRef}
                style={{ transform: `translateX(-${serviceTranslateX}px)` }}
              >
                {services.map((service, index) => {
                  const isOpen = isMobile && openServiceIndex === index;
                  const isDesktop = !isMobile;

                  return (
                    <div
                      className={`service-item ${service.extraItemClass ?? ''} ${isOpen ? 'is-open' : ''}`}
                      key={service.id}
                    >
                      <button
                        className="service-item__trigger"
                        type="button"
                        aria-expanded={isDesktop || isOpen}
                        aria-controls={service.id}
                        onClick={() => {
                          if (!isMobile) {
                            return;
                          }

                          setOpenServiceIndex((current) => (current === index ? null : index));
                        }}
                      >
                        <h3 className={`service-item__title ${service.extraTitleClass ?? ''}`}>{service.title}</h3>
                        <span className="service-item__chevron" aria-hidden="true" />
                      </button>
                      <div
                        className="service-item__content"
                        id={service.id}
                        ref={(element) => {
                          serviceContentRefs.current[index] = element;
                        }}
                      >
                        <p className="service-item__desc">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className="services__nav services__nav--next"
              type="button"
              aria-label="Ver siguientes servicios"
              onClick={() => {
                setServiceCarouselPage((current) => Math.min(servicePageCount - 1, current + 1));
              }}
              disabled={servicePageCount <= 1 || serviceCarouselPage >= servicePageCount - 1}
            >
              <span aria-hidden="true">&#10095;</span>
            </button>
          </div>

          <div className="services__dots" aria-hidden={servicePageCount <= 1} aria-label="Paginacion de servicios">
            {Array.from({ length: servicePageCount }).map((_, index) => {
              const isActive = index === serviceCarouselPage;

              return (
                <button
                  key={`service-dot-${index + 1}`}
                  type="button"
                  className={`services__dot ${isActive ? 'is-active' : ''}`}
                  aria-label={`Ir a la pagina ${index + 1} de servicios`}
                  aria-current={isActive ? 'true' : 'false'}
                  onClick={() => {
                    setServiceCarouselPage(index);
                  }}
                />
              );
            })}
          </div>

          <section className="services__insight" aria-label="Importancia del registro">
            <h3 className="services__insight-title">¿Por qué es necesario registrar?</h3>
            <p className="services__note">
              En nuestro pais existen oficinas nacionales que gestionan el registro y control de marcas,
              patentes, obras ineditas, modelos de utilidad y modelos industriales. Para trabajar con ellas,
              es clave contar con asesoramiento capacitado.
            </p>
            <ul className="services__reasons">
              <li>Te permite operar con tranquilidad y legalidad.</li>
              <li>Puede generar valor economico y escalar tu proyecto.</li>
              <li>Te protege frente a copias o usos no autorizados.</li>
              <li>Le aporta seriedad y robustez a tu marca o empresa.</li>
              <li>Fomenta la innovacion y la competitividad en el mercado.</li>
            </ul>
          </section>
        </section>
      </main>

      <section className="marcas-carousel">
        <h2 className="marcas-carousel__title">Clientes Destacados</h2>

        <div className="marcas-carousel__container">
          <button className="marcas-carousel__nav marcas-carousel__nav--prev" type="button" aria-label="Ver marcas anteriores">
            <span aria-hidden="true">&#10094;</span>
          </button>

          <div className="marcas-carousel__viewport">
            <div className="marcas-carousel__track">
              {[...brandImages, ...brandImages].map((brandImage, index) => (
                <div className="marcas-carousel__item" key={`${brandImage}-${index + 1}`}>
                  <img src={`/marcas/${brandImage}`} alt={`Cliente ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <button className="marcas-carousel__nav marcas-carousel__nav--next" type="button" aria-label="Ver siguiente marca">
            <span aria-hidden="true">&#10095;</span>
          </button>
        </div>

        <div className="marcas-carousel__dots" aria-label="Paginacion de marcas" />
      </section>

      <footer className="footer" ref={footerRef}>
        <h2 className="footer__headline">Agenda tu consulta</h2>
        <div className="footer__social">
          <a
            href="https://instagram.com/estudiojuridicocer"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="Instagram"
          >
            <img src="/images/IG.svg" alt="instagram" className="footer__social-icon" />
          </a>
          <a href="mailto:emanuelreist@gmail.com" className="footer__social-link" aria-label="Email">
            <img src="/images/mail.svg" alt="email" className="footer__social-icon" />
          </a>
          <a
            href="https://wa.me/5493434543443"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="WhatsApp"
          >
            <img src="/images/wsp.svg" alt="whatsapp" className="footer__social-icon" />
          </a>
        </div>

        <div className="footer__contact">
          <a
            href="https://www.google.com/maps/place/Fleming+744,+Parana,+Entre+Rios"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/map.svg" alt="map" />
            <p>Fleming 744 Parana, Entre Rios</p>
          </a>
          <p>0343 4543443</p>
          <p>emanuelreist@gmail.com</p>
        </div>
      </footer>
    </>
  );
}

export default App;
