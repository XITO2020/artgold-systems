'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { Card } from '@ui/card'
import { Shield, TrendingUp, Users, Banknote, Store, Factory } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '../../theme/ThemeContext'

interface FeaturesProps {
  dict: any
  lang: string
}

/* === Utilitaires pour lire les variables CSS de TOUTES tes classes de thème === */
const THEME_NAMES = [
  'light',          // <- correspond à :root
  'dark',
  'emerald',
  'silver-berry',
  'metal-lazuli',
  'diamond-pastel',
  'africa-gems',
  'golden-tacos',
  'agua-saphir',
  'chili-ruby',
] as const
type ThemeName = typeof THEME_NAMES[number]

const VAR_KEYS = [
  '--background',
  '--card',
  '--card-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accentOne',
  '--accentTwo',
  '--accentThree',
  '--accentFour',
  '--accent-foreground',
  '--border',
  '--ring',
  '--quadriary',
  '--quintary',
  '--light',
  '--sombre',
] as const

function readVarsFromElement(el: Element) {
  const cs = getComputedStyle(el)
  const out: Record<string, string> = {}
  // ⚠️ on garde la clé AVEC les deux tirets (ex: "--background")
  for (const k of VAR_KEYS) out[k] = cs.getPropertyValue(k).trim()
  return out
}

function collectThemeVars(theme: ThemeName) {
  if (theme === 'light') {
    return readVarsFromElement(document.documentElement)
  }
  const probe = document.createElement('div')
  probe.className = theme
  probe.style.cssText = 'position:absolute;opacity:0;pointer-events:none'
  document.body.appendChild(probe)
  const vars = readVarsFromElement(probe)
  probe.remove()
  return vars
}

function useThemeVarsMap() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return {} as Record<ThemeName, Record<string, string>>
    }
    const map = {} as Record<ThemeName, Record<string, string>>
    for (const name of THEME_NAMES) map[name] = collectThemeVars(name)
    return map
  }, [])
}
/* === fin utilitaires === */

const Features: React.FC<FeaturesProps> = ({ dict, lang }) => {
  const { theme } = useTheme()
  const themeVarsMap = useThemeVarsMap()
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    // normalise le nom (tes classes CSS sont en kebab-case)
    const normalized = (theme || 'light').toLowerCase() as ThemeName
    const currentVars =
      themeVarsMap[normalized] ??
      themeVarsMap['light'] ??
      {}

    // pousse les CSS custom properties sur la section si tu en as besoin localement
    for (const [k, v] of Object.entries(currentVars)) {
      if (v) sectionRef.current.style.setProperty(k, v)
    }
  }, [theme, themeVarsMap])

  return (
    <section ref={sectionRef} className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--classic)' }}>
          {dict.home.features.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 mb-2">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{dict.home.features.validation.title}</h3>
            <p className="text-2xl text-muted-foreground text-yellow-200">
              {dict.home.features.validation.description}
            </p>
            <p className="text-2xl text-muted-foreground text-yellow-300">
              {dict.home.features.validation.description2}
            </p>
          </Card>

          <Card className="p-6 mb-2">
            <div className="mb-4">
              <TrendingUp className="h-12 w-12 text-teal-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{dict.home.features.growth.title}</h3>
            <p className="text-2xl text-muted-foreground text-sky-300 mb-2">
              {dict.home.features.growth.description}
            </p>
            <p className="text-2xl text-muted-foreground text-teal-300">
              {dict.home.features.growth.description2}
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <Users className="h-12 w-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{dict.home.features.distribution.title}</h3>
            <p className="text-2xl text-muted-foreground text-emerald-300 mb-2">
              {dict.home.features.distribution.description}
            </p>
            <p className="text-2xl text-muted-foreground text-emerald-300">
              {dict.home.features.distribution.description2}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Banknote className="h-12 w-12 text-lime-500" />
              <h3 className="text-2xl font-semibold mb-2">
                {dict.home.features.details.title}
              </h3>
            </div>
            <div className="text-2xl flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-lime-200 mb-1">{dict.home.features.details.exp1}</p>
              <p className="text-yellow-200 mb-1">{dict.home.features.details.exp2}</p>
              <p className="text-amber-200 mb-1">{dict.home.features.details.exp3}</p>
              <p className="text-cyan-300">{dict.home.features.details.exp4}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center justify-center gap-2">
              <Store className="h-12 w-12 mb-2 text-pink-400" />
              <h3 className="text-2xl font-semibold mb-2">
                {dict.home.features.financing.title}
              </h3>
            </div>
            <div className="text-2xl flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-white">{dict.home.features.financing.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <a href={`/${lang}/shop`} className="h-[120px] block text-center">
                  <img src="/icons/tbcity.png" width="160" alt="tabascocity" />
                  <p>Opérer depuis ces sites</p>
                </a>
                <a href="https://www.tshirts.land" target="_blank" rel="noopener noreferrer" className="mx-auto h-[120px] text-center block">
                  <img src="/icons/tshirtsland.png" width="100" alt="tshirtland" />
                </a>
              </div>
              <p className="mb-2 text-rose-200 text-center">{dict.home.features.financing.exp2}</p>
              <p className="mb-2 text-purple-200 text-center">{dict.home.features.financing.exp3}</p>
              <p className="text-violet-200 text-center">{dict.home.features.financing.exp4}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center justify-center">
              <Factory className="h-12 w-12 mb-2 text-amber-500" />
              <h3 className="text-2xl font-semibold mb-2">
                {dict.home.features.industries.title}
              </h3>
            </div>
            <div className="text-2xl flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-white mb-2">{dict.home.features.industries.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <a href={`/${lang}/shop`} className="block">
                  <img src="/icons/shonen-detoured.png" width="160" alt="Shonen Industries" />
                </a>
              </div>
              <p className="mb-2 text-amber-500">{dict.home.features.industries.exp2}</p>
              <p className="mb-2 text-amber-400">{dict.home.features.industries.exp3}</p>
              <p className="mb-2 text-amber-300">{dict.home.features.industries.exp4}</p>
            </div>
          </Card>
        </div>
      </div>
      <h2 className="text-center w-full mt-2 text-3xl font-neontitle text-yellow-200">
        {dict.home.nogen}
      </h2>
    </section>
  )
}

export default Features
