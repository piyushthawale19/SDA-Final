import React from "react";

const ConfirmDialog = ({ open, title, description, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <i className="ri-alert-line text-xl"></i>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400/40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400/40"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
