type StructuredDataProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}
