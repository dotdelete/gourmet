import React, { useState } from 'react';
import NavbarWithSearch from "@/components/layout/NavbarWithSearch";
import Footer from "@/components/layout/Footer";

export default function HomePageLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavbarWithSearch onSearch={handleSearch} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {React.cloneElement(children as React.ReactElement, { searchQuery })}
            </main>
            <Footer />
        </div>
    )
}