/**
 * Composant TaskFilters - Filtres interactifs pour les tâches
 *
 * Ce composant fournit des boutons de filtrage pour afficher :
 * - Toutes les tâches
 * - Tâches créées par l'utilisateur connecté
 * - Tâches assignées à l'utilisateur connecté
 *
 * Met à jour dynamiquement le compteur de tâches affichées.
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.activeFilter - Filtre actuellement actif ('all', 'created', 'assigned')
 * @param {Function} props.onFilterChange - Fonction appelée lors du changement de filtre
 * @param {number} props.taskCount - Nombre de tâches affichées avec le filtre actuel
 * @param {string} [props.className=''] - Classes CSS additionnelles
 */
import React from 'react';

const TaskFilters = ({
  activeFilter,
  onFilterChange,
  taskCount,
  className = ''
}) => {
  const filters = [
    {
      key: 'all',
      label: 'Toutes les tâches',
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      color: 'blue'
    },
    {
      key: 'created',
      label: 'Créées par moi',
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'green'
    },
    {
      key: 'assigned',
      label: 'Assignées à moi',
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'purple'
    }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtrer les tâches</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {taskCount} tâche{taskCount > 1 ? 's' : ''} trouvée{taskCount > 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeFilter === filter.key
                ? `bg-${filter.color}-600 text-white shadow-lg`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilters;