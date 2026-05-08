import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {

    const { darkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="
                p-2 rounded-xl
                bg-gray-200 dark:bg-zinc-800
                text-black dark:text-white
                transition
            "
        >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
    );
}