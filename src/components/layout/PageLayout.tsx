import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PageLayout({
   children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex-shrink flex-col min-h-screen">
            <Navbar/>
            <main className="flex-shrink container mx-auto min-h-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    )
}