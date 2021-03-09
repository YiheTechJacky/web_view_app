# Releas Note
## v1.2.7
- 完善sentry功能。
## v1.2.6
- 上報功能將fingerprint設定為tag。
## v1.2.5
- 新增log上報sentry功能，新增fingerprint，版本頁排版調整，新增sha256方法。
## v1.2.3
- 將bundleId展示改為appName。
## v1.2.2
- 修正線路檢測interval秒數。
## v1.2.1
- 新增bundleId顯示及透過線上服務ipify獲取用戶真實對外ip。
## v1.2.0
- 優化webview及ping錯誤處理能力。
- android實作xhr timeout。
- 引入promise-any庫。
## v0.0.6
#### 功能:
- 新增sentry監測系統，蒐集webviewOnError及webviewOnHttpError之資訊。
## v0.0.5
#### 修復:
- 修正webviewOnMessage代碼段被移除，導致無法外開之問題。
## v0.0.4
#### 優化:
- 梳理代碼結構。
- cache error expection防止crash。
#### 功能:偵測最優線路並自動切換域名
- cache error expection防止crash。
- 移除ping會reject錯誤導致無法render。
- 優化webview之錯誤提示。

## v0.0.3 
#### 功能:偵測最優線路並自動切換域名
- 修改域名切換邏輯，Promise.all改為Promise.race。
- 移除xhr timeout時間。(中國地區訪問CDN過慢所以移除)。
