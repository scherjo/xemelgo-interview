import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
import { createWorkLog, updateWorkLog } from "./graphql/mutations";
import { employeesByEmployeeUsername, getWorkLog, listWorkLogs } from "./graphql/queries";

interface WorkOrder {
  orderNum: string,
  startTime: string,
  endTime: string
}

interface WorkLog {
  employeeID: string,
  clockInTime: string,
  clockOutTime: string | null,
  workOrders: WorkOrder[] | null
}

interface Employee {
  employeeID: string,
  employeeUsername: string
}

export async function getEmployeeID(username: string): Promise<string> {
  const apiData: GraphQLResult<any> = await API.graphql({
    query: employeesByEmployeeUsername,
    variables: {
      employeeUsername: username
    }
  });

  if (apiData.errors) {
    return "";
  }
  const employees: Employee[] = apiData.data.employeesByEmployeeUsername.items;

  if (employees.length > 0) {
    return employees[0].employeeID;
  }
  return "";
}

export async function getClockInTime(employeeID: string): Promise<string> {
  const apiData: GraphQLResult<any> = await API.graphql({
    query: listWorkLogs,
    variables: {
      employeeID: employeeID,
      sortDirection: "DESC",
      filter: {
        clockOutTime: {
          attributeExists: false
        }
      }
    }
  });

  if (apiData.errors) {
    return "";
  }

  const workLogs: WorkLog[] = apiData.data.listWorkLogs.items;

  if (workLogs.length > 0) {
    return workLogs[0].clockInTime;
  }
  return "";
}

export async function clockIn(employeeID: string, clockInTime: string): Promise<string> {
  const workLogData = {
    employeeID: employeeID,
    clockInTime: clockInTime
  };
  const apiData: GraphQLResult<any> = await API.graphql({
    query: createWorkLog,
    variables: {
      input: workLogData
    }
  });

  if (apiData.errors) {
    return "Error initializing new work log";
  }
  return "";
}

export async function clockOut(employeeID: string, clockInTime: string, clockOutTime: string): Promise<string> {
  const workLogData = {
    employeeID: employeeID,
    clockInTime: clockInTime,
    clockOutTime: clockOutTime
  };
  const apiData: GraphQLResult<any> = await API.graphql({
    query: updateWorkLog,
    variables: {
      input: workLogData
    }
  });

  if (apiData.errors) {
    return "Error clocking out";
  }
  return "";
}

async function getWorkLogInfo(employeeID: string, clockInTime: string): Promise<WorkLog | null> {
  const apiData: GraphQLResult<any> = await API.graphql({
    query: getWorkLog,
    variables: {
      employeeID: employeeID,
      clockInTime: clockInTime
    }
  });

  if (apiData.errors) {
    return null;
  }
  return apiData.data.getWorkLog;
}

async function getClockInPeriod(employeeID: string, startTime: string): Promise<string> {
  const apiData: GraphQLResult<any> = await API.graphql({
    query: listWorkLogs,
    variables: {
      employeeID: employeeID,
      clockInTime: {
        le: startTime
      },
      sortDirection: "DESC"
    }
  });

  if (apiData.errors) {
    return "";
  }

  const workLogsInfo: WorkLog[] = apiData.data.listWorkLogs.items;

  if (workLogsInfo.length > 0) {
    return workLogsInfo[0].clockInTime;
  }
  return "";
}

export async function addWorkOrder(employeeID: string, orderNum: string, startTime: string, endTime: string): Promise<string> {
  const clockInTime: string = await getClockInPeriod(employeeID, startTime);
  if (!clockInTime) {
    return "Error determining shift corresponding with job start and end time";
  }

  const workLog: WorkLog | null = await getWorkLogInfo(employeeID, clockInTime);
  if (!workLog) {
    return "Error retrieving shift information corresponding with job start and end time";
  }

  const workOrders: WorkOrder[] = workLog.workOrders ? workLog.workOrders : [] as WorkOrder[];
  workOrders.push({
    orderNum: orderNum,
    startTime: startTime,
    endTime: endTime
  });
  const workLogData = {
    employeeID: employeeID,
    clockInTime: clockInTime,
    workOrders: workOrders
  };

  const apiData: GraphQLResult<any> = await API.graphql({
    query: updateWorkLog,
    variables: {
      input: workLogData
    }
  });

  if (apiData.errors) {
    return "Error submitting work order";
  }
  return "";
}
