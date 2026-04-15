import BackgroundAnimation from "../components/BackgroundAnimation";
import Navbar from "../components/Navbar";
import LoginPage from "./LoginPage";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, getDemoAccounts, verifySessionToken } from "../lib/demoAuth";
import { getSurveyProfileByUserId } from "../lib/database";

export const metadata = {
    title: "Giriş Yap | LearnStyle AI",
    description: "LearnStyle AI platformuna giriş yapın.",
};

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const user = verifySessionToken(token);
    const initialDashboardProfile = user ? getSurveyProfileByUserId(user.id) : null;

    return (
        <div id="app">
            <BackgroundAnimation />
            <Navbar />
            <LoginPage initialUser={user} initialDashboardProfile={initialDashboardProfile} accounts={getDemoAccounts()} />
        </div>
    );
}
