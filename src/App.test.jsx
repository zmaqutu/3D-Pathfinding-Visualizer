import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// WebGL requires a browser/GPU; exercise the app shell independently in jsdom.
vi.mock('./components/World', () => ({
  default: () => <div data-testid="world" />,
}));

test('renders the visualizer and the portfolio credit', () => {
  render(<App />);
  expect(screen.getByTestId('world')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /made by zongo maqutu/i }))
    .toHaveAttribute('href', 'https://zongo-is.me/');
});
