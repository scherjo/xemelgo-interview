import { View, Button } from "@aws-amplify/ui-react";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";
import { getEmployeeID, getClockInTime, clockIn, clockOut } from "./apiHelpers";
import WorkOrderForm from "./WorkOrderForm";

interface WorkTimeLoggerProps {
  username: string
}

function getCurrentTimeString(): string {
  const now: Date = new Date();
  return dateFormat(now, "yyyy-mm-dd HH:MM:ss");
}

function WorkTimeLogger(props: WorkTimeLoggerProps): JSX.Element {
  const [employeeID, setEmployeeID] = useState("");
  const [clockInTime, setClockInTime] = useState("");
  const [hasCheckedClockInTime, setHasCheckedClockInTime] = useState(false);
  
  useEffect(() => {
    getEmployeeID(props.username).then(id => {
      if (id) {
        setEmployeeID(id);
        getClockInTime(id).then(time => {
          if (time) {
            setClockInTime(time);
          }
          setHasCheckedClockInTime(true);
        });
      }
    });
  }, []);

  async function handleClockIn(): Promise<void> {
    const dateTime: string = getCurrentTimeString();
    await clockIn(employeeID, dateTime);
    setClockInTime(dateTime);
  }

  async function handleClockOut(): Promise<void> {
    const dateTime: string = getCurrentTimeString();
    clockOut(employeeID, clockInTime, dateTime);
    setClockInTime("");
  }

  return (
    <View>
      <Button
        onClick={clockInTime === "" ? handleClockIn : handleClockOut}
        disabled={!hasCheckedClockInTime} variation="primary"
      >
        {clockInTime === "" ? "Clock In" : "Clock Out"}
      </Button>
      <WorkOrderForm employeeID={employeeID}></WorkOrderForm>
    </View>
  );
}

export default WorkTimeLogger;
