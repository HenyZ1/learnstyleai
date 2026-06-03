import Image from "next/image";

export default function Logo({ size = 36 }) {
    return (
        <Image
            src="/LearnStyleAI-Logo-full-512x512.png"
            alt="LearnStyle AI Logo"
            width={size}
            height={size}
            style={{ borderRadius: "22%", display: "block" }}
        />
    );
}
