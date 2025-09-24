/**
 * Composant ImageUploadSection - Section d'upload d'images pour les tâches
 *
 * Ce composant gère l'upload d'images dans le formulaire de création de tâches :
 * - Validation du type de fichier (images uniquement)
 * - Validation de la taille (max 5MB)
 * - Aperçu de l'image sélectionnée
 * - Possibilité de supprimer l'image
 *
 * @param {Object} props - Les propriétés du composant
 * @param {File} [props.selectedImage] - Fichier image sélectionné
 * @param {string} [props.imagePreview] - URL de données pour l'aperçu
 * @param {Function} props.onImageChange - Fonction appelée avec (file, error, preview)
 * @param {Function} props.onRemoveImage - Fonction appelée pour supprimer l'image
 */
import React from 'react';

const ImageUploadSection = ({
  selectedImage,
  imagePreview,
  onImageChange,
  onRemoveImage,
  error
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        onImageChange(null, 'Veuillez sélectionner un fichier image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onImageChange(null, 'L\'image ne doit pas dépasser 5MB');
        return;
      }

      onImageChange(file);

      // Créer l'aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(file, null, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Image (optionnel)
      </label>
      <div className="space-y-4">
        {/* Zone de drop ou sélection */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200 bg-gray-50 hover:bg-green-50">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 font-medium">
              Cliquez pour sélectionner une image
            </p>
            <p className="text-gray-400 text-sm mt-1">
              PNG, JPG, GIF jusqu'à 5MB
            </p>
          </div>
        </div>

        {/* Aperçu de l'image */}
        {imagePreview && (
          <div className="relative bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Aperçu de l'image</h4>
              <button
                type="button"
                onClick={onRemoveImage}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-full max-h-64 object-cover rounded-lg shadow-sm"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {selectedImage?.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;