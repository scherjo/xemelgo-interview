import { Table, TableHead, TableBody, TableCell, Text, View, Flex, TableRow } from "@aws-amplify/ui-react";
import { WorkLog } from "./apiHelpers";

interface WorkLogTableProps {
  workLog: WorkLog
}

// Component for displaying a table for a single work log.
function WorkLogTable(props: WorkLogTableProps): JSX.Element {
  return (
    <View direction="column">
      <Flex direction="row" margin="1rem">
        <Text>Clock In: {props.workLog.clockInTime}</Text>
        <Text>Clock Out: {props.workLog.clockOutTime}</Text>
      </Flex>
      {!props.workLog.workOrders ? null :
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.workLog.workOrders.map((workOrder, index) =>
                <TableRow key={index}>
                  <TableCell>{workOrder.orderNum}</TableCell>
                  <TableCell>{workOrder.startTime}</TableCell>
                  <TableCell>{workOrder.endTime}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      }
    </View>
  );
}

export default WorkLogTable;