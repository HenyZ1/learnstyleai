import BackgroundAnimation from "../components/BackgroundAnimation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";
import FeaturesPage from "./FeaturesPage";

export const metadata = {
    title: "Özellikler | LearnStyle AI",
    description: "LearnStyle AI'ın yapay zeka destekli öğrenme özelliklerini keşfedin.",
};

export default function Page() {
    return (
        <div id="app">
            <BackgroundAnimation />
            <Navbar />
            <FeaturesPage />
            <Footer />
            <AIChat />
        </div>
    );
}
