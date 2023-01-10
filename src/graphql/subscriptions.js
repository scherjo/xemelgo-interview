/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWorkLog = /* GraphQL */ `
  subscription OnCreateWorkLog($filter: ModelSubscriptionWorkLogFilterInput) {
    onCreateWorkLog(filter: $filter) {
      employeeID
      clockInTime
      clockOutTime
      workOrders {
        orderNum
        startTime
        endTime
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateWorkLog = /* GraphQL */ `
  subscription OnUpdateWorkLog($filter: ModelSubscriptionWorkLogFilterInput) {
    onUpdateWorkLog(filter: $filter) {
      employeeID
      clockInTime
      clockOutTime
      workOrders {
        orderNum
        startTime
        endTime
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteWorkLog = /* GraphQL */ `
  subscription OnDeleteWorkLog($filter: ModelSubscriptionWorkLogFilterInput) {
    onDeleteWorkLog(filter: $filter) {
      employeeID
      clockInTime
      clockOutTime
      workOrders {
        orderNum
        startTime
        endTime
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateEmployee = /* GraphQL */ `
  subscription OnCreateEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onCreateEmployee(filter: $filter) {
      employeeID
      employeeUsername
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateEmployee = /* GraphQL */ `
  subscription OnUpdateEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onUpdateEmployee(filter: $filter) {
      employeeID
      employeeUsername
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteEmployee = /* GraphQL */ `
  subscription OnDeleteEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onDeleteEmployee(filter: $filter) {
      employeeID
      employeeUsername
      createdAt
      updatedAt
    }
  }
`;
