import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700
  },
});

function ResultTable(props) {
  const { result } = props;
  return (
    <Table>
      <TableBody>
        {result.map(row => (
          <TableRow key={row.key}>
            <TableCell className="table-font">
              {row.key}
            </TableCell>
            <TableCell className="table-font">
              {row.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default withStyles(styles)(ResultTable);

ResultTable.defaultProps = {
  result: [],
};
