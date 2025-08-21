"use client";

import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { useTheme } from '@comp/theme/ThemeContext';
import { useMediaQuery } from '@hooks/use-media-query';
import Link from 'next/link';

interface SliderProps {
  dict: {
    slider: {
      emerald: {
        one: {
          link1: string;
          link2: string;
          link3: string;
          link4: string;
          link5: string;
          central: string;
          social1: string;
          social2: string;
          social3: string;
        };
        two: {
          link1: string;
          link2: string;
          link3: string;
          link4: string;
          link5: string;
          central: string;
          social1: string;
          social2: string;
          social3: string;
        };
        three: {
          link1: string;
          link2: string;
          link3: string;
          link4: string;
          link5: string;
          central: string;
          social1: string;
          social2: string;
          social3: string;
        };
        four: {
          link1: string;
          link2: string;
          link3: string;
          link4: string;
          link5: string;
          central: string;
          social1: string;
          social2: string;
          social3: string;
        };
        five: {
          link1: string;
          link2: string;
          link3: string;
          link4: string;
          link5: string;
          central: string;
          social1: string;
          social2: string;
          social3: string;
        };
        mode: string;
      };
    };
  };
  lang: string;
}

const SliderComponent: React.FC<SliderProps> = ({ dict, lang }) => {
  const { theme } = useTheme();
  const heroButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: !isMobile,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
          adaptiveHeight: true
        }
      }
    ]
  };

  useEffect(() => {
    if (heroButtonRef.current) {
      heroButtonRef.current.style.backgroundColor = `var(--${theme}-accent)`;
    }
  }, [theme]);

  if (!dict?.slider?.emerald) {
    console.warn('Slider dictionary data is missing');
    return null;
  }

  const slides = [
    {
      HeroTitle: "Streaming Catalogue",
      background: 'emerald1',
      links: [
        { href: '/streaming', text: dict.slider.emerald.one.link1 },
        { href: '/streaming/manga', text: dict.slider.emerald.one.link2 },
        { href: '/streaming/icons', text: dict.slider.emerald.one.link3 },
        { href: '/streaming/wallpapers', text: dict.slider.emerald.one.link4 },
        { href: '/shop', text: dict.slider.emerald.one.link5 },
      ],
      roundLinks: [
        { href: '/blog', img: '/icons/emerald-blog.png', name: dict.slider.emerald.one.social1 },
        { href: '/shop', img: '/icons/emerald-shop.png', name: dict.slider.emerald.one.social2 },
        { href: '/portfolio', img: '/icons/emerald-contact.png', name: dict.slider.emerald.one.social3 },
      ],
      centralLink: '/blog',
      centralText: dict.slider.emerald.one.central
    },
    {
      HeroTitle: "News & Vlog",
      background: 'emerald2',
      links: [
        { href: '/blog/crypto', text: dict.slider.emerald.two.link1 },
        { href: '/blog/doxa', text: dict.slider.emerald.two.link2 },
        { href: '/blog/news', text: dict.slider.emerald.two.link3 },
        { href: '/blog/latest', text: dict.slider.emerald.two.link4 },
        { href: '/blog/stack', text: dict.slider.emerald.two.link5 },
      ],
      roundLinks: [
        { href: 'https://tiktok.com', img: '/icons/tiktok.png', name: dict.slider.emerald.two.social1 },
        { href: 'https://facebook.com', img: '/icons/facebook.png', name: dict.slider.emerald.two.social2 },
        { href: 'https://twitter.com', img: '/icons/twitter.png', name: dict.slider.emerald.two.social3 },
      ],
      centralLink: '/blog',
      centralText: dict.slider.emerald.two.central
    },
    {
      HeroTitle: "Sous-titrez, doublez, gagnez !",
      background: 'emerald3',
      links: [
        { href: '/dubbing/crypto', text: dict.slider.emerald.three.link1 },
        { href: '/dubbing/subtitles', text: dict.slider.emerald.three.link2 },
        { href: '/dubbing/voice', text: dict.slider.emerald.three.link3 },
        { href: '/dubbing/sell', text: dict.slider.emerald.three.link4 },
        { href: '/dubbing/collect', text: dict.slider.emerald.three.link5 },
      ],
      roundLinks: [
        { href: 'https://elevenlabs.io', img: '/icons/11labs.png', name: dict.slider.emerald.three.social1 },
        { href: '/dubbing/tools', img: '/icons/lipdub.png', name: dict.slider.emerald.three.social2 },
        { href: '/dubbing/more', img: '/icons/more.png', name: dict.slider.emerald.three.social3 },
      ],
      centralLink: '/dubbing',
      centralText: dict.slider.emerald.three.central
    },
    {
      HeroTitle: "Top 100 des Master Pièces rentables",
      background: 'emerald4',
      links: [
        { href: '/explore/how-it-works', text: dict.slider.emerald.four.link1 },
        { href: '/upload', text: dict.slider.emerald.four.link2 },
        { href: '/explore/sell', text: dict.slider.emerald.four.link3 },
        { href: '/explore/buy', text: dict.slider.emerald.four.link4 },
        { href: '/explore/categories', text: dict.slider.emerald.four.link5 },
      ],
      roundLinks: [
        { href: 'https://facebook.com', img: '/icons/facebook.png', name: dict.slider.emerald.four.social1 },
        { href: 'https://linkedin.com', img: '/icons/linkedin.png', name: dict.slider.emerald.four.social2 },
        { href: 'https://coingecko.com', img: '/icons/coingecko.png', name: dict.slider.emerald.four.social3 },
      ],
      centralLink: '/upload',
      centralText: dict.slider.emerald.four.central
    },
    {
      HeroTitle: 'Always TabascoCity: des t-shirts pour soutenir ...',
      background: 'emerald5',
      links: [
        { href: '/shop/latest', text: dict.slider.emerald.five.link1 },
        { href: '/shop/impact', text: dict.slider.emerald.five.link2 },
        { href: '/shop/categories', text: dict.slider.emerald.five.link3 },
        { href: '/shop/bestsellers', text: dict.slider.emerald.five.link4 },
        { href: '/shop/submit', text: dict.slider.emerald.five.link5 },
      ],
      roundLinks: [
        { href: 'https://deviantart.com', img: '/icons/deviantart.png', name: dict.slider.emerald.five.social1 },
        { href: 'https://pinterest.com', img: '/icons/pinterest.png', name: dict.slider.emerald.five.social2 },
        { href: 'https://leonardo.ai', img: '/icons/leonardo.png', name: dict.slider.emerald.five.social3 },
      ],
      centralLink: '/shop',
      centralText: dict.slider.emerald.five.central
    },
  ];

  return (
    <div className={`slider-container ${isMobile ? 'mobile' : ''} h-[55vh] mt-5`}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className={`m-auto slide ${slide.background} ${isMobile ? 'mobile-bg' : ''}`}>
            <div className="links-container">
              <div className="left-links">
                {slide.links.slice(0, isMobile ? 3 : 5).map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="link transition-all duration-300 hover:bg-accent-hover hover:text-accentText-hover"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
              {!isMobile && (
                <div className="right-links">
                  {slide.roundLinks.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="w-16 h-16 flex items-center justify-center transition-transform hover:scale-110"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <img
                        src={link.img}
                        alt={link.name}
                        className="w-full h-full"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="hero-title">
              <h1 className="text-4xl font-bold mb-4">{slide.HeroTitle}</h1>
              {!isMobile && (
                <Link href={slide.centralLink}>
                  <button
                    ref={heroButtonRef}
                    className="central-button transition-all duration-300 hover:opacity-90 hover:scale-105"
                  >
                    {slide.centralText || "Explore"}
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </Slider>
      <h3 className="text-emerald-200 hover:text-cyan-300 mt-3">{dict.slider.emerald.mode}</h3>
    </div>
  );
};

export default SliderComponent;
