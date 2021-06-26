#import "DeviceUtil.h"
#import "NSUserDefaults+Helper.h"
#import <UIKit/UIKit.h>

@implementation DeviceUtil

+ (NSString*)getImei {
  NSString* imei = (NSString*)[NSUserDefaults getObjectWithKey:@"KEY_IMEI"];
  if (imei == nil || [imei isEqualToString:@""]) {
    imei = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
  }
  [NSUserDefaults setObjectWithKey:imei key:@"KEY_IMEI"];
  return imei;
}

@end
