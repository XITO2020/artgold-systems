"use client";
import "@/wonderstyles/slider.css";
import React, { useEffect, useState } from 'react';
import { useTheme } from 'ç/theme/ThemeContext';
import dynamic from 'next/dynamic';
import LoadingScreen from './LoadingScreen';
import VideoPlayer from "./VideoPlayer";

interface HomeClientProps {
    initialDict: any;
    lang: string;
}

const HomeClient: React.FC<HomeClientProps> = ({ initialDict, lang }) => {
    const { theme } = useTheme();
    const [matrixColumns, setMatrixColumns] = useState<JSX.Element[]>([]);

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

    // Single dynamic import for each component
    const SliderComponent = dynamic(
        () => import(`../_partials/${theme}/SliderComponent`),
        { ssr: false, loading: () => <div>Loading Slider...</div> }
    );

    const Hero = dynamic(
        () => import(`../_partials/${theme}/Hero`),
        { loading: () => <div>Loading Hero...</div> }
    );

    const Features = dynamic(
        () => import(`../_partials/${theme}/Features`),
        { loading: () => <div>Loading Features...</div> }
    );

    const ValidationProcess = dynamic(
        () => import(`../_partials/${theme}/validation-process`).then(mod => mod.ValidationProcess),
        { loading: () => <div>Loading Validation Process...</div> }
    );

    const ValueDistribution = dynamic(
        () => import(`../_partials/${theme}/value-distribution`).then(mod => mod.ValueDistribution),
        { loading: () => <div>Loading Value Distribution...</div> }
    );

    return (
        <div className={`mt-12 flex flex-col min-h-screen ${theme === 'emerald' ? 'matrix-background' : ''}`}>
            {theme === 'emerald' && (
                <div className="matrix-text">
                    {matrixColumns}
                </div>
            )}
            <section className="sliding">
                <SliderComponent dict={initialDict} lang={lang} />
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
