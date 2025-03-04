"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Gourmet - Application de gestion de recettes
            </p>
          </div>
          <div className="flex space-x-4">
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
