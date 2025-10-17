import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

function Toast({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-white" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-white" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-white" />;
      default:
        return <AlertCircle className="w-6 h-6 text-white" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#57CC99]';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div className={`fixed top-6 right-6 ${getBgColor()} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-slide-down max-w-md`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Toast;
