/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWorkLog = /* GraphQL */ `
  mutation CreateWorkLog(
    $input: CreateWorkLogInput!
    $condition: ModelWorkLogConditionInput
  ) {
    createWorkLog(input: $input, condition: $condition) {
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
export const updateWorkLog = /* GraphQL */ `
  mutation UpdateWorkLog(
    $input: UpdateWorkLogInput!
    $condition: ModelWorkLogConditionInput
  ) {
    updateWorkLog(input: $input, condition: $condition) {
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
export const deleteWorkLog = /* GraphQL */ `
  mutation DeleteWorkLog(
    $input: DeleteWorkLogInput!
    $condition: ModelWorkLogConditionInput
  ) {
    deleteWorkLog(input: $input, condition: $condition) {
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
export const createEmployee = /* GraphQL */ `
  mutation CreateEmployee(
    $input: CreateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    createEmployee(input: $input, condition: $condition) {
      employeeID
      employeeUsername
    }
  }
`;
export const updateEmployee = /* GraphQL */ `
  mutation UpdateEmployee(
    $input: UpdateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    updateEmployee(input: $input, condition: $condition) {
      employeeID
      employeeUsername
    }
  }
`;
export const deleteEmployee = /* GraphQL */ `
  mutation DeleteEmployee(
    $input: DeleteEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    deleteEmployee(input: $input, condition: $condition) {
      employeeID
      employeeUsername
    }
  }
`;
