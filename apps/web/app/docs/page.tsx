import Link from "next/link";

const docLinks = [
  ["Starter article", "/docs/WHOP_EXTENSION_STARTER_ARTICLE.md"],
  ["Research and feasibility", "/docs/RESEARCH_AND_FEASIBILITY.md"],
  ["Architecture", "/docs/ARCHITECTURE.md"],
  ["Whop setup", "/docs/WHOP_SETUP.md"],
  ["Chrome extension setup", "/docs/CHROME_EXTENSION_SETUP.md"],
  ["Security model", "/docs/SECURITY.md"],
  ["Customization", "/docs/CUSTOMIZATION.md"],
  ["Testing", "/docs/TESTING.md"],
  ["Deployment", "/docs/DEPLOYMENT.md"]
];

export default function DocsPage() {
  return (
    <main className="narrow-page">
      <p className="eyebrow">Implementation notes</p>
      <h1>Template documentation</h1>
      <p className="lead">
        The repo-level docs are intentionally detailed so builders can adapt the
        template to a paid, free, or mixed Whop product without guessing where
        security boundaries live.
      </p>

      <div className="doc-list">
        {docLinks.map(([title, href]) => (
          <a key={href} href={href}>
            <span>{title}</span>
            <small>{href}</small>
          </a>
        ))}
      </div>

      <p className="note">
        When running locally, open the Markdown files from the repository root.
        They are also copied here as navigational pointers for deployed demos.
      </p>

      <Link className="button secondary" href="/">
        Back to template
      </Link>
    </main>
  );
}
