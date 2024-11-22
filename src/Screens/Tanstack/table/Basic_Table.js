import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const defaultData = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  
];

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('firstName', {
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.lastName, {
    id: 'lastName',
    cell: info => <Text style={styles.italic}>{info.getValue()}</Text>,
    header: () => <Text>Last Name</Text>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <Text>Visits</Text>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: info => info.column.id,
  }),
];

export default function Table() {
  const [data, setData] = React.useState(() => [...defaultData]);
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {item.getVisibleCells().map(cell => (
        <Text style={styles.cell} key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {table.getHeaderGroups().map(headerGroup => (
          <View style={styles.row} key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Text style={styles.header} key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <FlatList
        data={table.getRowModel().rows}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />


      <Button title="Rerender" onPress={() => rerender()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  footerRow: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    marginTop: 10,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
});
