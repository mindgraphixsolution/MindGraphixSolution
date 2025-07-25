import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { ClientNotifications } from "./ClientNotifications";

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onRegisterClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, isAdmin, isSuperAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Accueil", href: "/", type: "route" },
    { label: "À propos", href: "/about", type: "route" },
    { label: "Services", href: "/services", type: "route" },
    { label: "Portfolio", href: "#portfolio", type: "scroll" },
    { label: "Équipe", href: "#team", type: "scroll" },
    { label: "Contact", href: "#contact", type: "scroll" },
  ];

  const handleNavigation = (item: any) => {
    if (item.type === "scroll") {
      // Si on n'est pas sur la page d'accueil, rediriger vers l'accueil avec l'ancre
      if (location.pathname !== "/") {
        navigate("/" + item.href);
      } else {
        // Si on est sur la page d'accueil, faire le scroll normal
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center space-x-3 text-2xl font-bold transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4871d4fcbac047999c8a4dbe551aa7ef%2Faa0f68d60ade45f69d38a41cc2d1e34f?format=webp&width=800"
              alt="Mind Graphix Solution Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span>
              Mind <span className="text-accent">Graphix</span> Solution
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.type === "route" ? (
                  <Link
                    to={item.href}
                    className={`relative font-medium transition-colors hover:text-accent group ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`relative font-medium transition-colors hover:text-accent group ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Auth Buttons / User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <ClientNotifications />
                <div
                  className={`flex items-center space-x-2 ${isScrolled ? "text-gray-700" : "text-white"}`}
                >
                  <User size={20} />
                  <span className="font-medium">
                    {isSuperAdmin
                      ? "Utilisateur"
                      : isAdmin
                        ? "Admin"
                        : currentUser?.name || "Utilisateur"}
                  </span>
                </div>
                {isAdmin && (
                  <Button
                    onClick={() => navigate("/admin")}
                    variant="outline"
                    className={`border-2 transition-all ${
                      isScrolled
                        ? "border-primary text-primary hover:bg-primary hover:text-white"
                        : "border-white text-white hover:bg-white hover:text-primary"
                    }`}
                  >
                    Vue Admin
                  </Button>
                )}
                <Button
                  onClick={logout}
                  variant="outline"
                  className={`border-2 transition-all ${
                    isScrolled
                      ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      : "border-white text-white hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <LogOut size={16} />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onLoginClick}
                  className={`border-2 transition-all ${
                    isScrolled
                      ? "border-primary text-primary hover:bg-primary hover:text-white"
                      : "border-white text-white hover:bg-white hover:text-primary"
                  }`}
                >
                  Connexion
                </Button>
                <Button
                  onClick={onRegisterClick}
                  className="bg-gradient-to-r from-accent to-orange-400 text-black font-semibold hover:from-orange-400 hover:to-accent transform hover:scale-105 transition-all"
                >
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200">
            <div className="container mx-auto px-6 py-6">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.type === "route" ? (
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left text-gray-700 font-medium py-2 transition-colors hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item)}
                        className="block w-full text-left text-gray-700 font-medium py-2 transition-colors hover:text-accent"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col space-y-3 mt-6">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-2 text-gray-700 p-2">
                      <User size={20} />
                      <span className="font-medium">
                        {isSuperAdmin
                          ? "Utilisateur"
                          : isAdmin
                            ? "Admin"
                            : currentUser?.name || "Utilisateur"}
                      </span>
                    </div>
                    {isAdmin && (
                      <Button
                        onClick={() => {
                          navigate("/admin");
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Vue Admin
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLoginClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Connexion
                    </Button>
                    <Button
                      onClick={() => {
                        onRegisterClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-accent to-orange-400 text-black font-semibold hover:from-orange-400 hover:to-accent"
                    >
                      Inscription
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
