import React from 'react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div id="footer" className="w-full bg-sombre transition border-t-quintary border-t-2 mt-5 py-4">
            <ul className="flex flex-row justify-evenly text-primary font-darktitle items-center px-8">
                <li className="flex flex-col items-center justify-between w-[400px] relative group">
                    <a href="#" target="_blank">
                        <img
                            src="/icons/cpl-pink.png"
                            alt="logo conspix"
                            width="250"
                            className="w-32 opacity-70 hover:opacity-100 glowy transition"
                        />
                    </a>
                    <span className="tooltip">Infos et vidéos</span>
                </li>

                <li className="flex flex-col items-center justify-around w-[400px] relative group">
                    <a href="#" target="_blank">
                        <img
                            src="/icons/shonen-detoured.png"
                            alt="logo tabascocity"
                            width="150"
                            className="opacity-70 hover:opacity-100 glowy transition"
                        />
                    </a>
                    <span className="tooltip">Shonen.industries:<br /> become a famous mangaka !</span>
                </li>

                <li className="flex flex-col items-center justify-between w-[350px] relative group">
                    <a href="#" target="_blank">
                        <img
                            src="/icons/tshirtsland.png"
                            alt="tshirts land"
                            width="150"
                            className="w-48 opacity-70 hover:opacity-100 glowy transition"
                        />
                    </a>
                    <span className="tooltip">Tshirts.land:<br />Play and win your best T-shirts</span>
                </li>

                <li className="flex flex-col items-center justify-between w-[400px] relative group">
                    <a href="#" target="_blank">
                        <img
                            src="/icons/zz-lemon.png"
                            alt="logo zarmazon"
                            width="250"
                            className="w-40 opacity-70 hover:opacity-100 glowy transition"
                        />
                    </a>
                    <span className="tooltip">Algerian Ecommerce<br />Zarmazon prime concurrence<br /><i>Serious Soon !</i></span>
                </li>
            </ul>
            <div className="text-quadriary font-darkplus flex items-center justify-center tracking-wider mt-2">
                This &nbsp; serie &nbsp; of &nbsp; websites &nbsp; is &nbsp; exclusive &nbsp; Property &nbsp;
                of &nbsp; naïmé &nbsp; tabasco &nbsp; in &nbsp; heritance &nbsp; from &nbsp; O. Opal, &nbsp; ©2013-2023
            </div>
            <button
                onClick={scrollToTop}
                className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-secondary transition"
            >
                ↑
            </button>
        </div>
    );
};

export default Footer;
