import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  BackHandler,
  Platform,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Draggable from 'react-native-draggable';
import DeviceInfo from 'react-native-device-info';
import {NetworkInfo} from 'react-native-network-info';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faTimes, faRandom} from '@fortawesome/free-solid-svg-icons';
import ProgressBar from 'react-native-progress/Bar';
import promiseAny from 'promise-any';
import Navbar from './navbar';
import { pingIp, getConnectionQuality, getNetworkQualityClass, getNetworkQualityColorByClass, getIpAddress, sha256 } from '../scripts/ping';
import ColorPattern from '../../src/styles/variables';
import * as Sentry from '@sentry/react-native';

const config = require('../statics/config.json');
const packageJSON = require('../../package.json');
const launchscreen = require('../assets/launchscreen.jpg');
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const {urlList} = config;
const {
  colors: {shadow},
} = ColorPattern;

const loadingPageHtml = `
<html>
  <head>
    <title>loading...</title>
  </head>
  <body>
  </body>
</html>
`;

const MainWebview = (myWebView) => {
  const [rootTransition, setRootTransition] = useState(null);
  useEffect(() => {
    if (!rootTransition) {
      setRootTransition(Sentry.startTransaction({ name: "MainWebview-transaction" }));
    }
  }, []);
  //
  // styles related
  //
  const {show, hide} = styles;
  const getDisplayStyle = (isShow) => isShow ? show : hide;
  
  //
  // current site url related
  //
  const [curLane, setCurLane] = useState(null);
  const [currentSiteUrl, setCurrentSiteUrl] = useState('');
  const changeLane = (i) => {
    setCurLane(i);
    setCurrentSiteUrl(urlList[i]);
  };
  const [isBestIp, setIsBestIp] = useState(true);

  //
  // navbar related
  //
  const [headerTitle, setHeaderTitle] = useState('');
  const [navbarVisiblity, setNavbarVisiblity] = useState(true);
  const [navState, setNavState] = useState([]);

  //
  // float btn related
  //
  const [isFloatBtnShow, setIsFloatBtnShow] = useState(true);
  const [floatIcon, setFloatIcon] = useState(faPlus);
  const [expendStatus, setExpendStatus] = useState(false);
  const [currentOrientation, setCurrentOrientation] = useState('portait');
  const floatBtnDefaultPos = {
    x: deviceWidth - 70,
    y: deviceHeight - 300,
    minX: 10,
    minY: 60,
    maxX: deviceWidth,
    maxY: deviceHeight - 220,
  };
  const mergedStyle = StyleSheet.flatten([styles.float, getDisplayStyle(navbarVisiblity)]);
  const mergedSubStyle = StyleSheet.flatten([styles.floatSub, getDisplayStyle(expendStatus)]);

  //
  // webview related
  //
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  //
  // version modal related
  //
  const [modalVisible, setModalVisible] = useState(false);
  const [p, setP] = useState('');
  const [d, setD] = useState('');
  const [dId, setDid] = useState('');
  const [brand, setB] = useState('');
  const [ua, setUa] = useState('');
  const [ip, setIp] = useState('');
  const [ipv4, setIpv4] = useState('');
  const [gatewayIp, setGatewayIp] = useState('');
  const [ipify, setIpify] = useState('');
  const [bundleId, setBundleId] = useState('');

  //
  // detect state:currentSiteUrl change, and force webview redirect to it
  //
  useEffect(() => {
    if (currentSiteUrl) {
      myWebView.injectJavaScript(`window.location="${currentSiteUrl}"`);
    }
  }, [currentSiteUrl]);

  //
  // check orientation
  //
  const onOrientationChange = () => {
    const isPortrait = () => {
      return Dimensions.get('screen').height > Dimensions.get('screen').width;
    };
    if (isPortrait()) {
      setCurrentOrientation('portait');
      setNavbarVisiblity(true);
    } else {
      setCurrentOrientation('landscape');
      setNavbarVisiblity(false);
    }
  };
  useEffect(() => {
    Dimensions.addEventListener('change', onOrientationChange);
    return () => {
      Dimensions.removeEventListener('change', onOrientationChange);
    };
  });

  //
  // make sure we can go to the best lane
  //
  const [isFireThreeLanesDetect, setIsFireThreeLanesDetect] = useState(true);
  const [isFireThreeLanesDetectLoading, setIsFireThreeLanesDetectLoading] = useState(false);
  const genLatencyMsObj = useCallback(
    (text) => {
      return urlList.reduce((acc, { text }, index) => {
        acc[index] = {
          url: '',
          text,
          ms: Infinity,
        }
        return acc;
      }, {})
    },
  );
  const [latencyMsObj, setLatencyMsObj] = useState(genLatencyMsObj('尚未检测'));
  const latencyMsObjRef = useRef(latencyMsObj);
  useEffect(() => {
    if (modalVisible && isFireThreeLanesDetect && !isFireThreeLanesDetectLoading) {
      setIsFireThreeLanesDetect(false);
      setIsFireThreeLanesDetectLoading(true);

      setLatencyMsObj(genLatencyMsObj('检测中...'));
      latencyMsObjRef.current = genLatencyMsObj('检测中...');
      
      function threeLaneDetectation() {
        return Promise.all(urlList.map((url, index) => {
          return pingIp({ url })
            .then(({ ms }) => {
              latencyMsObjRef.current = {
                ...latencyMsObjRef.current,
                [index]: {
                  url,
                  text: `${ms} ms`,
                  ms,
                },
              };
            })
            .catch(({ errorType, status, ms, url }) => {
              if (errorType === 'error code') {
                latencyMsObjRef.current = {
                  ...latencyMsObjRef.current,
                  [index]: {
                    text: `${errorType} ${status}`,
                    ms: Infinity,
                    url,
                  },
                };
              } else {
                latencyMsObjRef.current = {
                  ...latencyMsObjRef.current,
                  [index]: {
                    text: `${errorType}`,
                    ms: Infinity,
                    url,
                  },
                };
              }
            })
            .finally(() => {
              setLatencyMsObj({ ...latencyMsObjRef.current });
            });
        }));
      }
      async function fireThreeLaneDetectation() {
        await threeLaneDetectation();
        Sentry.withScope(scope => {
          scope.setFingerprint(['latency of lanes', Platform.OS]);
          scope.setTag('ua', navigator.userAgent);
          scope.setTag('ip', ipify);
          Sentry.setUser({
            id: DeviceInfo.getUniqueId(),
            ip: ipify,
          });
          scope.setExtra('latencies', latencyMsObjRef.current);
          scope.setLevel('info');
          Sentry.captureMessage(`[${Platform.OS === 'android' ? 'Android' : 'IOS'}] latency of lanes`);
          setIsFireThreeLanesDetectLoading(false);
          setIsFireThreeLanesDetect(false);
        });
      }
      fireThreeLaneDetectation();
    }
  }, [modalVisible, isFireThreeLanesDetect, latencyMsObj]);

  //
  // make sure we can go to the best lane
  //
  useEffect(() => {
    async function getBestIp(cb) {
      const result = await promiseAny(urlList.map((url) => {
        return pingIp({ url })
      }));
      const urlIndex = urlList.indexOf(result.url);
      if (urlIndex !== -1) {
        changeLane(urlIndex);
      }
      if (cb) cb();
    }
    if (isBestIp) {
      getBestIp(() => {
        setIsBestIp(false);
      });
    }
  }, [isBestIp, setIsBestIp]);

  //
  // btn functions
  // 
  const backKeyPressed = () => {
    if (myWebView && navState.canGoBack) {
      myWebView.goBack();
    }
  };
  const reloadKeyPressed = () => {
    if (myWebView) {
      myWebView.injectJavaScript(`window.location="${currentSiteUrl}"`);
    }
  };


  //
  // detect android back button onpress and trigger history back
  //
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (navState.canGoBack) {
            backKeyPressed();
          } else {
            Alert.alert('温馨提示', '是否确认结束游玩？', [
              {
                text: '下次再玩',
                onPress: () => BackHandler.exitApp(),
              },
              {
                text: '继续玩玩',
                onPress: () => null,
                style: 'cancel',
              },
            ]);
          }
          return true;
        },
      );
      return () => backHandler.remove();
    }
  });

  // show errors on version modal
  const [errors, setErrors] = useState({
    onHttpError: '',
    onError: '',
  });

  // getVersionDetails
  useEffect(() => {
    async function getVersionDetails() {
      const [d_p, d_d, d_id, d_brand, d_ua, d_ip, d_ipv4, d_gatewayIp, d_bundle_id] = await Promise.all([
        DeviceInfo.getProduct(),
        DeviceInfo.getDevice(),
        DeviceInfo.getDeviceId(),
        DeviceInfo.getBrand(),
        DeviceInfo.getUserAgent(),
        NetworkInfo.getIPAddress(),
        NetworkInfo.getIPV4Address(),
        NetworkInfo.getGatewayIPAddress(),
        DeviceInfo.getBundleId(),
      ]);
      getIpAddress().then((ip) => {
        setIpify(ip);
      });
      setP(d_p);
      setD(d_d);
      setDid(d_id);
      setB(d_brand);
      setUa(d_ua);
      setIp(d_ip);
      setIpv4(d_ipv4);
      setGatewayIp(d_gatewayIp);
      let appName = '';
      try {
        appName = d_bundle_id.split('.')[2];
      } catch (e) {
        appName = 'splitError';
      }
      setBundleId(appName);
    }
    getVersionDetails();
  }, []);

  // upload report
  const [uploadReport, setUploadReport] = useState(false);
  useEffect(() => {
    if (uploadReport && !isFireThreeLanesDetectLoading) {
      Sentry.withScope(scope => {
        scope.setFingerprint(['react native upload report', Platform.OS]);
        scope.setTag('ua', navigator.userAgent);
        scope.setTag('ip', ipify);
        Sentry.setUser({
          id: DeviceInfo.getUniqueId(),
          ip: ipify,
        });
        Sentry.captureMessage(`[${Platform.OS === 'android' ? 'Android' : 'IOS'}] react native upload report`, {
          level: 'info',
          extra: {
            appVersion: packageJSON.version,
            latencies: latencyMsObj,
            errors,
          },
        });
      });
      setTimeout(() => {
        Alert.alert('温馨提示', '上报检测成功!', [
          {
            text: '完成',
          },
        ]);
        setUploadReport(false);
      }, 2500);
    }
  }, [uploadReport, isFireThreeLanesDetectLoading])

  return (
    <View style={styles.container}>
      {
        isPageLoaded ? (
          <Navbar
            title={headerTitle}
            style={navbarVisiblity}
            backKeyPressed={backKeyPressed}
            reloadKeyPressed={reloadKeyPressed}
            curLane={curLane}
          />
        ) : <Image source={launchscreen} style={styles.launchscreen} />
      }
      <WebView
        ref={(ref) => (myWebView = ref)}
        source={curLane !== null ? { uri: urlList[curLane] } : { html: loadingPageHtml }}
        style={getDisplayStyle(isPageLoaded)}
        onMessage={(event) => {
          console.log(event.nativeEvent.data);
        }}
        onLoad={(event) => {
          console.log('onLoad');
          setHeaderTitle(event.nativeEvent.title);
        }}
        onLoadEnd={() => {
          console.log('onLoadEnd');
          if (rootTransition) {
            rootTransition.finish();
            console.log('root transition send!');
          }
          setIsPageLoaded(true);
        }}
        onNavigationStateChange={(event) => {
          if (event.url.match(/\/deposit\?hwaoPayMethod=/g)) {
            const fullUrl = decodeURIComponent(event.url);
            const tester = /\/deposit\?hwaoPayMethod=https?:\/\/[\w|\.|\/|\?|\=]+/gi;
            const arr = fullUrl.match(tester);
            if (arr && arr.length === 1) {
              const thirdPartyPayUrl = arr[0].split(
                '/deposit?hwaoPayMethod=',
              )[1];
              Linking.openURL(thirdPartyPayUrl);
              return;
            }
          }
          if (event.url.match(/play\//)) {
            setIsFloatBtnShow(false);
          } else {
            setIsFloatBtnShow(true);
          }
          setHeaderTitle(event.title);
          setNavState(event);
        }}
        onHttpError={(event) => {
          console.log('onHttpError');
          const httpErrorCode = event.nativeEvent.statusCode;
          const httpErrorUrl = event.nativeEvent.url;
          Sentry.withScope(scope => {
            scope.setFingerprint(['onHttpError', Platform.OS]);
            scope.setTag('ua', navigator.userAgent);
            scope.setTag('ip', ipify);
            Sentry.setUser({
              id: DeviceInfo.getUniqueId(),
              ip: ipify,
            });
            Sentry.captureException(new Error(`[${Platform.OS === 'android' ? 'Android' : 'IOS'}] ${httpErrorCode}: ${httpErrorUrl}`));
            setErrors({
              ...errors,
              onHttpError: `${errors.onHttpError}|@@@|${event.nativeEvent.statusCode}: ${event.nativeEvent.url}`,
            });
          });
        }}
        onError={(syntheticEvent) => {
          console.log('onError');
          const {nativeEvent} = syntheticEvent;
          Sentry.withScope(scope => {
            scope.setFingerprint(['onError', Platform.OS]);
            scope.setTag('ua', navigator.userAgent);
            scope.setTag('ip', ipify);
            Sentry.setUser({
              id: DeviceInfo.getUniqueId(),
              ip: ipify,
            });
            Sentry.captureException(new Error(`[${Platform.OS === 'android' ? 'Android' : 'IOS'}] ${nativeEvent.description}`));
            setErrors({
              ...errors,
              onError: `${errors.onError}|@@@|${nativeEvent.description}`,
            });
          });
        }}
      />
      {isFloatBtnShow && (
        <Draggable
          x={floatBtnDefaultPos.x}
          y={floatBtnDefaultPos.y}
          minX={floatBtnDefaultPos.minX}
          minY={floatBtnDefaultPos.minY}
          maxX={floatBtnDefaultPos.maxX}
          maxY={floatBtnDefaultPos.maxY}>
          <View style={styles.toolContainer}>
            <View style={mergedStyle}>
              <TouchableOpacity
                onPress={() => {
                  if (floatIcon === faPlus) {
                    setFloatIcon(faTimes);
                    setExpendStatus(true);
                  } else {
                    setFloatIcon(faPlus);
                    setExpendStatus(false);
                  }
                }}>
                <FontAwesomeIcon
                  style={styles.floatBtn}
                  icon={floatIcon}
                  color={'#FFF'}
                  size={29}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setFloatIcon(faPlus);
                setExpendStatus(false);
                setIsBestIp(true);
              }}>
              <View style={{ ...styles.labelWrap, ...mergedSubStyle}}>
                <Text style={styles.label}>换线路</Text>
              </View>
            </TouchableOpacity>
            {/* {urlList.map((url, index) => {
              if (index === curLane) return null;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setFloatIcon(faPlus);
                    setExpendStatus(false);
                    changeLane(index);
                  }}>
                  <View style={{ ...styles.labelWrap, ...mergedSubStyle}} key={`${url}-${index}`}>
                    <Text style={styles.label}>线路{index + 1}</Text>
                  </View>
                </TouchableOpacity>
              );
            })} */}
            <TouchableOpacity
              onPress={async () => {
                setModalVisible(true);
              }}>
              <View style={{ ...styles.labelWrap, ...mergedSubStyle, backgroundColor: '#8ce609'}}>
                  <Text style={styles.label}>版本</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Draggable>
      )}
      <Modal style={styles.modal} animationType="slide" visible={modalVisible}>
        <SafeAreaView style={styles.modalSafeArea} />
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView style={{backgroundColor: shadow, height: '100%', padding: 20}}>
            <View style={{paddingBottom: 100}}>
              <View key="d_0" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>程序版本:</Text>
                </View>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>{packageJSON.version}</Text>
                </View>
              </View>
              <View key="d_1" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>系统类型:</Text>
                </View>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>{Platform.OS}</Text>
                </View>
              </View>
              <View key="d_2" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>系统版本:</Text>
                </View>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>{Platform.Version}</Text>
                </View>
              </View>
              <View key="d_3" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>网络地址:</Text>
                </View>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>{ipify}</Text>
                </View>
              </View>
              <View key="d_4" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>识别码:</Text>
                </View>
              </View>
              <View key="t_4" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>{DeviceInfo.getUniqueId()}</Text>
                </View>
              </View>
              {/* <View key="d_5" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>客户资讯:</Text>
                </View>
              </View>
              <View key="t_5" style={styles.modalBlock}>
                <View style={styles.modalLabelTop}>
                  <Text style={styles.modalLabel}>{navigator.userAgent}</Text>
                </View>
              </View> */}
              <View style={styles.modalBtnsWrap}>
                <TouchableOpacity
                  style={{ ...styles.modalBackBtn, backgroundColor: '#1579d6' }}
                  onPress={() => {
                    if (!isFireThreeLanesDetectLoading && !uploadReport) {
                      setIsFireThreeLanesDetect(true);
                    }
                  }}>
                  <View>
                    {
                      isFireThreeLanesDetectLoading || uploadReport ?
                      <ActivityIndicator size="small" color="#fff" />
                      : <Text style={{...styles.label, marginTop: 0}}>线路检测</Text>
                    }
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{ ...styles.modalBackBtn, backgroundColor: '#338833' }}
                  onPress={() => {
                    if (!isFireThreeLanesDetectLoading && !uploadReport) {
                      setUploadReport(true);
                    }
                  }}>
                  <View>
                    {
                      isFireThreeLanesDetectLoading || uploadReport ?
                      <ActivityIndicator size="small" color="#fff" />
                      : <Text style={{...styles.label, marginTop: 0}}>上报检测</Text>
                    }
                  </View>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.modalBackBtn}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <View>
                    <Text style={{...styles.label, marginTop: 0}}>返回</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {
                Object.keys(latencyMsObj).map((key, i) => {
                  const quality = getConnectionQuality(latencyMsObj[i].ms);
                  const color = getNetworkQualityColorByClass(getNetworkQualityClass(quality));
                  return (
                    <View key={`d_${13 + i}`} style={styles.latencyBarWrap}>
                      <Text style={styles.modalLabel}>
                        线路{i + 1}: {urlList[i]}
                      </Text>
                      <Text style={styles.modalLabel}>
                        {latencyMsObj[i].text}
                      </Text>
                      <ProgressBar key={`pb_${0 + i}`} progress={quality} width={null} color={color} />
                    </View>
                  );
                })
              }
              {
                Object.keys(errors).map((key, i) => {
                  if (!errors[key]) return null;
                  return (
                    <Text key={`d_${9 + i}`} style={styles.modalLabel}>
                      { key === 'onError' ? '系统侦测' : 'http侦测'}: {errors[key]}
                    </Text>
                  );
                })
              }
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#F00',
  },
  launchscreen: {
    resizeMode: 'cover',
    alignSelf: 'stretch',
    width: null,
    height: deviceHeight,
  },
  toolContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  float: {
    margin: 10,
    width: 56,
    height: 56,
    backgroundColor: '#EC0',
    borderRadius: 28,
    shadowOffset: {height: 3, width: 0},
    shadowColor: '#333',
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  floatBtn: {
    margin: 13,
  },
  floatSub: {
    marginBottom: 5,
    width: 50,
    height: 50,
    backgroundColor: '#D00',
    borderRadius: 25,
    shadowOffset: {height: 3, width: 0},
    shadowColor: '#333',
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  floatSubBtn: {
    margin: 10,
  },
  floatLabel: {
    width: 50,
    padding: 4,
    marginTop: 4,
    backgroundColor: '#333',
    borderRadius: 10,
    shadowOffset: {height: 3, width: 0},
    shadowColor: '#333',
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  labelWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'flex',
  },
  // modal
  modal: {
    zIndex: 999999,
  },
  modalSafeArea: {
    backgroundColor: shadow,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  modalBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  modalLabel: {
    color: 'white',
    fontSize: 16,
  },
  modalLabelTop: {
    marginBottom: 5,
  },
  modalBackBtn: {
    display: 'flex',
    padding: 10,
    width: '40%',
    textAlign: 'center',
    backgroundColor: '#F00',
  },
  latencyBarWrap: {
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 7,
  },
  modalBtnsWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },
});

export default MainWebview;
