import React, {Component} from 'react';
import {Button, Switch, StyleSheet, Text, View} from 'react-native';

import WebView from 'react-native-webview';

const HTML = `
<!DOCTYPE html>\n
<html>
  <head>
    <title>Alerts</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=320, user-scalable=no">
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        font: 62.5% arial, sans-serif;
        background: #ccc;
      }
      a {
        display: block;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button onclick="openWindow()">Call window.open() from JS</button>
    <a href="https://google.com" target="_blank">Call target=_blank link from DOM</a>
    <script>
      function openWindow() {
        window.open('https://google.com', '_blank')
      }
    </script>
  </body>
</html>
`;

type Props = {};
type State = {
  shouldInterceptOpenWindow: boolean,
  text: string,
  webViewKey: number
};

export default class Alerts extends Component<Props, State> {
  state = {
    shouldInterceptOpenWindow: true,
    text: 'No OpenWindow event intercepted yet',
    webViewKey: 1
  };

  interceptOpenWindow = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent
    const { targetUrl } = nativeEvent
    this.setState({
      text: `Intercepted OpenWindow event for ${targetUrl} at ${Date.now()}`
    })
  };

  toggleShouldInterceptOpenWindow = () => {
    this.setState(prevState => ({
      shouldInterceptOpenWindow: !prevState.shouldInterceptOpenWindow,
      webViewKey: prevState.webViewKey + 1
    }))
  };

  resetWebView = () => {
    this.setState(prevState => ({
      webViewKey: prevState.webViewKey + 1
    }))
  };

  render() {
    const onOpenWindow = this.state.shouldInterceptOpenWindow
      ? this.interceptOpenWindow
      : undefined

    return (
      <View style={styles.container}>
        <View style={styles.interceptSection}>
          <Text style={styles.text}>
            Intercept OpenWindow event
          </Text>
          <Switch
            onValueChange={this.toggleShouldInterceptOpenWindow}
            value={this.state.shouldInterceptOpenWindow}
          />
        </View>
        <WebView
          key={this.state.webViewKey}
          source={{html: HTML}}
          automaticallyAdjustContentInsets={false}
          onOpenWindow={onOpenWindow}
        />
        <Text style={styles.text}>
          {this.state.text}
        </Text>
        <Button title="Reset webview" onPress={this.resetWebView} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 200
  },
  interceptSection: {
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 20
  },
  text: {
    color: 'black'
  }
})
