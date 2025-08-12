"use client";

import { Card } from "ù/card";
import { Button } from "ù/button";
import Image from "next/image";
import { TOKEN_CONFIG } from "~/token-config";
import { useTranslations } from 'next-intl';

export default function TokenInfoPage({ 
  params: { lang } 
}: { 
  params: { lang: string } 
}) {
  const t = useTranslations('tokens');

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
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      
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
            <p>{t('tabz.description')}</p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addToMetaMask('TABZ')}
            >
              {t('tabz.addToWallet')}
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
            <p>{t('agt.description')}</p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addToMetaMask('AGT')}
            >
              {t('agt.addToWallet')}
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t('blogTemplate.title')}</h2>
        <Card className="p-6">
          <div className="prose max-w-none">
            <h1>{t('blogTemplate.articleTitle')}</h1>
            <p>{t('blogTemplate.date')}</p>
            
            <h2>{t('blogTemplate.sections.intro')}</h2>
            <p>{t('blogTemplate.introText')}</p>
            
            <h2>{t('blogTemplate.sections.tabz')}</h2>
            <ul>
              <li>{t('blogTemplate.tabzPoints.stability')}</li>
              <li>{t('blogTemplate.tabzPoints.value')}</li>
              <li>{t('blogTemplate.tabzPoints.trading')}</li>
            </ul>
            
            <h2>{t('blogTemplate.sections.agt')}</h2>
            <ul>
              <li>{t('blogTemplate.agtPoints.governance')}</li>
              <li>{t('blogTemplate.agtPoints.rewards')}</li>
              <li>{t('blogTemplate.agtPoints.community')}</li>
            </ul>
            
            <h2>{t('blogTemplate.sections.distribution')}</h2>
            <p>{t('blogTemplate.distributionText')}</p>
            
            <h2>{t('blogTemplate.sections.getStarted')}</h2>
            <p>{t('blogTemplate.getStartedText')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}