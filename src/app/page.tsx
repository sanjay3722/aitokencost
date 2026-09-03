import Calculator from "@/components/Calculator";
import { MODELS, PROVIDER_PRICING_URL, PROVIDER_LABEL } from "@/lib/pricing";

const providers = Array.from(new Set(MODELS.map((m) => m.provider)));

export default function Home() {
  return (
    <main>
      <section className="band band-white">
        <div className="wrap hero">
          <h1>What does your prompt actually cost?</h1>
          <p className="lede">
            Paste the prompt you send on every call. See the monthly bill on{" "}
            {MODELS.length} models side by side — exact token counts for OpenAI,
            hand-checked prices for everyone.
          </p>
        </div>
      </section>

      <section id="calculator" className="band band-grey">
        <div className="wrap">
          <Calculator />
        </div>
      </section>

      <section id="sources" className="band band-white">
        <div className="wrap sources">
          <h2>Where the numbers come from</h2>
          <p>
            Prices are transcribed by hand from each provider&rsquo;s public
            pricing page and re-checked regularly. If you spot a stale number,
            it is a bug — tell me.
          </p>
          <ul>
            {providers.map((p) => (
              <li key={p}>
                {PROVIDER_LABEL[p]}:{" "}
                <a
                  href={PROVIDER_PRICING_URL[p]}
                  rel="nofollow noopener"
                  target="_blank"
                >
                  {PROVIDER_PRICING_URL[p]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
