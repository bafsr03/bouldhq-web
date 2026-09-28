/**
 * Renders a JSON-LD graph into the document.
 *
 * Server component on purpose: structured data has to be in the HTML Google
 * receives on the first request, not injected after hydration.
 *
 * `JSON.stringify` is the escaping story here. The one sequence it does not
 * neutralise inside a <script> element is a literal "</script>" in a string, so
 * that is replaced explicitly — every other character is safe as JSON.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/<\/(script)/gi, '<\\/$1')
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
