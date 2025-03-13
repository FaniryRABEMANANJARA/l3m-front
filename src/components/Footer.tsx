'use client';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="container mx-auto text-center">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p>&copy; {new Date().getFullYear()} MaPlateforme. Tous droits réservés.</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="/terms" className="hover:text-gray-300">Conditions d'utilisation</a>
                        <a href="/privacy" className="hover:text-gray-300">Politique de confidentialité</a>
                        <a href="/contact" className="hover:text-gray-300">Contact</a>
                    </div>
                </div>
                <div className="mt-4">
                    <p>Suivez-nous :</p>
                    <div className="flex justify-center space-x-4 mt-2">
                        <a href="#" className="hover:text-gray-300">
                            <img src="/facebook.svg" alt="Facebook" className="h-6 w-6" />
                        </a>
                        <a href="#" className="hover:text-gray-300">
                            <img src="/twitter.svg" alt="Twitter" className="h-6 w-6" />
                        </a>
                        <a href="#" className="hover:text-gray-300">
                            <img src="/linkedin.svg" alt="LinkedIn" className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;