import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { QueryClient, QueryClientProvider } from 'react-query';

/*
  render app function
*/

const queryClient = new QueryClient();

export default function runApp(container: HTMLElement): void {
  ReactDOM.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
    container
  );
  console.log(
    'Tasks for Canvas: Check out the repo! https://github.com/jtcheng26/canvas-task-extension'
  );
}
