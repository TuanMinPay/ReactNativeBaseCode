#import <Foundation/Foundation.h>

@interface NSUserDefaults (Helper)

+ (void)setObjectWithKey:(NSObject *)object key:(NSString *)key;
+ (NSObject *)getObjectWithKey:(NSString *)key;

@end
