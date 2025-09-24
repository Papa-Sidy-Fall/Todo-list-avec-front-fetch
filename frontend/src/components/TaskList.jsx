import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import Pagination from './Pagination';

const TaskList = ({ onLogout }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // États synchronisés avec l'URL
  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    return page;
  });
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const limit = parseInt(searchParams.get('limit')) || 10;
    return limit;
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // État pour contrôler la visibilité du formulaire (caché par défaut)
  const [showTaskForm, setShowTaskForm] = useState(false);

  // État pour le filtre actif synchronisé avec l'URL
  const [activeFilter, setActiveFilter] = useState(() => {
    const filter = searchParams.get('filter') || 'all';
    return filter;
  });

  // Récupérer l'utilisateur connecté
  const { user } = useAuth();

  const fetchTasks = async (page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      console.log('Fetching tasks:', { page, limit });
      const response = await api.getTasks(page, limit);
      console.log('Tasks response:', response);
      setTasks(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des tâches');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Synchroniser l'état avec l'URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage !== 1) params.set('page', currentPage.toString());
    if (itemsPerPage !== 10) params.set('limit', itemsPerPage.toString());
    if (activeFilter !== 'all') params.set('filter', activeFilter);

    setSearchParams(params, { replace: true });
  }, [currentPage, itemsPerPage, activeFilter, setSearchParams]);

  useEffect(() => {
    fetchTasks(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleTaskCreated = () => {
    console.log('Task created, refreshing tasks...');
    fetchTasks(currentPage, itemsPerPage);
    setShowTaskForm(false); // Cacher le formulaire après création
  };

  const handleTaskUpdated = () => {
    fetchTasks(currentPage, itemsPerPage);
  };

  const handleTaskDeleted = () => {
    fetchTasks(currentPage, itemsPerPage);
  };

  const getStatusCounts = () => {
    const counts = {
      EN_COURS: 0,
      TERMINER: 0,
    };

    tasks.forEach(task => {
      if (counts.hasOwnProperty(task.status)) {
        counts[task.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Fonction pour filtrer les tâches
  const getFilteredTasks = () => {
    if (!user) return tasks;

    switch (activeFilter) {
      case 'created':
        return tasks.filter(task => task.userId === user.userId);
      case 'assigned':
        return tasks.filter(task => task.assignedTo === user.userId && task.userId !== user.userId);
      case 'all':
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Recalculer les statistiques basées sur les tâches filtrées
  const getFilteredStatusCounts = () => {
    const counts = {
      EN_COURS: 0,
      TERMINER: 0,
    };

    filteredTasks.forEach(task => {
      if (counts.hasOwnProperty(task.status)) {
        counts[task.status]++;
      }
    });

    return counts;
  };

  const filteredStatusCounts = getFilteredStatusCounts();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div>Chargement des tâches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Gestionnaire de Tâches
              </h1>
              {user && (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Connecté en tant que : <span className="font-semibold text-gray-800">{user.nom}</span>
                    <span className="text-gray-400 ml-1">({user.email})</span>
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filtrer les tâches</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''} trouvée{filteredTasks.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFilterChange('all')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Toutes les tâches
            </button>
            <button
              onClick={() => handleFilterChange('created')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeFilter === 'created'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Créées par moi
            </button>
            <button
              onClick={() => handleFilterChange('assigned')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeFilter === 'assigned'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Assignées à moi
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">
                  {filteredStatusCounts.EN_COURS}
                </div>
                <div className="text-yellow-100 font-medium">En cours</div>
              </div>
              <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">
                  {filteredStatusCounts.TERMINER}
                </div>
                <div className="text-green-100 font-medium">Terminé</div>
              </div>
              <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-lg">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Bouton Nouvelle tâche */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className={`px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 ${
              showTaskForm
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {showTaskForm ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Fermer
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle tâche
              </>
            )}
          </button>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Créer une nouvelle tâche
              </h3>
            </div>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>
        )}

        {/* Tasks Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center mb-4 lg:mb-0">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">
                Tâches - Page {currentPage}
              </h2>
            </div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''} affichée{filteredTasks.length > 1 ? 's' : ''}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {activeFilter === 'all' && totalItems === 0
                  ? "Aucune tâche trouvée"
                  : activeFilter === 'created'
                  ? "Vous n'avez créé aucune tâche"
                  : activeFilter === 'assigned'
                  ? "Aucune tâche ne vous est assignée"
                  : "Aucune tâche trouvée avec ce filtre"
                }
              </h3>
              <p className="text-gray-500 mb-6">
                {activeFilter === 'all' && totalItems === 0
                  ? "Créez votre première tâche pour commencer !"
                  : activeFilter === 'created'
                  ? "Créez votre première tâche pour la voir apparaître ici."
                  : activeFilter === 'assigned'
                  ? "Les tâches qui vous sont assignées apparaîtront ici."
                  : "Essayez de changer de filtre pour voir d'autres tâches."
                }
              </p>
              {activeFilter === 'all' && totalItems === 0 && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Créer ma première tâche
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleTaskUpdated}
                  onDelete={handleTaskDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskList;
