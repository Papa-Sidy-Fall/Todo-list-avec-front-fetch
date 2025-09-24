import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    status: 'EN_COURS',
    assignedTo: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const visualizerRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await api.getUsers();
        setUsers(userList);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fonction de validation
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'titre':
        if (!value.trim()) {
          errors.titre = 'Le titre est obligatoire';
        } else if (value.trim().length < 3) {
          errors.titre = 'Le titre doit contenir au moins 3 caractères';
        } else if (value.trim().length > 100) {
          errors.titre = 'Le titre ne peut pas dépasser 100 caractères';
        }
        break;

      case 'description':
        // Description optionnelle, mais si remplie, vérifier la longueur maximale
        if (value.trim() && value.trim().length > 1000) {
          errors.description = 'La description ne peut pas dépasser 1000 caractères';
        }
        break;

      case 'status':
        // Statut optionnel, mais si fourni, vérifier la validité
        if (value && !['EN_COURS', 'TERMINER', 'A_FAIRE'].includes(value)) {
          errors.status = 'Statut invalide';
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'assignedTo' && value ? parseInt(value, 10) : value;

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    // Validation en temps réel
    const fieldErrors = validateField(name, processedValue);
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || ''
    }));

    // Marquer le champ comme touché
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setSelectedImage(file);
      setError('');

      // Créer l'aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Arrêter tous les tracks du stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setError('Erreur lors de l\'accès au microphone');
      console.error('Erreur d\'enregistrement:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  // Validation complète du formulaire
  const validateForm = () => {
    const errors = {};

    // Validation du titre (seul champ obligatoire)
    if (!formData.titre.trim()) {
      errors.titre = 'Le titre est obligatoire';
    } else if (formData.titre.trim().length < 3) {
      errors.titre = 'Le titre doit contenir au moins 3 caractères';
    } else if (formData.titre.trim().length > 100) {
      errors.titre = 'Le titre ne peut pas dépasser 100 caractères';
    }

    // Description et statut sont optionnels, mais vérifier s'ils ont des erreurs
    if (formData.description.trim() && formData.description.trim().length > 1000) {
      errors.description = 'La description ne peut pas dépasser 1000 caractères';
    }

    if (formData.status && !['EN_COURS', 'TERMINER', 'A_FAIRE'].includes(formData.status)) {
      errors.status = 'Statut invalide';
    }

    setFieldErrors(errors);
    setTouched({
      titre: true,
      description: true,
      status: true,
      assignedTo: true
    });

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation du formulaire
    if (!validateForm()) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);

    try {
      // Créer FormData pour l'upload multipart
      const formDataToSend = new FormData();

      // Ajouter les champs texte
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      if (formData.assignedTo && formData.assignedTo !== '') {
        formDataToSend.append('assignedTo', formData.assignedTo.toString());
      }

      // Ajouter l'image si elle existe
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      // Ajouter l'audio si il existe
      if (audioBlob) {
        formDataToSend.append('audio', audioBlob, 'audio.wav');
      }

      await api.createTask(formDataToSend);
      onTaskCreated();

      // Reset du formulaire
      setFormData({
        titre: '',
        description: '',
        status: 'EN_COURS',
        assignedTo: '',
      });
      setSelectedImage(null);
      setImagePreview(null);
      setAudioBlob(null);
      setAudioUrl(null);
      setFieldErrors({});
      setTouched({});
    } catch (error) {
      setError(error.message || 'Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center shadow-lg">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titre de la tâche <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12 ${
                  fieldErrors.titre && touched.titre
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Entrez le titre de votre tâche"
              />
              <svg className={`w-5 h-5 absolute left-4 top-3.5 ${
                fieldErrors.titre && touched.titre ? 'text-red-400' : 'text-gray-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            {fieldErrors.titre && touched.titre && (
              <div className="text-red-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.titre}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12 resize-none ${
                  fieldErrors.description && touched.description
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Décrivez en détail votre tâche..."
              />
              <svg className={`w-5 h-5 absolute left-4 top-3.5 ${
                fieldErrors.description && touched.description ? 'text-red-400' : 'text-gray-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            {fieldErrors.description && touched.description && (
              <div className="text-red-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.description}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {formData.description.length}/1000 caractères
            </div>
          </div>

          {/* Image Upload */}
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
                      onClick={removeImage}
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

          {/* Audio Recording */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enregistrement audio (optionnel)
            </label>
            <div className="space-y-4">
              {/* Contrôles d'enregistrement */}
              <div className="flex items-center space-x-4">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    Commencer l'enregistrement
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    Arrêter l'enregistrement
                  </button>
                )}

                {isRecording && (
                  <div className="flex items-center text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                    Enregistrement en cours...
                  </div>
                )}
              </div>

              {/* Visualiseur audio */}
              {audioBlob && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Aperçu de l'audio</h4>
                    <button
                      type="button"
                      onClick={removeAudio}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/wav" />
                    Votre navigateur ne supporte pas l'audio.
                  </audio>
                </div>
              )}
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Statut initial
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12 appearance-none ${
                  fieldErrors.status && touched.status
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              >
                <option value="EN_COURS">En cours</option>
                <option value="TERMINER">Terminé</option>
                <option value="A_FAIRE">À faire</option>
              </select>
              <svg className={`w-5 h-5 absolute left-4 top-3.5 ${
                fieldErrors.status && touched.status ? 'text-red-400' : 'text-gray-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg className="w-5 h-5 text-gray-400 absolute right-4 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {fieldErrors.status && touched.status && (
              <div className="text-red-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.status}
              </div>
            )}
          </div>

          {/* Assigner à */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assigner à
            </label>
            <div className="relative">
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12 appearance-none"
              >
                <option value="">Aucun (moi-même)</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.nom} ({user.email})</option>
                ))}
              </select>
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <svg className="w-5 h-5 text-gray-400 absolute right-4 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Indicateur de validation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {Object.keys(fieldErrors).length === 0 && touched.titre ? (
              <div className="flex items-center text-green-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Formulaire valide
              </div>
            ) : (
              <div className="flex items-center text-gray-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Remplissez tous les champs requis
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 transform shadow-lg ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer la tâche
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
