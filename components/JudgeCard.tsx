import { JudgeScore } from '@/types'
import { SCORE_CATEGORIES } from '@/lib/competitions'

export default function JudgeCard({ judge }: { judge: JudgeScore }) {
  return (
    <div className="border border-border bg-bg-card p-5">
      {/* Judge header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-medium text-text-primary">{judge.name}</p>
          <p className="text-xs text-text-secondary">{judge.location}</p>
          <p className="text-xs text-lavender-dark">
            BJCP {judge.bjcpRank}
            {judge.certifications && ` · ${judge.certifications}`}
          </p>
        </div>
        <div className="text-xl font-bold text-accent">
          {judge.score}
          <span className="text-xs font-normal text-text-secondary">/50</span>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SCORE_CATEGORIES.map((category) => (
          <div key={category} className="text-center">
            <div className="text-sm font-semibold text-lavender">
              {judge.scores[category][0]}
              <span className="text-xs font-normal text-text-secondary">
                /{judge.scores[category][1]}
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-wide text-text-secondary">
              {category === 'appearance'
                ? 'App'
                : category === 'mouthfeel'
                  ? 'MF'
                  : category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Flaws */}
      {judge.flaws && (
        <p className="mb-3 text-xs text-status-error">Flaws: {judge.flaws}</p>
      )}

      {/* Feedback */}
      <p className="text-sm italic text-text-secondary">
        &ldquo;{judge.feedback}&rdquo;
      </p>
    </div>
  )
}
