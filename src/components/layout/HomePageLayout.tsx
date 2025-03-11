import React, { useState } from 'react';
import NavbarWithSearch from '@/components/layout/NavbarWithSearch';
import Footer from '@/components/layout/Footer';

interface HomePageLayoutProps {
    children: React.ReactElement<{ searchQuery?: string }>;
}

export default function HomePageLayout({ children }: HomePageLayoutProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavbarWithSearch onSearch={handleSearch} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {React.cloneElement(children, { searchQuery })}
            </main>
            <Footer />
        </div>
    );
}