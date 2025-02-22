"use client";

import { useState } from 'react';
import { Button } from 'ù/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ù/dropdown-menu';
import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "ù/tooltip";

const languages = [
  { code: 'ar', name: 'العربية', flag: '/flags/pl.jpg' },
  { code: 'ko', name: '한국어', flag: '/flags/kr.svg' },
  { code: 'fr', name: 'Français', flag: '/flags/fr.jpg' },
  { code: 'en', name: 'English', flag: '/flags/jm.svg' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '/flags/my.svg' },
  { code: 'dz', name: 'Darija Alger', flag: '/flags/dz.svg' },
  { code: 'so', name: 'Af Soomaali.', flag: '/flags/so.svg' },
  { code: 'pt', name: 'Português', flag: '/flags/br.svg' },
  { code: 'ru', name: 'Русский', flag: '/flags/ru.svg' },
  { code: 'bs', name: 'Bahaméan', flag: '/flags/bs.svg' },
  { code: 'zh', name: '中文', flag: '/flags/cn.svg' },
  { code: 'gl', name: 'Galiego', flag: '/flags/es-ga.svg' },
  { code: 'cat', name: 'Catalaù', flag: '/flags/es-ct.svg' },
  { code: 'es', name: 'Español', flag: '/flags/mx.svg' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '/flags/id.svg' },
  { code: 'zu', name: 'Zulu', flag: '/flags/zm.svg' },
  { code: 'fi', name: 'Finnish', flag: '/flags/fi.svg' },
  { code: 'al', name: 'Albanian', flag: '/flags/al.svg' },
  { code: 'ha', name: 'Hausa', flag: '/flags/ng.svg' },
  { code: 'ln', name: 'Lingala', flag: '/flags/cd.svg' },
  { code: 'af', name: 'Afghan', flag: '/flags/af.svg' },
  { code: 'tr', name: 'Türkçe', flag: '/flags/tr.svg' },
  { code: 'ja', name: '日本語', flag: '/flags/jp.svg' },
  { code: 'am', name: 'አማርኛ', flag: '/flags/et.svg' },
  { code: 'nl', name: 'Nederlands', flag: '/flags/nl.svg' },
  { code: 'wo', name: 'Wolof', flag: '/flags/sn.svg' },
  { code: 'sw', name: 'Kiswahili', flag: '/flags/ke.svg' },
  { code: 'it', name: 'Italiano', flag: '/flags/it.svg' },
  { code: 'bn', name: 'বাংলা', flag: '/flags/bd.svg' },
  { code: 'bo', name: 'བོད་སྐད་', flag: '/flags/bt.svg' },
  { code: 'cs', name: 'Čeština', flag: '/flags/cz.svg' },
  { code: 'pt', name: 'Portuguese', flag: '/flags/pt.svg' },
  { code: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
  { code: 'el', name: 'Ελληνικά', flag: '/flags/gr.svg' },
  { code: 'ca', name: 'Québéquois', flag: '/flags/ca.svg' },
  { code: 'ga', name: 'Gaeilge', flag: '/flags/ie.svg' },
  { code: 'ro', name: 'Română', flag: '/flags/ro.svg' },
  { code: 'hi', name: 'हिन्दी', flag: '/flags/in.svg' },
  { code: 'be', name: 'Flamand', flag: '/flags/be.svg' },
  { code: 'hu', name: 'Magyar', flag: '/flags/hu.svg' },
  { code: 'is', name: 'Íslenska', flag: '/flags/is.svg' },
  { code: 'kk', name: 'Қазақша', flag: '/flags/kz.svg' },
  { code: 'pl', name: 'Polski', flag: '/flags/pl.svg' },
  { code: 'th', name: 'ไทย', flag: '/flags/th.svg' },
  { code: 'ps', name: 'پښتو', flag: '/flags/af.svg' },
  { code: 'fj', name: 'Fidji', flag: '/flags/fj.svg' },
  { code: 'ur', name: 'اردو', flag: '/flags/pk.svg' },
  { code: 'xh', name: 'isiXhosa', flag: '/flags/za.svg' },
  { code: 'sk', name: 'Slovenčina', flag: '/flags/sk.svg' },
  { code: 'yo', name: 'Yorùbá', flag: '/flags/gn.svg' },
  { code: 'se', name: 'Svenska', flag: '/flags/se.svg' }
  
  
];

export function LanguageSelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (locale: string) => {
    router.push(`/${locale}`);
    setIsOpen(false);
  };

  return (
    <TooltipProvider>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Select language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] max-h-[400px] overflow-y-auto">
          {languages.map((language) => (
            <Tooltip key={language.code}>
              <TooltipTrigger asChild>
                <DropdownMenuItem
                  onClick={() => changeLanguage(language.code)}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={language.flag}
                    alt={language.name}
                    width={20}
                    height={15}
                    className="rounded-sm"
                  />
                  <span>{language.name}</span>
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}