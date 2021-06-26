#import <CoreLocation/CoreLocation.h>

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

#import "CBLocation.h"

@interface CBLocation() <CLLocationManagerDelegate>

@property (strong, nonatomic) CLLocationManager *locationManager;

@end

@implementation CBLocation

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

#pragma mark Initialization

- (instancetype)init
{
  if (self = [super init]) {
    self.locationManager = [[CLLocationManager alloc] init];
    
    self.locationManager.delegate = self;
    
    self.locationManager.distanceFilter = kCLDistanceFilterNone;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    
    self.locationManager.pausesLocationUpdatesAutomatically = NO;
  }
  
  return self;
}

#pragma mark

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"CBLocationChange"];
}

RCT_EXPORT_METHOD(getCurrentLocation:(RCTResponseSenderBlock)callback)
{
  CLLocation *location = [self.locationManager location];
  if (location != nil) {
    NSDictionary *params = @{
                             @"latitude": @(location.coordinate.latitude),
                             @"longitude": @(location.coordinate.longitude),
                             @"altitude": @(location.altitude),
                             @"accuracy": @(location.horizontalAccuracy),
                             @"course": @(location.course),
                             @"speed": @(location.speed)
                             };
    callback(@[params]);
  } else {
    callback(@[]);
  }
}

RCT_EXPORT_METHOD(startUpdatingLocation)
{
  [self.locationManager startUpdatingLocation];
}

RCT_EXPORT_METHOD(stopUpdatingLocation)
{
  [self.locationManager stopUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  NSLog(@"Location manager failed: %@", error);
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
  CLLocation *location = [locations lastObject];
  NSDictionary *params = @{
                           @"latitude": @(location.coordinate.latitude),
                           @"longitude": @(location.coordinate.longitude),
                           @"altitude": @(location.altitude),
                           @"accuracy": @(location.horizontalAccuracy),
                           @"course": @(location.course),
                           @"speed": @(location.speed)
                           };
  
  [self sendEventWithName:@"CBLocationChange" body:params];
}

@end
