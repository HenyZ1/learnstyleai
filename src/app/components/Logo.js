export default function Logo({ size = 36 }) {
    return (
        <img
            src="/LearnStyleAI-Logo-full-512x512.png"
            alt="LearnStyle AI Logo"
            width={size}
            height={size}
            style={{ borderRadius: '22%', display: 'block' }}
        />
    );
}
