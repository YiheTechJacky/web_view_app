#import <UIKit/UIKit.h>

#import "AppDelegate.h"

int main(int argc, char * argv[]) {
  @autoreleasepool {
    NSError *error;
    NSString *launchPicCachePath= [NSHomeDirectory() stringByAppendingPathComponent:@"/Library/SplashBoard"];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSLog(@"Launch image cache path: %@", launchPicCachePath);
    if ([fileManager removeItemAtPath:launchPicCachePath  error:&error] != YES)
    {
      NSLog(@"Unable to delete file: %@", [error localizedDescription]);
    } else {
      NSLog(@"Clear launch image cache done!");
    }
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
