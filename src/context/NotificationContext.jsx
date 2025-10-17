import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';
import CustomDialog from '../components/CustomDialog';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);

  const showToast = useCallback((message, type = 'error', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showDialog = useCallback((config) => {
    return new Promise((resolve) => {
      setDialog({
        ...config,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onClose: () => {
          setDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  const showError = useCallback((message) => {
    showToast(message, 'error');
  }, [showToast]);

  const showSuccess = useCallback((message) => {
    showToast(message, 'success');
  }, [showToast]);

  const showWarning = useCallback((message) => {
    showToast(message, 'warning');
  }, [showToast]);

  const confirm = useCallback(async (message, title = 'Confirmação') => {
    return showDialog({
      type: 'confirm',
      title,
      message,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar'
    });
  }, [showDialog]);

  return (
    <NotificationContext.Provider
      value={{
        showToast,
        showError,
        showSuccess,
        showWarning,
        showDialog,
        confirm
      }}
    >
      {children}

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {dialog && (
        <CustomDialog
          isOpen={true}
          type={dialog.type}
          title={dialog.title}
          message={dialog.message}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          onConfirm={dialog.onConfirm}
          onClose={dialog.onClose}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
