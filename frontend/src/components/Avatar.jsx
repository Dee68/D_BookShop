export default function Avatar({ name, size = 40 }) {
    const initials = (name || "?")
        .split(" ")
        .map(w => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    // Deterministic color from the name — same name always gets same color
    const colors = [
        "bg-emerald-600", "bg-blue-600", "bg-purple-600",
        "bg-pink-600", "bg-amber-600", "bg-teal-600",
    ];
    const idx = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const colorClass = colors[idx % colors.length];

    return (
        <div
            className={`${colorClass} text-white rounded-full flex items-center justify-center font-semibold`}
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initials}
        </div>
    );
}