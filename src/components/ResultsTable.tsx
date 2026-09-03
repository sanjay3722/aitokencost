import {
  formatPct,
  formatTokens,
  formatUSD,
  type ComparisonRow,
} from "@/lib/calc";
import { PROVIDER_LABEL } from "@/lib/pricing";

interface Props {
  rows: ComparisonRow[];
  /** Label for the amount column, e.g. "Cost / month" or "Cost / 1K calls". */
  amountLabel: string;
  /** Whether a baseline model is selected, which turns on the delta columns. */
  showDelta: boolean;
}

export default function ResultsTable({ rows, amountLabel, showDelta }: Props) {
  return (
    <div className="table-wrap">
      <table className="results">
        <thead>
          <tr>
            <th scope="col">Model</th>
            <th scope="col" className="num">
              Input
            </th>
            <th scope="col" className="num">
              Output
            </th>
            <th scope="col" className="num">
              {amountLabel}
            </th>
            {showDelta && (
              <th scope="col" className="num">
                vs. current
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.model.id}
              className={row.isBaseline ? "baseline-row" : undefined}
            >
              <th scope="row">
                <span className="model-name">{row.model.label}</span>
                <span className="provider">
                  {PROVIDER_LABEL[row.model.provider]}
                </span>
                {row.isBaseline && <span className="tag">current</span>}
              </th>
              <td className="num">
                {formatUSD(row.cost.inputCost)}
                <span className="sub">
                  {formatTokens(perM(row.cost.inputCost, row.model.inputPerM))} tok
                </span>
              </td>
              <td className="num">
                {formatUSD(row.cost.outputCost)}
                <span className="sub">
                  {formatTokens(perM(row.cost.outputCost, row.model.outputPerM))}{" "}
                  tok
                </span>
              </td>
              <td className="num strong">{formatUSD(row.cost.totalCost)}</td>
              {showDelta && (
                <td className="num">
                  {row.isBaseline ? (
                    <span className="sub">—</span>
                  ) : (
                    <span className={deltaClass(row.deltaAbs)}>
                      {row.deltaAbs > 0 ? "+" : ""}
                      {formatUSD(row.deltaAbs)}
                      <span className="sub">{formatPct(row.deltaPct)}</span>
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Recover the token count that produced `cost` at `ratePerM` USD / 1M tokens. */
function perM(cost: number, ratePerM: number): number {
  return ratePerM > 0 ? (cost / ratePerM) * 1_000_000 : 0;
}

function deltaClass(delta: number): string {
  if (delta < 0) return "delta cheaper";
  if (delta > 0) return "delta pricier";
  return "delta";
}
