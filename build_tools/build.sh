#!/bin/bash
export LANG=en_US.UTF-8

# apple related vars - 此區塊與開發者帳號相關
export BUNDLEID_SCOPE="com.yihe.app"
export DEVELOPERTEAM="7Y9L58RK9K"

# jenkins vars - 此區塊對接jenkins不可變動
export JENKINS_PLATID=$platId
export JENKINS_APP_NAME=$appName
export JENKINS_DOMAIN1=$domain1
export JENKINS_DOMAIN2=$domain2
export JENKINS_DOMAIN3=$domain3
export JENKINS_PLATNAME=$platName

# vars - 下方腳本所使用之變數
export PLATID=$JENKINS_PLATID
export BUNDLEID="$BUNDLEID_SCOPE$JENKINS_PLATID"
export APP_NAME=$JENKINS_APP_NAME
export DOMAIN_ONE=$JENKINS_DOMAIN1
export DOMAIN_TWO=$JENKINS_DOMAIN2
export DOMAIN_THREE=$JENKINS_DOMAIN3
export PLATNAME=$JENKINS_PLATNAME

# 使用jenkins會有$WORKSPACE變數
export JENKINS_WORKSPACE=$WORKSPACE

if [[ -n "$JENKINS_WORKSPACE" ]]; then
    echo "Use Jenkins Build !"
    export WS=$JENKINS_WORKSPACE
    export EXPORTS="/Users/apphwao/Project/app/exports/$PLATID"
    export PHOTO_LOCATION="/Users/apphwao/Project/app"
    export PROJECT_LOCATION="/Users/apphwao/Project"
    export BUILD_TOOLS="$WS/build_tools"
    export USER_HOME="/Users/apphwao"
else
    echo "Use Local Build !"
    export WS=$PWD
    export EXPORTS=$WS
    export PHOTO_LOCATION=$WS
    export PROJECT_LOCATION=$WS
    export BUILD_TOOLS="$WS/build_tools"
    export USER_HOME=$HOME
fi

# 此區域變數不變
export PATH="$USER_HOME/.nvm/versions/node/v12.18.0/bin:$PATH"
export LDFLAGS="-L$USER_HOME/.nvm/versions/node/v12.18.0/lib"
export CPPFLAGS="-I$USER_HOME/.nvm/versions/node/v12.18.0/include"
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export GRADLE_HOME=~/.gradle/wrapper/dists/gradle-6.0.1-all/99d3u8wxs16ndehh90lbbir67/gradle-6.0.1
export PATH=$PATH:$GRADLE_HOME/bin
export JAVA_HOME="$(/System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java_home)"
export PATH=$PATH:$JAVA_HOME/bin
export PATH=$PATH:/usr/local/bin

initProject() {
    npm install
    cd $WS/ios
    pod install
    cd $WS
    npm run build:ios
    rm -rf $WS/android/app/src/main/res/*land*
    find $WS/android/app/src/main/res -type f -name "*screen*" -exec rm {} \;
    cat << EOF >> android/gradle.properties
MYAPP_RELEASE_STORE_FILE=$PROJECT_LOCATION/bdkey.jks
MYAPP_RELEASE_KEY_ALIAS=key0
MYAPP_RELEASE_STORE_PASSWORD=123456
MYAPP_RELEASE_KEY_PASSWORD=123456"
EOF
}

applicationConfig() {
    # Domain
    sed -i "" "s/domain1/$DOMAIN_ONE/g" $BUILD_TOOLS/config.json
    sed -i "" "s/domain2/$DOMAIN_TWO/g" $BUILD_TOOLS/config.json
    sed -i "" "s/domain3/$DOMAIN_THREE/g" $BUILD_TOOLS/config.json
    sed -i "" "s/pid/$PLATNAME/g" $BUILD_TOOLS/config.json
    cp $BUILD_TOOLS/config.json $WS/src/statics/config.json
    # Android
    sed -i "" "s/platId/$PLATID/g" $BUILD_TOOLS/build.gradle
    sed -i "" "s/appName/$APP_NAME/g" $BUILD_TOOLS/strings.xml
    cp $BUILD_TOOLS/build.gradle $WS/android/app/build.gradle
    cp $BUILD_TOOLS/strings.xml $WS/android/app/src/main/res/values/strings.xml
    # iOS
    sed -i "" "s/appName/$APP_NAME/g" $BUILD_TOOLS/Info.plist
    sed -i "" "s/platId/$PLATID/g" $BUILD_TOOLS/project.pbxproj
    sed -i "" "s/platId/$PLATID/g" $BUILD_TOOLS/ExportOptions.plist
    sed -i "" "s/DEVELOPERTEAM/$DEVELOPERTEAM/g" $BUILD_TOOLS/project.pbxproj
    sed -i "" "s/DEVELOPERTEAM/$DEVELOPERTEAM/g" $BUILD_TOOLS/ExportOptions.plist
    sed -i "" "s/BUNDLEID/$BUNDLEID/g" $BUILD_TOOLS/project.pbxproj
    sed -i "" "s/BUNDLEID/$BUNDLEID/g" $BUILD_TOOLS/ExportOptions.plist
    cp $BUILD_TOOLS/project.pbxproj $WS/ios/webview_app.xcodeproj/project.pbxproj
    cp $BUILD_TOOLS/Info.plist $WS/ios/webview_app/Info.plist
    cp $BUILD_TOOLS/ExportOptions.plist $WS/ios
}

iconAssets() {
    mv $PHOTO_LOCATION/icon.png $EXPORTS/icon.png
    sips -s format png -m '/System/Library/ColorSync/Profiles/sRGB Profile.icc' $EXPORTS/icon.png -o $EXPORTS/icon.png
    # Android
    sips -z 96 96 $EXPORTS/icon.png -o $WS/android/app/src/main/res/drawable/icon.png
    sips -z 96 96 $EXPORTS/icon.png -o $WS/android/app/src/main/res/drawable-xhdpi/icon.png
    sips -z 144 144 $EXPORTS/icon.png -o $WS/android/app/src/main/res/drawable-xxhdpi/icon.png
    sips -z 72 72 $EXPORTS/icon.png -o $WS/android/app/src/main/res/drawable-hdpi/icon.png
    sips -z 36 36 $EXPORTS/icon.png -o $WS/android/app/src/main/res/drawable-ldpi/icon.png
    sips -z 48 48 $EXPORTS/icon.png -o $WS/android/app/src/main/res/drawable-mdpi/icon.png
    sips -z 192 192 $EXPORTS/icon.png -o $WS/android/app/src/main/res/drawable-xxxhdpi/icon.png
    # iOS
    cp $BUILD_TOOLS/Contents.json $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Contents.json
    sips -z 20 20 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-20x20@1x.png
    sips -z 29 29 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-29x29@1x.png
    sips -z 40 40 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-20x20@2x.png
    sips -z 58 58 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-29x29@2x.png
    sips -z 60 60 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-20x20@3x.png
    sips -z 76 76 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-76x76@1x.png
    sips -z 80 80 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-40x40@2x.png
    sips -z 87 87 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-29x29@3x.png
    sips -z 120 120 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-40x40@3x.png
    sips -z 120 120 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-60x60@2x.png
    sips -z 152 152 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-76x76@2x.png
    sips -z 167 167 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-83.5@2x.png
    sips -z 180 180 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-60x60@3x.png
    sips -z 1024 1024 $EXPORTS/icon.png -o $WS/ios/webview_app/Images.xcassets/AppIcon.appiconset/Icon-marketing-1024x1024.png
}

launcherAssets() {
    mv $PHOTO_LOCATION/launcher.png $EXPORTS/launcher.png
    sips -s format png -m '/System/Library/ColorSync/Profiles/sRGB Profile.icc' $EXPORTS/launcher.png -o $EXPORTS/launcher.png
    sips -s format jpeg -s formatOptions high -z 2208 1242 $EXPORTS/launcher.png -o $WS/src/assets/launchscreen.jpg
    # iOS
    sips -z 2208 1242 $EXPORTS/launcher.png -o $WS/ios/launchImage_ios.png
}

androidBuild() {
    cd $WS/android
    ./gradlew clean
    ./gradlew assembleRelease
    if [ "$?" -ne 0 ]; then
        echo "############"
        echo "# androidBuild壞掉惹rrr #"
        echo "############"
        exit 1
    fi
    cp $WS/android/app/build/outputs/apk/release/app-release.apk $EXPORTS/$PLATID-$DATE.apk
}

iosBuild() {
    cd $WS/ios
    xcodebuild -workspace webview_app.xcworkspace -scheme webview_app clean
    xcodebuild archive \
        -workspace webview_app.xcworkspace \
        -scheme webview_app \
        -configuration Release \
        -archivePath $APP_NAME.xcarchive \
        -IDEBuildOperationMaxNumberOfConcurrentCompileTasks=1 \
        -allowProvisioningUpdates
    if [ "$?" -ne 0 ]; then
        echo "############"
        echo "# iosBuild壞掉惹rrr #"
        echo "############"
        exit 1
    fi

    xcodebuild  -exportArchive \
        -archivePath $APP_NAME.xcarchive \
        -exportPath $APP_NAME/ \
        -exportOptionsPlist $WS/ios/ExportOptions.plist \
        -allowProvisioningUpdates
    if [ "$?" -ne 0 ]; then
        echo "############"
        echo "# iosBuild export壞掉惹rrr #"
        echo "############"
        exit 1
    fi
    cp $WS/ios/$APP_NAME/webview_app.ipa $EXPORTS/$PLATID-$DATE.ipa
}

## Start APP Build ###
# check assets
if [ ! -f $PHOTO_LOCATION/icon.png ]; then
    echo "############"
    echo "# icon.png 圖咧？rrr #"
    echo "############"
    exit 1
fi
if [ ! -f $PHOTO_LOCATION/launcher.png ]; then
    echo "############"
    echo "# launcher.png 圖咧？rrr #"
    echo "############"
    exit 1
fi
if [ ! -d /Users/apphwao/Project/app/exports/$platId ] && [[ -n "$JENKINS_WORKSPACE" ]]; then
    mkdir -p /Users/apphwao/Project/app/exports/$platId
fi
# vars
DATE=$(date +%Y%m%d%H%M)

initProject
applicationConfig
iconAssets
launcherAssets
androidBuild
iosBuild
