export const surveyQuestions = [
    {
        id: 1,
        text: "Yeni bir uygulamayı veya dijital aracı kullanmayı öğrenirken ilk olarak ne yaparsınız?",
        options: [
            { label: "A", text: "Ekran görüntülerine, ikonlara ve arayüz akışına bakarım", type: "visual" },
            { label: "B", text: "Birinin bana adım adım anlatmasını isterim", type: "auditory" },
            { label: "C", text: "Yazılı yardım sayfasını veya kullanım rehberini okurum", type: "readwrite" },
            { label: "D", text: "Doğrudan kurcalar, deneyerek çözmeye çalışırım", type: "kinesthetic" },
        ],
    },
    {
        id: 2,
        text: "Öğretmeniniz yeni bir konuyu ilk kez anlatırken hangi sunum biçimi size daha çok yardımcı olur?",
        options: [
            { label: "A", text: "Şema, grafik ve slaytlarla anlatılması", type: "visual" },
            { label: "B", text: "Açıklamanın konuşularak ve örneklenerek anlatılması", type: "auditory" },
            { label: "C", text: "Başlıklar, tanımlar ve notlarla yazılı verilmesi", type: "readwrite" },
            { label: "D", text: "Etkinlik, deney veya uygulama üzerinden gösterilmesi", type: "kinesthetic" },
        ],
    },
    {
        id: 3,
        text: "Bir süreci veya yöntemi hatırlamanız gerektiğinde hangisi en çok işe yarar?",
        options: [
            { label: "A", text: "Akış şeması veya zihinsel görsel oluşturmak", type: "visual" },
            { label: "B", text: "Adımları kendi kendime sesli tekrar etmek", type: "auditory" },
            { label: "C", text: "Maddeler halinde yazılı liste çıkarmak", type: "readwrite" },
            { label: "D", text: "Süreci uygulayarak tekrar etmek", type: "kinesthetic" },
        ],
    },
    {
        id: 4,
        text: "Zor bir matematik ya da fen sorusunu anlamakta zorlandığınızda ne yaparsınız?",
        options: [
            { label: "A", text: "Şekil çizerek veya problemi görselleştirerek düşünürüm", type: "visual" },
            { label: "B", text: "Soruyu biriyle konuşur, sesli düşünürüm", type: "auditory" },
            { label: "C", text: "Formülleri ve çözüm adımlarını yazarım", type: "readwrite" },
            { label: "D", text: "Benzer sorular çözerek mantığı kavramaya çalışırım", type: "kinesthetic" },
        ],
    },
    {
        id: 5,
        text: "Sınava hazırlanırken hangi yöntem size daha doğal gelir?",
        options: [
            { label: "A", text: "Renkli şemalar, tablolar ve zihin haritaları çıkarmak", type: "visual" },
            { label: "B", text: "Konuyu sesli anlatmak veya kayıt dinlemek", type: "auditory" },
            { label: "C", text: "Özet notlar çıkarıp tekrar tekrar okumak", type: "readwrite" },
            { label: "D", text: "Bol soru çözmek ve mini denemeler yapmak", type: "kinesthetic" },
        ],
    },
    {
        id: 6,
        text: "Bir eğitim veya toplantıda bilgiyi en rahat hangi biçimde alırsınız?",
        options: [
            { label: "A", text: "Slaytlar, grafikler ve görsel örneklerle", type: "visual" },
            { label: "B", text: "Anlatım, tartışma ve soru-cevap ile", type: "auditory" },
            { label: "C", text: "Yazılı rapor, doküman veya notlar ile", type: "readwrite" },
            { label: "D", text: "Canlı demo veya uygulamalı gösterim ile", type: "kinesthetic" },
        ],
    },
    {
        id: 7,
        text: "Ders bittikten sonra bilgiyi kalıcı hale getirmek için ilk olarak ne yaparsınız?",
        options: [
            { label: "A", text: "Notları görsel olarak yeniden düzenler, şema çıkarırım", type: "visual" },
            { label: "B", text: "Konuyu kendi kendime ya da bir arkadaşa anlatırım", type: "auditory" },
            { label: "C", text: "Defterime temiz bir özet ve anahtar kavram listesi yazarım", type: "readwrite" },
            { label: "D", text: "Konuyla ilgili alıştırma veya küçük uygulama yaparım", type: "kinesthetic" },
        ],
    },
    {
        id: 8,
        text: "İnternetten yeni bir konuyu öğrenmeniz gerektiğinde hangi kaynak size daha çok uyar?",
        options: [
            { label: "A", text: "İnfografik, animasyon veya görsel anlatımlı videolar", type: "visual" },
            { label: "B", text: "Canlı anlatım, podcast veya sesli açıklamalar", type: "auditory" },
            { label: "C", text: "Makaleler, blog yazıları ve yazılı rehberler", type: "readwrite" },
            { label: "D", text: "Etkileşimli simülasyonlar ve uygulamalı içerikler", type: "kinesthetic" },
        ],
    },
    {
        id: 9,
        text: "Öğretmeniniz bir ödevde hata yaptığınızı söylediğinde hangi geri bildirim türü size daha faydalı olur?",
        options: [
            { label: "A", text: "Hatanın işaretlendiği görsel veya örnek üzerinden açıklama", type: "visual" },
            { label: "B", text: "Hatanın sözlü olarak neden yanlış olduğunun anlatılması", type: "auditory" },
            { label: "C", text: "Yazılı yorumlar ve düzeltme notları verilmesi", type: "readwrite" },
            { label: "D", text: "Doğru yöntemi uygulayıp yeniden denememin istenmesi", type: "kinesthetic" },
        ],
    },
    {
        id: 10,
        text: "Yeni bir dil öğrenirken hangi yöntem size daha çok uyar?",
        options: [
            { label: "A", text: "Görsel kartlar, resimli kelime listeleri ve altyazılar", type: "visual" },
            { label: "B", text: "Dinleyerek, tekrar ederek ve konuşarak öğrenmek", type: "auditory" },
            { label: "C", text: "Gramer kurallarını okuyup yazılı alıştırma yapmak", type: "readwrite" },
            { label: "D", text: "Rol yapma, günlük diyalog ve gerçek kullanım üzerinden öğrenmek", type: "kinesthetic" },
        ],
    },
    {
        id: 11,
        text: "Ders sırasında dikkatinizi en çok ne toplar?",
        options: [
            { label: "A", text: "Tahtadaki çizimler, grafikler ve görsel düzen", type: "visual" },
            { label: "B", text: "Öğretmenin ses tonu ve anlatım biçimi", type: "auditory" },
            { label: "C", text: "Tahtaya yazılan formüller, tanımlar ve notlar", type: "readwrite" },
            { label: "D", text: "Uygulamalı etkinlikler, deneyler ve örnekler", type: "kinesthetic" },
        ],
    },
    {
        id: 12,
        text: "Bir eğitim etkinliğinde hangi oturum türünü tercih edersiniz?",
        options: [
            { label: "A", text: "Poster, görsel vaka veya sunum odaklı oturumları", type: "visual" },
            { label: "B", text: "Panel, tartışma ve soru-cevap oturumlarını", type: "auditory" },
            { label: "C", text: "Not, handout ve yazılı materyal verilen oturumları", type: "readwrite" },
            { label: "D", text: "Atölye, workshop ve uygulama içeren oturumları", type: "kinesthetic" },
        ],
    },
    {
        id: 13,
        text: "Bir proje problemi çözerken hangisi size daha doğal gelir?",
        options: [
            { label: "A", text: "Problemi diyagram, tablo veya akış çizerek netleştirmek", type: "visual" },
            { label: "B", text: "Fikirleri sesli tartışmak ve konuşarak çözmek", type: "auditory" },
            { label: "C", text: "Yazılı analiz, madde listesi ve plan çıkarmak", type: "readwrite" },
            { label: "D", text: "Farklı seçenekleri deneyip test ederek ilerlemek", type: "kinesthetic" },
        ],
    },
    {
        id: 14,
        text: "Bir haftalık ders çalışma planı hazırlarken nasıl başlarsınız?",
        options: [
            { label: "A", text: "Takvim, renk kodu ve görsel planlayıcı oluştururum", type: "visual" },
            { label: "B", text: "Planı biriyle konuşur veya kendi kendime sesli kurarım", type: "auditory" },
            { label: "C", text: "To-do listesi ve yazılı program hazırlarım", type: "readwrite" },
            { label: "D", text: "İlk göreve başlayıp ilerledikçe planı şekillendiririm", type: "kinesthetic" },
        ],
    },
    {
        id: 15,
        text: "Çalıştığınız bir konuyu sınavda hatırlamak istediğinizde genellikle neye yaslanırsınız?",
        options: [
            { label: "A", text: "Zihnimdeki görüntüye, sayfa düzenine veya şemaya", type: "visual" },
            { label: "B", text: "Ders anlatımını veya kendi sesli tekrarımı hatırlamaya", type: "auditory" },
            { label: "C", text: "Yazdığım özetlere, anahtar kelimelere ve notlara", type: "readwrite" },
            { label: "D", text: "Çözdüğüm örneğe, yaptığım uygulamaya veya deneyime", type: "kinesthetic" },
        ],
    },
    {
        id: 16,
        text: "Bir kurs veya eğitim kaynağı seçeceğiniz zaman hangi bilgi türü sizi daha çok ikna eder?",
        options: [
            { label: "A", text: "Örnek ekranlar, slaytlar ve görsel içerik kalitesi", type: "visual" },
            { label: "B", text: "Eğitmenin anlatımı ve kullanıcı yorumlarının sözlü içeriği", type: "auditory" },
            { label: "C", text: "Müfredat, dokümanlar ve yazılı içerik detayları", type: "readwrite" },
            { label: "D", text: "Deneme dersi, pratik bölüm ve uygulama imkanları", type: "kinesthetic" },
        ],
    },
    {
        id: 17,
        text: "Bir konuyu gerçekten anladığınızı en iyi nasıl gösterirsiniz?",
        options: [
            { label: "A", text: "Şema, sunum veya çizimle anlatarak", type: "visual" },
            { label: "B", text: "Konuşarak ve sözlü açıklama yaparak", type: "auditory" },
            { label: "C", text: "Yazılı açıklama, özet veya rapor hazırlayarak", type: "readwrite" },
            { label: "D", text: "Yaparak, göstererek veya örnek uygulama oluşturarak", type: "kinesthetic" },
        ],
    },
    {
        id: 18,
        text: "Bir eğitim uygulamasını kullanırken hangi özellik size daha çok yardımcı olur?",
        options: [
            { label: "A", text: "Temiz arayüz, görsel akış ve grafik destekleri", type: "visual" },
            { label: "B", text: "Sesli anlatım, dinleme modları ve konuşma pratiği", type: "auditory" },
            { label: "C", text: "Yazılı açıklamalar, not alanları ve metin içerikleri", type: "readwrite" },
            { label: "D", text: "Sürükle-bırak, quiz ve etkileşimli alıştırmalar", type: "kinesthetic" },
        ],
    },
    {
        id: 19,
        text: "Çalışırken dikkatiniz dağıldığında odağı yeniden toplamak için hangisini yaparsınız?",
        options: [
            { label: "A", text: "Konuyu daha düzenli ve görsel hale getiririm", type: "visual" },
            { label: "B", text: "Konuyu sesli tekrar eder veya anlatırım", type: "auditory" },
            { label: "C", text: "Kısa bir yazılı özet ve görev listesi çıkarırım", type: "readwrite" },
            { label: "D", text: "Kısa bir mola verip sonra alıştırmayla geri dönerim", type: "kinesthetic" },
        ],
    },
    {
        id: 20,
        text: "Sizin için ideal çalışma ortamı hangisine daha yakındır?",
        options: [
            { label: "A", text: "Düzenli, renk kodlu ve görsel materyallerin olduğu bir masa", type: "visual" },
            { label: "B", text: "Sessiz veya kontrollü ses ortamı olan bir alan", type: "auditory" },
            { label: "C", text: "Kitap, not ve yazı araçlarıyla düzenlenmiş bir çalışma alanı", type: "readwrite" },
            { label: "D", text: "Hareket edebileceğim ve pratik yapabileceğim esnek bir ortam", type: "kinesthetic" },
        ],
    },
];

export const styleResults = {
    visual: { title: "Görsel Öğrenme Stiliniz Baskın! 👁️", icon: "👁️", iconBg: "rgba(168,85,247,0.15)", description: "Siz görsel bir öğrenicisiniz! Grafikler, diyagramlar, renkler ve görsel düzenlemeler sizin en güçlü öğrenme araçlarınız.", tips: ["Zihin haritaları ve diyagramlar oluşturarak çalışın", "Renkli kalemler ve highlight kullanarak not alın", "Video eğitimlerden ve infografiklerden faydalanın", "Öğrendiğiniz konuları görsel şemalara dönüştürün", "Flash kartlar oluşturup görsel tekrar yapın"] },
    auditory: { title: "İşitsel Öğrenme Stiliniz Baskın! 🎧", icon: "🎧", iconBg: "rgba(6,182,212,0.15)", description: "Siz işitsel bir öğrenicisiniz! Dinleyerek, tartışarak ve sesli tekrar yaparak en iyi şekilde öğrenirsiniz.", tips: ["Podcast ve sesli kitapları öğrenme aracı olarak kullanın", "Konuları sesli okuyarak tekrar edin", "Çalışma gruplarına katılıp tartışın", "Kayıt yaparak notlarınızı sesli formata çevirin", "Arkaplanda hafif müzik eşliğinde çalışın"] },
    readwrite: { title: "Okuma/Yazma Stiliniz Baskın! 📝", icon: "📝", iconBg: "rgba(99,102,241,0.15)", description: "Siz okuma/yazma odaklı bir öğrenicisiniz! Metin tabanlı materyaller, yazılı notlar ve listeler sizin en etkili öğrenme araçlarınız.", tips: ["Detaylı ve düzenli notlar tutun", "Öğrendiğiniz konuları kendi kelimelerinizle yazın", "Listeler, taslaklar ve özetler oluşturun", "Ders kitapları ve makaleler sizin en güçlü kaynağınız", "Blog yazma veya günlük tutma alışkanlığı edinin"] },
    kinesthetic: { title: "Kinestetik Öğrenme Stiliniz Baskın! 🤸", icon: "🤸", iconBg: "rgba(249,115,22,0.15)", description: "Siz kinestetik bir öğrenicisiniz! Yaparak, dokunarak ve deneyimleyerek en iyi şekilde öğrenirsiniz.", tips: ["Bilgileri uygulamalı projelerle pekiştirin", "Çalışırken kısa molalar verin ve hareket edin", "Laboratuvar deneylerinden ve simülasyonlardan faydalanın", "Rol yapma ve senaryo çalışmaları deneyin", "Stres topu gibi objeler kullanarak konsantrasyonunuzu artırın"] },
};
