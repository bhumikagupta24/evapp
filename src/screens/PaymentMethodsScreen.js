import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function PaymentMethodsScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const rawAmount = route.params?.amount || null;
  const amount =
    rawAmount != null ? parseFloat(parseFloat(rawAmount).toFixed(2)) : null;

  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .collection('paymentMethods')
      .onSnapshot(
        snapshot => {
          if (snapshot) {
            const list = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMethods(list);
          }
          setLoading(false);
        },
        error => {
          console.error('Error fetching payment methods:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const handleAddMethod = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    try {
      // Adding a dummy card for testing Firebase integration
      await firestore()
        .collection('users')
        .doc(uid)
        .collection('paymentMethods')
        .add({
          type: 'Visa',
          last4: Math.floor(1000 + Math.random() * 9000).toString(),
          expiry: '12/28',
          icon: '💳',
        });
      Alert.alert('Success', 'A new payment method was securely linked!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not link payment method.');
    }
  };

  const handleRemove = id => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this payment method?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const uid = auth().currentUser?.uid;
            if (!uid) {
              return;
            }
            try {
              await firestore()
                .collection('users')
                .doc(uid)
                .collection('paymentMethods')
                .doc(id)
                .delete();
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
    );
  };

  const handlePay = () => {
    Alert.alert(
      'Payment Successful',
      `Transaction of ₹${amount?.toFixed(2)} completed successfully!`,
      [
        {text: 'Go Home', onPress: () => navigation.navigate('Home')},
        {text: 'Book Another', onPress: () => navigation.navigate('Finder')},
      ],
    );
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
        <Text style={[styles.headerTitle, {color: theme.text}]}>Payment</Text>
        <View style={{width: 44}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {amount && (
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.primary + '10',
                borderColor: theme.primary + '30',
              },
            ]}>
            <Text style={[styles.summaryLabel, {color: theme.subtext}]}>
              Amount to Pay
            </Text>
            <Text style={[styles.summaryAmount, {color: theme.primary}]}>
              ₹{amount?.toFixed(2)}
            </Text>
            <View style={styles.divider} />
            <Text style={[styles.summaryDesc, {color: theme.text}]}>
              Charging Session Summary
            </Text>
            <TouchableOpacity
              style={[styles.payBtn, {backgroundColor: theme.primary}]}
              onPress={handlePay}>
              <Text style={styles.payBtnText}>Confirm & Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.sectionTitle, {color: theme.subtext}]}>
          Select Payment Method
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{marginVertical: 40}}
          />
        ) : methods.length === 0 ? (
          <View style={{alignItems: 'center', padding: 30}}>
            <Text style={{color: theme.subtext}}>
              No payment methods linked yet.
            </Text>
          </View>
        ) : (
          methods.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.methodCard,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}>
              <View
                style={[
                  styles.iconBox,
                  {backgroundColor: theme.primary + '10'},
                ]}>
                <Text style={{fontSize: 24}}>{item.icon}</Text>
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodTitle, {color: theme.text}]}>
                  {item.type} **** {item.last4}
                </Text>
                {item.expiry ? (
                  <Text style={[styles.methodSub, {color: theme.subtext}]}>
                    Expires {item.expiry}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Text style={{color: '#FF3B30', fontWeight: '700'}}>
                  Remove
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={[
            styles.addBtn,
            {borderColor: theme.primary, borderStyle: 'dashed'},
          ]}
          onPress={handleAddMethod}>
          <Text style={[styles.addBtnText, {color: theme.primary}]}>
            + Add New Method
          </Text>
        </TouchableOpacity>

        <View style={[styles.securityNote, {backgroundColor: theme.card}]}>
          <Text style={{fontSize: 20, marginBottom: 8}}>🛡️</Text>
          <Text style={[styles.securityTitle, {color: theme.text}]}>
            Secure Payments
          </Text>
          <Text style={[styles.securityText, {color: theme.subtext}]}>
            Your payment information is encrypted and stored securely.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: 24, paddingBottom: 40},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  summaryCard: {
    padding: 24,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 32,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryAmount: {fontSize: 42, fontWeight: '900', marginBottom: 16},
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
  },
  summaryDesc: {fontSize: 14, fontWeight: '600', marginBottom: 20},
  payBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBtnText: {color: '#fff', fontSize: 16, fontWeight: '800'},
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {flex: 1},
  methodTitle: {fontSize: 16, fontWeight: '800'},
  methodSub: {fontSize: 13, fontWeight: '500', marginTop: 2},
  addBtn: {
    height: 60,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  addBtnText: {fontSize: 16, fontWeight: '700'},
  securityNote: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  securityTitle: {fontSize: 18, fontWeight: '800', marginBottom: 4},
  securityText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});
