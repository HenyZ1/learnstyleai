"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./AIChat.module.css";

// Comprehensive response database
const responseDB = {
    greetings: {
        keywords: ["merhaba", "selam", "hey", "sa", "naber", "nasılsın", "iyi günler", "iyi akşamlar", "günaydın"],
        response: "Merhaba! 👋 Ben LearnStyle AI Asistanınızım. Size öğrenme stiliniz, etkili çalışma yöntemleri ve kişiselleştirilmiş öğrenme stratejileri hakkında yardımcı olabilirim. Nasıl yardımcı olabilirim?"
    },
    thanks: {
        keywords: ["teşekkür", "sağol", "sağ ol", "eyvallah", "tşk", "eyv"],
        response: "Rica ederim! 😊 Öğrenme yolculuğunuzda her zaman yanınızdayım. Başka bir sorunuz olursa çekinmeden sorabilirsiniz!"
    },
    bye: {
        keywords: ["görüşürüz", "hoşçakal", "bye", "güle güle", "bb"],
        response: "Görüşmek üzere! 🌟 Öğrenme yolculuğunuzda başarılar dilerim. İhtiyacınız olduğunda buradayım!"
    },
    learningStyle: {
        keywords: ["öğrenme stilim", "öğrenme stili nedir", "stilimi bul", "hangi stildeyim", "öğrenme tipim"],
        response: "Öğrenme stilinizi keşfetmek için sayfamızdaki anketi kullanabilirsiniz! 📋 VARK modeline göre 4 temel öğrenme stili var:\n\n👁️ **Görsel** – Görseller ve diyagramlarla öğrenme\n🎧 **İşitsel** – Dinleyerek ve konuşarak öğrenme\n📖 **Okuma/Yazma** – Metin ve notlarla öğrenme\n🤸 **Kinestetik** – Yaparak ve deneyimleyerek öğrenme\n\nAnketimiz hazır olduğunda size özel analiz sunacağız!"
    },
    betterLearning: {
        keywords: ["daha iyi öğren", "nasıl öğrenirim", "etkili öğrenme", "verimli çalışma", "nasıl çalışmalıyım", "çalışma teknik"],
        response: "Daha etkili öğrenmek için kanıtlanmış stratejiler:\n\n⏱️ **Pomodoro Tekniği** – 25 dk çalış, 5 dk mola ver\n🔄 **Aralıklı Tekrar** – Bilgiyi belirli aralıklarla gözden geçir\n🧠 **Aktif Hatırlama** – Pasif okuma yerine kendini test et\n📝 **Feynman Tekniği** – Konuyu basitçe açıklayarak öğren\n💤 **Uyku Düzeni** – Yeterli uyku hafıza pekiştirmeyi güçlendirir\n🏃 **Düzenli Egzersiz** – Beyin fonksiyonlarını artırır"
    },
    vark: {
        keywords: ["vark", "vark model", "vark nedir"],
        response: "**VARK Modeli**, Neil Fleming tarafından geliştirilen bir öğrenme stili çerçevesidir:\n\n👁️ **V**isual (Görsel) – Görseller, grafikler, diyagramlar\n👂 **A**ural (İşitsel) – Sesli anlatım, tartışma, müzik\n📖 **R**ead/Write (Okuma/Yazma) – Metin, notlar, listeler\n🤸 **K**inesthetic (Kinestetik) – Uygulama, deneyim, hareket\n\nÇoğu insan birden fazla stili birleştirir. Baskın stilinizi bilmek, öğrenme stratejinizi optimize etmenize yardımcı olur!"
    },
    visual: {
        keywords: ["görsel öğrenme", "görsel stil", "görsel olarak", "görsel öğrenici"],
        response: "👁️ **Görsel Öğrenme Stili** için öneriler:\n\n📊 Zihin haritaları ve diyagramlar oluşturun\n🎨 Renkli kalemler ve vurgulayıcılar kullanın\n📹 Video içeriklerden ve infografiklerden faydalanın\n🗂️ Flash kartlar hazırlayıp görsel tekrar yapın\n📐 Bilgileri şemalara ve tablolara dönüştürün\n🖼️ Görsel çağrışımlar oluşturarak ezberleyin\n\nGörsel öğreniciler bilgiyi 'görerek' en iyi işler!"
    },
    auditory: {
        keywords: ["işitsel öğrenme", "işitsel stil", "dinleyerek öğren", "işitsel öğrenici"],
        response: "🎧 **İşitsel Öğrenme Stili** için öneriler:\n\n🎙️ Podcast ve sesli kitapları kullanın\n🗣️ Konuları sesli okuyarak tekrar edin\n👥 Çalışma gruplarına katılıp tartışın\n📱 Ders kayıtları alın ve dinleyin\n🎵 Hafif müzik eşliğinde çalışın\n🔊 Kavramları kendi kelimelerinizle anlatın\n\nİşitsel öğreniciler bilgiyi 'duyarak' en iyi işler!"
    },
    readwrite: {
        keywords: ["okuma yazma", "okuyarak öğren", "yazarak öğren", "metin tabanlı", "not tutma"],
        response: "📖 **Okuma/Yazma Öğrenme Stili** için öneriler:\n\n📝 Detaylı ve düzenli notlar tutun\n✍️ Konuları kendi kelimelerinizle yazın\n📋 Listeler ve özetler oluşturun\n📚 Ders kitapları ve makaleleri derinlemesine okuyun\n📓 Günlük tutma alışkanlığı edinin\n🔤 Anahtar kavramları yazarak pekiştirin\n\nOkuma/Yazma öğrenicileri bilgiyi 'metin ile' en iyi işler!"
    },
    kinesthetic: {
        keywords: ["kinestetik öğrenme", "kinestetik stil", "yaparak öğren", "uygulamalı öğren", "hareketle öğren"],
        response: "🤸 **Kinestetik Öğrenme Stili** için öneriler:\n\n🔬 Laboratuvar deneyleri ve simülasyonlar kullanın\n✋ Uygulamalı projelerle bilgiyi pekiştirin\n🚶 Çalışırken kısa yürüyüş molaları verin\n🎭 Rol yapma ve senaryo çalışmaları deneyin\n🧩 Pratik sorular ve örnekler üzerinde çalışın\n⚽ Stres topu kullanarak konsantrasyonunuzu artırın\n\nKinestetik öğreniciler bilgiyi 'yaparak' en iyi işler!"
    },
    pomodoro: {
        keywords: ["pomodoro", "zaman yönetimi", "süre", "mola", "çalışma süresi"],
        response: "⏱️ **Pomodoro Tekniği** nasıl uygulanır:\n\n1️⃣ Yapılacak görevi belirleyin\n2️⃣ Zamanlayıcıyı 25 dakikaya ayarlayın\n3️⃣ Odaklanarak çalışın (kesintisiz!)\n4️⃣ 5 dakika kısa mola verin\n5️⃣ 4 pomodoro sonrasında 15-30 dk uzun mola\n\n💡 **İpuçları:**\n• Molalarda ekrandan uzaklaşın\n• Su için, esneme yapın\n• Hedeflerinizi küçük parçalara bölün\n• Günlük kaç pomodoro tamamladığınızı takip edin"
    },
    motivation: {
        keywords: ["motivasyon", "motive", "isteksiz", "çalışamıyorum", "odaklanamıyorum", "konsantrasyon", "dikkat"],
        response: "🔥 **Motivasyon ve Odaklanma İpuçları:**\n\n🎯 Küçük, ulaşılabilir hedefler koyun\n📱 Çalışırken telefonu uzaklaştırın\n🌿 Temiz ve düzenli bir çalışma alanı oluşturun\n⏰ Her gün aynı saatte çalışma rutini oluşturun\n🏆 Başarılarınızı kutlayın, kendini ödüllendirin\n📊 İlerlemenizi görsel olarak takip edin\n🤝 Çalışma arkadaşı veya grup bulun\n💭 'Neden' yapıyorsunuz sorusunu hatırlayın\n\nKüçük adımlar → Büyük başarılar! 🚀"
    },
    exam: {
        keywords: ["sınav", "sınava hazırlan", "sınav kaygısı", "sınav stresi", "final", "vize"],
        response: "📝 **Sınav Hazırlık Stratejileri:**\n\n📅 **Planlama:** Erken başlayın, günlük hedefler koyun\n🧠 **Aktif Öğrenme:** Özet çıkarın, pratik sorular çözün\n🔄 **Aralıklı Tekrar:** Bilgiyi belirli aralıklarla gözden geçirin\n🃏 **Flash Kartlar:** Anahtar kavramları kartlara yazın\n😴 **Uyku:** Sınav öncesi mutlaka iyi uyuyun\n🍎 **Beslenme:** Beyin dostu gıdalar tüketin\n🧘 **Stres Yönetimi:** 4-7-8 nefes tekniğini deneyin\n\nSınav stresi normaldir, hazırlıklı olun ve kendinize güvenin! 💪"
    },
    memory: {
        keywords: ["hafıza", "ezber", "hatırlamak", "unutkanlık", "aklımda kalm", "ezberle"],
        response: "🧠 **Hafıza Güçlendirme Teknikleri:**\n\n🏰 **Hafıza Sarayı** – Bilgileri hayal ettiğiniz mekanlara yerleştirin\n🔗 **Çağrışım** – Yeni bilgiyi bildiğiniz şeylerle ilişkilendirin\n📝 **Aktif Tekrar** – Kitapları kapatıp hatırlamaya çalışın\n🎵 **Ritim ve Kafiye** – Bilgiyi müzikal formata dönüştürün\n📖 **Hikayeleştirme** – Bilgileri bir hikayeye dönüştürün\n🔄 **Spaced Repetition** – Artan aralıklarla tekrar yapın\n💤 **Uyku** – Uyku sırasında bellek pekişir"
    },
    anket: {
        keywords: ["anket", "test", "quiz", "anketi ne zaman", "anket hazır mı"],
        response: "📋 AI destekli öğrenme stili anketimiz şu anda geliştirme aşamasında! Gelişmiş yapay zeka modelimizi eğitiyoruz.\n\n✅ VARK Modeli Entegrasyonu – Tamamlandı\n✅ AI Analiz Motoru – Tamamlandı\n🔄 Kişiselleştirilmiş Sonuçlar – Geliştiriliyor\n\nAnket hazır olduğunda sayfamızdaki 'Hazır Olduğunda Haber Ver' butonuyla bildirim alabilirsiniz! 🔔"
    },
    platform: {
        keywords: ["learnstyle", "platform nedir", "ne işe yarar", "bu site ne", "nedir bu"],
        response: "🚀 **LearnStyle AI** hakkında:\n\nYapay zeka teknolojisi ile kişiselleştirilmiş öğrenme deneyimi sunan bir platformuz.\n\n✨ **Neler sunuyoruz:**\n• AI destekli öğrenme stili analizi\n• Kişiselleştirilmiş öğrenme stratejileri\n• VARK modeli tabanlı değerlendirme\n• 7/24 AI asistan desteği\n• Detaylı ilerleme raporları\n\nHedefimiz, her bireyin potansiyelini en üst düzeye çıkarmak!"
    },
    ai: {
        keywords: ["yapay zeka", "ai nedir", "artificial intelligence", "makine öğrenme", "machine learning"],
        response: "🤖 **Yapay Zeka ve Eğitim:**\n\nLearnStyle AI'da yapay zekayı şu alanlarda kullanıyoruz:\n\n📊 **Stil Analizi** – Öğrenme davranışlarınızı analiz eder\n🎯 **Kişiselleştirme** – Size özel içerik ve strateji önerir\n📈 **İlerleme Tahmini** – Öğrenme hızınızı optimize eder\n💬 **AI Asistan** – Sorularınıza anında yanıt verir\n\nAI, eğitimi daha erişilebilir, etkili ve keyifli hale getiriyor!"
    },
    noteTaking: {
        keywords: ["not al", "not tutma", "cornell", "not yöntemi", "yazım teknik"],
        response: "📝 **Etkili Not Alma Teknikleri:**\n\n📋 **Cornell Metodu** – Sayfayı 3 bölüme ayırın (notlar, ipuçları, özet)\n🗺️ **Zihin Haritası** – Ana konuyu merkeze, dalları olarak alt konuları yazın\n📊 **Sketch Notes** – Metinle görselleri birleştirin\n🔤 **Kısaltmalar** – Hızlı not için semboller geliştirin\n✨ **Renk Kodlama** – Farklı konuları renklerle ayırın\n📱 **Dijital Notlar** – Notion, Obsidian gibi araçları deneyin"
    },
    stress: {
        keywords: ["stres", "kaygı", "endişe", "baskı", "bunalmak", "rahatla"],
        response: "🧘 **Stres Yönetimi İpuçları:**\n\n🌬️ **4-7-8 Nefes** – 4 sn nefes al, 7 sn tut, 8 sn ver\n🚶 **Yürüyüş** – 20 dk doğada yürüyüş stresi azaltır\n📵 **Dijital Detoks** – Günde 1 saat ekransız vakit geçirin\n🎵 **Müzik** – 432 Hz müzik dinleyin\n📓 **Günlük** – Düşüncelerinizi yazarak boşaltın\n🤝 **Sosyal Bağ** – Güvendiğiniz biriyle konuşun\n💪 **Egzersiz** – Stres hormonlarını dengeler\n\nStresi yönetmek, öğrenme gücünüzü artırır! 🌟"
    },
};

const defaultResponses = [
    "İlginç bir soru! 🤔 Bu konuda daha fazla yardımcı olmak isterim. Öğrenme stiliniz, çalışma teknikleri veya sınav hazırlığı hakkında sorularınız varsa yanıtlayabilirim!",
    "Bu konuyu araştıracağım! Şimdilik öğrenme stili, motivasyon veya verimli çalışma ile ilgili sorularınızı yanıtlayabilirim. 📚",
    "Henüz bu konuda yeterli bilgim yok, ancak öğrenme ve eğitim stratejileri hakkında birçok konuda yardımcı olabilirim! Neler sormak istersiniz? ✨",
    "Harika bir soru! Öğrenme teknikleri, hafıza güçlendirme, stres yönetimi veya VARK modeli hakkında sorularınızı yanıtlayabilirim. 🎯",
];

function getResponse(msg) {
    const lower = msg.toLowerCase().replace(/[?!.,]/g, "").trim();

    for (const [, data] of Object.entries(responseDB)) {
        for (const keyword of data.keywords) {
            if (lower.includes(keyword)) return data.response;
        }
    }

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Simple markdown bold parser
function renderText(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

export default function AIChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Merhaba! 👋 Ben LearnStyle AI Asistanınızım. Size öğrenme stiliniz, çalışma yöntemleri ve kişiselleştirilmiş stratejiler hakkında yardımcı olabilirim. Ne sormak istersiniz?" },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    const sendMessage = (text) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setInput("");
        setShowSuggestions(false);
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setMessages((prev) => [...prev, { sender: "bot", text: getResponse(text) }]);
        }, 800 + Math.random() * 800);
    };

    const suggestions = ["Öğrenme stilim nedir?", "Etkili çalışma teknikleri", "VARK modeli nedir?", "Sınava nasıl hazırlanırım?"];

    return (
        <>
            <button className={styles.chatBtn} onClick={() => setOpen(!open)} aria-label="AI Asistan">
                <div className={styles.chatBtnInner}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="10" r="1" fill="currentColor" /><circle cx="8" cy="10" r="1" fill="currentColor" /><circle cx="16" cy="10" r="1" fill="currentColor" />
                    </svg>
                </div>
                <div className={styles.chatBtnPulse}></div>
            </button>

            {open && (
                <div className={styles.modal}>
                    <div className={`glass-card-large ${styles.modalInner}`}>
                        <div className={styles.chatHeader}>
                            <div className={styles.headerInfo}>
                                <div className={styles.avatar}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /></svg>
                                </div>
                                <div>
                                    <h4>LearnStyle AI</h4>
                                    <span className={styles.status}><span className={styles.statusDot}></span>Çevrimiçi</span>
                                </div>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Kapat">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className={styles.messages}>
                            {messages.map((m, i) => (
                                <div key={i} className={`${styles.message} ${styles[m.sender]}`}>
                                    <div className={styles.msgAvatar}>{m.sender === "bot" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}</div>
                                    <div className={styles.msgContent}><p style={{ whiteSpace: "pre-line" }}>{renderText(m.text)}</p></div>
                                </div>
                            ))}
                            {typing && (
                                <div className={`${styles.message} ${styles.bot}`}>
                                    <div className={styles.msgAvatar}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /></svg></div>
                                    <div className={styles.msgContent}><div className={styles.typingDots}><span></span><span></span><span></span></div></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className={styles.inputArea}>
                            {showSuggestions && (
                                <div className={styles.suggestions}>
                                    {suggestions.map((s) => <button key={s} className={styles.chip} onClick={() => sendMessage(s)}>{s}</button>)}
                                </div>
                            )}
                            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
                                <input className={styles.input} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Mesajınızı yazın..." autoComplete="off" />
                                <button type="submit" className={styles.sendBtn} aria-label="Gönder">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
