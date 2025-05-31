import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1/Tab1';
import Tab2 from './pages/Tab2/Tab2';
import Tab3 from './pages/Tab3/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';

setupIonicReact();


// Componente para las rutas protegidas (con tabs)
const AuthenticatedRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Muestra un loader mientras se verifica el usuario (útil al recargar la página)
  if (isLoading) {
    return (
      <IonApp>
        <IonRouterOutlet id="main-content">
          {/* Aquí podrías poner un componente de "Splash Screen" o "Loading" */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Cargando...
          </div>
        </IonRouterOutlet>
      </IonApp>
    );
  }

  // Si no hay usuario, redirige a la página de login
  if (!user) {
    return <Redirect to="/login" />;
  }

  // Si hay usuario, muestra las tabs
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/tab1">
          <Tab1 />
        </Route>
        <Route exact path="/tabs/tab2">
          <Tab2 />
        </Route>
        <Route path="/tabs/tab3">
          <Tab3 />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/tab1" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/tab1">
          <IonIcon aria-hidden="true" icon={triangle} />
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/tab2">
          <IonIcon aria-hidden="true" icon={ellipse} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/tab3">
          <IonIcon aria-hidden="true" icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AuthProvider> {/* Envuelve toda la aplicación con el AuthProvider */}
        <IonRouterOutlet id="main-content">
          {/* Rutas de autenticación (no protegidas) */}
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>

          {/* Rutas protegidas (componente que envuelve las tabs) */}
          <Route path="/tabs">
            <AuthenticatedRoutes />
          </Route>

          {/* Redirección por defecto */}
          <Route exact path="/">
            <Redirect to="/tabs/tab1" /> {/* Intentará ir a tabs si está logeado, sino será redirigido */}
          </Route>
        </IonRouterOutlet>
      </AuthProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
