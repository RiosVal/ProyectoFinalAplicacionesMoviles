import axios from 'axios';
import { IonButton, IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './Tab1.css';

import { useAuth } from '../../components/AuthProvider';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

export default function Tab1() {
  const { user, isLoading, logout } = useAuth();
  const history = useHistory(); // Inicializa useHistory
  const userInfo: any = user ? {
    userFirstName: user.firstName,
    userToken: user.token
  } : null;
  
  const handleLogout = () => {
    logout(); // Llama a la función de logout del AuthProvider
    history.replace('/login'); // Redirige al usuario a la página de login
  };

  console.log(user);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Muestra el nombre de usuario de forma segura */}
          <IonTitle>Yo soy el usuario {userInfo.userFirstName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Muestra la información del usuario de forma segura */}
        {isLoading && <p>Cargando información del usuario...</p>}
        {!isLoading && user ? (
          <div>
            <p>Email: {user.email}</p>
            <p>Rol: {user.role}</p>
            {/* Puedes mostrar más información aquí si lo deseas */}
          </div>
        ) : (
          !isLoading && <p>Por favor, inicia sesión para ver tu información.</p>
        )}

        <ExploreContainer name="Tab 1 page" />

        {/* Botón de Logout */}
        <IonButton expand="block" onClick={handleLogout} className="ion-margin-top">
          Cerrar Sesión
        </IonButton>

      </IonContent>
    </IonPage>
  );
};
