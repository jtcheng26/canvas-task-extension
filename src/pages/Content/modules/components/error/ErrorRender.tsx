import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export default function ErrorRender({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  return <div onClick={resetErrorBoundary}>{error.message}</div>;
}
