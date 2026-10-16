import { useState } from 'react';
import { TbMountain } from 'react-icons/tb';
import './SmartImage.css';

/** Image with a fade-in and an illustrated fallback if the photo can't load. */
export default function SmartImage({ src, alt, className = '', label, eager = false }) {
  const [state, setState] = useState('loading');

  return (
    <div className={`smart-img is-${state} ${className}`}>
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
        />
      )}
      {state === 'error' && (
        <div className="smart-img__fallback" role="img" aria-label={alt}>
          <TbMountain aria-hidden="true" />
          {label && <span>{label}</span>}
        </div>
      )}
    </div>
  );
}
