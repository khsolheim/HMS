import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '@/features/onboarding/screens/WelcomeScreen';
import { CreateHouseholdScreen } from '@/features/onboarding/screens/CreateHouseholdScreen';
import { DemoDataScreen } from '@/features/onboarding/screens/DemoDataScreen';
import { CompleteScreen } from '@/features/onboarding/screens/CompleteScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  CreateHousehold: undefined;
  DemoData: { householdId: string };
  Tutorial: undefined;
  Complete: undefined;
};

type OnboardingNavigatorProps = {
  onComplete: () => void;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="CreateHousehold"
        component={CreateHouseholdScreen}
        options={{
          headerShown: true,
          title: 'Opprett husholdning',
          headerBackTitle: 'Tilbake',
        }}
      />
      <Stack.Screen
        name="DemoData"
        component={DemoDataScreen}
        options={{
          headerShown: true,
          title: 'Demo-data',
          headerBackTitle: 'Tilbake',
        }}
      />
      <Stack.Screen name="Complete">
        {() => <CompleteScreen onComplete={onComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

