import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import StackNavigation from './src/Navigation/StackNavigation'

const App = () => {
  return (
    <SafeAreaProvider>
      <StackNavigation />
    </SafeAreaProvider>
  )
}

export default App