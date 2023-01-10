import { Flex, Heading, View } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { getWorkLogsFromDate, WorkLog } from "./apiHelpers";
import { DATETIME_FORMAT_STR, dateTimeToDate } from "./utilities";
import WorkLogTable from "./WorkLogTable";

interface WorkLogReportProps {
  employeeID: string,
  employeeUsername: string,
  workDate: string
}

const MILLISECONDS_PER_SECOND: number = 1000; 
const SECONDS_PER_HOUR: number = 3600;

function WorkLogReport(props: WorkLogReportProps): JSX.Element {
  const [workLogs, setWorkLogs] = useState([] as WorkLog[]);
  const [totalSecondsClockedIn, setTotalSecondsClockedIn] = useState(0);
  const [totalSecondsWorkOrder, setTotalSecondsWorkOrder] = useState(0);

  useEffect(() => {
    getWorkLogsFromDate(props.employeeID, props.workDate).then((result) => {
      setWorkLogs(result);
      calculateTotalSecondsClockedIn(result);
      calculateTotalSecondsWorkOrder(result);
    });
  }, []);

  function calculateTotalSecondsClockedIn(workLogs: WorkLog[]): void {
    let total: number = 0;
    for (const workLog of workLogs) {
      if (workLog.clockInTime && workLog.clockOutTime) {
        const startDateTime: Date = dateTimeToDate(workLog.clockInTime, DATETIME_FORMAT_STR);
        const endDateTime: Date = dateTimeToDate(workLog.clockOutTime, DATETIME_FORMAT_STR);
        total += (endDateTime.getTime() - startDateTime.getTime()) / MILLISECONDS_PER_SECOND;
      }
    }
    setTotalSecondsClockedIn(total);
  }

  function calculateTotalSecondsWorkOrder(workLogs: WorkLog[]): void {
    let total: number = 0;
    for (const workLog of workLogs) {
      if (workLog.workOrders) {
        for (const workOrder of workLog.workOrders) {
          const startDateTime: Date = dateTimeToDate(workOrder.startTime, DATETIME_FORMAT_STR);
          const endDateTime: Date = dateTimeToDate(workOrder.endTime, DATETIME_FORMAT_STR);
          total += (endDateTime.getTime() - startDateTime.getTime()) / MILLISECONDS_PER_SECOND;
        }
      }
    }
    setTotalSecondsWorkOrder(total);
  }

  return (
    <View>
      <Flex direction="column">
        <Heading level={5}>
          Total Work Time: {(totalSecondsClockedIn / SECONDS_PER_HOUR).toFixed(1)} hours
        </Heading>
        <Heading level={5}>
          Total Job Processing Time: {(totalSecondsWorkOrder / SECONDS_PER_HOUR).toFixed(1)} hours
        </Heading>
        <Heading level={5}>
          Total Efficiency: {totalSecondsClockedIn === 0 ? "N/A" :
                               `${(totalSecondsWorkOrder / totalSecondsClockedIn).toFixed(1)}%`}
        </Heading>
      </Flex>
      {
        workLogs.length === 0 ? null :
        workLogs.map((workLog, index) => <WorkLogTable key={index} workLog={workLog}></WorkLogTable>)
      }
    </View>
  );
}

export default WorkLogReport;
