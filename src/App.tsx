import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator, Button, Flex, TabItem, Tabs, View, Heading } from "@aws-amplify/ui-react";
import { AmplifyUser } from "@aws-amplify/ui";
import WorkTimeLogger from "./WorkTimeLogger";
import WorkLogSearch from "./WorkLogSearch";

/**
 * Returns true if the given user is a manager, otherwise returns false.
 * 
 * @param user the user
 * @returns true if the user belongs to the 'managers' Cognito group, else false
 */
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
        <View margin="1rem">
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Heading level={4}>Hello {user!.username}!</Heading>
            <Button margin="1rem" variation="primary" onClick={signOut}>Sign Out</Button>
          </Flex>
          <Tabs>
            <TabItem title={user!.username}>
              <WorkTimeLogger username={user!.username!}></WorkTimeLogger>
            </TabItem>
            <TabItem title="Reports" isDisabled={!isManager(user)}>
              <WorkLogSearch></WorkLogSearch>
            </TabItem>
          </Tabs>
        </View>
      )}
    </Authenticator>
  );
}

export default App;
