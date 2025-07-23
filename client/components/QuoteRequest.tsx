import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Calendar, DollarSign, Clock, Users, Target, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface QuoteRequestProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: string;
}

interface FormData {
  // Informations client
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    website: string;
  };
  // Détails du projet
  projectDetails: {
    service: string;
    title: string;
    description: string;
    goals: string[];
    targetAudience: string;
    competitors: string;
  };
  // Spécifications techniques
  technical: {
    platforms: string[];
    features: string[];
    integrations: string[];
    maintenance: string;
  };
  // Budget et timeline
  budget: {
    range: string;
    timeline: string;
    priority: string;
    flexibility: string;
  };
  // Matériaux fournis
  materials: {
    hasLogo: boolean;
    hasContent: boolean;
    hasImages: boolean;
    hasGuidelines: boolean;
    additionalMaterials: string;
  };
}

const services = [
  {
    id: 'web-dev',
    name: 'Développement Web',
    icon: '💻',
    platforms: ['Site vitrine', 'Application web', 'E-commerce', 'Portail', 'API/Backend'],
    features: ['Responsive design', 'CMS', 'Base de données', 'Paiement en ligne', 'Authentification', 'Dashboard admin', 'Multilingue', 'SEO optimisé']
  },
  {
    id: 'design',
    name: 'Design Graphique',
    icon: '🎨',
    platforms: ['Logo', 'Identité visuelle', 'Print', 'Packaging', 'Affichage'],
    features: ['Charte graphique', 'Déclinaisons', 'Formats vectoriels', 'Mockups', 'Guide d\'utilisation']
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    icon: '📱',
    platforms: ['Mobile App', 'Web App', 'Desktop', 'Tablette'],
    features: ['Wireframes', 'Prototypes', 'Tests utilisateurs', 'Animations', 'Design system', 'Accessibility']
  },
  {
    id: 'motion',
    name: 'Motion Design',
    icon: '🎬',
    platforms: ['Vidéo promo', 'Animation logo', 'Explainer', 'Publicité', 'Réseaux sociaux'],
    features: ['Story-board', '2D/3D', 'Sound design', 'Voix off', 'Sous-titres', 'Formats multiples']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: '🛒',
    platforms: ['Shopify', 'WooCommerce', 'Magento', 'Solution custom'],
    features: ['Catalogue produits', 'Panier', 'Paiement sécurisé', 'Gestion stock', 'Facturation', 'Analytics']
  },
  {
    id: 'marketing',
    name: 'SEO & Marketing',
    icon: '📈',
    platforms: ['Google Ads', 'Facebook Ads', 'SEO', 'Email marketing', 'Social media'],
    features: ['Audit SEO', 'Stratégie contenu', 'Campagnes pub', 'Analytics', 'Reporting', 'Formation']
  }
];

const budgetRanges = [
  { value: '1000-5000', label: '1 000€ - 5 000€', description: 'Projet simple' },
  { value: '5000-15000', label: '5 000€ - 15 000€', description: 'Projet standard' },
  { value: '15000-30000', label: '15 000€ - 30 000€', description: 'Projet avancé' },
  { value: '30000+', label: '30 000€+', description: 'Projet complexe' },
  { value: 'to-discuss', label: 'À discuter', description: 'Budget flexible' }
];

const timelineOptions = [
  { value: 'urgent', label: '< 2 semaines', description: 'Urgent', color: 'text-red-600' },
  { value: 'fast', label: '2-4 semaines', description: 'Rapide', color: 'text-orange-600' },
  { value: 'normal', label: '1-3 mois', description: 'Standard', color: 'text-blue-600' },
  { value: 'flexible', label: '3+ mois', description: 'Flexible', color: 'text-green-600' }
];

export const QuoteRequest: React.FC<QuoteRequestProps> = ({ isOpen, onClose, selectedService }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    clientInfo: {
      name: '',
      email: '',
      phone: '',
      company: '',
      website: ''
    },
    projectDetails: {
      service: selectedService || '',
      title: '',
      description: '',
      goals: [],
      targetAudience: '',
      competitors: ''
    },
    technical: {
      platforms: [],
      features: [],
      integrations: [],
      maintenance: ''
    },
    budget: {
      range: '',
      timeline: '',
      priority: '',
      flexibility: ''
    },
    materials: {
      hasLogo: false,
      hasContent: false,
      hasImages: false,
      hasGuidelines: false,
      additionalMaterials: ''
    }
  });

  const totalSteps = 5;

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Logique d'envoi du formulaire
    console.log('Devis soumis:', formData);
    alert('Votre demande de devis a été envoyée ! Nous vous répondrons sous 24h.');
    onClose();
  };

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleArrayValue = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => {
      const currentArray = (prev[section] as any)[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  const selectedServiceData = services.find(s => s.id === formData.projectDetails.service);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Demande de Devis Personnalisé</h2>
              <p className="text-white/80 mt-1">
                Étape {currentStep} sur {totalSteps} - {
                  currentStep === 1 ? 'Informations client' :
                  currentStep === 2 ? 'Détails du projet' :
                  currentStep === 3 ? 'Spécifications techniques' :
                  currentStep === 4 ? 'Budget & Timeline' :
                  'Matériaux & Finalisation'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {/* Step 1: Informations client */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Vos informations</h3>
                <p className="text-gray-600">Pour personnaliser notre approche</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.clientInfo.name}
                    onChange={(e) => updateFormData('clientInfo', 'name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email professionnel *
                  </label>
                  <input
                    type="email"
                    value={formData.clientInfo.email}
                    onChange={(e) => updateFormData('clientInfo', 'email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="votre@entreprise.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.clientInfo.phone}
                    onChange={(e) => updateFormData('clientInfo', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+226 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise/Organisation *
                  </label>
                  <input
                    type="text"
                    value={formData.clientInfo.company}
                    onChange={(e) => updateFormData('clientInfo', 'company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web actuel (si existant)
                  </label>
                  <input
                    type="url"
                    value={formData.clientInfo.website}
                    onChange={(e) => updateFormData('clientInfo', 'website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://votre-site.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Détails du projet */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Votre projet</h3>
                <p className="text-gray-600">Décrivez-nous votre vision</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type de service souhaité *
                </label>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => updateFormData('projectDetails', 'service', service.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.projectDetails.service === service.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-medium text-sm">{service.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du projet *
                </label>
                <input
                  type="text"
                  value={formData.projectDetails.title}
                  onChange={(e) => updateFormData('projectDetails', 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="ex: Nouveau site e-commerce pour vente de produits bio"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée du projet *
                </label>
                <textarea
                  value={formData.projectDetails.description}
                  onChange={(e) => updateFormData('projectDetails', 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Décrivez votre projet, vos besoins, le contexte..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Public cible
                </label>
                <input
                  type="text"
                  value={formData.projectDetails.targetAudience}
                  onChange={(e) => updateFormData('projectDetails', 'targetAudience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="ex: Particuliers 25-45 ans, entrepreneurs, étudiants..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concurrents ou références
                </label>
                <input
                  type="text"
                  value={formData.projectDetails.competitors}
                  onChange={(e) => updateFormData('projectDetails', 'competitors', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Sites web ou entreprises qui vous inspirent"
                />
              </div>
            </div>
          )}

          {/* Step 3: Spécifications techniques */}
          {currentStep === 3 && selectedServiceData && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Spécifications techniques</h3>
                <p className="text-gray-600">Détaillez vos besoins fonctionnels</p>
              </div>

              {selectedServiceData.platforms && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Plateformes/Supports souhaités
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedServiceData.platforms.map((platform) => (
                      <label key={platform} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.technical.platforms.includes(platform)}
                          onChange={() => toggleArrayValue('technical', 'platforms', platform)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedServiceData.features && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Fonctionnalités souhaitées
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedServiceData.features.map((feature) => (
                      <label key={feature} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.technical.features.includes(feature)}
                          onChange={() => toggleArrayValue('technical', 'features', feature)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intégrations nécessaires
                </label>
                <textarea
                  value={formData.technical.integrations.join(', ')}
                  onChange={(e) => updateFormData('technical', 'integrations', e.target.value.split(', ').filter(Boolean))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="ex: Google Analytics, CRM, systèmes de paiement, APIs tierces..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Maintenance et support
                </label>
                <div className="space-y-2">
                  {['Maintenance incluse 1 an', 'Support technique', 'Formation utilisateur', 'Pas de maintenance'].map((option) => (
                    <label key={option} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="maintenance"
                        value={option}
                        checked={formData.technical.maintenance === option}
                        onChange={(e) => updateFormData('technical', 'maintenance', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Timeline */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Budget & Planning</h3>
                <p className="text-gray-600">Définissons ensemble le cadre du projet</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Budget envisagé
                </label>
                <div className="space-y-3">
                  {budgetRanges.map((range) => (
                    <label key={range.value} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="budget"
                          value={range.value}
                          checked={formData.budget.range === range.value}
                          onChange={(e) => updateFormData('budget', 'range', e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <div className="font-medium">{range.label}</div>
                          <div className="text-sm text-gray-500">{range.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Timeline souhaitée
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {timelineOptions.map((option) => (
                    <label key={option.value} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="timeline"
                          value={option.value}
                          checked={formData.budget.timeline === option.value}
                          onChange={(e) => updateFormData('budget', 'timeline', e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className={`text-sm ${option.color}`}>{option.description}</div>
                        </div>
                      </div>
                      <Clock size={16} className="text-gray-400" />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priorité du projet
                </label>
                <div className="space-y-2">
                  {['Très urgent', 'Important', 'Modéré', 'Pas pressé'].map((priority) => (
                    <label key={priority} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.budget.priority === priority}
                        onChange={(e) => updateFormData('budget', 'priority', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span>{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Mat��riaux & Finalisation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Finalisation</h3>
                <p className="text-gray-600">Derniers détails avant envoi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Matériaux disponibles
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'hasLogo', label: 'Logo existant (formats vectoriels)' },
                    { key: 'hasContent', label: 'Contenus textuels' },
                    { key: 'hasImages', label: 'Images/Photos professionnelles' },
                    { key: 'hasGuidelines', label: 'Charte graphique/Brand guidelines' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.materials as any)[item.key]}
                        onChange={(e) => updateFormData('materials', item.key, e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informations complémentaires
                </label>
                <textarea
                  value={formData.materials.additionalMaterials}
                  onChange={(e) => updateFormData('materials', 'additionalMaterials', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Toute information supplémentaire utile pour votre projet..."
                />
              </div>

              {/* Résumé du projet */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Résumé de votre demande</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Service:</strong> {selectedServiceData?.name}</div>
                  <div><strong>Entreprise:</strong> {formData.clientInfo.company}</div>
                  <div><strong>Projet:</strong> {formData.projectDetails.title}</div>
                  <div><strong>Budget:</strong> {budgetRanges.find(b => b.value === formData.budget.range)?.label}</div>
                  <div><strong>Timeline:</strong> {timelineOptions.find(t => t.value === formData.budget.timeline)?.label}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with navigation */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ChevronLeft size={16} />
            <span>Précédent</span>
          </Button>

          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 <= currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>Suivant</span>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 flex items-center space-x-2"
            >
              <Check size={16} />
              <span>Envoyer la demande</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
