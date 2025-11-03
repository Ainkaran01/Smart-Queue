import React from 'react';
import { Clock, Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'elegant' | 'minimal' | 'classic';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text = 'Loading...',
  fullScreen = true
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const variantStyles = {
    primary: {
      spinner: `animate-spin rounded-full border-b-2 border-primary-600`,
      text: 'text-gray-600'
    },
    elegant: {
      spinner: `animate-spin rounded-full border-2 border-primary-200 border-t-primary-600`,
      text: 'text-gray-700'
    },
    minimal: {
      spinner: `animate-pulse opacity-75`,
      text: 'text-gray-500'
    },
    classic: {
      spinner: `animate-spin rounded-full border-4 border-primary-100 border-l-primary-600 border-t-primary-600`,
      text: 'text-gray-600'
    }
  };

  const content = (
    <div className="text-center">
      {/* Primary Variant */}
      {variant === 'primary' && (
        <>
          <div className={`inline-block ${sizeClasses[size]} ${variantStyles.primary.spinner}`}></div>
          {text && <p className={`mt-4 ${variantStyles.primary.text}`}>{text}</p>}
        </>
      )}

      {/* Elegant Variant */}
      {variant === 'elegant' && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={`${sizeClasses[size]} ${variantStyles.elegant.spinner}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'} text-primary-600`} />
            </div>
          </div>
          {text && <p className={`mt-4 ${variantStyles.elegant.text}`}>{text}</p>}
        </div>
      )}

      {/* Minimal Variant */}
      {variant === 'minimal' && (
        <div className="flex flex-col items-center">
          <Loader className={`${sizeClasses[size]} text-primary-600 ${variantStyles.minimal.spinner}`} />
          {text && <p className={`mt-3 ${variantStyles.minimal.text}`}>{text}</p>}
        </div>
      )}

      {/* Classic Variant */}
      {variant === 'classic' && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={`${sizeClasses[size]} ${variantStyles.classic.spinner}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'} bg-primary-600 rounded-full`}></div>
            </div>
          </div>
          {text && <p className={`mt-4 ${variantStyles.classic.text}`}>{text}</p>}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};

// Additional specialized loading components
export const PageLoadingSpinner: React.FC = () => (
  <LoadingSpinner 
    size="lg" 
    variant="elegant" 
    text="Loading your dashboard..." 
  />
);

export const CardLoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner 
      size="md" 
      variant="minimal" 
      text="Loading content..." 
      fullScreen={false}
    />
  </div>
);

export const ButtonLoadingSpinner: React.FC = () => (
  <div className="inline-flex items-center">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    <span>Processing...</span>
  </div>
);

export const TableLoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner 
      size="md" 
      variant="primary" 
      text="Loading data..." 
      fullScreen={false}
    />
  </div>
);

export default LoadingSpinner;