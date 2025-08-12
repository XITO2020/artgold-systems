"use client";

import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTheme } from '@comp/theme/ThemeContext';

interface HomeClientProps {
  dict: {
    home: {
      slider: {
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
      };
    };
  };
  lang: string;
}

const SliderComponent: React.FC<HomeClientProps> = ({ dict, lang }) => {
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
    adaptiveHeight: false,
  };

  const slides = [
    {
      HeroTitle: "Streaming Catalogue",
      background: 'bg-tb1',
      links: [
        { href: '/link1', text: dict.home.slider.one.link1 },
        { href: '/link2', text: dict.home.slider.one.link2 },
        { href: '/link3', text: dict.home.slider.one.link3 },
        { href: '/link4', text: dict.home.slider.one.link4 },
        { href: '/link5', text: dict.home.slider.one.link5 },
      ],
      roundLinks: [
        { href: '/link6', img: '/icons/sandia.png' },
        { href: '/link7', img: '/icons/sandia.png' },
        { href: '/link8', img: '/icons/sandia.png' },
      ],
    },
    {
      HeroTitle: "News & Vlog",
      background: 'bg-tb2',
      links: [
        { href: '/link9', text: dict.home.slider.two.link1 },
        { href: '/link10', text: dict.home.slider.two.link2 },
        { href: '/link11', text: dict.home.slider.two.link3 },
        { href: '/link12', text: dict.home.slider.two.link4 },
      ],
      roundLinks: [
        { href: '/link6', img: '/icons/sandia.png' },
        { href: '/link7', img: '/icons/sandia.png' },
        { href: '/link8', img: '/icons/sandia.png' },
      ],
    },
    {
      HeroTitle: "Sous-titrez, doublez, gagnez !",
      background: 'bg-tb3',
      links: [
        { href: '/link15', text: dict.home.slider.three.link1 },
        { href: '/link16', text: dict.home.slider.three.link2 },
        { href: '/link17', text: dict.home.slider.three.link3 },
        { href: '/link18', text: dict.home.slider.three.link4 },
        { href: '/link19', text: dict.home.slider.three.link5 },
      ],
      roundLinks: [
        { href: '/link6', img: '/icons/sandia.png' },
        { href: '/link7', img: '/icons/sandia.png' },
        { href: '/link8', img: '/icons/sandia.png' },
      ],
    },
    {
      HeroTitle: "Top 100 des Master Pièces rentables",
      background: 'bg-tb4',
      links: [
        { href: '/link22', text: dict.home.slider.four.link1 },
        { href: '/link23', text: dict.home.slider.four.link2 },
        { href: '/link24', text: dict.home.slider.four.link3 },
        { href: '/link25', text: dict.home.slider.four.link4 },
        { href: '/link26', text: dict.home.slider.four.link5 },
      ],
      roundLinks: [
        { href: '/link6', img: '/icons/sandia.png' },
        { href: '/link7', img: '/icons/sandia.png' },
        { href: '/link8', img: '/icons/sandia.png' },
      ],
    },
    {
      HeroTitle: 'Always TabascoCity: des t-shirts pour soutenir ...',
      background: 'bg-tb5',
      links: [
        { href: '/link29', text: dict.home.slider.five.link1 },
        { href: '/link30', text: dict.home.slider.five.link2 },
        { href: '/link31', text: dict.home.slider.five.link3 },
        { href: '/link32', text: dict.home.slider.five.link4 },
        { href: '/link33', text: dict.home.slider.five.link5 },
      ],
      roundLinks: [
        { href: '/link6', img: '/icons/sandia.png' },
        { href: '/link7', img: '/icons/sandia.png' },
        { href: '/link8', img: '/icons/sandia.png' },
      ],
    },
  ];

  useEffect(() => {
    if (heroButtonRef.current) {
      heroButtonRef.current.style.backgroundColor = `var(--${theme}-accent)`;
    }
  }, [theme]);

  return (
    <div className="slider-container h-[55vh]">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className={`m-auto slide ${slide.background}`}>
            <div className="links-container">
              <div className="left-links">
                {slide.links.slice(0, 5).map((link, linkIndex) => (
                  <a key={linkIndex} href={link.href} className="link">
                    {link.text}
                  </a>
                ))}
              </div>
              <div className="right-links">
                {slide.roundLinks.map((link, linkIndex) => (
                  <a key={linkIndex} href={link.href} className="rounded-full w-12 h-12 text-center">
                    <img src={link.img} alt={`Icon ${linkIndex}`} className="w-full h-full" />
                  </a>
                ))}
              </div>
            </div>
            <div className="hero-title">
              <h1>{slide.HeroTitle}</h1>
              <button ref={heroButtonRef} className="central-button">Central Button</button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
