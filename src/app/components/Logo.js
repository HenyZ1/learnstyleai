export default function Logo({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
            <rect width="100" height="100" rx="20" fill="url(#logoGrad)" />
            <path d="M30 35 L30 65 L48 60 L48 30 Z M70 35 L70 65 L52 60 L52 30 Z" fill="white" opacity="0.9" />
            <rect x="47" y="30" width="6" height="35" fill="white" />
            <line x1="35" y1="45" x2="45" y2="45" stroke="white" strokeWidth="2" />
            <line x1="35" y1="52" x2="45" y2="52" stroke="white" strokeWidth="2" />
            <line x1="55" y1="45" x2="65" y2="45" stroke="white" strokeWidth="2" />
            <line x1="55" y1="52" x2="65" y2="52" stroke="white" strokeWidth="2" />
            <circle cx="50" cy="48" r="3" fill="white" />
        </svg>
    );
}
