"use client";

import { useEffect, useState } from "react";

interface Token {
  id: string;
  name: string;
  amount: number;
  hidden?: boolean;
  airdropClaimed?: boolean;
}

export default function TokenHoldings() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokens() {
      try {
        // Replace with the actual API endpoint that returns token data
        const res = await fetch("/api/token-holdings");
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        const data: Token[] = await res.json();
        setTokens(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchTokens();
  }, []);

  if (loading) return <p>Loading token holdings...</p>;
  if (error) return <p className="text-destructive">Error: {error}</p>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Token Holdings</h2>
      <ul className="space-y-2">
        {tokens.map((token) => (
          <li key={token.id} className="p-3 border rounded-md flex justify-between items-center">
            <div>
              <span className="font-medium">{token.name}</span>
              {token.hidden && <span className="ml-2 text-xs text-muted-foreground">(Hidden)</span>}
              {token.airdropClaimed === false && (
                <span className="ml-2 text-xs text-yellow-600">(Unclaimed airdrop)</span>
              )}
            </div>
            <span>{token.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
