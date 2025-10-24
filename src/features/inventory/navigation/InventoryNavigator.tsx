import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InventoryListScreen from '../screens/InventoryListScreen';
import AddItemScreen from '../screens/AddItemScreen';

export type InventoryStackParamList = {
  InventoryList: undefined;
  AddItem: undefined;
  ItemDetail: { itemId: string };
  EditItem: { itemId: string };
};

const Stack = createStackNavigator<InventoryStackParamList>();

export const InventoryNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InventoryList"
        component={InventoryListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{
          title: 'Legg til gjenstand',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

