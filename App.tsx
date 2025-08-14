/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useMatchHook } from './useMatchHook';
import { Event } from './MatchService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { matchResult, isLoading, updateResult, queryMatch, updateMatch } = useMatchHook();

  const handleQueryMatchResult = () => {
    queryMatch(123); // Using sample match ID 123
  };

  const handleHomeGoal = () => {
    updateMatch(123, Event.HomeGoal); // Using sample match ID 123
  };

  const handleAwayGoal = () => {
    updateMatch(123, Event.AwayGoal); // Using sample match ID 123
  };

  const handleCancelHomeGoal = () => {
    updateMatch(123, Event.CancelHomeGoal); // Using sample match ID 123
  };

  const handleCancelAwayGoal = () => {
    updateMatch(123, Event.CancelAwayGoal); // Using sample match ID 123
  };

  // Parse the match result to display score
  const getScoreDisplay = () => {
    if (isLoading) return 'Loading...';
    if (!matchResult) return '0:0 (First Half)';
    
    // If matchResult contains "HH" format, parse and display it
    if (matchResult.includes(':')) {
      // Extract just the result part if it contains "Match ID:" prefix
      const resultPart = matchResult.includes('Result:') 
        ? matchResult.split('Result: ')[1] 
        : matchResult;
      return resultPart || '0:0 (First Half)';
    }
    
    return matchResult || '0:0 (First Half)';
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {/* 分數顯示 */}
        <Text style={styles.scoreText}>{getScoreDisplay()}</Text>
        
        {/* 更新結果顯示 */}
        {updateResult ? (
          <Text style={styles.updateResultText}>{updateResult}</Text>
        ) : null}
        
        {/* 按鈕區域 */}
                <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleQueryMatchResult}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Querying...' : 'QueryMatchResult'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleHomeGoal}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating...' : 'Home Goal'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleAwayGoal}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating...' : 'Away Goal'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleCancelHomeGoal}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating...' : 'Cancel Home Goal'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleCancelAwayGoal}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating...' : 'Cancel Away Goal'}
            </Text>
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
  updateResultText: {
    fontSize: 14,
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 5,
    textAlign: 'center',
    color: '#2d5a2d',
    borderWidth: 1,
    borderColor: '#4caf50',
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
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
