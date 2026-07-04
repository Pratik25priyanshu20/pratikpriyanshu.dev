import StarBackground from "./components/StarBackground";
import ConsoleGreeting from "./components/ConsoleGreeting";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Trajectory from "./components/Trajectory";
import Publications from "./components/Publications";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import QuantumDivider from "./components/QuantumDivider";
import Terminal from "./components/Terminal";

export default function Home() {
  return (
    <>
      <StarBackground />
      <ConsoleGreeting />
      <Terminal />
      <div className="noise-overlay" aria-hidden="true" />
      <Navigation />
      <main id="main-content">
        <Hero />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Publications />
        <QuantumDivider />
        <Projects />
        <div className="section-divider" />
        <Blog />
        <div className="section-divider" />
        <Skills />
        <div className="section-divider" />
        <Trajectory />
        <div className="section-divider" />
        <Certifications />
        <div className="section-divider" />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
