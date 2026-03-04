import BackgroundAnimation from "../components/BackgroundAnimation";
import Navbar from "../components/Navbar";
import LoginPage from "./LoginPage";

export const metadata = {
    title: "Giriş Yap | LearnStyle AI",
    description: "LearnStyle AI platformuna giriş yapın.",
};

export default function Page() {
    return (
        <div id="app">
            <BackgroundAnimation />
            <Navbar />
            <LoginPage />
        </div>
    );
}
