import { AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';

function CustomDialog({ isOpen, onClose, onConfirm, title, message, type = 'alert', confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-yellow-500" />;
      case 'confirm':
        return <AlertCircle className="w-12 h-12 text-[#058ED9]" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'confirm':
        return 'bg-[#058ED9]/10';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconBackground()}`}>
              {getIcon()}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {title && (
            <h2 className="text-2xl font-bold text-[#03012C] mb-3">{title}</h2>
          )}

          <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>

          {type === 'confirm' ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-[#03012C] text-white font-semibold rounded-lg hover:bg-[#058ED9] transition"
              >
                {confirmText}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#03012C] text-white font-semibold rounded-lg hover:bg-[#058ED9] transition"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomDialog;
