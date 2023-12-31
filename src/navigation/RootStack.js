import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import i18n from 'i18next';

import Colors from '../constants/Colors';
import BottomTabs from './BottomTabs';
import SubCategoriesScreen, {
  screenOptions as subCategoriesScreenOptions,
} from '../screen/services/SubCategoryScreen';
import SlotBookingScreen, {
  screenOptions as slotBookingScreenOptions,
} from '../screen/booking/SlotBookingScreen';
import WalletScreen, {
  screenOptions as walletScreenOptions,
} from '../screen/wallet/WalletScreen';
import ServiceProvidersListScreen, {
  screenOptions as serviceProvidersScreenOptions,
} from '../screen/booking/ServiceProvidersListScreen';
import PaymentOption from '../screen/ProfileSection/PaymentOption';
import Security from '../screen/ProfileSection/Security';
import ReviewScreen from '../screen/ProfileSection/RateUsScreen';
import EditProfileScreen from '../screen/ProfileSection/EditProfileScreen';
import AboutUs from '../screen/ProfileSection/AboutUs';
import HelpScreen from '../screen/ProfileSection/HelpScreen';
import ServiceProviderProfileScreen from '../screen/service-provider/ServiceProviderProfileScreen';
import PostReviewScreen from '../screen/PostReviewScreen';
import ServiceRequestDetailScreen from '../screen/service-request/ServiceRequestDetailScreen';
import ServiceProviderReviewScreen from '../screen/service-provider/ServiceProviderReviewScreen';
import OrderPageScreen from '../screen/OrderPageScreen';
import ServiceList from '../screen/ProfileSection/ServiceList';
import WalletTransaction from '../screen/wallet/WalletTransaction';
import ComplaintForm from '../screen/ProfileSection/ComplaintForm';
import AllServiceScreen from '../screen/services/AllServiceScreen';
import PaymentScreen from '../screen/PaymentScreen';
import AddonScreen from '../screen/addon/AddonScreen';
import AddonDetails from '../screen/addon/AddonDetailsScreen';
import SendBookingRequestScreen, {
  screenOptions as sendBookingRequestScreenOptions,
} from '../screen/booking/SendBookingRequestScreen';
import AddressBookScreen, {
  screenOptions as addressBookScreenOptions,
} from '../screen/address/AddressBookScreen';
import EditAddressScreen, {
  screenOptions as editAddressScreenOptions,
} from '../screen/address/EditAddressScreen';
import NewAddressScreen, {
  screenOptions as newAddressScreenOptions,
} from '../screen/address/NewAddressScreen';
import AddressListScreen from '../screen/address/AddressListScreen';
import ServiceConfirmationScreen from '../screen/ServiceConfirmationScreen';
import PayForServiceScreen from '../screen/PayForServiceScreen';
import InvoiceScreen from '../screen/InvoiceScreen';
import MessageScreen, {
  screenOptions as messageScreenOptions,
} from '../screen/MessageScreen';
import CartScreen from '../screen/cart/CartScreen';
import UpdateEmailScreen from '../screen/ProfileSection/UpdateEmailScreen';
import OrderSummaryScreen from '../screen/checkout/OrderSummaryScreen';
import CheckoutScreen from '../screen/checkout/CheckoutScreen';
import CardPaymentScreen from '../screen/checkout/CardPaymentScreen';
import OrderDetailsScreen from '../screen/order/OrderDetailsScreen';
import UpdateMobileScreen from '../screen/ProfileSection/UpdateMobileScreen';
import { useNotificationNavigation } from '../lib/notifee';
import Entypo from 'react-native-vector-icons/Entypo'
import { Text, View } from 'native-base';
import { useGetCartList } from '../hooks/cart/useGetCartList';
import SameBookingRequest from '../screen/service-request/SameBookingRequest'

const Stack = createNativeStackNavigator();

const stackOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: '#fff',
  headerBackTitle: null,
  headerBackTitleVisible: false,
};

const routes = [
  {
    name: 'BottomTabs',
    component: BottomTabs,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'NewAddress',
    component: NewAddressScreen,
    options: newAddressScreenOptions,
  },
  {
    name: 'AddressBook',
    component: AddressBookScreen,
    options: addressBookScreenOptions,
  },
  {
    name: 'EditAddress',
    component: EditAddressScreen,
    options: editAddressScreenOptions,
  },
  // {
  //   name: 'SubCategories',
  //   component: SubCategoriesScreen,
  //   options: subCategoriesScreenOptions,
  // },

  {
    name: 'SendBookingRequest',
    component: SendBookingRequestScreen,
    options: sendBookingRequestScreenOptions,
  },
  {
    name: 'Wallet',
    component: WalletScreen,
    options: walletScreenOptions,
  },

  {
    name: 'message',
    component: MessageScreen,
    options: messageScreenOptions,
  },
];

const RootStack = () => {
  useNotificationNavigation();

  const [ProductCartList, ServiceCartList, loading] = useGetCartList();


  const cartLength = ProductCartList.length + ServiceCartList.length;

  return (
    <Stack.Navigator screenOptions={stackOptions}>
      {routes.map(({ name, component, options }) => (
        <Stack.Screen name={name} component={component} options={options} />
      ))}
      <Stack.Screen
        name="Payment"
        component={PaymentOption}
        options={{
          title: i18n.t('langChange:managePaymentMethod'),
        }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={({ navigation }) => ({
          title: i18n.t('langChange:chooseAddress'),
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />
      <Stack.Screen
        name="Password"
        component={Security}
        options={{
          title: i18n.t('langChange:updPass'),
        }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          title: i18n.t('langChange:feedback'),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: i18n.t('langChange:editProfile'),
        }}
      />
      <Stack.Screen
        name="about"
        component={AboutUs}
        options={{
          title: i18n.t('langChange:aboutUs'),
        }}
      />
      <Stack.Screen
        name="help"
        component={HelpScreen}
        options={{
          title: i18n.t('langChange:urgentService'),
        }}
      />
      <Stack.Screen
        name="ServiceProviderProfile"
        component={ServiceProviderProfileScreen}
        options={({ navigation }) => ({
          title: i18n.t('langChange:serviceProviderProfile'),
          headerRight: () => (
            <View>
              <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
              <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
                <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
              </View>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="SubCategories"
        component={SubCategoriesScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />

      <Stack.Screen
        name="ServiceProviders"
        component={ServiceProvidersListScreen}
        options={({ navigation }) => ({
          headerTitle: i18n.t('langChange:serviceProviders'),
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />



      <Stack.Screen
        name="SlotBooking"
        component={SlotBookingScreen}
        options={({ navigation }) => ({
          title: i18n.t('langChange:bookSlot'),
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />
      <Stack.Screen
        name="PostReview"
        component={PostReviewScreen}
        options={{
          title: i18n.t('langChange:revScreenTitle'),
        }}
      />
      <Stack.Screen
        name="RequestDetails"
        component={ServiceRequestDetailScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
          title: i18n.t('langChange:reqDetails'),
        })}
      />
      <Stack.Screen
        name="ProviderReview"
        component={ServiceProviderReviewScreen}
        options={{
          title: i18n.t('langChange:serviceProviderRev'),
        }}
      />
      <Stack.Screen
        name="Order"
        component={OrderPageScreen}
        options={{
          title: i18n.t('langChange:bookDetails'),
        }}
      />
      <Stack.Screen
        name="SameBooking"
        component={SameBookingRequest}
        options={{
          title: i18n.t('langChange:bookDetails'),
        }}
      />

      <Stack.Screen
        name="ServiceList"
        component={ServiceList}
        options={{
          title: i18n.t('langChange:raiseComplaint'),
        }}
      />
      <Stack.Screen
        name="walletActivity"
        component={WalletTransaction}
        options={{
          title: i18n.t('langChange:walletTrans'),
        }}
      />
      <Stack.Screen
        name="AllService"
        component={AllServiceScreen}
        options={() => ({
          title: i18n.t('langChange:searchTitle'),
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />
      <Stack.Screen
        name="ComplaintForm"
        component={ComplaintForm}
        options={{
          title: i18n.t('langChange:raiseComplaint'),
        }}
      />
      <Stack.Screen
        name="OnlinePayment"
        component={PaymentScreen}
        options={{
          title: i18n.t('langChange:onlinePayment'),
        }}
      />
      <Stack.Screen
        name="PayForService"
        component={PayForServiceScreen}
        options={{
          title: i18n.t('langChange:payForService'),
        }}
      />
      <Stack.Screen
        name="serviceConfirmation"
        component={ServiceConfirmationScreen}
        options={{
          title: i18n.t('langChange:serviceConf'),
        }}
      />
      <Stack.Screen
        name="invoice"
        component={InvoiceScreen}
        options={{
          title: i18n.t('langChange:invoiceBtn'),

        }}
      />
      <Stack.Screen
        name="Addon"
        component={AddonScreen}
        options={() => ({
          title: i18n.t('langChange:products'),
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />
      <Stack.Screen
        name="AddonDetails"
        component={AddonDetails}
        options={() => ({
          title: i18n.t('langChange:productsDetails'),
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          title: i18n.t('langChange:cart'),
        }}
      />
      <Stack.Screen
        name="UpdateEmail"
        component={UpdateEmailScreen}
        options={{
          title: i18n.t('langChange:updateEmail'),
        }}
      // options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen
        name="UpdateMobile"
        component={UpdateMobileScreen}
        options={{
          title: i18n.t('langChange:updateMobile')
        }}
      // options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummaryScreen}
        options={{
          title: i18n.t('langChange:orderSummary')
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: i18n.t('langChange:checkout')
        }}
      />
      <Stack.Screen
        name="CardPayment"
        component={CardPaymentScreen}
        options={{ title: i18n.t('langChange:payment') }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailsScreen}
        options={({ navigation }) => ({
          title: i18n.t('langChange:orderDetails'),
          headerRight: () => (
            <View>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
