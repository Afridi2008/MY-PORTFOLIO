import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import profilePhoto from './imgs/photo copy.jpg';
import billerImg from './imgs/biller.png';
import siratImg from './imgs/sirat.png';
import krImg from './imgs/kr.jpeg';
import periodicImg from './imgs/periodic.png';
import cgpaImg from './imgs/cgpa.png';
import casioImg from './imgs/casio.png';

// ==========================================
// THREE.JS HERO PARTICLE WAVE COMPONENT (#D8FF3E)
// ==========================================

function HeroParticleWave() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 3000);
    camera.position.set(0, 320, 950);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Particle Grid (55 x 55 particles)
    const SEPARATION = 40;
    const AMOUNTX = 55;
    const AMOUNTY = 55;
    const numParticles = AMOUNTX * AMOUNTY;

    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        scales[j] = 1;
        i += 3;
        j++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Theme Dark Circular Particle Texture (Softened Ambient Opacity)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(17, 17, 17, 0.45)');
    grad.addColorStop(0.35, 'rgba(17, 17, 17, 0.22)');
    grad.addColorStop(0.7, 'rgba(17, 17, 17, 0.08)');
    grad.addColorStop(1, 'rgba(17, 17, 17, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      color: 0x111111,
      size: 14,
      map: texture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let count = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      targetMouseX = (clientX - width / 2) * 0.7;
      targetMouseY = (clientY - height / 2) * 0.7;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 0.5;
      camera.position.y = 320 - mouseY * 0.35;
      camera.lookAt(0, 0, 0);

      // Slow continuous particle-grid rotation
      particles.rotation.y += 0.0012;

      // Sine/cosine wave animation with mouse ripple
      const positionAttr = geometry.attributes.position;
      const posArray = positionAttr.array;

      let idx = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const xPos = posArray[idx];
          const zPos = posArray[idx + 2];
          const dx = xPos - mouseX * 0.4;
          const dz = zPos - mouseY * 0.4;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const mouseWave = Math.sin(dist * 0.02 - count * 2) * Math.max(0, 42 - dist * 0.07);

          posArray[idx + 1] = (Math.sin((ix + count) * 0.35) * 38) + 
                              (Math.sin((iy + count) * 0.5) * 38) + 
                              mouseWave;

          idx += 3;
        }
      }

      positionAttr.needsUpdate = true;
      count += 0.045;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="hero-particle-wave-canvas" 
      aria-hidden="true" 
    />
  );
}

// ==========================================
// VECTOR SVG ICONS (Self-contained, Zero Assets)
// ==========================================

const ArrowUpRightIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const MenuIcon = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GitHubIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const DownloadIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckCircleIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CertificateIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const DotsIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="19" cy="12" r="1.5" fill={color} />
    <circle cx="5" cy="12" r="1.5" fill={color} />
  </svg>
);

// ==========================================
// ANIMATED COUNTER COMPONENT
// ==========================================

function CounterNumber({ target, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1400; // ms
    let startTime = null;
    let animId;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * target));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

// ==========================================
// DATA DEFINITIONS (AFRIDI MOHAMED J)
// ==========================================

const STATS = [
  { target: 6, suffix: "+", label: "Projects Built" },
  { target: 9, suffix: "+", label: "Certifications" },
  { target: 18, suffix: "+", label: "Technical Skills" },
  { target: 2029, suffix: "", label: "Expected Graduation" }
];

const SKILLS = {
  developer: [
    "React.js",
    "JavaScript",
    "Python",
    "FAST APIs",
    "Flask",
    "MongoDB",
    "REST APIs",
    "HTML",
    "CSS",
    "Responsive Design",
    "Git",
    "GitHub",
    "Visual Studio Code"
  ],
  other: [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "Canva",
    "Blender (3D Modelling)"
  ]
};

const EDUCATION = [
  {
    degree: "Bachelor Of Engineering",
    department: "Computer Science & Engineering",
    institution: "K. Ramakrishnan College of Technology (KRCT)",
    location: "Tiruchirappalli, Tamil Nadu",
    graduation: "Expected: 2029",
    score: "CGPA: 8.0"
  },
  {
    degree: "Higher Secondary (12th) & SSLC (10th)",
    department: "Computer Science Stream",
    institution: "Rice City Matric Higher Secondary School",
    location: "Aduthurai, Thanjavur",
    graduation: "Completed",
    score: "12th: 85.5% | 10th: 85.6%"
  }
];

const PROJECTS = [
  {
    id: "biller",
    name: "BILLER",
    category: "Full-Stack Web Application",
    type: "Business Billing & Management System",
    image: billerImg,
    theme: "preview-theme-damas",
    accent: "accent-bar",
    tools: [
      "React.js",
      "FastAPI",
      "Python",
      "MongoDB"
    ],
    liveUrl: "https://biller-fullstack.onrender.com/",
    github: "YOUR_BILLER_GITHUB_URL",
    description:
      "A full-stack business billing and management system designed to simplify customer management, product management, dynamic billing, payment tracking, and revenue analytics.",
    features: [
      "Customer Management",
      "Product Management with CRUD operations",
      "Dynamic Billing (Area, Quantity, Fixed & Custom Pricing)",
      "Payment Recording and Tracking",
      "Revenue Analytics Dashboard",
      "Authentication",
      "Real-time Data Synchronization"
    ]
  },
  {
    id: "sirat",
    name: "SIRAT",
    category: "Progressive Web Application",
    type: "Habit Tracker PWA",
    image: siratImg,
    theme: "preview-theme-postwing",
    accent: "accent-emerald",
    tools: [
      "JavaScript",
      "PWA",
      "IndexedDB"
    ],
    liveUrl: "https://afridi2008.github.io/Habit-Tracker/",
    github: "YOUR_SIRAT_GITHUB_URL",
    description:
      "SIRAT is a Progressive Web App focused on building consistent habits and managing daily routines. It combines habit tracking, fitness, nutrition, learning, personal routine management, and academic tracking into a single offline-friendly application.",
    highlights: [
      "Installable Progressive Web App",
      "Offline-friendly experience",
      "Local/long-term data storage",
      "Habit and progress tracking",
      "Exercise tracking",
      "Coding and learning tracking",
      "College subject management",
      "Designed for everyday use"
    ],
    features: [
      "Habit Tracking",
      "Exercise Tracking",
      "Protein Tracking",
      "Food Routine Tracking",
      "Prayer Tracking",
      "Quran Tracking",
      "Coding Learning Tracking",
      "College Subject Management",
      "Offline Support",
      "Long-term Local Data Storage",
      "Installable PWA"
    ]
  },
  {
    id: "kr-map",
    name: "KR MAP",
    category: "Web Application",
    type: "Intra College Campus Navigation Web App",
    image: krImg,
    theme: "preview-theme-damas",
    accent: "accent-bar",
    tools: ["HTML/CSS", "JavaScript", "3D Modelling"],
    liveUrl: "https://afridi2008.github.io/KR-Map/",
    description: "A fully designed Intra College Campus Navigation Web application that helps students, faculty, and visitors locate Departments, Labs, and Campus Facilities effectively with intuitive 3D spatial representations."
  },
  {
    id: "periodic-table",
    name: "PERIODIC ELEMENT VIEWER",
    category: "Interactive Educational Tool",
    type: "3D Interactive Chemistry Table",
    image: periodicImg,
    theme: "preview-theme-najm",
    accent: "accent-blue",
    tools: ["HTML", "CSS", "JavaScript", "3D Animation"],
    liveUrl: "https://afridi2008.github.io/Periodic-Table/",
    description: "Designed and developed an interactive periodic table displaying all 118 chemical elements with smooth 3D animations and rich scientific property cards for enhanced visual learning."
  },
  {
    id: "cgpa-calc",
    name: "CGPA Calculator",
    category: "Utility Tool",
    type: "Academic Performance Analyzer",
    image: cgpaImg,
    theme: "preview-theme-kavi",
    accent: "accent-purple",
    tools: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://afridi2008.github.io/CGPA-Calculator/",
    description: "Developed a dynamic and responsive CGPA calculator tool featuring flexible semester inputs, real-time credit weighting, and instant grade-to-point calculation for college students."
  },
  {
    id: "basic-calc",
    name: "Basic Calculator",
    category: "Utility Tool",
    type: "Casio Clone Web Application",
    image: casioImg,
    theme: "preview-theme-postwing",
    accent: "accent-emerald",
    tools: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://afridi2008.github.io/Calculator/",
    description: "Designed and developed a pixel-perfect, fully functional digital clone of the classic Casio calculator with responsive button feedback and arithmetic parsing."
  }
];

const MAIN_CERTIFICATIONS = [
  {
    id: "web-dev-simplilearn",
    title: "Web Development for Beginners",
    issuer: "Simplilearn",
    category: "Web Development",
    filterTags: ["Development"],
    isFeatured: true,
    url: "CERTIFICATE_URL"
  },
  {
    id: "dsa-python-simplilearn",
    title: "Data Structure by Python",
    issuer: "Simplilearn",
    category: "Data Structures / Python",
    filterTags: ["Python", "Development"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  },
  {
    id: "intro-js-simplilearn",
    title: "Introduction of JavaScript",
    issuer: "Simplilearn",
    category: "JavaScript / Web Development",
    filterTags: ["JavaScript", "Development"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  },
  {
    id: "simplifying-python-simplilearn",
    title: "Simplifying Python for Beginners",
    issuer: "Simplilearn",
    category: "Python",
    filterTags: ["Python"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  },
  {
    id: "claude-101-anthropic",
    title: "Claude 101",
    issuer: "Anthropic",
    category: "Artificial Intelligence / Generative AI",
    filterTags: ["AI"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  },
  {
    id: "ms-web-accessibility",
    title: "Microsoft Certificate in Web Development and Accessibility",
    issuer: "Microsoft",
    category: "Web Development / Accessibility",
    filterTags: ["Development"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  },
  {
    id: "soft-skills-nptel",
    title: "Soft Skill Development",
    issuer: "NPTEL",
    category: "Professional Development",
    filterTags: ["Professional"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  },
  {
    id: "hp-life-data",
    title: "HP LIFE – Presenting Data",
    issuer: "HP LIFE",
    category: "Data Presentation",
    filterTags: ["Professional"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  },
  {
    id: "hackerrank-css-basic",
    title: "CSS (Basic) Certificate",
    issuer: "HackerRank",
    category: "CSS / Web Development",
    filterTags: ["Development"],
    isFeatured: false,
    url: "CERTIFICATE_URL"
  }
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState(null);
  const [certFilter, setCertFilter] = useState('All');
  const [contactForm, setContactForm] = useState({ name: '', email: '', project: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Monitor Scroll for Active Section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'education', 'skills', 'projects', 'certifications', 'contact'];
      const scrollPos = window.scrollY + 180;
      
      for (let secId of sections) {
        const el = document.getElementById(secId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(secId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Reveal Observer (Smooth Minimal Transitions)
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSuccess(true);
      setContactForm({ name: '', email: '', project: '' });
      setTimeout(() => setFormSuccess(false), 5000);
    }, 700);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadResume = async (e) => {
    e.preventDefault();
    const pdfUrl = "https://afridi2008.github.io/PORTFOLIO/RESUME-AFRIDI%20MOHAMED.J.pdf";
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Afridi_Mohamed_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'Afridi_Mohamed_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="app-container">
      
      {/* ---------------------------------------------------- */}
      {/* FLOATING NAVIGATION BAR */}
      {/* ---------------------------------------------------- */}
      <div className="navbar-fixed-wrap">
        <nav className="navbar" aria-label="Main Navigation">
          {/* Mobile Brand / Name (always 1 single line on mobile) */}
          <span className="nav-brand-mobile">AFRIDI MOHAMED J</span>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <a 
                href="#hero" 
                className={`nav-link-item ${activeSection === 'hero' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`nav-link-item ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#education" 
                className={`nav-link-item ${activeSection === 'education' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}
              >
                Education
              </a>
            </li>
            <li>
              <a 
                href="#skills" 
                className={`nav-link-item ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className={`nav-link-item ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="#certifications" 
                className={`nav-link-item ${activeSection === 'certifications' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('certifications'); }}
              >
                Certifications
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link-item ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              >
                Contact
              </a>
            </li>
          </ul>

          <button 
            className="nav-cta-btn"
            onClick={() => scrollToSection('contact')}
          >
            <span>Get in Touch</span>
            <ArrowUpRightIcon size={14} color="var(--text-primary)" />
          </button>

          {/* Mobile Three-dot / Close Toggle Button */}
          <button 
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <DotsIcon size={18} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <a href="#hero" className="nav-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            <span>Home</span>
          </a>
          <a href="#about" className="nav-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            <span>About</span>
          </a>
          <a href="#education" className="nav-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}>
            <span>Education</span>
          </a>
          <a href="#skills" className="nav-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>
            <span>Skills</span>
          </a>
          <a href="#projects" className="nav-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>
            <span>Projects</span>
          </a>
          <a href="#certifications" className="nav-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('certifications'); }}>
            <span>Certifications</span>
          </a>
          <a href="#contact" className="nav-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
            <span>Contact</span>
          </a>
          <button 
            className="mobile-menu-cta"
            onClick={() => scrollToSection('contact')}
          >
            <span>Get in Touch</span>
            <ArrowUpRightIcon size={14} color="var(--text-primary)" />
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <header id="hero" className="hero-section">
        {/* Three.js Interactive Particle Wave Background */}
        <HeroParticleWave />

        <div className="section-container">
          <h1 className="hero-main-title">AFRIDI MOHAMED J</h1>
          <p className="hero-role-title">
            ASPIRING FULL STACK DEVELOPER
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <button 
              className="btn-primary"
              onClick={handleDownloadResume}
              title="Download My Resume Directly"
              aria-label="Download My Resume PDF"
            >
              <span>Download My Resume</span>
              <DownloadIcon size={15} color="#FAF7F3" />
            </button>
            <button 
              className="btn-outline" 
              onClick={() => scrollToSection('projects')}
            >
              <span>Explore My Work</span>
            </button>
          </div>

          {/* Stats Bar with Counter Animation (Transparent Background) */}
          <div className="hero-stats-bar">
            {STATS.map((s, idx) => (
              <div key={idx} className="hero-stat-item">
                <div className="hero-stat-number">
                  <CounterNumber target={s.target} suffix={s.suffix} />
                </div>
                <div className="hero-stat-label">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* ABOUT ME SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="about" className="bio-section reveal-on-scroll">
        <div className="section-container">
          <div className="bio-grid">
            <div className="bio-left-col">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                ABOUT ME
              </span>
              <h2 style={{ marginTop: '8px', marginBottom: '24px' }}>Who I Am?</h2>

              {/* Photo Space / Card */}
              <div className="about-photo-card" title="Afridi Mohamed J">
                <div className="about-photo-inner">
                  <div className="photo-placeholder-graphic">
                    <div className="photo-avatar-emblem">AM</div>
                    <span className="photo-hint-text">Afridi Mohamed J</span>
                  </div>
                  <img 
                    src={profilePhoto} 
                    alt="Afridi Mohamed J" 
                    className="about-profile-img"
                    onError={(e) => {
                      e.currentTarget.src = '/photo.jpg';
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bio-right-col" style={{ paddingTop: '16px' }}>
              <p className="bio-p-text">
                I’m Afridi Mohamed J, a Computer Science &amp; Engineering student and an aspiring Full Stack Developer who loves turning ideas into real, usable products. I enjoy building across the stack—from crafting clean interfaces with React to developing APIs, backend systems, and database-driven applications with Python, FastAPI, and MongoDB.
              </p>
              <p className="bio-p-text">
                I believe the best way to learn technology is to build with it. Every project I create is an opportunity to solve a real problem, experiment with new ideas, and become a better engineer. My goal is to grow into a versatile software engineer capable of taking an idea from concept to a complete, production-ready application.
              </p>
              <div className="bio-cta-row">
                <button className="btn-primary" onClick={() => scrollToSection('contact')}>
                  <span>Get in Touch</span>
                  <ArrowUpRightIcon size={16} color="#FAF7F3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PHILOSOPHY / MANIFESTO BANNER */}
      {/* ---------------------------------------------------- */}
      <div className="section-container reveal-on-scroll">
        <section className="manifesto-section">
          <div className="manifesto-content">
            <span className="manifesto-badge">PASSION &amp; GOALS</span>
            <p className="manifesto-quote">
              I don’t just write code — <span className="highlight">I turn ideas into experiences</span>.
              <br />
              Building, breaking, learning, and rebuilding better.
              <br />
              My goal is to turn <span className="highlight">“What if?”</span> into <span className="highlight">“It works.”</span>
            </p>
          </div>
        </section>
      </div>

      {/* ---------------------------------------------------- */}
      {/* EDUCATION SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="education" className="services-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                MY EDUCATION
              </span>
              <h2 className="section-title" style={{ marginTop: '4px' }}>Academic Background</h2>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Computer Science &amp; Engineering</span>
          </div>

          <div className="services-list">
            {EDUCATION.map((edu, idx) => (
              <div key={idx} className="service-card">
                <div className="service-num-title">
                  <span className="service-index">/0{idx + 1}</span>
                  <h3 className="service-name">{edu.degree}</h3>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{edu.department}</span>
                </div>

                <div className="service-description">
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{edu.institution}</p>
                  <p>{edu.location}</p>
                </div>

                <div className="service-tags">
                  <span className="service-tag" style={{ backgroundColor: 'var(--bg-color-alt)', color: 'var(--text-primary)', fontWeight: 600 }}>{edu.score}</span>
                  <span className="service-tag">{edu.graduation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TECHNICAL SKILLS SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="skills" className="testimonials-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                MY SKILLS
              </span>
              <h2 className="section-title" style={{ marginTop: '4px' }}>Technical &amp; Creative Skills</h2>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Development &amp; Design</span>
          </div>

          <div className="testimonials-grid">
            {/* Developer Skills */}
            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircleIcon size={20} color="var(--text-primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>As A Developer</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SKILLS.developer.map((skill, i) => (
                    <span key={i} className="service-tag" style={{ fontSize: '13px', padding: '6px 12px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Skills */}
            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircleIcon size={20} color="var(--text-primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Other Skills</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SKILLS.other.map((skill, i) => (
                    <span key={i} className="service-tag" style={{ fontSize: '13px', padding: '6px 12px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PROJECTS SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="projects" className="projects-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                PORTFOLIO
              </span>
              <h2 className="section-title" style={{ marginTop: '4px' }}>Projects &amp; Sample Work</h2>
            </div>
            <a 
              href="https://github.com/Afridi2008" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary" 
              style={{ fontSize: '13px', padding: '8px 18px' }}
            >
              <span>GitHub Profile</span>
              <ArrowUpRightIcon size={14} color="#FAF7F3" />
            </a>
          </div>

          <div className="projects-grid">
            {PROJECTS.map((proj) => (
              <article 
                key={proj.id} 
                className="project-card"
                onClick={() => setSelectedProject(proj)}
                tabIndex="0"
                role="button"
                aria-label={`View project details for ${proj.name}`}
              >
                {/* Visual Preview Box with Project Image */}
                <div className={`project-preview-box ${proj.theme}`}>
                  {proj.image ? (
                    <div className="project-img-wrap">
                      <img 
                        src={proj.image} 
                        alt={proj.name} 
                        className="project-preview-img" 
                      />
                    </div>
                  ) : (
                    <div className="mockup-window">
                      <div className="mockup-header">
                        <div className="mockup-dots">
                          <div className="mockup-dot"></div>
                          <div className="mockup-dot"></div>
                          <div className="mockup-dot"></div>
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--bg-color-alt)', fontFamily: 'var(--font-mono)' }}>
                          {proj.id}.app
                        </span>
                      </div>

                      <div className="mockup-body">
                        <div className="mockup-sidebar"></div>
                        <div className="mockup-content-bars">
                          <div className={`mockup-bar ${proj.accent}`}></div>
                          <div className="mockup-bar" style={{ width: '85%' }}></div>
                          <div className="mockup-grid-cells">
                            <div className="mockup-cell"></div>
                            <div className="mockup-cell"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="project-info">
                  <div className="project-title-sub">
                    <h3>{proj.name}</h3>
                    <p>{proj.type}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {proj.tools.map((t, idx) => (
                        <span key={idx} style={{ fontSize: '10.5px', background: 'var(--bg-color-alt)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="project-arrow-btn">
                    <ArrowUpRightIcon size={16} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CERTIFICATIONS SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="certifications" className="certifications-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header" style={{ alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                CERTIFICATIONS
              </span>
              <h2 className="section-title" style={{ marginTop: '4px' }}>Certifications</h2>
              <p style={{ marginTop: '8px', fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
                Continuous learning, practical skills, and industry-recognized credentials.
              </p>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'center' }}>
              09 Verified Credentials
            </span>
          </div>

          {/* Filter Bar */}
          <div className="cert-filter-bar" role="tablist" aria-label="Certification category filters">
            {['All', 'Development', 'Python', 'JavaScript', 'AI', 'Professional'].map(filter => (
              <button
                key={filter}
                className={`cert-filter-btn ${certFilter === filter ? 'active' : ''}`}
                onClick={() => setCertFilter(filter)}
                role="tab"
                aria-selected={certFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Main Certifications Grid */}
          <div className="certifications-grid">
            {(certFilter === 'All' 
              ? MAIN_CERTIFICATIONS 
              : MAIN_CERTIFICATIONS.filter(c => c.filterTags && c.filterTags.includes(certFilter))
            ).map((cert) => (
              <article 
                key={cert.id} 
                className={`cert-card ${cert.isFeatured ? 'featured-card' : ''}`}
              >
                <div className="cert-card-top">
                  <div className="cert-badge-row">
                    <span className="cert-issuer-badge">{cert.issuer}</span>
                    <span className="cert-category-tag">{cert.category}</span>
                  </div>

                  {cert.isFeatured && (
                    <div className="cert-highlight-badge">
                      <CertificateIcon size={12} color="var(--text-light)" />
                      <span>Primary Developer Certification</span>
                    </div>
                  )}

                  <h3 className="cert-title">{cert.title}</h3>
                </div>

                <div>
                  <div className="cert-issuer-name" style={{ marginBottom: '16px' }}>
                    <CheckCircleIcon size={16} color="var(--text-primary)" />
                    <span>Verified Credential &middot; {cert.issuer}</span>
                  </div>

                  <div className="cert-card-bottom">
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                      Credential Verified
                    </span>
                    <a
                      href={cert.url === "CERTIFICATE_URL" ? "#" : cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cert-link"
                      onClick={(e) => {
                        if (cert.url === "CERTIFICATE_URL") {
                          e.preventDefault();
                          alert(`Certificate link placeholder for "${cert.title}" (Issuer: ${cert.issuer}).`);
                        }
                      }}
                      aria-label={`View certificate for ${cert.title}`}
                    >
                      <span>View Certificate</span>
                      <ArrowUpRightIcon size={13} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CONTACT SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="contact" className="contact-section reveal-on-scroll">
        <div className="section-container">
          <div className="contact-grid">
            <div className="contact-left">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                LET'S TALK
              </span>
              <h2 style={{ marginTop: '8px' }}>Ready to HIRE ME?</h2>
              <p className="contact-subtitle">
                Make a connection, discuss project opportunities, or join a discovery call.
              </p>

              <div className="social-links-row" style={{ marginTop: '24px' }}>
                <a href="mailto:afridimohamed9741@gmail.com" className="social-link-icon-btn" aria-label="Email" title="afridimohamed9741@gmail.com">
                  <MailIcon size={18} />
                </a>
                <a href="https://github.com/Afridi2008" target="_blank" rel="noopener noreferrer" className="social-link-icon-btn" aria-label="GitHub" title="GitHub">
                  <GitHubIcon />
                </a>
                <a href="https://www.linkedin.com/in/afridimohamed-j" target="_blank" rel="noopener noreferrer" className="social-link-icon-btn" aria-label="LinkedIn" title="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a href="https://www.instagram.com/mr_afridi_mohamed?igsh=MWczZHM5anRxMTJ1NA==" target="_blank" rel="noopener noreferrer" className="social-link-icon-btn" aria-label="Instagram" title="Instagram">
                  <InstagramIcon />
                </a>
              </div>
            </div>

            <div className="contact-right">
              <form className="contact-form" onSubmit={handleFormSubmit}>
                {formSuccess && (
                  <div className="form-success-toast">
                    Thank you! Your message has been received. I'll get back to you shortly.
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="form-name" className="form-label">Name</label>
                  <input 
                    id="form-name"
                    type="text" 
                    className="form-input" 
                    placeholder="Your Name" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-email" className="form-label">Email</label>
                  <input 
                    id="form-email"
                    type="email" 
                    className="form-input" 
                    placeholder="your.email@example.com" 
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-project" className="form-label">Your Project / Inquiry</label>
                  <textarea 
                    id="form-project"
                    className="form-textarea" 
                    placeholder="Tell me about your project, timeline, or requirement..."
                    rows={4}
                    value={contactForm.project}
                    onChange={(e) => setContactForm({ ...contactForm, project: e.target.value })}
                  />
                </div>

                <button 
                  type="submit" 
                  className="form-submit-btn"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? <span>Sending...</span> : (
                    <>
                      <span>Send Message</span>
                      <ArrowUpRightIcon size={16} color="var(--text-primary)" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="site-footer">
        <div className="footer-watermark">AFRIDI</div>

        <div className="section-container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <h3>AFRIDI MOHAMED J</h3>
              <p>Aspiring Full Stack Developer</p>
            </div>

            <div>
              <h4 className="footer-col-title">/Quick links</h4>
              <ul className="footer-links-list">
                <li><a href="#hero" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a></li>
                <li><a href="#about" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
                <li><a href="#education" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}>Education</a></li>
                <li><a href="#skills" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a></li>
                <li><a href="#projects" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a></li>
                <li><a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">/Direct Connect</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="mailto:afridimohamed9741@gmail.com" className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <MailIcon size={16} />
                    <span>afridimohamed9741@gmail.com</span>
                  </a>
                </li>
                <li style={{ fontSize: '0.85rem', color: 'var(--text-light-secondary)', marginTop: '8px' }}>
                  K. Ramakrishnan College of Technology (KRCT)
                </li>
                <li style={{ fontSize: '0.85rem', color: 'var(--text-light-secondary)' }}>
                  Tiruchirappalli, Tamil Nadu, India
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 My Portfolio &middot; Built by <strong>Afridi Mohamed J</strong></span>
          </div>
        </div>
      </footer>

      {/* ---------------------------------------------------- */}
      {/* MODAL: PROJECT DETAIL */}
      {/* ---------------------------------------------------- */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)} aria-label="Close modal">✕</button>
            
            {selectedProject.image && (
              <div style={{ width: '100%', maxHeight: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              </div>
            )}

            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              {selectedProject.category}
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '6px', marginBottom: '8px' }}>
              {selectedProject.name}
            </h3>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '14px' }}>
              {selectedProject.type}
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              {selectedProject.description}
            </p>

            {/* Tech Stack */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                Tech Stack
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedProject.tools.map((t, idx) => (
                  <span key={idx} className="service-tag">{t}</span>
                ))}
              </div>
            </div>

            {/* Highlights if present */}
            {selectedProject.highlights && (
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                  Highlights
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {selectedProject.highlights.map((hl, idx) => (
                    <div key={idx} style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', background: 'var(--bg-color-alt)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontWeight: 500 }}>
                      {hl}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features if present */}
            {selectedProject.features && (
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                  Key Features
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && !selectedProject.liveUrl.startsWith('YOUR_') ? (
                <a 
                  href={selectedProject.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                >
                  <span>▶ {selectedProject.id === 'sirat' ? 'View Live App' : 'View Live Demo'}</span>
                  <ArrowUpRightIcon size={14} color="#FAF7F3" />
                </a>
              ) : selectedProject.liveUrl && selectedProject.liveUrl.startsWith('YOUR_') ? (
                <button 
                  className="btn-primary"
                  onClick={() => alert(`Demo URL placeholder for ${selectedProject.name}. Provide the live deployment link when available.`)}
                >
                  <span>▶ {selectedProject.id === 'sirat' ? 'View Live App' : 'View Live Demo'}</span>
                  <ArrowUpRightIcon size={14} color="#FAF7F3" />
                </button>
              ) : (
                <span className="btn-primary" style={{ opacity: 0.6, cursor: 'default' }}>
                  Coming Soon
                </span>
              )}

              {selectedProject.github && !selectedProject.github.startsWith('YOUR_') && (
                <a 
                  href={selectedProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-outline"
                >
                  <span>View on GitHub</span>
                  <ArrowUpRightIcon size={14} />
                </a>
              )}

              <button 
                className="btn-outline" 
                onClick={() => {
                  setSelectedProject(null);
                  scrollToSection('contact');
                }}
              >
                <span>Discuss Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
