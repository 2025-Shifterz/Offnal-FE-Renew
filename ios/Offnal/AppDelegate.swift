import UIKit
import UserNotifications
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import kakao_login

private let autoAlarmNotificationCategoryId = "offnal.auto-alarm.category"
private let autoAlarmSnoozeActionId = "offnal.auto-alarm.snooze"
private let autoAlarmDismissActionId = "offnal.auto-alarm.dismiss"
private let autoAlarmNotificationUserInfoAlarmIdKey = "alarmId"
private let autoAlarmNotificationUserInfoSnoozeKey = "snooze"
private let autoAlarmNotificationUserInfoSnoozeEnabledKey = "enabled"
private let autoAlarmNotificationUserInfoSnoozeIntervalMinutesKey = "intervalMinutes"
private let autoAlarmNotificationUserInfoSnoozeRepeatCountKey = "repeatCount"
private let autoAlarmNotificationUserInfoSnoozeRemainingCountKey = "remainingCount"
private let autoAlarmPendingEventsDefaultsKey = "offnal.auto-alarm.pending-events"

private struct AutoAlarmRuntimeConfig {
  let isSnoozeEnabled: Bool
  let snoozeIntervalMinutes: Int
  let snoozeRepeatCount: Int
  let snoozeRemainingCount: Int?

  init?(userInfo: [AnyHashable: Any]) {
    guard
      let snooze = userInfo[autoAlarmNotificationUserInfoSnoozeKey] as? [String: Any]
    else {
      return nil
    }

    isSnoozeEnabled = (snooze[autoAlarmNotificationUserInfoSnoozeEnabledKey] as? NSNumber)?.boolValue ?? false
    snoozeIntervalMinutes = (snooze[autoAlarmNotificationUserInfoSnoozeIntervalMinutesKey] as? NSNumber)?.intValue ?? 0
    snoozeRepeatCount = (snooze[autoAlarmNotificationUserInfoSnoozeRepeatCountKey] as? NSNumber)?.intValue ?? 0

    if let remaining = snooze[autoAlarmNotificationUserInfoSnoozeRemainingCountKey] as? NSNumber {
      let value = remaining.intValue
      snoozeRemainingCount = value < 0 ? nil : value
    } else {
      snoozeRemainingCount = nil
    }
  }
}

private enum AutoAlarmPlatformEventType: String {
  case dismissed
  case snoozed
}

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    let dismissAction = UNNotificationAction(
      identifier: autoAlarmDismissActionId,
      title: "알람 끄기",
      options: [.destructive]
    )
    let snoozeAction = UNNotificationAction(
      identifier: autoAlarmSnoozeActionId,
      title: "다시 울리기",
      options: [.foreground]
    )
    let autoAlarmCategory = UNNotificationCategory(
      identifier: autoAlarmNotificationCategoryId,
      actions: [snoozeAction, dismissAction],
      intentIdentifiers: [],
      options: []
    )
    UNUserNotificationCenter.current().setNotificationCategories(Set([autoAlarmCategory]))
    UNUserNotificationCenter.current().delegate = self

    factory.startReactNative(
      withModuleName: "Offnal",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  func application(
    _ application: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    if kakao_login.RNKakaoLogins.isKakaoTalkLoginUrl(url) {
      return kakao_login.RNKakaoLogins.handleOpen(url)
    }

    return false
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    if #available(iOS 14.0, *) {
      completionHandler([.banner, .list, .sound])
    } else {
      completionHandler([.alert, .sound])
    }
  }

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    switch response.actionIdentifier {
    case autoAlarmSnoozeActionId:
      handleAutoAlarmSnooze(center: center, response: response)
    case autoAlarmDismissActionId:
      handleAutoAlarmDismiss(center: center, response: response)
    default:
      break
    }

    completionHandler()
  }

  private func handleAutoAlarmDismiss(
    center: UNUserNotificationCenter,
    response: UNNotificationResponse
  ) {
    let identifier = response.notification.request.identifier
    center.removePendingNotificationRequests(withIdentifiers: [identifier])
    center.removeDeliveredNotifications(withIdentifiers: [identifier])

    guard let alarmId = alarmId(from: identifier) else {
      NSLog("AutoAlarm dismiss skipped because alarmId could not be parsed from identifier=%@", identifier)
      return
    }

    enqueueAutoAlarmPlatformEvent(
      type: .dismissed,
      alarmId: alarmId,
      nextTriggerAtMillis: nil,
      snoozeRemainingCount: nil,
      sessionState: "dismissed"
    )
  }

  private func handleAutoAlarmSnooze(
    center: UNUserNotificationCenter,
    response: UNNotificationResponse
  ) {
    let identifier = response.notification.request.identifier
    center.removePendingNotificationRequests(withIdentifiers: [identifier])
    center.removeDeliveredNotifications(withIdentifiers: [identifier])

    guard let alarmId = alarmId(from: identifier) else {
      NSLog("AutoAlarm snooze skipped because alarmId could not be parsed from identifier=%@", identifier)
      return
    }

    guard let runtimeConfig = AutoAlarmRuntimeConfig(userInfo: response.notification.request.content.userInfo) else {
      NSLog("AutoAlarm snooze skipped because runtime config was missing for alarmId=%d", alarmId)
      enqueueAutoAlarmPlatformEvent(
        type: .dismissed,
        alarmId: alarmId,
        nextTriggerAtMillis: nil,
        snoozeRemainingCount: nil,
        sessionState: "failed"
      )
      return
    }

    guard runtimeConfig.isSnoozeEnabled, runtimeConfig.snoozeIntervalMinutes > 0 else {
      enqueueAutoAlarmPlatformEvent(
        type: .dismissed,
        alarmId: alarmId,
        nextTriggerAtMillis: nil,
        snoozeRemainingCount: nil,
        sessionState: "dismissed"
      )
      return
    }

    if let remaining = runtimeConfig.snoozeRemainingCount, remaining <= 0 {
      enqueueAutoAlarmPlatformEvent(
        type: .dismissed,
        alarmId: alarmId,
        nextTriggerAtMillis: nil,
        snoozeRemainingCount: 0,
        sessionState: "expired"
      )
      return
    }

    let nextRemainingCount: Int?
    if let remaining = runtimeConfig.snoozeRemainingCount {
      nextRemainingCount = max(remaining - 1, 0)
    } else if runtimeConfig.snoozeRepeatCount == 0 {
      nextRemainingCount = nil
    } else {
      nextRemainingCount = max(runtimeConfig.snoozeRepeatCount - 1, 0)
    }

    let nextTriggerAtMillis =
      Int64(Date().timeIntervalSince1970 * 1000) +
      Int64(runtimeConfig.snoozeIntervalMinutes * 60_000)

    enqueueAutoAlarmPlatformEvent(
      type: .snoozed,
      alarmId: alarmId,
      nextTriggerAtMillis: nextTriggerAtMillis,
      snoozeRemainingCount: nextRemainingCount,
      sessionState: "snoozed"
    )
  }

  private func enqueueAutoAlarmPlatformEvent(
    type: AutoAlarmPlatformEventType,
    alarmId: Int,
    nextTriggerAtMillis: Int64?,
    snoozeRemainingCount: Int?,
    sessionState: String
  ) {
    var pendingEvents = UserDefaults.standard.array(forKey: autoAlarmPendingEventsDefaultsKey) as? [[String: Any]] ?? []
    var payload: [String: Any] = [
      "eventId": UUID().uuidString,
      "type": type.rawValue,
      "alarmId": alarmId,
      "occurredAtMillis": Int64(Date().timeIntervalSince1970 * 1000),
      "sessionState": sessionState,
      "source": "legacyNotificationAction",
    ]

    if let nextTriggerAtMillis {
      payload["nextTriggerAtMillis"] = nextTriggerAtMillis
    }

    if let snoozeRemainingCount {
      payload["snoozeRemainingCount"] = snoozeRemainingCount
    } else {
      payload["snoozeRemainingCount"] = NSNull()
    }

    pendingEvents.append(payload)
    UserDefaults.standard.set(pendingEvents, forKey: autoAlarmPendingEventsDefaultsKey)
    UserDefaults.standard.synchronize()
  }

  private func alarmId(from notificationIdentifier: String) -> Int? {
    guard
      let alarmIdString = notificationIdentifier.split(separator: ".").last,
      let alarmId = Int(alarmIdString)
    else {
      return nil
    }

    return alarmId
  }
}
