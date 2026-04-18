#import <React/RCTBridgeModule.h>
#import <UserNotifications/UserNotifications.h>

static NSString *const AutoAlarmModuleErrorDomain = @"com.shifterz.offnal.AutoAlarmModule";
static NSString *const AutoAlarmNotificationIdentifierPrefix = @"offnal.auto-alarm.";
static NSString *const AutoAlarmNotificationCategoryIdentifier = @"offnal.auto-alarm.category";

@interface AutoAlarmModule : NSObject <RCTBridgeModule>
@end

@implementation AutoAlarmModule

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(scheduleAlarm:(nonnull NSNumber *)alarmId
                  nextTriggerAtMillis:(nonnull NSNumber *)nextTriggerAtMillis
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self scheduleAlarmWithAlarmId:alarmId
             nextTriggerAtMillis:nextTriggerAtMillis
           shouldCheckAuthorization:YES
                       completion:^(NSError *_Nullable error) {
    if (error != nil) {
      reject([self rejectionCodeForError:error defaultCode:@"schedule_failed"], error.localizedDescription, error);
      return;
    }

    resolve(nil);
  }];
}

RCT_EXPORT_METHOD(cancelAlarm:(nonnull NSNumber *)alarmId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self cancelAlarmWithAlarmId:alarmId completion:^(NSError *_Nullable error) {
    if (error != nil) {
      reject([self rejectionCodeForError:error defaultCode:@"cancel_failed"], error.localizedDescription, error);
      return;
    }

    resolve(nil);
  }];
}

RCT_EXPORT_METHOD(syncEnabledAutoAlarms:(NSArray *)alarms
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (![alarms isKindOfClass:[NSArray class]]) {
    reject(@"invalid_arguments", @"alarms must be an array.", nil);
    return;
  }

  NSMutableArray<NSDictionary *> *validatedItems = [NSMutableArray arrayWithCapacity:alarms.count];
  BOOL requiresAuthorization = NO;

  for (NSUInteger index = 0; index < alarms.count; index++) {
    id item = alarms[index];
    if (![item isKindOfClass:[NSDictionary class]]) {
      reject(
        @"invalid_arguments",
        [NSString stringWithFormat:@"Invalid alarm item at index %lu.", (unsigned long)index],
        nil
      );
      return;
    }

    NSDictionary *alarm = (NSDictionary *)item;
    id alarmIdValue = alarm[@"alarmId"];
    id isEnabledValue = alarm[@"isEnabled"];
    id nextTriggerValue = alarm[@"nextTriggerAtMillis"];

    if (![alarmIdValue isKindOfClass:[NSNumber class]]) {
      reject(
        @"invalid_arguments",
        [NSString stringWithFormat:@"alarmId must be a number at index %lu.", (unsigned long)index],
        nil
      );
      return;
    }

    if (![isEnabledValue isKindOfClass:[NSNumber class]]) {
      reject(
        @"invalid_arguments",
        [NSString stringWithFormat:@"isEnabled must be a boolean at index %lu.", (unsigned long)index],
        nil
      );
      return;
    }

    BOOL isEnabled = [isEnabledValue boolValue];
    if (isEnabled) {
      if (![nextTriggerValue isKindOfClass:[NSNumber class]]) {
        reject(
          @"invalid_arguments",
          [NSString stringWithFormat:@"nextTriggerAtMillis must be a number at index %lu.", (unsigned long)index],
          nil
        );
        return;
      }

      requiresAuthorization = YES;
    }

    [validatedItems addObject:@{
      @"alarmId": alarmIdValue,
      @"isEnabled": isEnabledValue,
      @"nextTriggerAtMillis": [nextTriggerValue isKindOfClass:[NSNumber class]] ? nextTriggerValue : @0,
    }];
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    if (!requiresAuthorization) {
      [self processSyncItems:validatedItems index:0 resolve:resolve reject:reject];
      return;
    }

    [self requestAuthorizationIfNeededWithCompletion:^(BOOL granted, NSError *_Nullable error) {
      if (error != nil) {
        reject([self rejectionCodeForError:error defaultCode:@"sync_failed"], error.localizedDescription, error);
        return;
      }

      if (!granted) {
        NSError *permissionError = [self permissionRequiredError];
        reject(permissionError.domain, permissionError.localizedDescription, permissionError);
        return;
      }

      [self processSyncItems:validatedItems index:0 resolve:resolve reject:reject];
    }];
  });
}

- (void)processSyncItems:(NSArray<NSDictionary *> *)items
                   index:(NSUInteger)index
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
  if (index >= items.count) {
    resolve(nil);
    return;
  }

  NSDictionary *item = items[index];
  NSNumber *alarmId = item[@"alarmId"];
  NSNumber *nextTriggerAtMillis = item[@"nextTriggerAtMillis"];
  BOOL isEnabled = [item[@"isEnabled"] boolValue];

  if (isEnabled) {
    [self scheduleAlarmWithAlarmId:alarmId
                 nextTriggerAtMillis:nextTriggerAtMillis
               shouldCheckAuthorization:NO
                           completion:^(NSError *_Nullable error) {
      if (error != nil) {
        reject([self rejectionCodeForError:error defaultCode:@"sync_failed"], error.localizedDescription, error);
        return;
      }

      [self processSyncItems:items index:index + 1 resolve:resolve reject:reject];
    }];
    return;
  }

  [self cancelAlarmWithAlarmId:alarmId completion:^(NSError *_Nullable error) {
    if (error != nil) {
      reject([self rejectionCodeForError:error defaultCode:@"sync_failed"], error.localizedDescription, error);
      return;
    }

    [self processSyncItems:items index:index + 1 resolve:resolve reject:reject];
  }];
}

- (void)scheduleAlarmWithAlarmId:(NSNumber *)alarmId
             nextTriggerAtMillis:(NSNumber *)nextTriggerAtMillis
           shouldCheckAuthorization:(BOOL)shouldCheckAuthorization
                       completion:(void (^)(NSError *_Nullable error))completion
{
  if (![alarmId isKindOfClass:[NSNumber class]] || alarmId.integerValue <= 0) {
    completion([self invalidAlarmIdError]);
    return;
  }

  if (![nextTriggerAtMillis isKindOfClass:[NSNumber class]] || nextTriggerAtMillis.doubleValue <= 0) {
    completion([self invalidTriggerAtMillisError]);
    return;
  }

  NSDate *triggerDate = [NSDate dateWithTimeIntervalSince1970:nextTriggerAtMillis.doubleValue / 1000.0];
  if ([triggerDate timeIntervalSinceNow] <= 0) {
    completion([self invalidTriggerAtMillisError]);
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    if (shouldCheckAuthorization) {
      [self requestAuthorizationIfNeededWithCompletion:^(BOOL granted, NSError *_Nullable error) {
        if (error != nil) {
          completion(error);
          return;
        }

        if (!granted) {
          completion([self permissionRequiredError]);
          return;
        }

        [self addNotificationForAlarmId:alarmId
                       nextTriggerAtMillis:nextTriggerAtMillis
                               completion:completion];
      }];
      return;
    }

    [self addNotificationForAlarmId:alarmId
                   nextTriggerAtMillis:nextTriggerAtMillis
                           completion:completion];
  });
}

- (void)cancelAlarmWithAlarmId:(NSNumber *)alarmId
                    completion:(void (^)(NSError *_Nullable error))completion
{
  if (![alarmId isKindOfClass:[NSNumber class]] || alarmId.integerValue <= 0) {
    completion([self invalidAlarmIdError]);
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *identifier = [self notificationIdentifierForAlarmId:alarmId];
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center removePendingNotificationRequestsWithIdentifiers:@[ identifier ]];
    [center removeDeliveredNotificationsWithIdentifiers:@[ identifier ]];
    completion(nil);
  });
}

- (void)addNotificationForAlarmId:(NSNumber *)alarmId
              nextTriggerAtMillis:(NSNumber *)nextTriggerAtMillis
                      completion:(void (^)(NSError *_Nullable error))completion
{
  NSString *identifier = [self notificationIdentifierForAlarmId:alarmId];
  NSDate *triggerDate = [NSDate dateWithTimeIntervalSince1970:nextTriggerAtMillis.doubleValue / 1000.0];

  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSDateComponents *components = [calendar components:
    (NSCalendarUnitYear |
     NSCalendarUnitMonth |
     NSCalendarUnitDay |
     NSCalendarUnitHour |
     NSCalendarUnitMinute |
     NSCalendarUnitSecond)
                                            fromDate:triggerDate];
  components.timeZone = [NSTimeZone localTimeZone];

  UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
  content.title = @"Offnal";
  content.body = @"알람이 울립니다.";
  content.sound = [UNNotificationSound defaultSound];
  content.categoryIdentifier = AutoAlarmNotificationCategoryIdentifier;
  content.threadIdentifier = AutoAlarmNotificationCategoryIdentifier;

  UNCalendarNotificationTrigger *trigger = [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:components repeats:NO];
  UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:identifier content:content trigger:trigger];

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center removePendingNotificationRequestsWithIdentifiers:@[ identifier ]];
  [center removeDeliveredNotificationsWithIdentifiers:@[ identifier ]];
  [center addNotificationRequest:request withCompletionHandler:^(NSError *_Nullable error) {
    completion(error);
  }];
}

- (void)requestAuthorizationIfNeededWithCompletion:(void (^)(BOOL granted, NSError *_Nullable error))completion
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings *settings) {
    switch (settings.authorizationStatus) {
      case UNAuthorizationStatusAuthorized:
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 140000
      case UNAuthorizationStatusProvisional:
      case UNAuthorizationStatusEphemeral:
#endif
        completion(YES, nil);
        return;

      case UNAuthorizationStatusNotDetermined:
        [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                              completionHandler:^(BOOL granted, NSError *_Nullable error) {
          if (error != nil) {
            completion(NO, error);
            return;
          }

          completion(granted, nil);
        }];
        return;

      case UNAuthorizationStatusDenied:
      default:
        completion(NO, nil);
        return;
    }
  }];
}

- (NSError *)invalidAlarmIdError
{
  return [NSError errorWithDomain:AutoAlarmModuleErrorDomain
                             code:1001
                         userInfo:@{ NSLocalizedDescriptionKey : @"alarmId must be a positive integer." }];
}

- (NSError *)invalidTriggerAtMillisError
{
  return [NSError errorWithDomain:AutoAlarmModuleErrorDomain
                             code:1002
                         userInfo:@{ NSLocalizedDescriptionKey : @"nextTriggerAtMillis must be a positive future timestamp." }];
}

- (NSError *)permissionRequiredError
{
  return [NSError errorWithDomain:AutoAlarmModuleErrorDomain
                             code:1003
                         userInfo:@{ NSLocalizedDescriptionKey : @"Notification permission is required to schedule auto alarms on iOS." }];
}

- (NSString *)rejectionCodeForError:(NSError *)error defaultCode:(NSString *)defaultCode
{
  if ([error.domain isEqualToString:AutoAlarmModuleErrorDomain]) {
    switch (error.code) {
      case 1001:
        return @"invalid_alarm_id";
      case 1002:
        return @"invalid_trigger_at_millis";
      case 1003:
        return @"notifications_permission_required";
      default:
        break;
    }
  }

  return defaultCode;
}

- (NSString *)notificationIdentifierForAlarmId:(NSNumber *)alarmId
{
  return [NSString stringWithFormat:@"%@%@", AutoAlarmNotificationIdentifierPrefix, alarmId.stringValue];
}

@end
