import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import ImageUploadSection from './ImageUploadSection';
import AudioRecordingSection from './AudioRecordingSection';
import TaskFormFields from './TaskFormFields';

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
          <TaskFormFields
            formData={formData}
            fieldErrors={fieldErrors}
            touched={touched}
            users={users}
            onChange={handleChange}
          />

          <ImageUploadSection
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            onImageChange={(file, error, preview) => {
              if (error) {
                setError(error);
                return;
              }
              setSelectedImage(file);
              setImagePreview(preview);
              setError('');
            }}
            onRemoveImage={() => {
              setSelectedImage(null);
              setImagePreview(null);
            }}
          />

          <AudioRecordingSection
            isRecording={isRecording}
            audioBlob={audioBlob}
            audioUrl={audioUrl}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onRemoveAudio={removeAudio}
          />
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
