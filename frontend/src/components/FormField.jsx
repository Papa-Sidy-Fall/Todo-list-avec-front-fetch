/**
 * Composant FormField - Champ de formulaire réutilisable avec icône et validation
 *
 * Ce composant fournit un champ de formulaire standardisé avec :
 * - Icône personnalisable
 * - Gestion des erreurs
 * - Styles cohérents
 * - Support des attributs HTML standards
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.label - Le label du champ
 * @param {string} [props.type='text'] - Le type du champ (text, email, password, etc.)
 * @param {string} props.name - Le nom du champ (pour les formulaires)
 * @param {string} props.value - La valeur du champ
 * @param {Function} props.onChange - Fonction appelée lors du changement de valeur
 * @param {string} [props.placeholder] - Texte d'aide affiché dans le champ
 * @param {string} [props.error] - Message d'erreur à afficher
 * @param {Function} [props.icon] - Fonction retournant l'icône SVG à afficher
 * @param {boolean} [props.required=false] - Si le champ est obligatoire
 * @param {string} [props.className=''] - Classes CSS additionnelles
 */
import React from 'react';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        {Icon && (
          <div className="w-5 h-5 text-gray-400 absolute left-4 top-3.5">
            <Icon />
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;