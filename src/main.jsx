import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App.jsx';
import './index.css';
import theme from '../theme.js';
import Home from './pages/Home/Home.jsx';
import Movies from './pages/Movies/Movies.jsx';
import Series from './pages/Series/Series.jsx';
import Search from './pages/Search/Search.jsx';
import DetailPoster from './pages/DetailPoster/DetailPoster.jsx';
import { AuthProvider } from './services/context/AuthProvider.jsx';
import Protected from './components/Routes/Protected.jsx';
import Watchlist from './pages/Watchlist/Watchlist.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/movies",
        element: <Movies />
      },
      {
        path: "/shows",
        element: <Series />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/:type/:id",
        element: <DetailPoster />
      },
      {
        path: "/watchlist",
        element: (
          <Protected>
            <Watchlist />
          </Protected>
        ),
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
);