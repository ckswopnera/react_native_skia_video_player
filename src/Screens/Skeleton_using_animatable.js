import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

const YourComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setData([]);
  //     setLoading(false);
  //   }, 3000);
  // }, []);

  return (
    <View>
      {loading ? (
        <>
          {[1, 2, 3, 4].map((i, j) => (
            <View key={j.toString()}>
              <SkeletonLoader />
            </View>
          ))}
          <Animatable.View
            animation="slideInRight"
            duration={1500}
            iterationCount="infinite"
            direction="alternate"
            style={{
              width: '20%',
              height: '40%',
              backgroundColor: 'rgba(0,0,0,0.3)',
              opacity: 0.6,
            }}
          />
        </>
      ) : (
        <FlatList
          data={data}
          renderItem={({item}) => <Text>{item.name}</Text>}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeIn"
        iterationCount="infinite"
        direction="alternate"
        style={styles.skeleton}
      />
      <View style={styles.textContainer}>
        <Animatable.View
          animation="fadeIn"
          iterationCount="infinite"
          direction="alternate"
          style={styles.skeletonText}
        />
        <Animatable.View
          animation="fadeIn"
          iterationCount="infinite"
          direction="alternate"
          style={styles.skeletonTextShort}
        />
        <Animatable.View
          animation="fadeIn"
          iterationCount="infinite"
          direction="alternate"
          style={styles.skeletonTextShort}
        />
        <Animatable.View
          animation="fadeIn"
          iterationCount="infinite"
          direction="alternate"
          style={styles.skeletonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  skeleton: {
    width: 120,
    height: 120,
    borderRadius: 25,
    backgroundColor: '#999',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  skeletonText: {
    height: 15,
    marginBottom: 5,
    backgroundColor: '#999',
    borderRadius: 4,
    marginVertical: 4,
  },
  skeletonTextShort: {
    width: '60%',
    height: 15,
    backgroundColor: '#999',
    borderRadius: 4,
    marginVertical: 4,
  },
});

export default YourComponent;
