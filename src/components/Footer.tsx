'use client';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 mt-auto">
            <div className="container mx-auto text-center">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p>&copy; {new Date().getFullYear()} L3m-holding. Tous droits réservés.</p>
                    </div>
                
                </div>
            </div>
        </footer>
    );
};

export default Footer;