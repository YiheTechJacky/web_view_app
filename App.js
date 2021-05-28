/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import GeneralStatusBarColor from './src/components/generalStatusBarColor';
import MainWebview from './src/components/webview';
import ColorPattern from './src/styles/variables';

import * as Sentry from '@sentry/react-native';
import sentryDnsMapping from './src/components/sentryDsnMapping';
const config = require('./src/statics/config.json');

Sentry.init({ 
  // dsn: sentryDnsMapping[config.platName] || sentryDnsMapping.test, 
  dsn: '',
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  enableAutoSessionTracking: true,
});


const {
  colors: { shadow },
} = ColorPattern;

const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView style={styles.statusBarArea} />
      <SafeAreaView style={styles.container}>
        <GeneralStatusBarColor backgroundColor={shadow} barStyle="light-content" />
        <MainWebview />
      </SafeAreaView>
    </>
  );
};


const styles = StyleSheet.create({
  statusBarArea: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
