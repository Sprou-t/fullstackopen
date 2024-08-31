import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Polyfill for requestSubmit
HTMLFormElement.prototype.requestSubmit = HTMLFormElement.prototype.submit;

afterEach(() => {
  cleanup();
});
