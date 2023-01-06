import React from 'react';
import './App.css';
import { Authenticator } from "@aws-amplify/ui-react";
import { AmplifyUser } from '@aws-amplify/ui';

function isManager(user: AmplifyUser | undefined): boolean {
  const groups = user?.getSignInUserSession()?.getAccessToken().payload['cognito:groups'];
  return Boolean(groups?.includes('managers'));
}

function App() {
  return (
    <Authenticator
      className="App"
      hideSignUp={true}
    >
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <h1>Manager Permissions: {String(isManager(user))}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
