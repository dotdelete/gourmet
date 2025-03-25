export default function Footer() {
    // Pre-compute the year to avoid re-renders that might cause layout shifts
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gray-100 py-6 mt-auto h-[80px] w-full">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 w-full md:w-auto">
                        <p className="text-gray-600 text-sm">
                            © {currentYear} Gourmet - Application de gestion de recettes
                        </p>
                    </div>
                    <div className="flex space-x-4 w-full md:w-auto">
                        <a
                            href="https://gourmet.cours.quimerch.com/swagger/index.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                            API Documentation
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}