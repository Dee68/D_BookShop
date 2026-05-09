export default function NavButton({
    onClick,
    children,
    icon: Icon,
    variant = "neutral"
}) {

    const styles = {
        danger: `
            bg-red-500 hover:bg-red-600
            text-white
        `,
        neutral: `
            bg-zinc-800 hover:bg-zinc-700
            text-white
        `
    };

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2
                px-4 py-2 rounded-full
                transition font-medium
                ${styles[variant]}
            `}
        >
            {Icon && <Icon size={16} />}

            {children}
        </button>
    );
}