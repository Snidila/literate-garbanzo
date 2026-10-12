import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SegmentedType = {
  title: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
};

export const SegmentedLauncher = React.memo((props: SegmentedType) => {
  const { title, options, value, onChange } = props;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      <View style={styles.row}>
        {options.map(option => {
          const selected = option === value;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => onChange(option)}>
              <Text style={[styles.text, selected && styles.textSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { marginTop: 18 },
  title: { color: '#827896', fontSize: 11, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    backgroundColor: '#14101a',
    borderColor: '#463a5c',
    borderWidth: 1,
    borderRadius: 10,
    padding: 3,
  },
  item: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  itemSelected: { backgroundColor: '#8b4fe0' },
  text: { color: '#a8a0b6', fontSize: 14, fontWeight: '600' },
  textSelected: { color: '#ffffff' },
});
