import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import {makeData} from './makeData';
import Orientation from 'react-native-orientation-locker';
import {Picker} from '@react-native-picker/picker';

function App() {
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [searchInputs, setSearchInputs] = useState({});
  const [data, setData] = React.useState(() => makeData(5000));

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: () => <Text>First Name</Text>,
        cell: info => info.getValue(),
        filterFn: 'characterFilter',
      },
      {
        accessorKey: 'lastName',
        header: () => <Text>Last Name</Text>,
        cell: info => info.getValue(),
        filterFn: 'characterFilter',
      },
      {
        accessorKey: 'age',
        header: () => <Text>Age</Text>,
        meta: {filterVariant: 'range'},
        filterFn: 'rangeFilter',
      },
      {
        accessorKey: 'visits',
        header: () => <Text>Visits</Text>,
        meta: {filterVariant: 'range'},
        filterFn: 'filterFn',
      },
      {
        accessorKey: 'status',
        header: () => <Text>Status</Text>,
        meta: {filterVariant: 'select'},
        filterFn: 'characterFilter',
      },
      {
        accessorKey: 'progress',
        header: () => <Text>Profile Progress</Text>,
        meta: {filterVariant: 'range'},
        filterFn: 'filterFn',
      },
    ],
    [],
  );

  useEffect(() => {
    Orientation.unlockAllOrientations();
  }, []);

  const refreshData = () => setData(() => makeData(50000));

  const handleSearch = (id, value) => {
    // console.log({value});

    setColumnFilters(prev => {
      const existingFilter = prev.find(filter => filter.id === id);
      if (existingFilter) {
        return prev.map(filter =>
          filter.id === id ? {...filter, value} : filter,
        );
      }
      return [...prev, {id, value}];
    });
  };

  const handleInputChange = (id, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [id]: value,
    }));
    // handleSearch(id, value);
    if (value === '') {
      setColumnFilters(prev => prev.filter(filter => filter.id !== id));
    } else {
      handleSearch(id, isNaN(value) ? value : Number(value));
    }
  };

  const rangeFilter = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);
    const {min, max} = filterValue;
    if (typeof min === 'undefined' && typeof max === 'undefined') {
      return true;
    }
    if (typeof min === 'undefined') {
      return rowValue <= max;
    }
    if (typeof max === 'undefined') {
      return rowValue >= min;
    }
    return rowValue >= min && rowValue <= max;
  };
  const characterFilter = (row, columnId, filterValue) => {
    const nameValue = row.getValue(columnId).toLowerCase();
    return nameValue.startsWith(filterValue.toLowerCase());
  };
  const exactFilter = (row, columnId, filterValue) => {
    const visits = row.getValue(columnId);
    return visits === filterValue;
  };
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      filterFn: exactFilter,
      characterFilter: characterFilter,
      rangeFilter: rangeFilter,
    },

    state: {columnFilters},
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const renderRow = ({item: row}) => (
    <View style={{flexDirection: 'row'}}>
      {row.getVisibleCells().map(cell => (
        <View
          key={cell.id}
          style={{
            flexDirection: 'row',
            flex: 1 / row.getVisibleCells().length,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center'}}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{padding: 10}}>
      <FlatList
        data={table.getHeaderGroups()}
        renderItem={({item: headerGroup}) => {
        //   console.log(headerGroup.headers.length);
          return (
            <View key={headerGroup.id} style={{flexDirection: 'row'}}>
              {headerGroup.headers.map(header => (
                <View
                  key={header.id}
                  style={{
                    flex: 1 / headerGroup.headers.length,
                    padding: 5,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={header.column.getToggleSortingHandler()}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      height: 40,
                      alignItems: 'center',
                    }}>
                    <Text style={{textAlign: 'center'}}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Text>
                    <Text style={{textAlign: 'center'}}>
                      {{
                        asc: '🔼',
                        desc: '🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      borderColor: 'gray',
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                    placeholder={`Search ${header.id}`}
                    value={searchInputs[header.id] || ''}
                    onChangeText={value => handleInputChange(header.id, value)}
                    keyboardType={
                      ['age', 'visits', 'progress'].includes(header.id)
                        ? 'numeric'
                        : 'default'
                    }
                  />
                </View>
              ))}
            </View>
          );
        }}
        keyExtractor={item => item.id}
        ListFooterComponent={() => {
          return (
            <>
              <FlatList
                data={table.getRowModel().rows}
                renderItem={renderRow}
                keyExtractor={row => row.id}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-evenly',
                    flex: 0.5,
                  }}>
                  <TouchableOpacity
                    style={styles.navigationColor}
                    onPress={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}>
                    <Text style={styles.navigationTextColor}>{'<<'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navigationColor}
                    onPress={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    <Text style={styles.navigationTextColor}>{'<'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navigationColor}
                    onPress={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    <Text style={styles.navigationTextColor}>{'>'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navigationColor}
                    onPress={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}>
                    <Text style={styles.navigationTextColor}>{'>>'}</Text>
                  </TouchableOpacity>
                </View>
                <Text>
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'grey',
                  borderRadius: 10,
                }}>
                <Picker
                  mode="dialog"
                  selectedValue={table.getState().pagination.pageSize}
                  onValueChange={value => table.setPageSize(Number(value))}>
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <Picker.Item
                      key={pageSize}
                      label={`Show ${pageSize}`}
                      value={pageSize}
                    />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'grey',
                  height: 50,
                  width: '80%',
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginVertical: 10,
                }}
                onPress={refreshData}>
                <Text style={styles.navigationTextColor}>Refresh Data</Text>
              </TouchableOpacity>
            </>
          );
        }}
      />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  navigationColor: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationTextColor: {
    transform: [{scale: 1.2}],
    color: '#fff',
  },
});
