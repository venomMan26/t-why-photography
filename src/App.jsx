import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminGallery from "./AdminGallery";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const phone1 = "2349136952831";
const phone2 = "2347079783778";

const studioAddress =
  "Opposite Akungba Palace, beside Point One Restaurant, Akungba-Akoko, Ondo State, Nigeria";

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studioAddress)}`;

const whatsappMessage = encodeURIComponent(
  "Hello T-Why Photography Studio, I would like to make a booking. Please tell me more about your services.",
);

// --------------------------------------------------
// OFFICIAL GALLERY CATEGORIES
// These images are category covers only.
// They are NOT actual studio uploads.
// --------------------------------------------------

const previewPhotos = [
  {
    title: "The Art of Portraits",
    category: "PORTRAITS",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "Forever Begins",
    category: "WEDDINGS",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "Motherhood",
    category: "BABY & MATERNITY",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "The Celebration",
    category: "EVENTS",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "Modern Elegance",
    category: "COMMERCIAL",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "Behind the Story",
    category: "VIDEO COVERAGE",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "A Day to Remember",
    category: "BIRTHDAY SHOOT",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=90",
  },
];

// --------------------------------------------------
// OFFICIAL STUDIO SERVICES
// --------------------------------------------------

const services = [
  {
    number: "01",
    title: "Portraits",
    icon: "portrait",
    description:
      "Beautifully composed portraits that express personality, confidence and individuality.",
  },
  {
    number: "02",
    title: "Weddings",
    icon: "wedding",
    description:
      "Every emotion, every detail and every unforgettable moment of your special day.",
  },
  {
    number: "03",
    title: "Baby & Maternity",
    icon: "maternity",
    description:
      "Preserving the beautiful journey of motherhood and the precious beginnings of life.",
  },
  {
    number: "04",
    title: "Events",
    icon: "events",
    description:
      "Capturing the atmosphere, excitement and memories that make every occasion special.",
  },
  {
    number: "05",
    title: "Commercial",
    icon: "commercial",
    description:
      "Professional visual content that gives brands, products and businesses a stronger identity.",
  },
  {
    number: "06",
    title: "Video Coverage",
    icon: "video",
    description:
      "Cinematic video storytelling that lets you relive your most important experiences.",
  },
  {
    number: "07",
    title: "Birthday Shoot",
    icon: "birthday",
    description:
      "Celebrate another year with creative, personal and memorable birthday photography.",
  },
];

// --------------------------------------------------
// SERVICE ICONS
// --------------------------------------------------

function ServiceIcon({ type }) {
  const common = {
    viewBox: "0 0 48 48",
    width: "42",
    height: "42",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    portrait: (
      <>
        <circle cx="24" cy="16" r="8" />
        <path d="M9 41c1-9 6-14 15-14s14 5 15 14" />
        <path d="M18 17c1 2 3 3 6 3s5-1 6-3" />
      </>
    ),
    wedding: (
      <>
        <path d="M24 39 8 23a9 9 0 0 1 13-13l3 3 3-3a9 9 0 0 1 13 13Z" />
        <path d="M24 13c-3-4-7-5-10-2" />
        <path d="m24 39 4-8 4 3 4-7" />
      </>
    ),
    maternity: (
      <>
        <circle cx="23" cy="10" r="5" />
        <path d="M17 18c-5 5-5 13-1 20" />
        <path d="M29 18c5 5 5 13 1 20" />
        <path d="M17 18c2 4 4 6 8 6s7-2 8-6" />
        <path d="M16 38c5 3 12 3 17 0" />
        <path d="M24 24c-4 2-6 6-5 10 2 3 7 3 10 0 1-4-1-8-5-10Z" />
      </>
    ),
    events: (
      <>
        <path d="M24 5v6M24 37v6M5 24h6M37 24h6" />
        <path d="m10 10 5 5m18 18 5 5m0-28-5 5m-18 18-5 5" />
        <circle cx="24" cy="24" r="10" />
        <circle cx="24" cy="24" r="4" />
      </>
    ),
    commercial: (
      <>
        <rect x="7" y="13" width="34" height="25" rx="3" />
        <path d="M17 13V9h14v4" />
        <path d="M7 22h34" />
        <path d="M20 22v4h8v-4" />
        <path d="M13 32h8m6 0h8" />
      </>
    ),
    video: (
      <>
        <rect x="5" y="11" width="26" height="26" rx="4" />
        <path d="m31 19 12-6v22l-12-6" />
        <path d="m16 19 9 5-9 5Z" />
      </>
    ),
    birthday: (
      <>
        <path d="M10 23h28v17H10z" />
        <path d="M7 23h34" />
        <path d="M14 23v-5h20v5" />
        <path d="M24 18v-7" />
        <path d="M21 8c-1-3 3-4 3-7 3 3 4 6 0 7" />
        <path d="M17 31h14" />
      </>
    ),
  };

  return <svg {...common}>{icons[type] || icons.portrait}</svg>;
}

// --------------------------------------------------
// BRAND LOGO
// --------------------------------------------------

function BrandLogo({ onClick }) {
  return (
    <a href="/#home" className="brand-logo" onClick={onClick}>
      <span className="brand-script">T-Why</span>
      <span className="brand-camera">◉</span>
      <span className="brand-name">PHOTOGRAPHY</span>
      <span className="brand-studio">S T U D I O</span>
    </a>
  );
}

// --------------------------------------------------
// CONTACT ICONS
// --------------------------------------------------

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.24V2h-3.56v13.67a2.9 2.9 0 1 1-2.9-2.9c.32 0 .63.05.92.15v-3.63a6.45 6.45 0 1 0 5.54 6.38V10.9a8.33 8.33 0 0 0 4.87 1.57V8.91a4.85 4.85 0 0 1-1.1-.13Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="27"
      height="27"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// --------------------------------------------------
// MAIN PUBLIC WEBSITE
// --------------------------------------------------

function PublicWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryLoaded, setGalleryLoaded] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // LOAD REAL PHOTOS FROM THE BACKEND

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const response = await fetch(`${API_URL}/api/gallery`);

        if (!response.ok) {
          throw new Error("Gallery request failed");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid gallery response");
        }

        const livePhotos = data
          .map((photo) => ({
            ...photo,
            id: photo._id || photo.id,
            image: photo.imageUrl || photo.image,
            category: (photo.category || "").trim().toUpperCase(),
            title: photo.title || "Untitled photograph",
            size: ["normal", "tall", "wide", "large"].includes(photo.size)
              ? photo.size
              : "normal",
          }))
          .filter((photo) => photo.image);

        if (active) {
          setGalleryPhotos(livePhotos);
        }
      } catch (error) {
        console.error("Unable to load gallery:", error);

        if (active) {
          setGalleryPhotos([]);
        }
      } finally {
        if (active) {
          setGalleryLoaded(true);
        }
      }
    }

    loadGallery();

    return () => {
      active = false;
    };
  }, []);

  // CREATE CATEGORY DATA FROM REAL UPLOADS

  const categoryCards = useMemo(() => {
    return services.map((service) => {
      const category = service.title.toUpperCase();

      const photos = galleryPhotos.filter(
        (photo) => photo.category === category,
      );

      const fallback = previewPhotos.find(
        (photo) => photo.category === category,
      );

      return {
        ...service,
        category,
        photos,
        cover: photos[0]?.image || fallback?.image,
        count: photos.length,
      };
    });
  }, [galleryPhotos]);

  // PHOTOS BELONGING TO THE SELECTED CATEGORY

  const categoryPhotos = useMemo(() => {
    if (!selectedCategory) return [];

    return galleryPhotos.filter((photo) => photo.category === selectedCategory);
  }, [galleryPhotos, selectedCategory]);

  // PREVENT BACKGROUND SCROLL WHEN MENU OR LIGHTBOX IS OPEN

  useEffect(() => {
    document.body.style.overflow = menuOpen || selectedPhoto ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, selectedPhoto]);

  // CLOSE MENU AND LIGHTBOX WITH ESCAPE

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <main>
      {/* NAVIGATION */}

      <header className="navbar">
        <BrandLogo onClick={closeMenu} />

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={closeMenu}>
            HOME
          </a>
          <a href="#about" onClick={closeMenu}>
            OUR STORY
          </a>
          <a href="#services" onClick={closeMenu}>
            SERVICES
          </a>
          <a href="#portfolio" onClick={closeMenu}>
            PORTFOLIO
          </a>
          <a href="#contact" onClick={closeMenu}>
            CONTACT
          </a>
        </nav>

        <a
          href={`https://wa.me/${phone1}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="nav-book"
        >
          BOOK A SESSION <span>↗</span>
        </a>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* MOBILE MENU BACKDROP */}

      {menuOpen && (
        <div className="menu-backdrop" onClick={closeMenu} aria-hidden="true" />
      )}

      {/* HERO */}

      <section className="hero" id="home">
        <div className="hero-background" />
        <div className="hero-shade" />

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="hero-eyebrow">
              <span />
              T-WHY PHOTOGRAPHY STUDIO
              <span />
            </div>

            <h1>
              WE CAPTURE
              <br />
              <em>MOMENTS.</em>
              <br />
              YOU CHERISH
              <br />
              <em>FOREVER.</em>
            </h1>

            <p className="hero-description">
              Every photograph holds a feeling. Every moment deserves to be
              remembered. Let us tell your story through our lens.
            </p>

            <div className="hero-actions">
              <a href="#portfolio" className="gold-button">
                EXPLORE OUR WORK
              </a>

              <a href="#about" className="text-link">
                DISCOVER OUR STORY <span>↗</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="hero-footer">
          <span>CREATIVE PHOTOGRAPHY & VISUAL STORYTELLING</span>
          <span className="hero-scroll">SCROLL TO DISCOVER</span>
          <span>AKUNGBA-AKOKO, NIGERIA</span>
        </div>

        <div className="hero-counter">
          01 <span>/</span> 07
        </div>
      </section>

      {/* ABOUT THE STUDIO */}

      <section className="about-section section-padding" id="about">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=85"
            alt="Professional camera and photography equipment"
            loading="lazy"
          />

          <div className="image-caption">THE ART BEHIND EVERY FRAME</div>
        </div>

        <div className="about-content">
          <span className="section-kicker">01 — OUR STORY</span>

          <h2>
            WE DON'T JUST
            <br />
            TAKE PICTURES.
            <br />
            <em>WE PRESERVE</em>
            <br />
            MEMORIES.
          </h2>

          <div className="gold-line" />

          <p>
            At T-Why Photography Studio, we believe that the most beautiful
            moments in life deserve to last forever.
          </p>

          <p>
            From personal portraits to weddings, celebrations and professional
            visual storytelling, our passion is to transform real moments into
            timeless photographs.
          </p>

          <p className="signature">T-Why Photography Studio</p>

          <a href="#services" className="underlined-link">
            DISCOVER WHAT WE DO <span>↗</span>
          </a>
        </div>
      </section>

      {/* SERVICES */}

      <section className="services-section section-padding" id="services">
        <div className="section-top">
          <div>
            <span className="section-kicker">02 — WHAT WE OFFER</span>
            <h2>
              OUR <em>SERVICES.</em>
            </h2>
          </div>

          <p>
            Different stories. Different experiences. One passion — capturing
            them beautifully.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.article
              className="service-card"
              key={service.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.07,
              }}
            >
              <span className="service-number">{service.number}</span>

              <div className="service-icon">
                <ServiceIcon type={service.icon} />
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <a
                href={`https://wa.me/${phone1}?text=${encodeURIComponent(
                  `Hello T-Why Photography Studio, I am interested in your ${service.title} service.`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                ENQUIRE <span>↗</span>
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      {/* PORTFOLIO CATEGORY GALLERY */}

      <section className="portfolio-section section-padding" id="portfolio">
        <div className="section-top">
          <div>
            <span className="section-kicker">03 — THE PORTFOLIO</span>
            <h2>
              FRAMES OF <em>LIFE.</em>
            </h2>
          </div>

          <p>
            Explore our work by category. Every frame tells a different story.
          </p>
        </div>

        {!selectedCategory ? (
          <>
            <div className="category-grid">
              {categoryCards.map((category, index) => (
                <motion.button
                  type="button"
                  className="category-card"
                  key={category.category}
                  onClick={() => setSelectedCategory(category.category)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.6,
                    delay: (index % 3) * 0.08,
                  }}
                >
                  {category.cover && (
                    <img
                      src={category.cover}
                      alt={`${category.title} category`}
                      loading="lazy"
                    />
                  )}

                  <span className="category-card-shade" />

                  <span className="category-card-number">
                    {category.number}
                  </span>

                  <span className="category-card-content">
                    <small>
                      {category.count}{" "}
                      {category.count === 1 ? "PHOTOGRAPH" : "PHOTOGRAPHS"}
                    </small>

                    <strong>{category.title}</strong>

                    <span className="category-card-link">
                      EXPLORE CATEGORY <span>↗</span>
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>

            {!galleryLoaded && (
              <p className="portfolio-note">LOADING STUDIO PORTFOLIO...</p>
            )}

            {galleryLoaded && galleryPhotos.length === 0 && (
              <p className="portfolio-note">
                OUR OFFICIAL STUDIO PHOTOGRAPHS WILL APPEAR HERE AS THEY ARE
                UPLOADED.
              </p>
            )}
          </>
        ) : (
          <div className="category-detail">
            <div className="category-gallery-heading">
              <button
                type="button"
                className="category-back"
                onClick={() => setSelectedCategory(null)}
              >
                <span>←</span> BACK TO CATEGORIES
              </button>

              <div>
                <span className="section-kicker">SELECTED COLLECTION</span>

                <h3>
                  {services.find(
                    (service) =>
                      service.title.toUpperCase() === selectedCategory,
                  )?.title || selectedCategory}
                  <em>.</em>
                </h3>

                <p>
                  {categoryPhotos.length}{" "}
                  {categoryPhotos.length === 1 ? "PHOTOGRAPH" : "PHOTOGRAPHS"}
                </p>
              </div>
            </div>

            {categoryPhotos.length > 0 ? (
              <div className="portfolio-grid">
                {categoryPhotos.map((photo, index) => (
                  <motion.button
                    type="button"
                    className={`portfolio-card ${photo.size || "normal"}`}
                    key={photo.id || `${photo.title}-${index}`}
                    onClick={() => setSelectedPhoto(photo)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % 3) * 0.07,
                    }}
                  >
                    <img src={photo.image} alt={photo.title} loading="lazy" />

                    <span className="portfolio-overlay" />

                    <span className="portfolio-info">
                      <small>{photo.category}</small>
                      <strong>{photo.title}</strong>
                    </span>

                    <span className="portfolio-plus">+</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="portfolio-empty">
                <span className="portfolio-empty-number">T-WHY STUDIO</span>

                <h3>NEW MOMENTS ARE COMING.</h3>

                <p>
                  We are preparing beautiful photographs for this collection.
                  Please check back soon.
                </p>

                <a
                  href={`https://wa.me/${phone1}?text=${encodeURIComponent(
                    `Hello T-Why Photography Studio, I would like to enquire about your ${selectedCategory} service.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="gold-button"
                >
                  ENQUIRE ABOUT THIS SERVICE
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      {/* BRAND STATEMENT */}

      <section className="statement-section">
        <div className="statement-content">
          <span className="section-kicker">THE T-WHY EXPERIENCE</span>

          <h2>
            YOUR MOMENTS.
            <br />
            YOUR EMOTIONS.
            <br />
            <em>FOREVER YOURS.</em>
          </h2>

          <p>We capture the moments you never want to forget.</p>

          <a
            href={`https://wa.me/${phone1}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="gold-button"
          >
            LET'S CREATE TOGETHER
          </a>
        </div>
      </section>

      {/* CONTACT */}

      <section className="contact-section section-padding" id="contact">
        <div className="contact-heading">
          <span className="section-kicker">04 — GET IN TOUCH</span>

          <h2>
            LET'S TELL YOUR <em>STORY.</em>
          </h2>

          <p>Have a special moment coming up? Let's make it unforgettable.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <span className="contact-icon">☎</span>

            <small>CALL OR WHATSAPP</small>

            <a href={`tel:+${phone1}`}>09136952831</a>
            <a href={`tel:+${phone2}`}>070 7978 3778</a>
          </div>

          <div className="contact-card">
            <span className="contact-icon">
              <LocationIcon />
            </span>

            <small>VISIT OUR STUDIO</small>

            <p>{studioAddress}</p>

            <a
              className="contact-action"
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
            >
              GET DIRECTIONS ↗
            </a>
          </div>

          <div className="contact-card">
            <span className="contact-icon">
              <TikTokIcon />
            </span>

            <small>FOLLOW OUR JOURNEY</small>

            <a
              href="https://www.tiktok.com/@twhy_photography"
              target="_blank"
              rel="noreferrer"
            >
              @twhy_photography
            </a>

            <p>Follow us for our latest photography and studio updates.</p>
          </div>
        </div>

        <div className="booking-banner">
          <div>
            <span className="section-kicker">YOUR NEXT MEMORY STARTS HERE</span>

            <h3>BOOK YOUR SESSION TODAY.</h3>
          </div>

          <a
            href={`https://wa.me/${phone1}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="gold-button"
          >
            BOOK VIA WHATSAPP
          </a>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer">
        <BrandLogo onClick={closeMenu} />

        <p className="footer-slogan">
          LET US TELL YOUR STORY THROUGH OUR LENS.
        </p>

        <div className="footer-bottom">
          <span>© 2026 T-WHY PHOTOGRAPHY STUDIO.</span>

          <a href="#home">BACK TO TOP</a>

          <a href="/admin" className="admin-footer-link">
            ADMIN
          </a>

          <span>MADE WITH PASSION.</span>
        </div>
      </footer>

      {/* PHOTO LIGHTBOX */}

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close image preview"
            >
              ✕
            </button>

            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={selectedPhoto.image} alt={selectedPhoto.title} />

              <div className="lightbox-caption">
                <span>{selectedPhoto.category}</span>
                <h3>{selectedPhoto.title}</h3>
              </div>

              <a
                className="gold-button gallery-enquiry"
                href={`https://wa.me/${phone1}?text=${encodeURIComponent(
                  `Hello T-Why Photography Studio, I am interested in this photograph: ${selectedPhoto.title} (${selectedPhoto.category}). Please tell me more.`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                ENQUIRE ABOUT THIS PHOTO
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING INSTAGRAM BUTTON */}

      <a
        className="floating-instagram"
        href="https://www.instagram.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Visit Instagram"
        title="Instagram"
      >
        <InstagramIcon />
      </a>

      {/* FLOATING WHATSAPP BUTTON */}

      <a
        className="floating-whatsapp"
        href={`https://wa.me/${phone1}?text=${whatsappMessage}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with T-Why Photography on WhatsApp"
        title="WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 .5C7.45.5.5 7.45.5 16c0 2.73.72 5.41 2.08 7.76L.5 31.5l7.93-2.08A15.43 15.43 0 0 0 16 31.5c8.55 0 15.5-6.95 15.5-15.5S24.55.5 16 .5Zm0 28.36c-2.37 0-4.7-.64-6.72-1.85l-.48-.28-4.71 1.24 1.26-4.59-.31-.5A12.82 12.82 0 1 1 16 28.86Zm7.04-9.6c-.39-.2-2.3-1.14-2.66-1.27-.36-.13-.62-.2-.88.2-.26.39-1.01 1.27-1.24 1.53-.23.26-.46.29-.85.1-.39-.2-1.64-.61-3.13-1.94-1.16-1.04-1.94-2.32-2.17-2.71-.23-.39-.02-.6.17-.8.18-.17.39-.45.59-.68.2-.23.26-.39.39-.65.13-.26.07-.49-.03-.68-.1-.2-.88-2.12-1.21-2.9-.32-.76-.64-.66-.88-.67h-.75c-.26 0-.68.1-1.04.49-.36.39-1.37 1.34-1.37 3.25s1.4 3.77 1.6 4.03c.2.26 2.75 4.2 6.66 5.89.93.4 1.65.65 2.21.83.93.3 1.77.26 2.44.16.75-.11 2.3-.94 2.63-1.86.33-.91.33-1.69.23-1.85-.1-.16-.36-.26-.75-.46Z" />
        </svg>
      </a>
    </main>
  );
}

// --------------------------------------------------
// APP ROUTING
// --------------------------------------------------

export default function App() {
  return window.location.pathname.replace(/\/+$/, "") === "/admin" ? (
    <AdminGallery />
  ) : (
    <PublicWebsite />
  );
}
