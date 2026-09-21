import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

export default function SupportChatScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I help you with your charging session today?',
      sender: 'bot',
      time: '10:00 AM',
    },
  ]);

  const sendMessage = () => {
    if (message.trim() === '') {
      return;
    }

    const newMsg = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newMsg]);
    setMessage('');

    // Simple bot reply simulation
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for reaching out! A support agent will be with you shortly.',
          sender: 'bot',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }, 1000);
  };

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
          <Text style={{fontSize: 20}}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            Support Chat
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={[styles.statusText, {color: theme.subtext}]}>
              Online
            </Text>
          </View>
        </View>
        <View style={{width: 44}} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === 'user'
                ? [styles.userBubble, {backgroundColor: theme.primary}]
                : [
                    styles.botBubble,
                    {backgroundColor: theme.card, borderColor: theme.border},
                  ],
            ]}>
            <Text
              style={[
                styles.messageText,
                {color: item.sender === 'user' ? '#fff' : theme.text},
              ]}>
              {item.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                {
                  color:
                    item.sender === 'user'
                      ? 'rgba(255,255,255,0.7)'
                      : theme.subtext,
                },
              ]}>
              {item.time}
            </Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View
          style={[
            styles.inputContainer,
            {backgroundColor: theme.card, borderTopColor: theme.border},
          ]}>
          <TextInput
            style={[
              styles.input,
              {color: theme.text, backgroundColor: theme.background},
            ]}
            placeholder="Type a message..."
            placeholderTextColor={theme.subtext}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, {backgroundColor: theme.primary}]}
            onPress={sendMessage}>
            <Text style={{color: '#fff', fontSize: 18}}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {alignItems: 'center'},
  headerTitle: {fontSize: 18, fontWeight: '800'},
  statusRow: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  statusText: {fontSize: 12, fontWeight: '600'},
  chatContent: {padding: 20, paddingBottom: 40},
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {fontSize: 15, fontWeight: '500', lineHeight: 20},
  messageTime: {fontSize: 10, marginTop: 4, alignSelf: 'flex-end'},
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 15,
    marginRight: 12,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});
