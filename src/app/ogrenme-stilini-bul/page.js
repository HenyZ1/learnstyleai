import BackgroundAnimation from "../components/BackgroundAnimation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";
import Survey from "../components/Survey";

export const metadata = {
    title: "Öğrenme Stilini Bul | LearnStyle AI",
    description: "20 soruluk anketimiz ile kendi öğrenme stilinizi keşfedin.",
};

export default function Page() {
    return (
        <div id="app">
            <BackgroundAnimation />
            <Navbar />
            <div style={{ paddingTop: "60px" }}>
                <Survey />
            </div>
            <Footer />
            <AIChat />
        </div>
    );
}
