/**
 * Various functions to simplify interacting with the GraphQL API, as well as
 * interfaces for dealing with the results of the API calls.
 */

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

/**
 * Returns the username of the employee with the given id, or an empty string
 * if no username exists for that id.
 * 
 * @param id the id for which to retrieve the corresponding employee's username
 * @returns the username of the employee with the given id, or an empty string
 *          if no username exists for that id
 */
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

/**
 * Returns the id of the employee with the given username, or an empty string
 * if no id exists for that username.
 * 
 * @param username the username for which to retrieve the corresponding
 *                  employee's id
 * @returns the id of the employee with the given username, or an empty string
 *          if no id exists for that username
 */
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

/**
 * Returns the time at which the employee clocked in, or an empty string
 * if the employee with the given id is not currently clocked in.
 * 
 * @param employeeID the id of the employee
 * @returns the time at which the employee clocked in, or an empty string
 *          if the employee with the given id is not currently clocked in
 */
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

/**
 * Attempts to clock in the employee using the given id and clock in time.
 * Returns an empty string on success or an error message on failure.
 * 
 * @param employeeID the id of the employee
 * @param clockInTime the time at which to clock in the employee
 * @returns empty string on success, error message on failure
 */
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

/**
 * Attempts to clock out the employee using the given id, clock in time, and
 * clock out time. Returns an empty string on success or an error message
 * on failure.
 * 
 * @param employeeID the id of the employee
 * @param clockInTime the time at which the employee clocked in
 * @param clockOutTime the time at which to clock out the employee
 * @returns empty string on success, error message on failure
 */
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

/**
 * Returns the work log corresponding with the given employee id and clock in time, or null
 * if no such work log exists.
 * 
 * @param employeeID the id of the employee
 * @param clockInTime the time at which the employee clocked in
 * @returns the work log corresponding with the given employee id and clock in time, or null
 *          if no such work log exists
 */
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

/**
 * Returns all work logs from the given date.
 * 
 * @param employeeID the id of the employee
 * @param date the date from which to retrieve work logs, in the form 'YYYY-MM-DD'
 * @returns all work logs with a clock in time on the given date
 */
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

/**
 * Returns the latest clock in time for the employee that is on or before start time,
 * or an empty string if no such clock in time exists.
 * 
 * @param employeeID the id of the employee
 * @param startTime a time in the form 'YYYY-MM-DD HH:mm:ss'
 * @returns the latest clock in time for the employee that is on or before
 *          start time, or an empty string if no such clock in time exists
 */
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
  
  if (apiData.errors || !apiData.data.listWorkLogs) {
    return "";
  }

  const workLogs: WorkLog[] = apiData.data.listWorkLogs.items;

  if (workLogs.length > 0) {
    return workLogs[0].clockInTime;
  }
  return "";
}

/**
 * Attempts to add a work order to the employee's work log using the employee id, order number,
 * and job start and end times. Returns an empty string on success or an error message
 * on failure.
 * 
 * @param employeeID the id of the employee
 * @param orderNum the order number
 * @param startTime the job start time
 * @param endTime the job end time
 * @returns empty string on success, error message on failure
 */
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
