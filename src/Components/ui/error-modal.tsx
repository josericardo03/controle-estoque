import { Modal } from "./modal";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string;
}

export function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  details,
}: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            {details && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  Detalhes do erro:
                </p>
                <p className="text-sm text-red-600 mt-1">{details}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Entendi
          </button>
        </div>
      </div>
    </Modal>
  );
}
