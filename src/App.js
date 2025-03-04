import React, { useState, useEffect } from 'react';
import './App.css';
import NeuralNetworkBackground from './neural-network-background';

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
      text: `I'm a Data Scientist/Software Engineer and consultant with a PhD 
             in Physics, bridging advanced research with real-world 
             applications in AI, ML, and HPC. My focus is on building 
             scalable, reliable systems that transform bold ideas into 
             tangible impact, from global finance giants to award-winning startups.`,
    },
    expertise: {
      heading: 'Expertise',
      hardSkillsTitle: 'Technical Mastery',
      hardSkillsList: `• Data Science and Statistics
                       • AI, ML, AIOps & Data Pipelines
                       • AWS, DevOps, CI/CD & Terraform
                       • Python, C++, Kotlin, PySpark`,
      softSkillsTitle: 'Strategic Impact',
      softSkillsList: `• Leading End-to-End Transformations
                       • Translating Complex Tech into Business ROI
                       • Mentoring Teams & Building Innovation Culture
                       • Sustainable, Scalable Systems Architecture`,
    },
    projects: {
      heading: 'Projects I\'ve Worked On',
      wingbitsTitle: 'Wingbits — Sweden\'s Startup of the Year',
      wingbitsDesc: `Engineered data infrastructure for Wingbits, delivering
                     hyper-growth readiness and a seamless user experience, 
                     propelling them to a national accolade in 2024.`,
      globalTitle: 'Global AI & Big Data Ecosystem',
      globalDesc: `Led transformations for major finance organizations, blending HPC-level
                   data processing with advanced AI pipelines. Implemented Terraform-based 
                   infra & CI/CD.`,
      numcmcTitle: 'nuMCMC — High-Performance Simulations',
      numcmcDesc: `Created nuMCMC, an open source C++ library powering large-scale Monte Carlo 
                   simulations. Esteemed for speed and extensibility, it's redefining HPC 
                   innovation for scientific computing over the world.`,
    },
    contact: {
      heading: 'Collaborate',
      text: `Ready to tackle complex data challenges or pioneer new frontiers in AI? 
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
      text: `Sou Data Scientist/Software Engineer e consultor com PhD em Física,
             unindo pesquisa avançada a aplicações reais em IA, ML e HPC.
             Foco em criar sistemas escaláveis e confiáveis que transformam
             grandes ideias em impactos reais, desde gigantes do mercado financeiro
             até startups premiadas.`,
    },
    expertise: {
      heading: 'Expertise',
      hardSkillsTitle: 'Domínio Técnico',
      hardSkillsList: `• Ciência de Dados e Estatística
                       • AI, ML, AIOps & Data Pipelines
                       • AWS, DevOps, CI/CD & Terraform
                       • Python, C++, Kotlin, PySpark`,
      softSkillsTitle: 'Impacto Estratégico',
      softSkillsList: `• Liderança de Transformações End-to-End
                       • Tradução de Tecnologia Complexa em ROI de Negócios
                       • Mentoria de Equipes & Cultura de Inovação
                       • Arquiteturas Sustentáveis e Escaláveis`,
    },
    projects: {
      heading: 'Projetos que participei',
      wingbitsTitle: 'Wingbits — Startup do Ano na Suécia',
      wingbitsDesc: `Criei a infraestrutura de dados para a Wingbits, garantindo
                     alta escalabilidade e uma experiência de usuário impecável,
                     impulsionando-os a ganhar um prêmio nacional em 2024.`,
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
  const icon = theme === 'light' ? '🌙' : '✴';
  return (
    <button className="theme-button" onClick={onToggleTheme}>
      {icon}
    </button>
  );
}

/* =========== Seletor de Idioma =========== */
function LanguageSelector({ lang, onChangeLanguage }) {
  return (
    <select
      className="language-selector"
      value={lang}
      onChange={onChangeLanguage}
    >
      <option value="en">English</option>
      <option value="pt">Português</option>
    </select>
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
        <LanguageSelector lang={lang} onChangeLanguage={onChangeLanguage} />
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
function Skills({ lang }) {
  return (
    <section id="skills" className="skills section fade-in">
      <h2>{strings[lang].expertise.heading}</h2>
      <div className="skills-container">
        <div className="hard-skills">
          <h3>{strings[lang].expertise.hardSkillsTitle}</h3>
          <p>
            {strings[lang].expertise.hardSkillsList.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className="soft-skills">
          <h3>{strings[lang].expertise.softSkillsTitle}</h3>
          <p>
            {strings[lang].expertise.softSkillsList.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========== Projects =========== */
function Projects({ lang }) {
  return (
    <section id="projects" className="projects section fade-in">
      <h2>{strings[lang].projects.heading}</h2>

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
