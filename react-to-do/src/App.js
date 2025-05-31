import React from 'react';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoList from './pages/TodoList/TodoList';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="app">
          <Router>
            <Routes>
              <Route path="/" element={<TodoList />} />
            </Routes>
          </Router>
        </div>
    </AppProvider>
  );
}

export default App;
