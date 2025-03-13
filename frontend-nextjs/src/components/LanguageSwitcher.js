import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) setLanguage(storedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    router.push(router.pathname, router.asPath, { locale: lang });
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center space-x-2 p-2 bg-gray-200 rounded-md shadow-md focus:outline-none"
      >
        <FontAwesomeIcon icon={faGlobe} className="text-blue-700" />
        <span className="text-gray-700">{language === "fr" ? "FR" : "EN"}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32">
          <button
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => changeLanguage("fr")}
          >
            🇫🇷 Français
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => changeLanguage("en")}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
