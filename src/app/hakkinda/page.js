import BackgroundAnimation from "../components/BackgroundAnimation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";
import AboutPage from "./AboutPage";

export const metadata = {
    title: "Hakkında | LearnStyle AI",
    description: "LearnStyle AI hakkında: Misyonumuz, vizyonumuz ve ekibimiz.",
};

export default function Page() {
    return (
        <div id="app">
            <BackgroundAnimation />
            <Navbar />
            <AboutPage />
            <Footer />
            <AIChat />
        </div>
    );
}
