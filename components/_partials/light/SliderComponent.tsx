"use client";

import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTheme } from 'ç/theme/ThemeContext';
import { useMediaQuery } from '#/hooks/use-media-query';
import Link from 'next/link';

interface SliderProps {
  dict: {
    slider: {
      light: {
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

  if (!dict?.slider?.light) {
    console.warn('Slider dictionary data is missing');
    return null;
  }

  const slides = [
    {
      HeroTitle: "Streaming Catalogue",
      background: 'light1',
      links: [
        { href: '/streaming', text: dict.slider.light.one.link1 },
        { href: '/streaming/manga', text: dict.slider.light.one.link2 },
        { href: '/streaming/icons', text: dict.slider.light.one.link3 },
        { href: '/streaming/wallpapers', text: dict.slider.light.one.link4 },
        { href: '/shop', text: dict.slider.light.one.link5 },
      ],
      roundLinks: [
        { href: '/blog', img: '/icons/light-blog.png', name: dict.slider.light.one.social1 },
        { href: '/shop', img: '/icons/light-shop.png', name: dict.slider.light.one.social2 },
        { href: '/portfolio', img: '/icons/light-contact.png', name: dict.slider.light.one.social3 },
      ],
      centralLink: '/blog',
      centralText: dict.slider.light.one.central
    },
    {
      HeroTitle: "News & Vlog",
      background: 'light2',
      links: [
        { href: '/blog/crypto', text: dict.slider.light.two.link1 },
        { href: '/blog/doxa', text: dict.slider.light.two.link2 },
        { href: '/blog/news', text: dict.slider.light.two.link3 },
        { href: '/blog/latest', text: dict.slider.light.two.link4 },
        { href: '/blog/stack', text: dict.slider.light.two.link5 },
      ],
      roundLinks: [
        { href: 'https://tiktok.com', img: '/icons/tiktok.png', name: dict.slider.light.two.social1 },
        { href: 'https://facebook.com', img: '/icons/facebook.png', name: dict.slider.light.two.social2 },
        { href: 'https://twitter.com', img: '/icons/twitter.png', name: dict.slider.light.two.social3 },
      ],
      centralLink: '/blog',
      centralText: dict.slider.light.two.central
    },
    {
      HeroTitle: "Sous-titrez, doublez, gagnez !",
      background: 'light3',
      links: [
        { href: '/dubbing/crypto', text: dict.slider.light.three.link1 },
        { href: '/dubbing/subtitles', text: dict.slider.light.three.link2 },
        { href: '/dubbing/voice', text: dict.slider.light.three.link3 },
        { href: '/dubbing/sell', text: dict.slider.light.three.link4 },
        { href: '/dubbing/collect', text: dict.slider.light.three.link5 },
      ],
      roundLinks: [
        { href: 'https://elevenlabs.io', img: '/icons/11labs.png', name: dict.slider.light.three.social1 },
        { href: '/dubbing/tools', img: '/icons/lipdub.png', name: dict.slider.light.three.social2 },
        { href: '/dubbing/more', img: '/icons/more.png', name: dict.slider.light.three.social3 },
      ],
      centralLink: '/dubbing',
      centralText: dict.slider.light.three.central
    },
    {
      HeroTitle: "Top 100 des Master Pièces rentables",
      background: 'light4',
      links: [
        { href: '/explore/how-it-works', text: dict.slider.light.four.link1 },
        { href: '/upload', text: dict.slider.light.four.link2 },
        { href: '/explore/sell', text: dict.slider.light.four.link3 },
        { href: '/explore/buy', text: dict.slider.light.four.link4 },
        { href: '/explore/categories', text: dict.slider.light.four.link5 },
      ],
      roundLinks: [
        { href: 'https://facebook.com', img: '/icons/facebook.png', name: dict.slider.light.four.social1 },
        { href: 'https://linkedin.com', img: '/icons/linkedin.png', name: dict.slider.light.four.social2 },
        { href: 'https://coingecko.com', img: '/icons/coingecko.png', name: dict.slider.light.four.social3 },
      ],
      centralLink: '/upload',
      centralText: dict.slider.light.four.central
    },
    {
      HeroTitle: 'Always TabascoCity: des t-shirts pour soutenir ...',
      background: 'light5',
      links: [
        { href: '/shop/latest', text: dict.slider.light.five.link1 },
        { href: '/shop/impact', text: dict.slider.light.five.link2 },
        { href: '/shop/categories', text: dict.slider.light.five.link3 },
        { href: '/shop/bestsellers', text: dict.slider.light.five.link4 },
        { href: '/shop/submit', text: dict.slider.light.five.link5 },
      ],
      roundLinks: [
        { href: 'https://deviantart.com', img: '/icons/deviantart.png', name: dict.slider.light.five.social1 },
        { href: 'https://pinterest.com', img: '/icons/pinterest.png', name: dict.slider.light.five.social2 },
        { href: 'https://leonardo.ai', img: '/icons/leonardo.png', name: dict.slider.light.five.social3 },
      ],
      centralLink: '/shop',
      centralText: dict.slider.light.five.central
    },
  ];

  return (
    <div className="slider-container h-[55vh] mt-5">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className={`m-auto slide ${slide.background}`}>
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
              <Link href={slide.centralLink}>
                <button 
                  ref={heroButtonRef} 
                  className="central-button transition-all duration-300 hover:opacity-90 hover:scale-105"
                >
                  {isMobile ? "View" : slide.centralText || "Explore"}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
      <br/>
      <h3 className="text-red-300 mt-1 text-clastext font-semibold tracking-wide">{dict.slider.light.mode}</h3>
    </div>
  );
};

export default SliderComponent;