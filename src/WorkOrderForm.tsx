import { View, Flex, Text, TextField, Button, Heading } from "@aws-amplify/ui-react";
import { FormEvent, SetStateAction, useState } from "react";
import { addWorkOrder } from "./apiHelpers";
import {
  DATETIME_FORMAT_STR,
  dateTimeIsValid,
  dateTimeToDate,
  getFormEntryString,
  matchesDateTimeFormat,
  matchesOrderNumberFormat
} from "./utilities";

interface WorkOrderFormProps {
  employeeID: string
}

// Component representing the form for logging a work order.
function WorkOrderForm(props: WorkOrderFormProps): JSX.Element {
  const [orderNumErrorMessage, setOrderNumErrorMessage] = useState("");
  const [startTimeErrorMessage, setStartTimeErrorMessage] = useState("");
  const [endTimeErrorMessage, setEndTimeErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  function handleFormReset(event: FormEvent): void {
    (event.target as HTMLFormElement).reset();
    setOrderNumErrorMessage("");
    setStartTimeErrorMessage("");
    setEndTimeErrorMessage("");
    setSubmitErrorMessage("");
  }

  async function submitWorkOrderInfo(event: FormEvent): Promise<void> {
    event.preventDefault();

    const form: FormData = new FormData(event.target as HTMLFormElement);
    const orderNum: string = getFormEntryString(form, "orderNum");
    const startTime: string = getFormEntryString(form, "startTime");
    const endTime: string = getFormEntryString(form, "endTime");

    if (!validateWorkOrderInfo(orderNum, startTime, endTime)) {
      return;
    }

    const result: string = await addWorkOrder(props.employeeID, orderNum, startTime, endTime);
    setSubmitErrorMessage(result);
    if (result === "") {
      (event.target as HTMLFormElement).reset();
    }
  }

  function validateWorkOrderInfo(orderNum: string, startTime: string, endTime: string): boolean {
    const orderNumIsValid: boolean = validateOrderNum(orderNum);
    const startTimeIsValid: boolean = validateStartTime(startTime);
    const endTimeIsValid: boolean = validateEndTime(endTime);

    if (!orderNumIsValid || !startTimeIsValid || !endTimeIsValid) {
      return false;
    }

    if (dateTimeToDate(startTime, DATETIME_FORMAT_STR) > dateTimeToDate(endTime, DATETIME_FORMAT_STR)) {
      setEndTimeErrorMessage("End time must be on or after start time");
      return false;
    }

    return true;
  }

  function validateOrderNum(orderNum: string): boolean {
    if (orderNum.length == 0) {
      setOrderNumErrorMessage("Order number cannot be empty");
      return false;
    }
    if (!matchesOrderNumberFormat(orderNum)) {
      setOrderNumErrorMessage("Order number must consist only of alphanumeric characters");
      return false;
    }
    setOrderNumErrorMessage("");
    return true;
  }

  function validateStartTime(startTime: string): boolean {
    return validateTime(startTime, setStartTimeErrorMessage, "Start time");
  }

  function validateEndTime(endTime: string): boolean {
    return validateTime(endTime, setEndTimeErrorMessage, "End time");
  }

  function validateTime(
      time: string,
      setErrorMessage: (value: SetStateAction<string>) => void,
      name: string): boolean {
    if (time.length == 0) {
      setErrorMessage(`${name} cannot be empty`);
      return false;
    }
    if (!matchesDateTimeFormat(time)) {
      setErrorMessage(`${name} must be of the form ${DATETIME_FORMAT_STR}`);
      return false;
    }
    if (!dateTimeIsValid(time, DATETIME_FORMAT_STR)) {
      setErrorMessage(`${name} must be a valid time`);
      return false;
    }
    setErrorMessage("");
    return true;
  }

  return (
    <View margin="1rem">
      <Heading level={5}>Log Work Order</Heading>
      <View as="form" margin="1rem 2rem" onSubmit={submitWorkOrderInfo} onReset={handleFormReset}>
        <Flex direction="column" justifyContent="center">
          <TextField
            name="orderNum"
            placeholder="0123456789"
            label="Order Number"
            variation="quiet"
            hasError={orderNumErrorMessage !== ""}
            errorMessage={orderNumErrorMessage}
            onChange={(event) => validateOrderNum(event.currentTarget.value)}
          />
          <TextField
            name="startTime"
            placeholder="2023-01-01 14:30:00"
            label="Job Start Time"
            variation="quiet"
            hasError={startTimeErrorMessage !== ""}
            errorMessage={startTimeErrorMessage}
            onChange={(event) => validateStartTime(event.currentTarget.value)}
          />
          <TextField
            name="endTime"
            placeholder="2023-01-01 14:30:00"
            label="Job End Time"
            variation="quiet"
            hasError={endTimeErrorMessage !== ""}
            errorMessage={endTimeErrorMessage}
            onChange={(event) => validateEndTime(event.currentTarget.value)}
          />
          <Flex direction="row" justifyContent="center">
            <Button type="reset" variation="primary">Reset</Button>
            <Button type="submit" variation="primary">Submit</Button>
          </Flex>
          <Text
            opacity={submitErrorMessage === "" ? 0 : 1}
            variation="error"
          >
            {submitErrorMessage}
          </Text>
        </Flex>
      </View>
    </View>
  );
}

export default WorkOrderForm;
