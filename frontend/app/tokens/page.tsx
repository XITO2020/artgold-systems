import { TokenTransfer } from '@comp/tokens/TokenTransfer';

export default function TokensPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <TokenTransfer tokenType="AGT" />
        </div>
        <div>
          <TokenTransfer tokenType="TABZ" />
        </div>
      </div>
    </div>
  );
}
