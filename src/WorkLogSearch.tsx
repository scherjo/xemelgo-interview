import { Button, Flex, Heading, Text, TextField, View } from "@aws-amplify/ui-react";
import { FormEvent, useState } from "react";
import { getEmployeeID, getEmployeeUsername } from "./apiHelpers";
import { DATE_FORMAT_STR, dateTimeIsValid, matchesDateFormat } from "./utilities";
import WorkLogReport from "./WorkLogReport";

function WorkLogSearch(): JSX.Element {
  const [employeeID, setEmployeeID] = useState("");
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [workDate, setWorkDate] = useState("");

  const [submittedID, setSubmittedID] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [submittedWorkDate, setSubmittedWorkDate] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  async function submitWorkLogSearch(event: FormEvent): Promise<void> {
    event.preventDefault();
    let id: string;
    let username: string;
    if (employeeID === "") {
      username = employeeUsername;
      id = await getEmployeeID(username);
      if (id === "") {
        setSubmitErrorMessage(`Cannot find employee with username ${username}`);
        return;
      }
    } else {
      id = employeeID;
      username = await getEmployeeUsername(id);
      if (username === "") {
        setSubmitErrorMessage(`Cannot find employee with ID ${id}`);
        return;
      }
    }
    setSubmittedID(id);
    setSubmittedUsername(username);
    setSubmittedWorkDate(workDate);
    setSubmitErrorMessage("");
    
  }

  function resetFields(): void {
    setEmployeeID("");
    setEmployeeUsername("");
    setWorkDate("");
    setSubmitErrorMessage("");
  }

  function handleEmployeeIDOnChange(event: FormEvent): void {
    const id: string = (event.currentTarget as HTMLFormElement).value;
    setEmployeeID(id);
  }

  function handleEmployeeUsernameOnChange(event: FormEvent): void {
    const username: string = (event.currentTarget as HTMLFormElement).value;
    setEmployeeUsername(username);
  }

  function handleWorkDateOnChange(event: FormEvent): void {
    const date: string = (event.currentTarget as HTMLFormElement).value;
    setWorkDate(date);
  }

  function validateFields(): boolean {
    if (employeeID === "" && employeeUsername === "") {
      return false;
    }
    return matchesDateFormat(workDate) && dateTimeIsValid(workDate, DATE_FORMAT_STR);
  }

  return (
    <View margin="1rem">
      <Heading level={5}>Search Employee Work Log</Heading>
      <View as="form" margin="1rem 2rem" direction="column" onSubmit={submitWorkLogSearch} onReset={resetFields}>
        <Flex direction="row" alignItems="center">
          <TextField
            name="employeeID"
            placeholder="0123456789"
            label="Employee ID"
            variation="quiet"
            value={employeeID}
            onChange={handleEmployeeIDOnChange}
            isDisabled={employeeUsername !== ""}
            margin="1rem"
          />
          <Text>OR</Text>
          <TextField
            name="employeeUsername"
            placeholder="janedoe"
            label="Employee Username"
            variation="quiet"
            value={employeeUsername}
            onChange={handleEmployeeUsernameOnChange}
            isDisabled={employeeID !== ""}
            margin="1rem"
          />
        </Flex>
        <TextField
          name="workDate"
          placeholder="2023-01-01"
          label="Date"
          variation="quiet"
          value={workDate}
          onChange={handleWorkDateOnChange}
          margin="1rem"
        />
        <Flex direction="row" justifyContent="center">
          <Button type="reset" variation="primary">Reset</Button>
          <Button
            type="submit"
            variation="primary"
            isDisabled={!validateFields()}
          >
            Search
          </Button>
        </Flex>
        <Text
          opacity={submitErrorMessage === "" ? 0 : 1}
          variation="error"
        >
          {submitErrorMessage}
        </Text>
      </View>
      {
        submittedID === "" ? null :
        <View>
          <Heading level={4} margin="1rem 0">
            Displaying results for {submittedUsername} on {workDate}
          </Heading>
          <WorkLogReport
            employeeID={submittedID}
            employeeUsername={submittedUsername}
            workDate={submittedWorkDate}
          ></WorkLogReport>
        </View>
      }
    </View>
  );
}

export default WorkLogSearch;
