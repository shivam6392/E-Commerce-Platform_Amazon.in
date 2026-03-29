import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations, TranslationKey } from '../data/translations';
type Language = 'EN' | 'HI';

interface LanguageContextType {
    language: Language;
    country: string;
    setLanguage: (lang: Language) => void;
    setCountry: (country: string) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('EN');
    const [country, setCountry] = useState<string>('India');

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations['EN'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, country, setLanguage, setCountry, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
