import BackgroundAnimation from "./components/BackgroundAnimation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import LearningStyles from "./components/LearningStyles";
import AdaptiveLearning from "./components/AdaptiveLearning";
import Survey from "./components/Survey";
import About from "./components/About";
import Footer from "./components/Footer";
import AIChat from "./components/AIChat";
import ScrollToTop from "./components/ScrollToTop";

export default function Home() {
  return (
    <div id="app">
      <BackgroundAnimation />
      <Navbar />
      <Hero />
      <Features />
      <LearningStyles />
      <AdaptiveLearning />
      <Survey />
      <About />
      <Footer />
      <AIChat />
      <ScrollToTop />
    </div>
  );
}
