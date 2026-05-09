import { NavLink } from "react-router-dom";

export default function NavItem({
    to,
    children,
    icon: Icon,
    variant = "default"
}) {

    const styles = {
        default: `
            px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-gray
        `,
        pill: `
            bg-zinc-800 hover:bg-zinc-700
            text-white px-4 py-2 rounded-lg
        `,
        auth: `
            bg-zinc-800 text-gray
            hover:bg-zinc-700
            px-4 py-2 rounded-lg
        `
    };

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `
                flex items-center gap-2
                transition font-medium
                ${styles[variant]}
                ${isActive ? "ring-2 ring-white/40" : ""}
                `
            }
        >
            {Icon && <Icon size={16} />}

            {children}
        </NavLink>
    );
}