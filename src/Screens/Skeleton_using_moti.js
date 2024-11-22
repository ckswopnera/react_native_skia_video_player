import { useReducer } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

export default function SkeletonComponent() {
  const [dark, toggle] = useReducer((s) => !s, true);

  const colorMode = dark ? 'dark' : 'light';

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <MotiView
        transition={{
          type: 'timing',
        }}
        style={[styles.container, styles.padded]}
        animate={{ backgroundColor: dark ? '#000' : '#ffffff' }}
      >
        <Skeleton colorMode={colorMode} radius="round" height={125} width={125} />
        <Spacer />
        <Skeleton colorMode={colorMode} width={250} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />

        <Spacer height={38} />

        <Skeleton colorMode={colorMode} width={250} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />

        <Spacer height={38} />

        <Skeleton colorMode={colorMode} width={250} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'80%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'80%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'80%'} />
        <Spacer height={8} />
        
      </MotiView>
    </Pressable>
  );
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
  shape: {
    // alignItems:'center',
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  padded: {
    padding: 16,
  },
});