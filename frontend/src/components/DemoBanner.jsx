import { FiInfo } from 'react-icons/fi'

function DemoBanner() {
  return (
    <div
      role="status"
      className="
        border-b border-amber-200
        bg-amber-50
        px-4 py-2
        text-center
        text-sm
        text-amber-900
        dark:border-amber-900/50
        dark:bg-amber-950/40
        dark:text-amber-200
      "
    >
      <span className="inline-flex items-center gap-2">
        <FiInfo size={14} aria-hidden="true" />
        <span>
          <strong className="font-semibold">Demo store</strong> — this is a
          portfolio project. No real orders are processed and no payments are
          taken.
        </span>
      </span>
    </div>
  )
}

export default DemoBanner