import { FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

export default function Toast({ toast, onClose }) {
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toast && (
        <div className={`toast toast--${toast.tone}`} key={toast.key}>
          {toast.tone === 'success' ? <FiCheckCircle /> : <FiInfo />}
          <span>{toast.message}</span>
          <button aria-label="Dismiss notification" onClick={onClose}>
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}
