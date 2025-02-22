"use client";

import { Card } from "ù/card";
import { Button } from "ù/button";
import Image from "next/image";
import { TOKEN_CONFIG } from "~/token-config";

export default function TokenInfoPage() {
  const addToMetaMask = async (token: 'TABZ' | 'AGT') => {
    try {
      const config = TOKEN_CONFIG[token];
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: config.network === 'ethereum' ? config.contractAddress : '',
            symbol: config.symbol,
            decimals: config.decimals,
            image: `${window.location.origin}${config.logo}`,
          },
        },
      });
    } catch (error) {
      console.error('Error adding token:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Our Tokens</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={TOKEN_CONFIG.TABZ.logo}
              alt="TABZ Logo"
              width={64}
              height={64}
            />
            <div>
              <h2 className="text-2xl font-bold">{TOKEN_CONFIG.TABZ.name}</h2>
              <p className="text-muted-foreground">{TOKEN_CONFIG.TABZ.symbol}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p>
              TABZ is our primary token for art valuation, pegged to gold prices
              to ensure stable and reliable art asset backing.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addToMetaMask('TABZ')}
            >
              Add to Phantom Wallet
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={TOKEN_CONFIG.AGT.logo}
              alt="AGT Logo"
              width={64}
              height={64}
            />
            <div>
              <h2 className="text-2xl font-bold">{TOKEN_CONFIG.AGT.name}</h2>
              <p className="text-muted-foreground">{TOKEN_CONFIG.AGT.symbol}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p>
              AGT (Art Generator Token) is our governance token, allowing holders
              to participate in platform decisions and earn rewards.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addToMetaMask('AGT')}
            >
              Add to MetaMask
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Blog Post Template</h2>
        <Card className="p-6">
          <div className="prose max-w-none">
            <h1>[Title: Introducing TABZ and AGT: The Dual-Token System]</h1>
            <p>[Publication Date]</p>
            
            <h2>Introduction</h2>
            <p>[Explain the need for a dual-token system in the art market]</p>
            
            <h2>TABZ: The Art Value Token</h2>
            <ul>
              <li>Gold-backed stability</li>
              <li>Art value representation</li>
              <li>Trading mechanics</li>
            </ul>
            
            <h2>AGT: The Governance Token</h2>
            <ul>
              <li>Platform governance</li>
              <li>Reward mechanisms</li>
              <li>Community participation</li>
            </ul>
            
            <h2>Token Distribution</h2>
            <p>[Add distribution details and tokenomics]</p>
            
            <h2>How to Get Started</h2>
            <p>[Add wallet setup and token acquisition guide]</p>
          </div>
        </Card>
      </div>
    </div>
  );
}