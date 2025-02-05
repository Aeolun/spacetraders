import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { app, appInitPromise } from './pixi-app';

export const Pixi = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    appInitPromise.then(() => {
      if (ref.current) {
        app.resizeTo = ref.current

        ref.current.appendChild(app.canvas)
      }
    });
  }, []);

  return <div ref={ref}></div>
}
