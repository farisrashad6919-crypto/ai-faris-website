type TestimonialCardProps = {
  quote: string;
  name: string;
  date: string;
  highlight: string;
};

export function TestimonialCard({
  quote,
  name,
  date,
  highlight,
}: TestimonialCardProps) {
  return (
    <article className="paper-panel flex h-full flex-col gap-6 rounded-lg p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-on-tertiary-container">
        {highlight}
      </p>
      <blockquote className="font-display text-2xl leading-snug text-primary">
        “{quote}”
      </blockquote>
      <footer className="space-y-1 border-t ghost-divider pt-4">
        <p className="text-sm font-semibold text-primary">{name}</p>
        <p className="text-sm text-secondary">{date}</p>
      </footer>
    </article>
  );
}
