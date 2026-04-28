#import <React/RCTBridgeModule.h>
#import <UserNotifications/UserNotifications.h>

static NSString *const AutoAlarmModuleErrorDomain = @"com.shifterz.offnal.AutoAlarmModule";
static NSString *const AutoAlarmNotificationIdentifierPrefix = @"offnal.auto-alarm.";
static NSString *const AutoAlarmNotificationCategoryIdentifier = @"offnal.auto-alarm.category";
static NSString *const AutoAlarmPendingEventsDefaultsKey = @"offnal.auto-alarm.pending-events";
static NSString *const AutoAlarmUserInfoAlarmIdKey = @"alarmId";
static NSString *const AutoAlarmUserInfoSnoozeKey = @"snooze";
static NSString *const AutoAlarmUserInfoSnoozeEnabledKey = @"enabled";
static NSString *const AutoAlarmUserInfoSnoozeIntervalMinutesKey = @"intervalMinutes";
static NSString *const AutoAlarmUserInfoSnoozeRepeatCountKey = @"repeatCount";
static NSString *const AutoAlarmUserInfoSnoozeRemainingCountKey = @"remainingCount";

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
  NSDictionary *item = @{
    @"alarmId": alarmId,
    @"nextTriggerAtMillis": nextTriggerAtMillis,
    @"isEnabled": @YES,
    AutoAlarmUserInfoSnoozeKey: @{
      AutoAlarmUserInfoSnoozeEnabledKey: @NO,
      AutoAlarmUserInfoSnoozeIntervalMinutesKey: @0,
      AutoAlarmUserInfoSnoozeRepeatCountKey: @0,
      AutoAlarmUserInfoSnoozeRemainingCountKey: @0,
    },
  };

  [self scheduleAlarmItem:item resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(scheduleAlarmItem:(NSDictionary *)item
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self scheduleAlarmItem:item
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
  NSMutableArray<NSDictionary *> *items = [NSMutableArray arrayWithCapacity:alarms.count];
  for (id item in alarms) {
    if (![item isKindOfClass:[NSDictionary class]]) {
      reject(@"invalid_arguments", @"alarms must be dictionaries.", nil);
      return;
    }

    NSDictionary *alarm = (NSDictionary *)item;
    [items addObject:@{
      @"alarmId": alarm[@"alarmId"] ?: @0,
      @"nextTriggerAtMillis": alarm[@"nextTriggerAtMillis"] ?: @0,
      @"isEnabled": alarm[@"isEnabled"] ?: @NO,
      AutoAlarmUserInfoSnoozeKey: @{
        AutoAlarmUserInfoSnoozeEnabledKey: @NO,
        AutoAlarmUserInfoSnoozeIntervalMinutesKey: @0,
        AutoAlarmUserInfoSnoozeRepeatCountKey: @0,
        AutoAlarmUserInfoSnoozeRemainingCountKey: @0,
      },
    }];
  }

  [self syncAlarmItems:items resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(syncAlarmItems:(NSArray *)items
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (![items isKindOfClass:[NSArray class]]) {
    reject(@"invalid_arguments", @"items must be an array.", nil);
    return;
  }

  NSMutableArray<NSDictionary *> *validatedItems = [NSMutableArray arrayWithCapacity:items.count];
  BOOL requiresAuthorization = NO;

  for (NSUInteger index = 0; index < items.count; index++) {
    id item = items[index];
    if (![item isKindOfClass:[NSDictionary class]]) {
      reject(@"invalid_arguments", [NSString stringWithFormat:@"Invalid alarm item at index %lu.", (unsigned long)index], nil);
      return;
    }

    NSDictionary *alarm = (NSDictionary *)item;
    id alarmIdValue = alarm[@"alarmId"];
    id isEnabledValue = alarm[@"isEnabled"];
    id nextTriggerValue = alarm[@"nextTriggerAtMillis"];

    if (![alarmIdValue isKindOfClass:[NSNumber class]]) {
      reject(@"invalid_arguments", [NSString stringWithFormat:@"alarmId must be a number at index %lu.", (unsigned long)index], nil);
      return;
    }

    if (![isEnabledValue isKindOfClass:[NSNumber class]]) {
      reject(@"invalid_arguments", [NSString stringWithFormat:@"isEnabled must be a boolean at index %lu.", (unsigned long)index], nil);
      return;
    }

    BOOL isEnabled = [isEnabledValue boolValue];
    if (isEnabled) {
      if (![nextTriggerValue isKindOfClass:[NSNumber class]]) {
        reject(@"invalid_arguments", [NSString stringWithFormat:@"nextTriggerAtMillis must be a number at index %lu.", (unsigned long)index], nil);
        return;
      }
      requiresAuthorization = YES;
    }

    [validatedItems addObject:alarm];
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
        reject([self rejectionCodeForError:permissionError defaultCode:@"sync_failed"], permissionError.localizedDescription, permissionError);
        return;
      }

      [self processSyncItems:validatedItems index:0 resolve:resolve reject:reject];
    }];
  });
}

RCT_EXPORT_METHOD(consumePendingEvents:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSArray *pendingEvents = [defaults arrayForKey:AutoAlarmPendingEventsDefaultsKey];
    [defaults removeObjectForKey:AutoAlarmPendingEventsDefaultsKey];
    [defaults synchronize];

    resolve(pendingEvents ?: @[]);
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
  BOOL isEnabled = [item[@"isEnabled"] boolValue];

  if (isEnabled) {
    [self scheduleAlarmItem:item
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

- (void)scheduleAlarmItem:(NSDictionary *)item
 shouldCheckAuthorization:(BOOL)shouldCheckAuthorization
               completion:(void (^)(NSError *_Nullable error))completion
{
  NSNumber *alarmId = item[@"alarmId"];
  NSNumber *nextTriggerAtMillis = item[@"nextTriggerAtMillis"];

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

        [self addNotificationForItem:item completion:completion];
      }];
      return;
    }

    [self addNotificationForItem:item completion:completion];
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

- (void)addNotificationForItem:(NSDictionary *)item
                    completion:(void (^)(NSError *_Nullable error))completion
{
  NSNumber *alarmId = item[@"alarmId"];
  NSNumber *nextTriggerAtMillis = item[@"nextTriggerAtMillis"];
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
  content.title = @"알람";
  content.body = @"일어날 시간이에요.";
  content.sound = [UNNotificationSound defaultSound];
  content.categoryIdentifier = AutoAlarmNotificationCategoryIdentifier;
  content.threadIdentifier = AutoAlarmNotificationCategoryIdentifier;
  content.interruptionLevel = UNNotificationInterruptionLevelTimeSensitive;
  content.userInfo = [self notificationUserInfoForItem:item];

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
      {
        completion(YES, nil);
        return;
      }

      case UNAuthorizationStatusNotDetermined: {
        [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                              completionHandler:^(BOOL granted, NSError *_Nullable error) {
          if (error != nil) {
            completion(NO, error);
            return;
          }

          completion(granted, nil);
        }];
        return;
      }

      case UNAuthorizationStatusDenied:
      default: {
        completion(NO, nil);
        return;
      }
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

- (NSDictionary<NSString *, id> *)notificationUserInfoForItem:(NSDictionary *)item
{
  NSNumber *alarmId = item[@"alarmId"];
  NSDictionary *snooze = [item[AutoAlarmUserInfoSnoozeKey] isKindOfClass:[NSDictionary class]]
    ? item[AutoAlarmUserInfoSnoozeKey]
    : @{};

  BOOL isSnoozeEnabled = [snooze[AutoAlarmUserInfoSnoozeEnabledKey] boolValue];
  NSInteger snoozeIntervalMinutes = [snooze[AutoAlarmUserInfoSnoozeIntervalMinutesKey] integerValue];
  NSInteger snoozeRepeatCount = [snooze[AutoAlarmUserInfoSnoozeRepeatCountKey] integerValue];
  id remainingCountValue = snooze[AutoAlarmUserInfoSnoozeRemainingCountKey];

  NSInteger snoozeRemainingCount;
  if (!isSnoozeEnabled) {
    snoozeRemainingCount = 0;
  } else if (remainingCountValue == nil || remainingCountValue == [NSNull null]) {
    snoozeRemainingCount = snoozeRepeatCount == 0 ? -1 : snoozeRepeatCount;
  } else {
    snoozeRemainingCount = [remainingCountValue integerValue];
  }

  return @{
    AutoAlarmUserInfoAlarmIdKey: alarmId,
    AutoAlarmUserInfoSnoozeKey: @{
      AutoAlarmUserInfoSnoozeEnabledKey: @(isSnoozeEnabled),
      AutoAlarmUserInfoSnoozeIntervalMinutesKey: @(snoozeIntervalMinutes),
      AutoAlarmUserInfoSnoozeRepeatCountKey: @(snoozeRepeatCount),
      AutoAlarmUserInfoSnoozeRemainingCountKey: @(snoozeRemainingCount),
    },
  };
}

@end
