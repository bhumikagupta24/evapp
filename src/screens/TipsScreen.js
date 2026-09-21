import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TipsScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const categories = [
    {id: '1', title: 'Battery', icon: 'battery-charging', color: '#10B981'},
    {id: '2', title: 'Driving', icon: 'car', color: '#1976D2'},
    {id: '3', title: 'Charging', icon: 'flash', color: '#F59E0B'},
    {id: '4', title: 'Environment', icon: 'leaf', color: '#059669'},
  ];

  const articles = [
    {
      id: 'a1',
      title: 'Maximize Your Range',
      desc: 'Learn how to get the most miles out of every single charge.',
      tag: 'Driving',
      time: '5 min read',
      image:
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'a2',
      title: 'Battery Longevity 101',
      desc: 'The science behind keeping your battery healthy for a decade.',
      tag: 'Battery',
      time: '8 min read',
      image:
        'https://images.unsplash.com/photo-1548333341-97d4160eeacb?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'a3',
      title: 'Eco-Friendly Routes',
      desc: 'How planning your path can save both time and the planet.',
      tag: 'Environment',
      time: '4 min read',
      image:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, {borderColor: theme.border}]}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.text}]}>
          Green Tips
        </Text>
        <View style={{width: 44}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Search Bar Placeholder */}
        <View
          style={[
            styles.searchBar,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <Ionicons name="search" size={20} color={theme.subtext} />
          <Text style={[styles.searchText, {color: theme.subtext}]}>
            Search for tips...
          </Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catChip,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}>
              <Ionicons
                name={cat.icon}
                size={18}
                color={cat.color}
                style={{marginRight: 8}}
              />
              <Text style={[styles.catText, {color: theme.text}]}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Article */}
        <Text style={[styles.sectionTitle, {color: theme.text}]}>
          Featured Stories
        </Text>
        {articles.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.articleCard,
              {backgroundColor: theme.card, borderColor: theme.border},
            ]}
            activeOpacity={0.9}>
            <Image source={{uri: item.image}} style={styles.articleImage} />
            <View style={styles.articleContent}>
              <View style={styles.tagRow}>
                <Text style={[styles.articleTag, {color: theme.primary}]}>
                  {item.tag}
                </Text>
                <Text style={[styles.articleTime, {color: theme.subtext}]}>
                  • {item.time}
                </Text>
              </View>
              <Text style={[styles.articleTitle, {color: theme.text}]}>
                {item.title}
              </Text>
              <Text
                style={[styles.articleDesc, {color: theme.subtext}]}
                numberOfLines={2}>
                {item.desc}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  searchBar: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  catScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
  },
  catText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
  },
  articleCard: {
    borderRadius: 25,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
  },
  articleImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#eee',
  },
  articleContent: {
    padding: 20,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleTag: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  articleTime: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  articleDesc: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
