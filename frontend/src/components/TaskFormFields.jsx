import React from 'react';

const TaskFormFields = ({
  formData,
  fieldErrors,
  touched,
  users,
  onChange
}) => {
  return (
    <>
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
            onChange={onChange}
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
            onChange={onChange}
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

      {/* Statut */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Statut initial
        </label>
        <div className="relative">
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
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
            onChange={onChange}
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
    </>
  );
};

export default TaskFormFields;