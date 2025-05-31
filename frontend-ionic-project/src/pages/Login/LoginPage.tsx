import React, { useState } from 'react';
import { IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonLoading,
    IonText,
    IonRouterLink } from '@ionic/react';
import { useAuth } from '../../components/AuthProvider';
import { useHistory } from 'react-router';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      history.replace('/tabs/tab1'); // Redirige a la primera tab después del login
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocurrió un error al iniciar sesión.');
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleLogin}>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              required
            ></IonInput>
          </IonItem>

          {error && <IonText color="danger"><p>{error}</p></IonText>}

          <IonButton expand="block" type="submit" className="ion-margin-top" disabled={isLoading}>
            {isLoading ? <IonLoading isOpen={isLoading} message="Iniciando..." spinner="circles" /> : 'Iniciar Sesión'}
          </IonButton>
        </form>

        <IonText className="ion-text-center ion-padding-top">
          <p>¿No tienes una cuenta? <IonRouterLink routerLink="/register">Regístrate aquí</IonRouterLink></p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;