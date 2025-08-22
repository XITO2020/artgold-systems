"use client";

import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTheme } from '@comp/theme/ThemeContext';
import Image from 'next/image';

interface MobileSliderProps {
  dict: {
    slider: {
      neon: {
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

const MobileSlider: React.FC<MobileSliderProps> = ({ dict, lang }) => {
  const { theme } = useTheme();
  const heroButtonRef = useRef<HTMLButtonElement>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          dots: true,
          adaptiveHeight: true,
        },
      },
    ],
  };

  useEffect(() => {
    if (heroButtonRef.current) {
      heroButtonRef.current.style.backgroundColor = `var(--${theme}-accent)`;
    }
  }, [theme]);

  if (!dict?.slider?.neon) {
    console.warn('Slider dictionary data is missing');
    return null;
  }

  const slides = [
    {
      HeroTitle: "Streaming Catalogue",
      background: 'mobile-neon',
      links: [
        { href: '/streaming', text: dict.slider.neon.one.link1 },
        { href: '/streaming/manga', text: dict.slider.neon.one.link2 },
        { href: '/streaming/icons', text: dict.slider.neon.one.link3 },
        { href: '/streaming/wallpapers', text: dict.slider.neon.one.link4 },
        { href: '/shop', text: dict.slider.neon.one.link5 },
      ],
      roundLinks: [
        { href: '/blog', img: '/icons/neon-blog.png', name: dict.slider.neon.one.social1 },
        { href: '/shop', img: '/icons/neon-shop.png', name: dict.slider.neon.one.social2 },
        { href: '/portfolio', img: '/icons/neon-contact.png', name: dict.slider.neon.one.social3 },
      ],
      centralLink: '/blog',
      centralText: dict.slider.neon.one.central,
    },
    {
      HeroTitle: "News & Vlog",
      background: 'mobile-neon',
      links: [
        { href: '/blog/crypto', text: dict.slider.neon.two.link1 },
        { href: '/blog/doxa', text: dict.slider.neon.two.link2 },
        { href: '/blog/news', text: dict.slider.neon.two.link3 },
        { href: '/blog/latest', text: dict.slider.neon.two.link4 },
        { href: '/blog/stack', text: dict.slider.neon.two.link5 },
      ],
      roundLinks: [
        { href: 'https://tiktok.com', img: '/icons/tiktok.png', name: dict.slider.neon.two.social1 },
        { href: 'https://facebook.com', img: '/icons/facebook.png', name: dict.slider.neon.two.social2 },
        { href: 'https://twitter.com', img: '/icons/twitter.png', name: dict.slider.neon.two.social3 },
      ],
      centralLink: '/blog',
      centralText: dict.slider.neon.two.central,
    },
    {
      HeroTitle: "Sous-titrez, doublez, gagnez !",
      background: 'mobile-neon',
      links: [
        { href: '/dubbing/crypto', text: dict.slider.neon.three.link1 },
        { href: '/dubbing/subtitles', text: dict.slider.neon.three.link2 },
        { href: '/dubbing/voice', text: dict.slider.neon.three.link3 },
        { href: '/dubbing/sell', text: dict.slider.neon.three.link4 },
        { href: '/dubbing/collect', text: dict.slider.neon.three.link5 },
      ],
      roundLinks: [
        { href: 'https://elevenlabs.io', img: '/icons/11labs.png', name: dict.slider.neon.three.social1 },
        { href: '/dubbing/tools', img: '/icons/lipdub.png', name: dict.slider.neon.three.social2 },
        { href: '/dubbing/more', img: '/icons/more.png', name: dict.slider.neon.three.social3 },
      ],
      centralLink: '/dubbing',
      centralText: dict.slider.neon.three.central,
    },
    {
      HeroTitle: "Top 100 des Master Pièces rentables",
      background: 'mobile-neon',
      links: [
        { href: '/explore/how-it-works', text: dict.slider.neon.four.link1 },
        { href: '/upload', text: dict.slider.neon.four.link2 },
        { href: '/explore/sell', text: dict.slider.neon.four.link3 },
        { href: '/explore/buy', text: dict.slider.neon.four.link4 },
        { href: '/explore/categories', text: dict.slider.neon.four.link5 },
      ],
      roundLinks: [
        { href: 'https://facebook.com', img: '/icons/facebook.png', name: dict.slider.neon.four.social1 },
        { href: 'https://linkedin.com', img: '/icons/linkedin.png', name: dict.slider.neon.four.social2 },
        { href: 'https://coingecko.com', img: '/icons/coingecko.png', name: dict.slider.neon.four.social3 },
      ],
      centralLink: '/upload',
      centralText: dict.slider.neon.four.central,
    },
    {
      HeroTitle: 'Always TabascoCity: des t-shirts pour soutenir ...',
      background: 'mobile-neon',
      links: [
        { href: '/shop/latest', text: dict.slider.neon.five.link1 },
        { href: '/shop/impact', text: dict.slider.neon.five.link2 },
        { href: '/shop/categories', text: dict.slider.neon.five.link3 },
        { href: '/shop/bestsellers', text: dict.slider.neon.five.link4 },
        { href: '/shop/submit', text: dict.slider.neon.five.link5 },
      ],
      roundLinks: [
        { href: 'https://deviantart.com', img: '/icons/deviantart.png', name: dict.slider.neon.five.social1 },
        { href: 'https://pinterest.com', img: '/icons/pinterest.png', name: dict.slider.neon.five.social2 },
        { href: 'https://leonardo.ai', img: '/icons/leonardo.png', name: dict.slider.neon.five.social3 },
      ],
      centralLink: '/shop',
      centralText: dict.slider.neon.five.central,
    },
  ];

  return (
    <div className="mobile-slider-container">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className={`slide ${slide.background}`}>
            <div className="links-container">
              <div className="right-links">
                {slide.roundLinks.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="social-link"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={link.name}
                  >
                    <Image
                      src={link.img}
                      alt={link.name}
                      width={24}
                      height={24}
                      className="social-icon"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
              <div className="hero-title">
                <h1 className="slide-title">{slide.HeroTitle}</h1>
                <div className="central-link">
                  <a 
                    href={slide.centralLink}
                    className="central-button"
                    aria-label={slide.centralText || "Explore"}
                  >
                    {slide.centralText || "Explore"}
                  </a>
                </div>
              </div>
              <div className="left-links">
                {slide.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="nav-link"
                    aria-label={link.text}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className="slider-mode">
        <span className="mode-text">{dict.slider.neon.mode}</span>
      </div>
    </div>
  );
};

export default MobileSlider;
