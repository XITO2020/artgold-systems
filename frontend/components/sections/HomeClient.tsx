"use client";
import "@/app/wonderstyles/slider.css";
import React, { useEffect, useState } from 'react';
import { useTheme } from '@comp/theme/ThemeContext';
import dynamic from 'next/dynamic';
import LoadingScreen from './LoadingScreen';
import VideoPlayer from "./VideoPlayer";
// ValueDistribution will be imported dynamically based on theme

interface HomeClientProps {
    initialDict: any;
    lang: string;
}

const HomeClient: React.FC<HomeClientProps> = ({ initialDict, lang }) => {
    const { theme } = useTheme();
    const [matrixColumns, setMatrixColumns] = useState<JSX.Element[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    // Gérer le redimensionnement de la fenêtre
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Initialiser isMobile
        handleResize();

        // Ajouter l'écouteur d'événement
        window.addEventListener('resize', handleResize);

        // Nettoyer l'écouteur d'événement lors du démontage du composant
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Générer les colonnes de la matrice
    useEffect(() => {
        if (theme === 'emerald') {
            const columns = Math.floor(window.innerWidth / 16); // Nombre de colonnes basé sur la largeur de l'écran
            const characters = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i)); // Caractères ASCII de 33 à 126

            const columnsArray = Array.from({ length: columns }, (_, colIndex) => {
                const randomCharCount = Math.floor(Math.random() * 20) + 10; // Nombre aléatoire de caractères par colonne
                const chars = Array.from({ length: randomCharCount }, () => {
                    const randomChar = characters[Math.floor(Math.random() * characters.length)];
                    return (
                        <span key={Math.random()} style={{ opacity: Math.random(), animationDelay: `${Math.random() * 5}s` }}>
                            {randomChar}
                        </span>
                    );
                });

                return (
                    <div key={colIndex} className="matrix-column" style={{ animationDuration: `${Math.random() * 5 + 5}s` }}>
                        {chars}
                    </div>
                );
            });

            setMatrixColumns(columnsArray);
        }
    }, [theme]);

    if (!initialDict) {
        return <LoadingScreen />;
    }

    // Dynamic imports with explicit theme paths
    const SliderComponent = dynamic(
        () => import(`../_partials/${theme}/SliderComponent`).catch(() => 
            import('../_partials/light/SliderComponent')
        ),
        { ssr: false, loading: () => <div>Loading Slider...</div> }
    );

    const MobileSlider = dynamic(
        () => import(`../_partials/${theme}/MobileSlider`).catch(() => 
            import('../_partials/light/MobileSlider')
        ),
        { ssr: false, loading: () => <div>Loading Mobile Slider...</div> }
    );

    const Hero = dynamic(
        () => import(`../_partials/${theme}/Hero`).catch(() => 
            import('../_partials/light/Hero')
        ),
        { ssr: false, loading: () => <div>Loading Hero...</div> }
    );

    const Features = dynamic(
        () => import(`../_partials/${theme}/Features`).catch(() => 
            import('../_partials/light/Features')
        ),
        { ssr: false, loading: () => <div>Loading Features...</div> }
    );

    const ValidationProcess = dynamic(
        () => import(`../_partials/${theme}/validation-process`).then(mod => mod.default || mod.ValidationProcess),
        { ssr: false, loading: () => <div>Loading Validation Process...</div> }
    );

    const ValueDistribution = dynamic(
        () => import(`../_partials/${theme}/value-distribution`),
        { ssr: false, loading: () => <div>Loading Value Distribution...</div> }
    );

    return (
        <div className={`mt-12 flex flex-col min-h-screen ${theme === 'emerald' ? 'matrix-background' : ''}`}>
            {theme === 'emerald' && (
                <div className="matrix-text">
                    {matrixColumns}
                </div>
            )}
            <section className="sliding">
                {isMobile ? (
                    <MobileSlider dict={initialDict} lang={lang} />
                ) : (
                    <SliderComponent dict={initialDict} lang={lang} />
                )}
            </section>
            
            <section className="homing mt-12">
                
                <Hero dict={initialDict} lang={lang} />
                
                <div className="my-12">
                    <VideoPlayer />
                </div>
                
                <div className="mt-[100px]">
                    <Features dict={initialDict} lang={lang} />
                </div>
                
                <ValueDistribution dict={initialDict} lang={lang} />
                <ValidationProcess dict={initialDict} lang={lang} />
            </section>
        </div>
    );
};

export default HomeClient;
