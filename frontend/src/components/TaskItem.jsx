import React, { useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    titre: task.titre,
    description: task.description,
    status: task.status,
    assignedTo: task.assignedTo,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const visualizerRef = useRef(null);

  // Récupérer l'utilisateur connecté
  const { user } = useAuth();

  // Vérifier si l'utilisateur connecté est le propriétaire ou l'utilisateur assigné
  const isOwner = user && (task.userId === user.userId || task.assignedTo === user.userId);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      titre: task.titre,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo,
    });
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await api.updateTask(task.id, editForm);
      if (result.success) {
        onUpdate();
        setIsEditing(false);
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorMessages = result.errors.map(err => err.message).join(', ');
          setError(errorMessages);
        } else {
          setError(result.message || 'Erreur lors de la modification');
        }
      }
    } catch (error) {
      setError('Erreur lors de la modification');
      console.error('Erreur lors de la modification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await api.deleteTask(task.id);
        onDelete();
      } catch (error) {
        setError('Erreur lors de la suppression');
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.updateTaskStatus(task.id, newStatus);
      onUpdate();
    } catch (error) {
      setError('Erreur lors du changement de statut');
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_COURS': return '#ffc107';
      case 'TERMINER': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINER': return 'Terminé';
      default: return status;
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header avec statut */}
        <div className={`h-2 ${
          task.status === 'EN_COURS' ? 'bg-yellow-400' :
          task.status === 'TERMINER' ? 'bg-green-500' : 'bg-gray-400'
        }`} />

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              task.status === 'EN_COURS' ? 'bg-yellow-100 text-yellow-600' :
              task.status === 'TERMINER' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Modifier la tâche</h3>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre de la tâche
              </label>
              <input
                type="text"
                value={editForm.titre}
                onChange={(e) => setEditForm({...editForm, titre: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Entrez le titre de la tâche"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none"
                placeholder="Décrivez la tâche en détail"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="EN_COURS">En cours</option>
                <option value="TERMINER">Terminé</option>
                <option value="A_FAIRE">À faire</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sauvegarde...
                </div>
              ) : (
                'Sauvegarder'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
      {/* Header avec statut */}
      <div className={`h-2 ${
        task.status === 'EN_COURS' ? 'bg-yellow-400' :
        task.status === 'TERMINER' ? 'bg-green-500' : 'bg-gray-400'
      }`} />

      <div className="p-6">
        {/* Titre et icône */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              task.status === 'EN_COURS' ? 'bg-yellow-100 text-yellow-600' :
              task.status === 'TERMINER' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {task.status === 'EN_COURS' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : task.status === 'TERMINER' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">
                {task.titre}
              </h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                task.status === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'TERMINER' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(task.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          {task.description}
        </p>

        {/* Image */}
        {task.imageUrl && (
          <div className="mb-6">
            <img
              src={`http://localhost:3080${task.imageUrl}`}
              alt="Image de la tâche"
              className="w-full h-48 object-cover rounded-lg shadow-sm border border-gray-200"
            />
          </div>
        )}

        {/* Audio */}
        {task.audioUrl && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-sm font-semibold text-purple-700">Enregistrement audio</span>
            </div>
            <audio controls className="w-full">
              <source src={`http://localhost:3080${task.audioUrl}`} type="audio/wav" />
              Votre navigateur ne supporte pas l'audio.
            </audio>
          </div>
        )}

        {/* Informations utilisateur */}
        <div className="space-y-3 mb-6">
          {task.user && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Créée par</span>
                <div className="text-sm text-gray-600">
                  {task.user.nom} <span className="text-gray-400">({task.user.email})</span>
                </div>
              </div>
            </div>
          )}

          {task.assignedUser && (
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div className="flex-1">
                <span className="text-sm font-medium text-blue-700">Assignée à</span>
                <div className="text-sm text-blue-600">
                  {task.assignedUser.nom} <span className="text-blue-400">({task.assignedUser.email})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="EN_COURS">En cours</option>
              <option value="TERMINER">Terminé</option>
              <option value="A_FAIRE">À faire</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {isOwner ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              </>
            ) : (
              <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                Lecture seule
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
