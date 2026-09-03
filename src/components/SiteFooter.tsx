import Link from "next/link";
import { MODELS, PROVIDER_LABEL, PROVIDER_PRICING_URL } from "@/lib/pricing";

const providers = Array.from(new Set(MODELS.map((m) => m.provider)));
const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="site-footer band band-grey">
      <div className="wrap">
        <div className="site-footer-top">
          <Link href="/" className="wordmark">
            aitokencost<span>.dev</span>
          </Link>
          <p>
            Compare LLM API prices on the prompt you actually send. Token
            counting runs in your browser; no login, and nothing you paste is
            stored or sent anywhere.
          </p>
        </div>

        <div className="site-footer-cols">
          <section>
            <h2>Pricing sources</h2>
            <ul>
              {providers.map((p) => (
                <li key={p}>
                  <a
                    href={PROVIDER_PRICING_URL[p]}
                    target="_blank"
                    rel="nofollow noopener"
                  >
                    {PROVIDER_LABEL[p]} pricing
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>This site</h2>
            <ul>
              <li>
                <a href="#calculator">Open the calculator</a>
              </li>
              <li>
                <a href="#sources">How the numbers are checked</a>
              </li>
            </ul>
          </section>
        </div>

        <p className="site-footer-legal">
          © {YEAR} aitokencost.dev — not affiliated with OpenAI, Anthropic, or
          Google. Prices change without notice; check them against the source
          before you rely on them.
        </p>
      </div>
    </footer>
  );
}
