import React, { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', dialCode: '+225' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', dialCode: '+27' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', dialCode: '+212' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dialCode: '+216' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', dialCode: '+20' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dialCode: '+213' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', dialCode: '+237' },
  { code: 'CD', name: 'RD Congo', flag: '🇨🇩', dialCode: '+243' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', dialCode: '+251' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', dialCode: '+256' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', dialCode: '+255' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dialCode: '+1' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dialCode: '+44' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dialCode: '+49' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Espagne', flag: '��🇸', dialCode: '+34' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', dialCode: '+32' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', dialCode: '+41' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', dialCode: '+31' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', dialCode: '+91' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', dialCode: '+86' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', dialCode: '+81' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', dialCode: '+52' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷', dialCode: '+54' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', dialCode: '+61' },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "XX XX XX XX",
  className = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Burkina Faso par défaut
  const [phoneNumber, setPhoneNumber] = useState('');

  // Extraire le code pays et le numéro du value initial
  React.useEffect(() => {
    if (value) {
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.replace(country.dialCode + ' ', ''));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const fullNumber = phoneNumber ? `${country.dialCode} ${phoneNumber}` : country.dialCode;
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);
    const fullNumber = newNumber ? `${selectedCountry.dialCode} ${newNumber}` : selectedCountry.dialCode;
    onChange(fullNumber);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Sélecteur de pays */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* Dropdown des pays */}
          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Rechercher un pays..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    // Ici on pourrait filtrer les pays selon la recherche
                  }}
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm font-medium text-gray-900">{country.dialCode}</span>
                    <span className="text-sm text-gray-600 truncate">{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Champ de saisie du numéro */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* Overlay pour fermer le dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
