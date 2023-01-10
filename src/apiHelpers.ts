import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
import { createWorkLog, updateWorkLog } from "./graphql/mutations";
import { employeesByEmployeeUsername, getEmployee, getWorkLog, listWorkLogs } from "./graphql/queries";

export interface WorkOrder {
  orderNum: string,
  startTime: string,
  endTime: string
}

export interface WorkLog {
  employeeID: string,
  clockInTime: string,
  clockOutTime: string | null,
  workOrders: WorkOrder[] | null
}

interface Employee {
  employeeID: string,
  employeeUsername: string
}

export async function getEmployeeUsername(id: string): Promise<string> {
  let apiData: GraphQLResult<any>;
  try {
    apiData = await API.graphql({
      query: getEmployee,
      variables: {
        employeeID: id
      }
    });
  } catch (e) {
    return "";
  }

  if (apiData.errors || !apiData.data.getEmployee) {
    return "";
  }
  return apiData.data.getEmployee.employeeUsername;
}

export async function getEmployeeID(username: string): Promise<string> {
  let apiData: GraphQLResult<any>;
  try {
    apiData = await API.graphql({
      query: employeesByEmployeeUsername,
      variables: {
        employeeUsername: username
      }
    });
  } catch (e) {
    return "";
  }

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
  let apiData: GraphQLResult<any>;
  try {
    apiData = await API.graphql({
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
  } catch (e) {
    return "";
  }

  if (apiData.errors || !apiData.data.listWorkLogs) {
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

  let apiData: GraphQLResult<any>
  try {
    apiData = await API.graphql({
      query: createWorkLog,
      variables: {
        input: workLogData
      }
    });
  } catch (e) {
    return "Error initializing new work log";
  }

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
  let apiData: GraphQLResult<any>; 
  try {
    apiData = await API.graphql({
      query: updateWorkLog,
      variables: {
        input: workLogData
      }
    });
  } catch (e) {
    return "Error clocking out";
  }

  if (apiData.errors) {
    return "Error clocking out";
  }
  return "";
}

async function getWorkLogInfo(employeeID: string, clockInTime: string): Promise<WorkLog | null> {
  let apiData: GraphQLResult<any>;
  try {
    apiData = await API.graphql({
      query: getWorkLog,
      variables: {
        employeeID: employeeID,
        clockInTime: clockInTime
      }
    });
  } catch (e) {
    return null;
  }

  if (apiData.errors) {
    return null;
  }
  return apiData.data.getWorkLog;
}

export async function getWorkLogsFromDate(employeeID: string, date: string): Promise<WorkLog[]> {
  const nextDay: string = `${date.substring(0, date.length - 1)}${Number(date.charAt(date.length - 1)) + 1}`;
  let apiData: GraphQLResult<any>;
  try {
    apiData = await API.graphql({
      query: listWorkLogs,
      variables: {
        employeeID: employeeID,
        clockInTime: {
          between: [date, nextDay]
        }
      }
    });
  } catch (e) {
    return [];
  }

  if (apiData.errors || !apiData.data.listWorkLogs) {
    return [];
  }
  return apiData.data.listWorkLogs.items;
}

async function getClockInPeriod(employeeID: string, startTime: string): Promise<string> {
  let apiData: GraphQLResult<any>;
  try {
    apiData = await API.graphql({
      query: listWorkLogs,
      variables: {
        employeeID: employeeID,
        clockInTime: {
          le: startTime
        },
        sortDirection: "DESC"
      }
    });
  } catch (e) {
    return "";
  }
  
  if (apiData.errors) {
    return "";
  }

  const workLogs: WorkLog[] = apiData.data.listWorkLogs.items;

  if (workLogs.length > 0) {
    return workLogs[0].clockInTime;
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

  let apiData: GraphQLResult<any>;
  try {
    apiData = await API.graphql({
      query: updateWorkLog,
      variables: {
        input: workLogData
      }
    });
  } catch (e) {
    return "Error submitting work order";
  }

  if (apiData.errors) {
    return "Error submitting work order";
  }
  return "";
}
