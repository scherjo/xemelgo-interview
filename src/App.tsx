import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator, Button, Text } from "@aws-amplify/ui-react";
import { AmplifyUser } from "@aws-amplify/ui";
import WorkTimeLogger from "./WorkTimeLogger";

function isManager(user: AmplifyUser | undefined): boolean {
  const groups = user?.getSignInUserSession()?.getAccessToken().payload["cognito:groups"];
  return Boolean(groups?.includes("managers"));
}

function App(): JSX.Element {
  return (
    <Authenticator
      className="App"
      hideSignUp={true}
    >
      {({ signOut, user }) => (
        <main>
          <Text>Hello {user?.username}</Text>
          <Text>Manager Permissions: {String(isManager(user))}</Text>
          {
            !!(user?.username) ? <WorkTimeLogger username={user.username}></WorkTimeLogger> : null
          }
          <Button variation="primary" onClick={signOut}>Sign Out</Button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
