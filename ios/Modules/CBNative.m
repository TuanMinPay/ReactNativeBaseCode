#import <UIKit/UIKit.h>
#import "CBNative.h"
#import "SVProgressHUD.h"
#import "DeviceUtil.h"

@implementation CBNative

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  return @{
           @"appVersion"  : [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
           @"buildVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:(NSString *)kCFBundleVersionKey],
           @"bundleIdentifier"  : [[NSBundle mainBundle] bundleIdentifier],
           @"imei" : [DeviceUtil getImei]
           };
}

RCT_EXPORT_METHOD(showLoading)
{
  [SVProgressHUD setBackgroundColor:UIColor.clearColor];
  [SVProgressHUD setRingThickness:3];
  [SVProgressHUD setForegroundColor:UIColor.whiteColor];
  [SVProgressHUD setDefaultMaskType:SVProgressHUDMaskTypeBlack];
  [SVProgressHUD show];
}

RCT_EXPORT_METHOD(hideLoading)
{
  [SVProgressHUD dismiss];
}

RCT_EXPORT_METHOD(exitApp)
{
  exit(0);
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
