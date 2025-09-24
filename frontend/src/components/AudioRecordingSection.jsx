import React from 'react';

const AudioRecordingSection = ({
  isRecording,
  audioBlob,
  audioUrl,
  onStartRecording,
  onStopRecording,
  onRemoveAudio
}) => {
  return (
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