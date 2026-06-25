export default function SectionHeader({ eyebrow, heading, subheading }) {
  return (
    <div className="mb-8 text-center lg:text-left">
      {eyebrow && (
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-400 dark:text-sky-300">
          {eyebrow}
        </p>
      )}

      {heading && (
        <h2 className="mt-2 text-2xl font-black text-slate-800 dark:text-white sm:text-3xl">
          {heading}
        </h2>
      )}

      {subheading && (
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-400">
          {subheading}
        </p>
      )}
    </div>
  );
}
