import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BackgroundAnimation from "../components/BackgroundAnimation";
import Navbar from "../components/Navbar";
import styles from "../components/PageStyles.module.css";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../lib/demoAuth";
import { getSurveyProfileByUserId } from "../lib/database";

export const metadata = {
  title: "Profil | LearnStyle AI",
  description: "LearnStyle AI profil ve son anket sonuclariniz.",
};

function formatCompletedAt(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = verifySessionToken(token);

  if (!user) {
    redirect("/giris");
  }

  const dashboardProfile = await getSurveyProfileByUserId(user.id);
  const formattedCompletedAt = formatCompletedAt(dashboardProfile?.completedAt);

  return (
    <div id="app">
      <BackgroundAnimation />
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <span className="glass-badge">
              <span className="badge-dot"></span>
              Profil
            </span>
            <h1 className={styles.pageTitle}>{user.name}</h1>
            <p className={styles.pageDesc}>
              {user.roleLabel} hesabi acik. Supabase baglantisi aktifse cozulen anketler burada kalici olarak
              tutulur ve son sonuclariniz bu sayfada gorunur.
            </p>
          </div>

          <div className={styles.profileGrid}>
            <div className={`glass-card-large ${styles.profileHeroCard}`}>
              <div className={styles.panelHeader}>
                <p className={styles.panelEyebrow}>Hesap Bilgisi</p>
                <h2 className={styles.panelTitle}>Oturum Ozeti</h2>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionRow}>
                  <span>Ad Soyad</span>
                  <strong>{user.name}</strong>
                </div>
                <div className={styles.sessionRow}>
                  <span>E-posta</span>
                  <strong>{user.email}</strong>
                </div>
                <div className={styles.sessionRow}>
                  <span>Rol</span>
                  <strong>{user.roleLabel}</strong>
                </div>
                <div className={styles.sessionRow}>
                  <span>Anket Kaydi</span>
                  <strong>{dashboardProfile ? "Var" : "Yok"}</strong>
                </div>
              </div>

              <div className={styles.quickLinks}>
                <a href="/ogrenme-stilini-bul" className={`btn btn-primary ${styles.backBtn}`}>
                  {dashboardProfile ? "Anketi Guncelle" : "Ankete Basla"}
                </a>
                <a href="/giris" className={`btn btn-glass ${styles.backBtn}`}>
                  Giris Sayfasi
                </a>
              </div>
            </div>

            <div className={`glass-card-large ${styles.profileDetailCard}`}>
              <div className={styles.panelHeader}>
                <p className={styles.panelEyebrow}>Son Anket Sonucu</p>
                <h2 className={styles.panelTitle}>
                  {dashboardProfile?.dominantStyle
                    ? `${dashboardProfile.dominantStyle.icon} ${dashboardProfile.dominantStyle.label}`
                    : "Henuz sonuc yok"}
                </h2>
                <p className={styles.panelDesc}>
                  {dashboardProfile
                    ? dashboardProfile.blendSummary
                    : "Anket cozuldugunde AI yorumu, ML tahmini ve skor dagilimi burada otomatik gorunecek."}
                </p>
              </div>

              {dashboardProfile ? (
                <div className={styles.profileResultStack}>
                  <div className={styles.dashboardMetrics}>
                    <span className={styles.dashboardMetric}>
                      AI: {dashboardProfile.analysisSource === "ai" ? "OpenAI" : "Fallback"}
                    </span>
                    {dashboardProfile.mlPrediction ? (
                      <span className={styles.dashboardMetric}>
                        ML: {dashboardProfile.mlPrediction.predictedStyleLabel} %
                        {dashboardProfile.mlPrediction.confidencePercent}
                      </span>
                    ) : null}
                    {formattedCompletedAt ? (
                      <span className={styles.dashboardMetric}>Guncellendi: {formattedCompletedAt}</span>
                    ) : null}
                  </div>

                  <div className={styles.dashboardScoreList}>
                    {dashboardProfile.rankedStyles.map((style) => (
                      <div key={style.key} className={styles.dashboardScoreRow}>
                        <div className={styles.dashboardScoreHeader}>
                          <span>
                            {style.icon} {style.label}
                          </span>
                          <strong>{style.score}/20</strong>
                        </div>
                        <div className={styles.dashboardScoreTrack}>
                          <div
                            className={styles.dashboardScoreFill}
                            style={{
                              width: `${style.percentage}%`,
                              background: style.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {dashboardProfile.analysisPreview ? (
                    <div className={`glass-card ${styles.dashboardCard}`}>
                      <div className={styles.dashboardHeader}>
                        <div>
                          <p className={styles.panelEyebrow}>AI Ozet</p>
                          <h3 className={styles.dashboardTitle}>Kisa Degerlendirme</h3>
                        </div>
                        {dashboardProfile.dominantStyle ? (
                          <span
                            className={styles.dashboardBadge}
                            style={{
                              background: `${dashboardProfile.dominantStyle.color}22`,
                              color: dashboardProfile.dominantStyle.color,
                            }}
                          >
                            %{dashboardProfile.dominantStyle.percentage}
                          </span>
                        ) : null}
                      </div>
                      <p className={styles.dashboardPreview}>{dashboardProfile.analysisPreview}</p>
                    </div>
                  ) : null}

                  {dashboardProfile.recommendedTips?.length ? (
                    <div className={`glass-card ${styles.dashboardCard}`}>
                      <div className={styles.dashboardHeader}>
                        <div>
                          <p className={styles.panelEyebrow}>Oneriler</p>
                          <h3 className={styles.dashboardTitle}>Hemen Uygula</h3>
                        </div>
                      </div>
                      <ul className={styles.dashboardTipList}>
                        {dashboardProfile.recommendedTips.slice(0, 5).map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className={styles.dashboardEmpty}>
                  <p>Bu hesap icin kayitli anket sonucu bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

