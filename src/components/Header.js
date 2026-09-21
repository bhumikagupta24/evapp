import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';

export default function Header({
  title,
  onBack,
  rightElement,
  showBack = true,
  style,
  titleStyle,
}) {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.header, style]}>
      {showBack ? (
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backBtn, {borderColor: theme.border}]}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {title ? (
        <Text
          style={[styles.headerTitle, {color: theme.text}, titleStyle]}
          numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View />
      )}

      {rightElement ? (
        <View style={styles.rightWrapper}>{rightElement}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    flex: 1,
  },
  rightWrapper: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
