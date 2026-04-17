import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from '@react-native-firebase/firestore';

const Colors = {
  primary: '#69B36D',
  white: '#FFFFFF',
  bg: '#F4F4F4',
  text: '#222222',
  muted: '#8E8E93',
  green: '#165E2C',
  red: '#E74C3C',
  cardBorder: '#E8E8E8',
  icon: '#A0A0A0',
};

const OrderCard = ({ item, navigation }) => (
  <View style={styles.card}>
    <View style={styles.rowBetween}>
      <Text style={[styles.status, { color: item.statusColor }]}>
        {item.status}
      </Text>
      <Text style={styles.id}>{item.id}</Text>
    </View>

    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.date}>{item.date}</Text>

    <View style={[styles.rowBetween, { marginTop: 10 }]}>
      <TouchableOpacity
        onPress={() =>
          navigation?.navigate?.('OrderComplete', { orderId: item.docId })
        }
      >
        <Text style={styles.details}>عرض التفاصيل</Text>
      </TouchableOpacity>

      <Text style={styles.total}>{item.total}</Text>
    </View>
  </View>
);

export default function PreviousOrdersScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribeAuth;
  }, [initializing]);

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setOrders([]);
      return;
    }

    const db = getFirestore();
    const ordersRef = collection(db, 'Orders');

    const ordersQuery = query(
      ordersRef,
      where('FarmID', '==', firebaseUser.uid),
      orderBy('CreatedAt', 'desc')
    );

    const unsubscribeOrders = onSnapshot(
      ordersQuery,
      snapshot => {
        const ordersList = snapshot.docs.map(docSnap => {
          const data = docSnap.data();

          let statusText = 'قيد المعالجة';
          let statusColor = Colors.green;

          if (data.Status === 'delivered' || data.Status === 'تم التوصيل') {
            statusText = 'تم التوصيل';
            statusColor = Colors.green;
          } else if (
            data.Status === 'cancelled' ||
            data.Status === 'تم الإلغاء'
          ) {
            statusText = 'تم الإلغاء';
            statusColor = Colors.red;
          } else if (data.Status === 'pending') {
            statusText = 'قيد الانتظار';
            statusColor = '#D69E2E';
          }

          let formattedDate = 'بدون تاريخ';
          if (data.CreatedAt?.toDate) {
            formattedDate = data.CreatedAt.toDate().toLocaleString('ar-SA');
          }

          return {
            docId: docSnap.id,
            id: `#${docSnap.id.slice(0, 5)}`,
            name: data.UserName || data.CustomerName || 'عميل',
            date: formattedDate,
            total: `${data.TotalAmount || 0} ريال`,
            status: statusText,
            statusColor,
          };
        });

        setOrders(ordersList);
      },
      error => {
        console.log('Orders Firestore error:', error);
        Alert.alert('خطأ', 'تعذر جلب الطلبات');
      }
    );

    return unsubscribeOrders;
  }, [firebaseUser]);

  if (initializing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.green} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Feather name="arrow-left" size={20} />
          </TouchableOpacity>

          <Text style={styles.title}>الطلبات السابقة</Text>

          <TouchableOpacity>
            <Feather name="filter" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد طلبات سابقة</Text>
          ) : (
            orders.map(item => (
              <OrderCard
                key={item.docId}
                item={item}
                navigation={navigation}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => navigation?.navigate?.('FarmInfo')}
          >
            <FontAwesome5 name="user" size={18} color={Colors.icon} />
            <Text style={styles.bottomLabel}>الحساب</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => navigation?.navigate?.('PreviousOrdersScreen')}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={22}
              color={Colors.green}
            />
            <Text style={[styles.bottomLabel, styles.activeBottomLabel]}>
              الطلبات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => navigation?.navigate?.('WelcomeScreen')}
          >
            <FontAwesome5 name="home" size={18} color={Colors.icon} />
            <Text style={styles.bottomLabel}>الرئيسية</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },

  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    paddingTop: 50,
    fontWeight: 'bold',
  },

  body: {
    flex: 1,
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },

  rowBetween: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },

  id: {
    color: Colors.muted,
  },

  status: {
    fontWeight: '600',
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 8,
  },

  date: {
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'right',
    marginTop: 4,
  },

  total: {
    fontSize: 16,
    color: Colors.green,
    fontWeight: 'bold',
  },

  details: {
    color: Colors.green,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: Colors.muted,
    fontSize: 16,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#F7F7F7',
    borderRadius: 25,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },

  bottomItem: {
    alignItems: 'center',
  },

  bottomLabel: {
    fontSize: 11,
    color: Colors.icon,
    marginTop: 4,
  },

  activeBottomLabel: {
    color: Colors.green,
    fontWeight: '700',
  },
});
