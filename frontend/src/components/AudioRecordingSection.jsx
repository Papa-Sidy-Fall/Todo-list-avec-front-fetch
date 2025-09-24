/**
 * Composant AudioRecordingSection - Section d'enregistrement audio pour les tâches
 *
 * Ce composant permet d'enregistrer et gérer des notes audio avec une limite de temps :
 * - Contrôles d'enregistrement (démarrer/arrêter)
 * - Limite automatique de 30 secondes maximum par enregistrement
 * - Compteur de temps en temps réel (format MM:SS)
 * - Barre de progression visuelle pendant l'enregistrement
 * - Avertissement 5 secondes avant la fin automatique
 * - Indicateur visuel d'enregistrement en cours (point rouge animé)
 * - Lecteur audio intégré pour l'aperçu avec durée affichée
 * - Possibilité de supprimer l'enregistrement
 *
 * Fonctionnalités techniques :
 * - Utilise l'API MediaRecorder du navigateur
 * - Timer automatique avec setInterval (1 seconde)
 * - Arrêt forcé après 30 secondes
 * - Nettoyage automatique des timers
 * - Gestion d'état réactive du temps écoulé
 *
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.isRecording - Si l'enregistrement est en cours
 * @param {Blob} [props.audioBlob] - Blob audio enregistré
 * @param {string} [props.audioUrl] - URL de l'audio pour le lecteur
 * @param {Function} props.onStartRecording - Fonction pour démarrer l'enregistrement
 * @param {Function} props.onStopRecording - Fonction pour arrêter l'enregistrement (appelée automatiquement après 30s)
 * @param {Function} props.onRemoveAudio - Fonction pour supprimer l'audio
 */
import React, { useState, useEffect, useRef } from 'react';

const AudioRecordingSection = ({
  isRecording,
  audioBlob,
  audioUrl,
  onStartRecording,
  onStopRecording,
  onRemoveAudio
}) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const MAX_RECORDING_TIME = 30; // 30 secondes maximum

  // Démarre le timer quand l'enregistrement commence
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Arrêter automatiquement après 30 secondes
          if (newTime >= MAX_RECORDING_TIME) {
            onStopRecording();
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);
    } else {
      // Nettoyer le timer quand l'enregistrement s'arrête
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }

    // Nettoyer le timer au démontage du composant
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, onStopRecording]);

  // Formater le temps en MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer le pourcentage de progression (pour la barre de progression)
  const progressPercentage = (recordingTime / MAX_RECORDING_TIME) * 100;

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Enregistrement audio (optionnel) - Max 30 secondes
      </label>
      <div className="space-y-4">
        {/* Contrôles d'enregistrement */}
        <div className="flex items-center space-x-4">
          {!isRecording ? (
            <button
              type="button"
              onClick={onStartRecording}
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
              onClick={onStopRecording}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Arrêter l'enregistrement
            </button>
          )}

          {isRecording && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                <span className="font-medium">Enregistrement en cours...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Barre de progression pendant l'enregistrement */}
        {isRecording && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Message d'avertissement quand on approche de la limite */}
        {isRecording && recordingTime >= 25 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-sm">
            ⚠️ L'enregistrement s'arrêtera automatiquement dans {MAX_RECORDING_TIME - recordingTime} seconde{MAX_RECORDING_TIME - recordingTime > 1 ? 's' : ''}.
          </div>
        )}

        {/* Lecteur audio */}
        {audioBlob && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                Aperçu de l'audio ({formatTime(recordingTime)})
              </h4>
              <button
                type="button"
                onClick={onRemoveAudio}
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
  );
};

export default AudioRecordingSection;