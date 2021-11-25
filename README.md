# Webview App Packer

> Generic web site packer

## Development Environment

- Node.js v14.13.1
- npx v10.2.2
- watchman (`brew install watchman` on Mac OS)
- JDK 8
- Xcode Version 12.3
- Android Studio 4.0.0
  - Android SDK Platform 28`*`
  - Intel x86 Atom_64 System Image / Google APIs Intel x86 Atom System Image`*`

`*`Installation: Android Studio → Preferences → Appearance & Behavior → System Settings → Android SDK, under Android 9 (Pie)

## Running app in debug mode

**for iOS:**

`npx react-native run-ios`

**for Android:**

`npx react-native run-android`

## Package Name Replacement

**for iOS:**

File location: `ios/webview_app.xcodeproj/project.pbxproj`

```
PRODUCT_BUNDLE_IDENTIFIER = "replace.with.yours"; ← your package name
```

**for Android:**

File location: `android/app/build.gradle`

```
android {
...
...
    defaultConfig {
      applicationId"replace.with.yours"; ← your package name
...
```

## App Configuration

- Config file location: `src/statics/config.json`
- initJavascript: Initial Javascript injection for webview
- domainNamePrefix: URL will be open in device browser such as Safari when the URL does **NOT** match the prefix.
- urlList: Singular or multiple URLs of this application.

## If you are noob(IOS), follow these step:

1. Download Xcode Application: App store serach "xcode" and download and install it.
2. Enter Xcode Application: Open xcode and create a empty project, use xcode to open this project, then wait for xcode loaded.
3. Download Simulators: click: Xcode -> Preferences -> Components -> install latest version simulators.
4. Set the command line tool version: click: Xcode -> Preferences -> Locations -> Command Line Tools choose any one.
5. Install node_modules: npm install
6. Install Cocospods(An ios package manager): sudo gem cocospods install.
7. cd ios
8. Install Native packages: pod install
9. Generate main.jsbundle: npm run dev:build:ios
10. Enter develop mode: npm run ios

## 打包

icon.png 及 launcher.png 放在此專案跟目錄(跟 package.json 同層)


修改 Use Local Build 區塊之變數


執行 sh build_tools/build.sh

## CodePush指令

1.登入appcenter帳號
```
appcenter login
```
2.查看app
```
appcenter apps list
```
3.查看app之熱更key
```
appcenter codepush deployment list -k --app YiHeTech/11606-xin1-neng2-yuan2-ETFtestios
appcenter codepush deployment list -k --app YiHeTech/11606-xin1-neng2-yuan2-ETFtestandroid
```
4.熱更新版
```
appcenter codepush release-react -a YiHeTech/11606-xin1-neng2-yuan2-ETFtestios -d Production -t 1.0.0
appcenter codepush release-react -a YiHeTech/11606-xin1-neng2-yuan2-ETFtestandroid -d Production -t 1.0.0

-a 指定app
-d 指定環境
-t 指定版本號碼
```

11606
中金碳交易
－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
production
ios
appCenterKey
b1b90991-1c2e-43e1-9f01-c9d6793f6642
codePushKey
5bj02zPq1HlbqEoZnhsgIUHF3uqQT_PyisFOa
－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
production
android
appCenterKey
d15619b6-3aa3-4d32-a387-a3d9e7d5cca3
codePushKey
sHaD0loX7rh7uVUSFMN09-qpr_aSpC2arcHek
－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

