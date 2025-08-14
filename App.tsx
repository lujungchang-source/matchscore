/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {/* 分數顯示 */}
        <Text style={styles.scoreText}>0:0 (First Half)</Text>
        
        {/* 按鈕區域 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => console.log('QueryMatchResult')}>
            <Text style={styles.buttonText}>QueryMatchResult</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => console.log('Home Goal')}>
            <Text style={styles.buttonText}>Home Goal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => console.log('Away Goal')}>
            <Text style={styles.buttonText}>Away Goal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => console.log('Cancel Home Goal')}>
            <Text style={styles.buttonText}>Cancel Home Goal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => console.log('Cancel Away Goal')}>
            <Text style={styles.buttonText}>Cancel Away Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
