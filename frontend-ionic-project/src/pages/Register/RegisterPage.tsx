// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonLoading, IonText, IonRouterLink } from '@ionic/react';
import { useAuth } from '../../components/AuthProvider';
import { useHistory } from 'react-router';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Asumiendo un campo de nombre
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ name, email, password }); // Envía todos los datos necesarios
      history.replace('/tabs/tab1'); // Redirige a la primera tab después del registro
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocurrió un error al registrar el usuario.');
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registrarse</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleRegister}>
          <IonItem>
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput
              type="text"
              value={name}
              onIonChange={(e) => setName(e.detail.value!)}
              required
            ></IonInput>
          </IonItem>
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
            {isLoading ? <IonLoading isOpen={isLoading} message="Registrando..." spinner="circles" /> : 'Registrarse'}
          </IonButton>
        </form>

        <IonText className="ion-text-center ion-padding-top">
          <p>¿Ya tienes una cuenta? <IonRouterLink routerLink="/login">Inicia sesión aquí</IonRouterLink></p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;