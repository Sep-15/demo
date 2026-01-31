// File: src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { RouterProvider } from 'react-router-dom';
import Router from './routes/Router.jsx';
import { FollowProvider } from './contexts/FollowContext.jsx';
import { UserSidebarProvider } from './contexts/UserSidebarContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import { ConversationProvider } from './contexts/GroupContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <ConversationProvider>
          <FollowProvider>
            <UserSidebarProvider>
              <RouterProvider router={Router} />
              <Toaster position="top-center" />
            </UserSidebarProvider>
          </FollowProvider>
        </ConversationProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
