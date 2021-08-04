import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import codePush from 'react-native-code-push';
import bg from './src/assets/launchscreen.jpg';
import App from "./App";
import domainList from './domainList';
import config from './src/statics/config.json';

const CssTheme = {
  colorPrimary: 'blue',
  colorSecondary: 'red',
  colorPositive: 'green',
  colorNegative: 'red',
  colorText: 'white',
  colorTextLight: 'grey',
};

const CssBtn = {
  // 线框按钮
  default: {
    // flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CssTheme.colorPrimary,
    height: 38,
    textAlign: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  defaultText: {
    color: CssTheme.colorText,
    textAlign: 'center',
    lineHeight: 36,
  },
  defaultBg: {
    // flex: 1,
    borderWidth: 1,
    borderColor: CssTheme.colorPrimary,
    backgroundColor: CssTheme.colorPrimary,
    height: 38,
    textAlign: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  defaultBgText: {
    color: 'white',
    lineHeight: 36,
    textAlign: 'center',
  },
  cancel: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    height: 38,
    textAlign: 'center',
  },
  cancelText: {
    color: CssTheme.colorTextLight,
    textAlign: 'center',
    lineHeight: 36,
  },
  // 表單按鈕
  // clearBtn: {
  //   width: 15,
  //   height: 15,
  // },
  // eyeBtn: {
  //   width: 25,
  //   height: 15,
  //   marginRight: 15,
  // },
  // 优惠活动【查看详情】按钮
  activityDetail: {
    width: 65,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: CssTheme.colorPrimary,
    alignSelf: 'center',
  },
  activityDetailText: {
    color: CssTheme.colorPrimary,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 13,
  },
  bet: {
    width: '55%',
    height: 50,
    backgroundColor: CssTheme.colorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  betText: {
    color: '#fff',
  },
  // 投注页【重置】按钮
  reset: {
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CssTheme.colorTextLight,
    borderRadius: 8,
  },
  resetText: {
    color: CssTheme.colorTextLight,
    lineHeight: 24,
    fontSize: 12,
  },
  // 投注页【往期开奖】按钮
  lotteryPastView: {
    borderWidth: 1,
    borderColor: CssTheme.colorPrimary,
    borderRadius: 8,
    width: 80,
    height: 24,
    overflow: 'hidden',
  },
  lotteryPastViewText: {
    color: CssTheme.colorPrimary,
    lineHeight: 22,
    fontSize: 12,
    textAlign: 'center',
  },
  loadingBg: {
    opacity: 0.8,
  },
  textBtnIcon: {
    fontSize: 18,
    color: CssTheme.colorPrimary,
    marginRight: 5,
  },
  boxTab: {
    width: '50%',
    borderBottomWidth: 1,
    borderColor: CssTheme.colorSecondary,
  },
  copyBtn: {
    height: 25,
    lineHeight: 25,
  },
  iconBtnBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
};

const CssLoading = {
  // 載入頁
  loadingView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  loadingViewBg: {
    flex: 1,
    // width: '100%',
    // height: '100%',
    resizeMode: 'cover',
  },
  loadingViewContent: {
    flex: 1,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  loadingViewBlock: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  loadingViewMessage: {
    marginTop: 10,
    marginBottom: 10,
    color: CssTheme.colorPrimary,
    fontSize: 16,
  },
  loadingViewMessageIcon: {
    fontSize: 60,
    color: CssTheme.colorPrimary,
  },
  loadingViewBtn: {
    marginTop: 30,
    width: '45%',
    alignSelf: 'flex-end',
  },
  loadingViewLogo: {
    width: '50%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  loadingViewText: {
    marginTop: 15,
    marginBottom: 15,
    color: CssTheme.colorTextLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingViewLableText: {
    marginTop: 10,
    color: CssTheme.colorSecondary,
    fontSize: 27,
    fontWeight: 'bold',
  },
  loadingViewBackBtn: {
    borderColor: '#0022ae',
    color: '#0022ae',
    width: 120,
  },
  loadingIconColor: {
    color: CssTheme.colorPrimary,
  },
  maintainView: {
    // justifyContent: 'flex-start',
  },
  maintainImg: {
    width: '75%',
    height: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  customContentText: {
    color: CssTheme.colorText,
  },

  // NetWork Check
  networkViewIcon: {
    fontSize: 60,
    color: CssTheme.colorPrimary,
    alignSelf: 'center',
  },
  topAreaTitle: {
    color: CssTheme.colorText,
    fontSize: 18,
    alignSelf: 'center',
  },
  topAreaContent: {
    color: CssTheme.colorPrimary,
    fontSize: 12,
    alignSelf: 'center',
    margin: 10,
  },
  topAreaList: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  topAreaText: {
    color: CssTheme.colorPrimary,
    fontSize: 16,
  },
  versionArea: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
    padding: 10,
  },
  pingArea: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  pingListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: CssTheme.colorText,
  },
  listTitle: {
    color: CssTheme.colorText,
    fontSize: 12,
  },
  listText: {
    color: CssTheme.colorPrimary,
    fontSize: 12,
  },
  btnBlock: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
  },
};


const CssModal = {
  display: {
    backgroundColor: '#333',
    opacity: 0.3,
  },
  modal: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    height: 50,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: CssTheme.colorLine,
  },
  titleText: {
    color: CssTheme.colorSecondary,
    textAlign: 'center',
    fontSize: 20,
  },
  titleClose: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  body: {
    borderRadius: 15,
    borderColor: CssTheme.colorTextLight,
    borderWidth: 2,
    height: 160,
    padding: 20,
    margin: 50,
    maxWidth: '100%',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  bodyText: {
    textAlign: 'center',
    color: '#bc0000',
  },
  bodyIcon: {
    textAlign: 'center',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerBtn: {
    marginLeft: 6,
    marginRight: 6,
    flex: 1, // 排版部分 不要寫在CssBtn
  },
  // 投注页左侧清单
  lotteryPopoverWrap: {
    padding: 0,
  },
  lotteryPopover: {
    borderRadius: 8,
    backgroundColor: '#fff',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 50,
    right: Platform.OS === 'ios' ? -10 : 10,
    width: 110,
    paddingTop: 8,
    paddingBottom: 8,
  },
  chatroomPopover: {
    borderRadius: 8,
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: 110,
    paddingTop: 8,
    paddingBottom: 8,
  },
  lotteryPopoverItem: {
    height: 40,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: CssTheme.colorLine,
    alignItems: 'center',
    flexDirection: 'row',
  },
  lotteryPopoverItemText: {
    color: CssTheme.colorText,
  },
  lotteryPopoverItemFaIcon: {
    fontSize: 16,
    marginRight: 5,
    marginLeft: 3,
  },
  chatroomPopoverItemFaIconTrash: {
    fontSize: 17,
    marginLeft: 5,
    marginRight: 8,
  },
  lotteryPopoverItemImage: {
    width: 26,
    height: 26,
  },
  payoffGreenText: {
    color: CssTheme.colorPositive,
  },
  payoffRedText: {
    color: CssTheme.colorNegative,
  },
  // 筛选选单
  filterPopoverWrap: {
    padding: 0,
  },
  filterPopover: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 50,
    left: -0.5 * 1,
    right: -0.5 * 1,
    padding: 12,
  },
  filterPopoverHeader: {
    padding: 4,
    marginBottom: 12,
  },
  filterPopoverHeaderText: {
    color: CssTheme.colorText,
  },
  filterPopoverList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterPopoverGrid: {
    width: '33.3333%',
  },
  filterPopoverItem: {
    borderRadius: 8,
    height: 35,
    margin: 4,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filterPopoverItemActive: {
    backgroundColor: CssTheme.colorPrimary,
    borderColor: CssTheme.colorPrimary,
  },
  filterPopoverItemText: {
    fontSize: 13,
    color: CssTheme.colorPrimary,
  },
  filterPopoverItemTextActive: {
    color: '#fff',
  },
  filterPopoverBtns: {
    flexDirection: 'row',
    marginTop: 12,
  },
  filterPopoverBtn: {
    margin: 4,
    flex: 1,
  },
  closeText: {
    fontSize: 24,
    color: CssTheme.colorTextLight,
  },
};

// const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL }; // 手动检查
const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START }; // app从后台切换过来时

class CodePush extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAppShow: false,
      update: false,
      restart: false,
      updateDescription: '',
      syncMessage: '',
      syncStatus: null,
      restartAllowed: true,
      showCloseBtn: false,
      appDomain: [],
    };
  }

  componentDidMount = async () => {
    const needUpdate = await this.checkUpdate();
    if (needUpdate !== null) {
      this.setState({
        updateDescription: needUpdate.description,
      });
    } else {
      await this.getCmsConfig();
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { update, restart } = this.state;
    if (prevState.update !== update && update) {
      this.syncUpdate();
    }
    if (prevState.restart !== restart && restart) {
      setTimeout(() => {
        codePush.restartApp();
      }, 2000)
    }
  }

  getCmsConfig = () => {
    let index = 0;
    const fetchCmsConfig = (i) => {
      const url = domainList[config.platName][i];
      if (url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${url}/api/pc/cms-config`, true);
        xhr.setRequestHeader('referer', url);
        xhr.onload = () => {
          if (xhr.readyState === 4) {
            if (xhr.status < 400) {
              console.log(JSON.parse(xhr.response).result.appDomain);
              this.setState({
                appDomain: JSON.parse(xhr.response).result.appDomain,
              });
              xhr.abort();
            } else {
              index++;
              fetchCmsConfig(index);
              xhr.abort();
            }
            xhr.abort();
          }
        };
        xhr.ontimeout = () => {
          index++;
          fetchCmsConfig(index);
        };
        xhr.onerror = () => {
          index++;
          fetchCmsConfig(index);
        };
        xhr.send(null);
      }
    }
    fetchCmsConfig(index);
  }

  checkUpdate = () => {
    return codePush.checkForUpdate();
  }

  codePushStatusDidChange = (syncStatus) => {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: '检查更新状态' });
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: '下载更新资料' });
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: '等待用户回应' });
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: '安装更新中' });
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        this.setState({
          syncMessage: '用户取消更新',
          progress: false,
        });
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({
          syncMessage: '无法完成更新，请联络客服',
          progress: false,
          showCloseBtn: true,
        });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        this.setState({
          syncMessage: '已为最新版本，正在进入APP...',
          progress: false,
          isAppShow: true,
        });
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          syncMessage: '更新完成，正在重启APP',
          progress: false,
          restart: true,
        });
        break;
      default:
        break;
    }
  }

  codePushDownloadDidProgress = (progress) => {
    this.setState({ progress });
  }

  toggleAllowRestart = () => {
    const { restartAllowed } = this.state;
    if (restartAllowed) {
      codePush.disallowRestart();
      return;
    }
    codePush.allowRestart();
    this.setState({ restartAllowed: !restartAllowed });
  }

  getUpdateMetadata = () => {
    codePush.getUpdateMetadata(codePush.UpdateState.RUNNING)
      .then((metadata) => {
        this.setState({ syncMessage: metadata ? JSON.stringify(metadata) : 'Running binary version', progress: false });
      }, (error) => {
        this.setState({ syncMessage: `Error: ${error}`, progress: false });
      });
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  syncUpdate = () => {
    codePush.sync(
      {},
      this.codePushStatusDidChange,
      this.codePushDownloadDidProgress,
    );
  }

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  syncImmediate = () => {
    // this.setState({ display: true });
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          appendReleaseDescription: true,
          descriptionPrefix: '\n\n',
          title: '更新提示',
          // 强制更新
          mandatoryUpdateMessage: 'APP有更新版本\n请立即更新\n',
          mandatoryContinueButtonLabel: '更新',
          // 一般更新
          optionalIgnoreButtonLabel: '忽略',
          optionalInstallButtonLabel: '安装',
          optionalUpdateMessage: 'APP有更新版本\n请立即更新',
        },
      },
      this.codePushStatusDidChange,
      this.codePushDownloadDidProgress,
    );
  }

  render() {
    console.log(this.state);
    if (this.state.isAppShow && this.state.appDomain.length) return <App appDomain={this.state.appDomain} />;

    let progressView = <ActivityIndicator color={CssTheme.colorText} />;
    const {
      progress, syncMessage, update, showCloseBtn, updateDescription, appUpdateDialogShow,
    } = this.state;

    if (progress) {
      // progressView = (<ActivityIndicator size={20} />);
      const { receivedBytes, totalBytes } = progress;
      const progressBar = Math.floor(receivedBytes / totalBytes * 100) / 100;
      progressView = (Platform.OS === 'android')
        ? (<ProgressBarAndroid styleAttr="Horizontal" color={CssTheme.colorText} progress={progressBar} indeterminate={false} />)
        : (<ProgressViewIOS color={CssTheme.colorText} progress={progressBar} />);
    }

    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={bg}
          imageStyle={CssLoading.loadingViewBg}
          style={CssLoading.loadingView}
        >
          <SafeAreaView
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
                marginTop: (Dimensions.get('window').height / 4),
              }}
            >
              {/* body */}
              <View style={{ ...CssModal.body }}>
                <View>
                  <Text style={CssLoading.topAreaTitle}>系统更新</Text>
                </View>
                <View>
                  <Text style={CssBtn.defaultText}>{updateDescription}</Text>
                  {
                    (
                      typeof syncMessage === 'string'
                      && syncMessage !== ''
                    ) && (
                      <Text style={CssBtn.defaultText}>{syncMessage}</Text>
                    )
                  }
                  {progressView}
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}


export default codePush(codePushOptions)(CodePush);
