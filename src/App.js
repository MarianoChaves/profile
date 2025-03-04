import React, { useState, useEffect } from 'react';
import './App.css';
import NeuralNetworkBackground from './neural-network-background';
import LanguageDropdown from './LanguageDropdown';

// No seu Header, por exemplo:


/* =========== HOOK DE DETECÇÃO/AJUSTE DE LINGUAGEM =========== */
function useLanguage() {
  const getDefaultLanguage = () => {
    const userLang = navigator.language || navigator.userLanguage;
    // Se começar com 'pt', carregue português; caso contrário, inglês
    return userLang && userLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
  };

  const [lang, setLang] = useState(getDefaultLanguage);

  const handleChangeLanguage = (event) => {
    setLang(event.target.value);
  };

  return [lang, handleChangeLanguage];
}

/* 
   Dicionário simples com mapeamento de textos para inglês e português.

   Você pode adaptar esse objeto ao conteúdo que quiser traduzir.
   Basta acessar com something como strings[lang].hero.heading
*/
const strings = {
  en: {
    header: {
      logo: 'Mariano Chaves',
      home: 'Home',
      about: 'About',
      skills: 'Expertise',
      projects: 'Projects',
      contact: 'Collaborate',
    },
    hero: {
      heading: 'Shaping the Future of AI & Big Data',
      subheading: 'Advanced Architectures & Transformative Solutions',
      cta: 'View My Projects',
    },
    about: {
      heading: 'About Me',
      text: `I'm a Data Scientist/Software Engineer and consultant with a PhD in Physics,
             bridging advanced research with real-world applications in AI, ML, and HPC.
             I focus on building scalable and reliable systems that transform bold ideas 
             into real impact, from financial market giants to award-winning startups.`,
    },
    expertise: {
      heading: 'Advanced Expertise',
      subtitle: 'Combining cutting-edge technical mastery with strategic leadership to deliver transformative solutions across data science, AI, cloud, and software engineering domains.',
    },
    projects: {
      heading: 'Projects I was involved in',
      wingbitsTitle: 'Wingbits — Sweden\'s Startup of the Year',
      wingbitsDesc: `Contributed to the development of the data infrastructure for Wingbits,
                     ensuring high scalability and a seamless user experience,
                     helping them win a national award in Sweden in 2024.`,
      globalTitle: 'Global AI & Big Data Ecosystem',
      globalDesc: `Leading transformations in major financial institutions,
                   combining HPC-level data processing with advanced AI pipelines.
                   Implemented Terraform-based infrastructure and CI/CD.`,
      numcmcTitle: 'nuMCMC — High-Performance Simulations',
      numcmcDesc: `Created nuMCMC, an open-source C++ library for large-scale 
                   Monte Carlo simulations. Recognized for its speed and extensibility,
                   it is redefining HPC innovation for scientific computing worldwide.`,
    },
    contact: {
      heading: 'Collaborate',
      text: `Ready to tackle complex data challenges or explore new frontiers in AI?
             Let's connect and build solutions that define the future.`,
      email: 'Email',
      linkedIn: 'LinkedIn',
      website: 'Website',
    },
    footer: {
      text: 'Elevating Technology and Innovation.',
    },
  },
  pt: {
    header: {
      logo: 'Mariano Chaves',
      home: 'Início',
      about: 'Sobre',
      skills: 'Expertise',
      projects: 'Projetos',
      contact: 'Colaborar',
    },
    hero: {
      heading: 'Moldando o Futuro de IA & Big Data',
      subheading: 'Arquiteturas Avançadas & Soluções Transformadoras',
      cta: 'Ver Meus Projetos',
    },
    about: {
      heading: 'Sobre Mim',
      text: `Sou Cientista de Dados/Engenheiro de Software e consultor com Doutorado em Física,
             unindo pesquisa avançada a aplicações reais em IA, ML e HPC.
             Foco em criar sistemas escaláveis e confiáveis que transformam
             grandes ideias em impactos reais, desde gigantes do mercado financeiro
             até startups premiadas.`,
    },
    expertise: {
      heading: 'Competências Avançadas',
      subtitle: 'Combinando domínio técnico de ponta com liderança estratégica para entregar soluções transformadoras em ciência de dados, IA, cloud e engenharia de software.',
    },
    projects: {
      heading: 'Projetos envolvidos',
      wingbitsTitle: 'Wingbits — Startup do Ano na Suécia',
      wingbitsDesc: `Participei da criação da infraestrutura de dados para a Wingbits, garantindo
                     alta escalabilidade e uma experiência de usuário impecável,
                     impulsionando-os a ganhar um prêmio nacional (Sueco) em 2024.`,
      globalTitle: 'Ecossistema Global de IA & Big Data',
      globalDesc: `Liderando transformações em grandes instituições financeiras,
                   combinando processamento de dados em nível de HPC com pipelines
                   avançados de IA. Infraestrutura e CI/CD baseados em Terraform.`,
      numcmcTitle: 'nuMCMC — Simulações de Alto Desempenho',
      numcmcDesc: `Criei nuMCMC, uma biblioteca C++ de código aberto para 
                   simulações de Monte Carlo em larga escala. Reconhecida pela 
                   velocidade e extensibilidade, está redefinindo a inovação em HPC 
                   para a computação científica em todo o mundo.`,
    },
    contact: {
      heading: 'Colaborar',
      text: `Pronto para encarar desafios complexos em dados ou explorar novas fronteiras em IA?
             Vamos nos conectar e construir soluções que definem o futuro.`,
      email: 'Email',
      linkedIn: 'LinkedIn',
      website: 'Site',
    },
    footer: {
      text: 'Elevando Tecnologia e Inovação.',
    },
  },
};


/* =========== Hook de Detecção/Ajuste de Tema =========== */
function useSystemTheme() {
  const getDefaultTheme = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getDefaultTheme);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
}

/* =========== Botão de Alternância de Tema (Sol/Lua) =========== */
function ThemeToggleButton({ theme, onToggleTheme }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={onToggleTheme}
      />
      <span className="slider"></span>
    </label>
  );
}



/* =========== Header =========== */
function Header({ theme, onToggleTheme, lang, onChangeLanguage }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">{strings[lang].header.logo}</div>
        <nav className="nav">
          <a href="#hero">{strings[lang].header.home}</a>
          <a href="#about">{strings[lang].header.about}</a>
          <a href="#skills">{strings[lang].header.skills}</a>
          <a href="#projects">{strings[lang].header.projects}</a>
          <a href="#contact">{strings[lang].header.contact}</a>
        </nav>

        {/* Botão para mudar tema */}
        <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />

        {/* Seletor de idioma */}
        <LanguageDropdown lang={lang} onChangeLanguage={onChangeLanguage} />
      </div>
    </header>
  );
}

/* =========== Hero =========== */
function Hero({ lang }) {
  return (
    <section id="hero" className="hero fade-in">
      <div className="hero-content">
        <h1>{strings[lang].hero.heading}</h1>
        <p>{strings[lang].hero.subheading}</p>
        <a href="#projects" className="cta-button">
          {strings[lang].hero.cta}
        </a>
      </div>
    </section>
  );
}

/* =========== About =========== */
function About({ lang }) {
  return (
    <section id="about" className="about section fade-in">
      <div className="about-container">
        <h2>{strings[lang].about.heading}</h2>
        <div className="about-content">
          <img
            src="/profile.png"
            alt="Mariano"
            className="profile-photo"
          />
          <p>
            {strings[lang].about.text}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========== Skills =========== */
/* =========== Skills (Versão Avançada e Integrada) =========== */
function Skills({ lang }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const skillsRef = React.useRef(null);

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  const technicalSkills = [
    {
      icon: "🧠", 
      title: lang === 'en' ? "AI, ML & Data Science" : "IA, ML & Ciência de Dados",
      description: lang === 'en' 
        ? "Building intelligent systems and transforming data into business value" 
        : "Construção de sistemas inteligentes e transformação de dados em valor de negócio",
      skills: [
        {
          name: "Deep Learning & Data Science",
          level: 95,
          badges: ["PyTorch", "TensorFlow", "Scikit-Learn"]
        },
        {
          name: "Big Data Processing",
          level: 92,
          badges: ["Spark", "AWS Glue"]	
        },
        {
          name: "Statistical Analysis & Modeling Tools",
          level: 95,
          badges: ["Advanced Stats", "Hypothesis Testing", "Sagemaker", "R"]
        },
        {
          name: "NLP & Computer Vision",
          level: 90,
          badges: ["LLMs", "OpenCV", "LangChain"]
        }
      ]
    },
    {
      icon: "☁️", 
      title: lang === 'en' ? "Cloud & Infrastructure" : "Cloud & Infraestrutura",
      description: lang === 'en' 
        ? "Designing scalable, enterprise-grade cloud architectures" 
        : "Projetando arquiteturas cloud escaláveis de nível empresarial",
      skills: [
        {
          name: "AWS Architecture & Services",
          level: 90,
          badges: ["EC2", "S3", "Lambda", "API Gateway", "CloudFront"]
        },
        {
          name: "Infrastructure as Code",
          level: 85,
          badges: ["Terraform", "CloudFormation"]
        },
        {
          name: "Containerization",
          level: 88,
          badges: ["Docker", "ECS", "ECR"]
        },
        {
          name: "CI/CD Pipelines",
          level: 92,
          badges: ["Gitlab Pipelines", "GitHub Actions"]
        }
      ]
    },
    {
      icon: "💻", 
      title: lang === 'en' ? "Software Engineering" : "Engenharia de Software",
      description: lang === 'en' 
        ? "Building robust, maintainable, and high-performance systems" 
        : "Construindo sistemas robustos, sustentáveis e de alto desempenho",
      skills: [
        {
          name: "Languages & Frameworks",
          level: 98,
          badges: ["Python", "C++", "Java", "React", "Node.js", "Kotlin"]	
        },
        {
          name: "C++ & High-Performance Computing",
          level: 90,
          badges: ["HPC", "CUDA"]
        },
        {
          name: "API Design & Development",
          level: 85,
          badges: ["REST", "WebSockets", "OAuth", "JWT",]
        },
        {
          name: "Microservices Architecture",
          level: 88,
          badges: ["System Design"]
        }
      ]
    }
  ];

  return (
    <section id="skills" className="skills section fade-in" ref={skillsRef}>
      <h2>{strings[lang].expertise.heading}</h2>
      
      <div className="skills-intro">
        <p>{strings[lang].expertise.subtitle}</p>
      </div>
      
      <div className={`skills-container ${isVisible ? 'skill-visible' : ''}`}>
        {technicalSkills.map((domain, index) => (
          <div className="skill-card technical" key={`domain-${index}`}>
            <div className="skill-header">
              <div className="skill-icon">{domain.icon}</div>
              <h3 className="skill-title">{domain.title}</h3>
              <p className="skill-subtitle">{domain.description}</p>
            </div>
            
            <div className="skill-body">
              {domain.skills.map((skill, skillIndex) => (
                <div className="skill-item" key={`skill-${index}-${skillIndex}`}>
                  <div className="skill-name">
                    <span>{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  
                  <div className="skill-badges">
                    {skill.badges.map((badge, badgeIndex) => (
                      <span className="skill-badge" key={`badge-${skillIndex}-${badgeIndex}`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                  
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      style={{ '--skill-level': `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========== Projects =========== */
function Projects({ lang }) {
  return (
    <section id="projects" className="projects section fade-in">
      <h2>{strings[lang].projects.heading}</h2>
      <div className="projects-container">
        <div className="project-item">
          <h3>{strings[lang].projects.wingbitsTitle}</h3>
          <a
            href="https://wingbits.com" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/wingbits.png"
              alt="Wingbits"
              className="project-image"
            />
          </a>
          <p>{strings[lang].projects.wingbitsDesc}</p>
        </div>

        <div className="project-item">
          <h3>{strings[lang].projects.globalTitle}</h3>
          <a
            href="https://aws.amazon.com/solutions/case-studies/itau-ml-case-study/?nc1=h_ls" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/itau.png"
              alt="Global AI & Big Data"
              className="project-image"
            />
          </a>
          <p>{strings[lang].projects.globalDesc}</p>
        </div>

        <div className="project-item">
          <h3>{strings[lang].projects.numcmcTitle}</h3>
          <a
            href="https://github.com/MarianoChaves/MCMC" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/numcmc.png"
              alt="nuMCMC"
              className="project-image"
            />
          </a>
          <p>{strings[lang].projects.numcmcDesc}</p>
        </div>
      </div>
    </section>
  );
}


/* =========== Contact =========== */
function Contact({ lang }) {
  return (
    <section id="contact" className="contact section fade-in">
      <h2>{strings[lang].contact.heading}</h2>
      <p>{strings[lang].contact.text}</p>
      <p>
        {strings[lang].contact.email}:
        {' '}
        <a href="mailto:marianoechaves@gmail.com">marianoechaves@gmail.com</a>
      </p>
      <p>
        {strings[lang].contact.linkedIn}:
        <a
          href="https://linkedin.com/in/mariano-echaves/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: 5 }}
        >
          linkedin.com/in/mariano-echaves/
        </a>
      </p>
      <p>
        {strings[lang].contact.website}:
        <a
          href="https://marianochaves.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: 5 }}
        >
          marianochaves.com.br/
        </a>
      </p>
    </section>
  );
}

/* =========== Footer =========== */
function Footer({ lang }) {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p>
          &copy; {new Date().getFullYear()} Mariano Chaves — {strings[lang].footer.text}
        </p>
      </div>
    </footer>
  );
}

/* =========== APP PRINCIPAL =========== */
export default function App() {
  const [theme, toggleTheme] = useSystemTheme();
  const [lang, handleChangeLanguage] = useLanguage();

  return (
    <>
      {/* Canvas animado de fundo (usa a classe .neural-network-canvas) */}
      <NeuralNetworkBackground />

      {/* Aplica o tema (light/dark) no container principal */}
      <div className={theme}>
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          lang={lang}
          onChangeLanguage={handleChangeLanguage}
        />
        <Hero lang={lang} />
        <About lang={lang} />
        <Skills lang={lang} />
        <Projects lang={lang} />
        <Contact lang={lang} />
        <Footer lang={lang} />
      </div>
    </>
  );
}
