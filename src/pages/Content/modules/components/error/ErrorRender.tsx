import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export default function ErrorRender({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  return (
    <div id="tfc-fail-load" onClick={resetErrorBoundary}>
      {error.message}
    </div>
  );
}
