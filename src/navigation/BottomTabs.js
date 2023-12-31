import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import i18n from 'i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import Colors from '../constants/Colors';
import HomeScreen from '../screen/services/HomeScreen';
import RewardScreen from '../screen/reward/RewardScreen';
import ProfileScreen from '../screen/BottomTabs/ProfileScreen';
import ServiceRequestScreen from '../screen/service-request/ServiceRequestScreen';
import { HomeHeader } from '../components/header/HomeHeader';
import OrderScreen from '../screen/order/OrderScreen';
import {View,Text} from 'native-base'
import { useGetCartList } from '../hooks/cart/useGetCartList';
import SameBookingRequest from '../screen/service-request/SameBookingRequest';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {

  const [ProductCartList, ServiceCartList, loading] = useGetCartList();

  const cartLength = ProductCartList.length + ServiceCartList.length;

  return (
    <Tab.Navigator
      shifting={false}
      backBehavior={'initialRoute'}
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: 'rgb(162,162,162)',
        tabBarStyle: {
          backgroundColor: Colors.primary,
        },
      }}
      barStyle={{ backgroundColor: Colors.primary }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: props => <HomeHeader {...props} />,
          tabBarLabel: i18n.t('langChange:homeBottomTab'),
          tabBarIcon: tabInfo => (
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
              size={25}
              color={tabInfo.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ServiceReq"
        component={ServiceRequestScreen}
        options={() => ({
          headerTitle: i18n.t('langChange:serviceScreenTitle'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          headerRight: ({ navigation }) => (
            <View style={{ marginRight: 12 }}>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
            // <Entypo style={{ marginRight: 12 }} onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
          ),
          tabBarLabel: i18n.t('langChange:serviceBottomTab'),
          tabBarIcon: tabInfo => (
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'}
              size={25}
              color={tabInfo.color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={({ navigation }) => ({
          headerTitle: i18n.t('langChange:orders'),
          headerRight: () => (
            <View style={{ marginRight: 12 }}>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          tabBarLabel: i18n.t('langChange:orders'),
          tabBarIcon: tabInfo => (
            <Ionicons name="document-text" size={25} color={tabInfo.color} />
          ),
        })}
      />
      <Tab.Screen
        name="Reward"
        component={RewardScreen}
        options={({ navigation }) => ({
          headerTitle: i18n.t('langChange:referToWin'),
          headerStyle: { backgroundColor: Colors.primary },
          headerRight: () => (
            <View style={{ marginRight: 12 }}>
            <Entypo onPress={() => { navigation.navigate('CartScreen') }} color={'white'} name="shopping-cart" size={24} />
            <View position={'absolute'} rounded={'full'} alignItems={'center'} justifyContent={'center'} style={{ width: 20, height: 20, left: 10, bottom: 14 }} bg={'red.600'}>
              <Text style={{ fontSize: 10, color: 'white' }}>{cartLength}</Text>
            </View>
          </View>
          ),
          headerTintColor: 'white',
          tabBarLabel: i18n.t('langChange:rewardBottomTab'),
          tabBarIcon: tabInfo => (
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-wallet' : 'md-wallet'}
              size={25}
              color={tabInfo.color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation})=>({
          headerTitle: i18n.t('langChange:myProfile'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          tabBarLabel: i18n.t('langChange:profileBottomTab'),
         
          tabBarIcon: tabInfo => (
            <Ionicons
              name={
                Platform.OS === 'ios' ? 'ios-person-circle' : 'md-person-circle'
              }
              size={25}
              color={tabInfo.color}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
