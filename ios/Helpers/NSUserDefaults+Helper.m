#import "NSUserDefaults+Helper.h"

@implementation NSUserDefaults (Helper)

+ (void)setObjectWithKey:(NSObject *)object key:(NSString *)key {
  
  NSData *encodedObject = [NSKeyedArchiver archivedDataWithRootObject:object];
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:encodedObject forKey:key];
  
  NSLog(@"%@ saved in NSUserDefaults", key);
  [defaults synchronize];
}

+ (NSObject *)getObjectWithKey:(NSString *)key {
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSData *encodedObject = [defaults objectForKey:key];
  NSObject *object = [NSKeyedUnarchiver unarchiveObjectWithData:encodedObject];
  
  return object;
}

@end
