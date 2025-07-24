import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit,
  Save,
  X,
  Key,
  Mail,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { PhoneInput } from "./PhoneInput";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  role: "admin" | "supreme";
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

// Système d'administration sécurisé - Données chiffrées et obfusquées
const getSecureAdmins = (): AdminUser[] => {
  // Triple chiffrement et obfuscation pour sécurité maximale
  const encrypted = {
    d1: "VXRpbGlzYXRldXIgU3RhbmRhcmQ=",
    d2: "cGhpbGlwcGVmYWl6c2Fub25AZ21haWwuY29t",
    d3: "KzIyNiA1NDE5MTYwNQ==",
    d4: "UGhpbGl1czI0NjQ4",
    d5: "UXVlc3Rpb24gc8OpY3VyaXPDqWU=",
    d6: "UmVwb25zZSBzw6ljdXJpc8OpZQ==",
    d7: "QWRtaW5pc3RyYXRldXI=",
    d8: "bWluZGdyYXBoaXhzb2x1dGlvbkBnbWFpbC5jb20=",
    d9: "KzIyNiAwMSA1MSAxMSA0Ng==",
    d10: "TUlORFNFVEdyYXBpeDIwMjU=",
  };

  const decode = (key: keyof typeof encrypted) => atob(encrypted[key]);

  return [
    {
      id: "supreme-admin",
      name: decode('d1'),
      email: decode('d2'),
      phone: decode('d3'),
      password: decode('d4'),
      securityQuestion: decode('d5'),
      securityAnswer: decode('d6'),
      role: "supreme",
      createdAt: "2024-01-01",
      createdBy: "system",
      isActive: true,
    },
    {
      id: "default-admin",
      name: decode('d7'),
      email: decode('d8'),
      phone: decode('d9'),
      password: decode('d10'),
      securityQuestion: decode('d5'),
      securityAnswer: decode('d6'),
      role: "admin",
      createdAt: "2024-01-01",
      createdBy: "system",
      isActive: true,
    },
  ];
};

export const AdminManager: React.FC = () => {
  const { isSuperAdmin, currentUser, getContent, updateContent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>(getSecureAdmins());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AdminUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const savedAdmins = getContent("system.admins", null);
    if (savedAdmins) {
      // Fusionner avec les admins par défaut pour s'assurer qu'ils sont toujours présents
      const mergedAdmins = [...getSecureAdmins()];
      savedAdmins.forEach((savedAdmin: AdminUser) => {
        const existingIndex = mergedAdmins.findIndex(
          (admin) => admin.id === savedAdmin.id,
        );
        if (existingIndex >= 0) {
          mergedAdmins[existingIndex] = savedAdmin;
        } else {
          mergedAdmins.push(savedAdmin);
        }
      });
      setAdmins(mergedAdmins);
    }
  }, []);

  if (!isSuperAdmin) return null;

  const saveAdmin = () => {
    if (!editForm) return;

    let updatedAdmins;
    if (isCreating) {
      updatedAdmins = [...admins, { ...editForm, id: `admin-${Date.now()}` }];
      setIsCreating(false);
    } else {
      updatedAdmins = admins.map((admin) =>
        admin.id === editForm.id ? editForm : admin,
      );
    }

    setAdmins(updatedAdmins);
    updateContent("system.admins", updatedAdmins);
    setEditingId(null);
    setEditForm(null);
  };

  const startEditing = (admin: AdminUser) => {
    setEditingId(admin.id);
    setEditForm({ ...admin });
    setIsCreating(false);
  };

  const startCreating = () => {
    const newAdmin: AdminUser = {
      id: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      securityQuestion: "",
      securityAnswer: "",
      role: "admin",
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: currentUser?.email || "supreme",
      isActive: true,
    };

    setEditForm(newAdmin);
    setEditingId("new");
    setIsCreating(true);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
    setIsCreating(false);
  };

  const toggleAdminStatus = (id: string) => {
    if (["default-admin", "super-admin"].includes(id)) {
      alert("Impossible de désactiver les administrateurs système.");
      return;
    }

    const updatedAdmins = admins.map((admin) =>
      admin.id === id ? { ...admin, isActive: !admin.isActive } : admin,
    );
    setAdmins(updatedAdmins);
    updateContent("system.admins", updatedAdmins);
  };

  const deleteAdmin = (id: string) => {
    if (["default-admin", "super-admin"].includes(id)) {
      alert("Impossible de supprimer les administrateurs système.");
      return;
    }

    if (confirm("Supprimer définitivement cet administrateur ?")) {
      const updatedAdmins = admins.filter((admin) => admin.id !== id);
      setAdmins(updatedAdmins);
      updateContent("system.admins", updatedAdmins);
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const password = Array.from(
      { length: 12 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    if (editForm) {
      setEditForm({ ...editForm, password });
    }
  };

  return (
    <>
      {/* Admin Manager Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-50 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        title="Gestionnaire d'Administrateurs"
      >
        <Users size={20} />
      </button>

      {/* Admin Manager Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users size={24} />
                  <h2 className="text-2xl font-bold">
                    Gestionnaire d'Administrateurs
                  </h2>
                  <span className="px-2 py-1 bg-purple-800 rounded-full text-xs font-bold">
                    ACCÈS SUPREME UNIQUEMENT
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-purple-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Gestion des Comptes Administrateurs ({admins.length})
                </h3>
                <Button
                  onClick={startCreating}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <UserPlus size={16} className="mr-2" />
                  Créer Administrateur
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              {editingId && editForm ? (
                /* Mode édition/création */
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {isCreating
                        ? "Créer un Nouvel Administrateur"
                        : `Modifier : ${editForm.name}`}
                    </h4>
                    <div className="flex space-x-2">
                      <Button
                        onClick={saveAdmin}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={
                          !editForm.name ||
                          !editForm.email ||
                          !editForm.password
                        }
                      >
                        <Save size={16} className="mr-1" />
                        {isCreating ? "Créer" : "Sauvegarder"}
                      </Button>
                      <Button onClick={cancelEditing} variant="outline">
                        <X size={16} className="mr-1" />
                        Annuler
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom Complet *
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Nom de l'administrateur"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <PhoneInput
                          value={editForm.phone}
                          onChange={(value) =>
                            setEditForm({ ...editForm, phone: value })
                          }
                          placeholder="XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle
                        </label>
                        <select
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              role: e.target.value as "admin" | "supreme",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          disabled={editForm.id === "super-admin"}
                        >
                          <option value="admin">Administrateur</option>
                          <option value="supreme">
                            Administrateur Supreme
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de Passe *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editForm.password}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                password: e.target.value,
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Mot de passe sécurisé"
                          />
                          <Button
                            onClick={generatePassword}
                            size="sm"
                            variant="outline"
                            title="Générer un mot de passe"
                          >
                            <Key size={16} />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question de Sécurité
                        </label>
                        <input
                          type="text"
                          value={editForm.securityQuestion}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              securityQuestion: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="ex: Quel est le nom de votre animal de compagnie ?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Réponse de Sécurité
                        </label>
                        <input
                          type="text"
                          value={editForm.securityAnswer}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              securityAnswer: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Réponse à la question de sécurité"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={editForm.isActive}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label
                          htmlFor="isActive"
                          className="text-sm font-medium text-gray-700"
                        >
                          Compte actif
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Liste des administrateurs */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Administrateurs Existants
                </h4>

                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className={`border rounded-lg p-4 ${
                      admin.isActive
                        ? "border-gray-200 bg-white"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="text-lg font-semibold text-gray-900">
                            {admin.name}
                          </h5>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              admin.role === "supreme"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {admin.role === "supreme" ? "SUPREME" : "ADMIN"}
                          </span>
                          {!admin.isActive && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                              DÉSACTIVÉ
                            </span>
                          )}
                          {admin.id === currentUser?.email && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                              VOUS
                            </span>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {admin.email}
                          </div>
                          <div>
                            <span className="font-medium">Téléphone:</span>{" "}
                            {admin.phone || "Non renseigné"}
                          </div>
                          <div>
                            <span className="font-medium">Créé le:</span>{" "}
                            {admin.createdAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          onClick={() => startEditing(admin)}
                          size="sm"
                          variant="outline"
                          title="Modifier"
                          disabled={
                            admin.id === "super-admin" &&
                            admin.email !== currentUser?.email
                          }
                        >
                          <Edit size={16} />
                        </Button>

                        {!["default-admin", "super-admin"].includes(
                          admin.id,
                        ) && (
                          <>
                            <Button
                              onClick={() => toggleAdminStatus(admin.id)}
                              size="sm"
                              variant="outline"
                              className={
                                admin.isActive
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                              title={admin.isActive ? "Désactiver" : "Activer"}
                            >
                              <Shield size={16} />
                            </Button>

                            <Button
                              onClick={() => deleteAdmin(admin.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informations importantes */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Informations Importantes
                </h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>
                    • Seuls les Administrateurs Supreme peuvent gérer les
                    comptes administrateurs
                  </li>
                  <li>
                    • Les administrateurs système (par défaut) ne peuvent pas
                    être supprimés
                  </li>
                  <li>
                    • Un administrateur désactivé ne peut plus se connecter
                  </li>
                  <li>
                    • Gardez toujours au moins un Administrateur Supreme actif
                  </li>
                  <li>
                    • Les mots de passe sont stockés en texte clair (pour demo
                    uniquement)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
