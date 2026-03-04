import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "emails.txt");

        // Check if email already exists
        let existingEmails = "";
        try {
            existingEmails = fs.readFileSync(filePath, "utf-8");
        } catch {
            // File doesn't exist yet, that's fine
        }

        if (existingEmails.includes(email.trim())) {
            return NextResponse.json({ message: "Bu e-posta zaten kayıtlı!", already: true });
        }

        // Append email with timestamp
        const timestamp = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
        const entry = `${email.trim()} | ${timestamp}\n`;
        fs.appendFileSync(filePath, entry, "utf-8");

        return NextResponse.json({ message: "Kaydınız alındı! Anket hazır olduğunda size haber vereceğiz." });
    } catch (error) {
        return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 });
    }
}
