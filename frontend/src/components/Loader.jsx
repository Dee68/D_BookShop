import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading..." }) {
    return (
        <div
            className="
                flex flex-col items-center justify-center
                py-12
                text-center
            "
        >
            <Loader2
                className="
                    w-10 h-10
                    animate-spin
                    text-emerald-600
                "
            />

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {text}
            </p>
        </div>
    );
}