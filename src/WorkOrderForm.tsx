import { View, Flex, Text, TextField, Button } from "@aws-amplify/ui-react";
import moment from "moment";
import { FormEvent, SetStateAction, useState } from "react";
import { addWorkOrder } from "./apiHelpers";

interface WorkOrderFormProps {
  employeeID: string
}

function matchesDateTimeFormat(dateTime: string): boolean {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTime);
}

function getFormEntryString(form: FormData, name: string): string {
  return form.get(name) === null ? "" : form.get(name) as string;
}

function WorkOrderForm(props: WorkOrderFormProps): JSX.Element {
  const [orderNumErrorMessage, setOrderNumErrorMessage] = useState("");
  const [startTimeErrorMessage, setStartTimeErrorMessage] = useState("");
  const [endTimeErrorMessage, setEndTimeErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  
  const dateTimeFormat: string = "YYYY-MM-DD HH:mm:ss";

  function handleFormReset(event: FormEvent): void {
    (event.target as HTMLFormElement).reset();
    setOrderNumErrorMessage("");
    setStartTimeErrorMessage("");
    setEndTimeErrorMessage("");
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

    if (moment(startTime, dateTimeFormat).toDate() > moment(endTime, dateTimeFormat).toDate()) {
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
    if (!/^[a-zA-Z0-9]+$/.test(orderNum)) {
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
      setErrorMessage(`${name} must be of the form ${dateTimeFormat}`);
      return false;
    }
    if (!moment(time, dateTimeFormat).isValid()) {
      setErrorMessage(`${name} must be a valid time`);
      return false;
    }
    setErrorMessage("");
    return true;
  }

  return (
    <View>
      <Text></Text>
      <View as="form" margin="3rem" onSubmit={submitWorkOrderInfo} onReset={handleFormReset}>
        <Flex direction="column" justifyContent="center">
          <TextField
            name="orderNum"
            placeholder="123456789"
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
        </Flex>
      </View>
    </View>
  );
}

export default WorkOrderForm;
