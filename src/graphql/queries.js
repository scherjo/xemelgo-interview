/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWorkLog = /* GraphQL */ `
  query GetWorkLog($employeeID: ID!, $clockInTime: String!) {
    getWorkLog(employeeID: $employeeID, clockInTime: $clockInTime) {
      employeeID
      clockInTime
      clockOutTime
      workOrders {
        orderNum
        startTime
        endTime
      }
    }
  }
`;
export const listWorkLogs = /* GraphQL */ `
  query ListWorkLogs(
    $employeeID: ID
    $clockInTime: ModelStringKeyConditionInput
    $filter: ModelWorkLogFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listWorkLogs(
      employeeID: $employeeID
      clockInTime: $clockInTime
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        employeeID
        clockInTime
        clockOutTime
        workOrders {
          orderNum
          startTime
          endTime
        }
      }
      nextToken
    }
  }
`;
export const getEmployee = /* GraphQL */ `
  query GetEmployee($employeeID: ID!) {
    getEmployee(employeeID: $employeeID) {
      employeeID
      employeeUsername
    }
  }
`;
export const listEmployees = /* GraphQL */ `
  query ListEmployees(
    $employeeID: ID
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listEmployees(
      employeeID: $employeeID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        employeeID
        employeeUsername
      }
      nextToken
    }
  }
`;
export const employeesByEmployeeUsername = /* GraphQL */ `
  query EmployeesByEmployeeUsername(
    $employeeUsername: String!
    $sortDirection: ModelSortDirection
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    employeesByEmployeeUsername(
      employeeUsername: $employeeUsername
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        employeeID
        employeeUsername
      }
      nextToken
    }
  }
`;
