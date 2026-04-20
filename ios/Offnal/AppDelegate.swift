import UIKit
import UserNotifications
import SQLite3
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import kakao_login

private let autoAlarmNotificationCategoryId = "offnal.auto-alarm.category"
private let autoAlarmSnoozeActionId = "offnal.auto-alarm.snooze"
private let autoAlarmDismissActionId = "offnal.auto-alarm.dismiss"
private let autoAlarmDatabaseName = "myDatabase.db"
private let autoAlarmNotificationSoundName = "auto_alarm.caf"
private let autoAlarmNotificationSoundDirectoryName = "Sounds"
private let autoAlarmNotificationTitle = "알람"
private let autoAlarmNotificationBody = "일어날 시간이에요."
private let autoAlarmNotificationUserInfoAlarmIdKey = "alarmId"
private let autoAlarmNotificationUserInfoSnoozeEnabledKey = "isSnoozeEnabled"
private let autoAlarmNotificationUserInfoSnoozeIntervalMinutesKey = "snoozeIntervalMinutes"
private let autoAlarmNotificationUserInfoSnoozeRepeatCountKey = "snoozeRepeatCount"
private let autoAlarmNotificationUserInfoSnoozeRemainingCountKey = "snoozeRemainingCount"

private struct AutoAlarmRuntimeConfig {
  let isSnoozeEnabled: Bool
  let snoozeIntervalMinutes: Int
  let snoozeRepeatCount: Int
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
    installAutoAlarmSoundIfNeeded()

    let dismissAction = UNNotificationAction(
      identifier: autoAlarmDismissActionId,
      title: "알람 끄기",
      options: [.destructive]
    )
    let snoozeAction = UNNotificationAction(
      identifier: autoAlarmSnoozeActionId,
      title: "다시 울리기",
      options: []
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
      handleAutoAlarmSnooze(center: center, response: response, completionHandler: completionHandler)
    case autoAlarmDismissActionId:
      handleAutoAlarmDismiss(center: center, response: response)
      completionHandler()
    default:
      completionHandler()
      return
    }
  }

  private func handleAutoAlarmDismiss(center: UNUserNotificationCenter, response: UNNotificationResponse) {
    let identifier = response.notification.request.identifier
    center.removePendingNotificationRequests(withIdentifiers: [identifier])
    center.removeDeliveredNotifications(withIdentifiers: [identifier])
    updateAutoAlarmEnabledState(alarmIdentifier: identifier, isEnabled: false)
  }

  private func handleAutoAlarmSnooze(
    center: UNUserNotificationCenter,
    response: UNNotificationResponse,
    completionHandler: @escaping () -> Void
  ) {
    let identifier = response.notification.request.identifier
    center.removePendingNotificationRequests(withIdentifiers: [identifier])
    center.removeDeliveredNotifications(withIdentifiers: [identifier])

    guard let alarmId = alarmId(from: identifier) else {
      completionHandler()
      return
    }

    guard let runtimeConfig = loadRuntimeConfig(for: alarmId) else {
      completionHandler()
      return
    }

    guard runtimeConfig.isSnoozeEnabled else {
      updateAutoAlarmEnabledState(alarmIdentifier: identifier, isEnabled: false)
      completionHandler()
      return
    }

    let currentUserInfo = response.notification.request.content.userInfo
    let currentRemainingCount = snoozeRemainingCount(from: currentUserInfo) ?? defaultSnoozeRemainingCount(for: runtimeConfig)

    let shouldRepeatSnooze: Bool
    if currentRemainingCount == nil {
      shouldRepeatSnooze = true
    } else {
      shouldRepeatSnooze = currentRemainingCount! > 0
    }

    guard shouldRepeatSnooze else {
      updateAutoAlarmEnabledState(alarmIdentifier: identifier, isEnabled: false)
      completionHandler()
      return
    }

    let nextRemainingCount = nextSnoozeRemainingCount(from: currentRemainingCount)
    let nextTriggerAtMillis = Int64(Date().timeIntervalSince1970 * 1000) + Int64(runtimeConfig.snoozeIntervalMinutes * 60_000)

    let updatedTrigger = updateAutoAlarmNextTriggerAtMillis(
      alarmId: alarmId,
      nextTriggerAtMillis: nextTriggerAtMillis
    )
    let enabledUpdated = updateAutoAlarmEnabledState(alarmId: alarmId, isEnabled: true)
    guard updatedTrigger, enabledUpdated else {
      updateAutoAlarmEnabledState(alarmIdentifier: identifier, isEnabled: false)
      completionHandler()
      return
    }

    var backgroundTaskIdentifier = UIBackgroundTaskIdentifier.invalid
    backgroundTaskIdentifier = UIApplication.shared.beginBackgroundTask(
      withName: "autoAlarmSnooze"
    ) {
      if backgroundTaskIdentifier != .invalid {
        UIApplication.shared.endBackgroundTask(backgroundTaskIdentifier)
        backgroundTaskIdentifier = .invalid
      }
    }

    scheduleSnoozedNotification(
      alarmId: alarmId,
      runtimeConfig: runtimeConfig,
      nextTriggerAtMillis: nextTriggerAtMillis,
      remainingCount: nextRemainingCount
    ) { success in
      if !success {
        self.updateAutoAlarmEnabledState(alarmIdentifier: identifier, isEnabled: false)
      }

      if backgroundTaskIdentifier != .invalid {
        UIApplication.shared.endBackgroundTask(backgroundTaskIdentifier)
        backgroundTaskIdentifier = .invalid
      }
      completionHandler()
    }
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

  private func defaultSnoozeRemainingCount(for runtimeConfig: AutoAlarmRuntimeConfig) -> Int? {
    guard runtimeConfig.isSnoozeEnabled else {
      return 0
    }

    return runtimeConfig.snoozeRepeatCount == 0 ? nil : runtimeConfig.snoozeRepeatCount
  }

  private func snoozeRemainingCount(from userInfo: [AnyHashable: Any]) -> Int? {
    guard let remainingCount = userInfo[autoAlarmNotificationUserInfoSnoozeRemainingCountKey] as? NSNumber else {
      return nil
    }

    let value = remainingCount.intValue
    return value < 0 ? nil : value
  }

  private func nextSnoozeRemainingCount(from currentRemainingCount: Int?) -> Int? {
    guard let currentRemainingCount, currentRemainingCount >= 0 else {
      return nil
    }

    guard currentRemainingCount > 0 else {
      return 0
    }

    return currentRemainingCount - 1
  }

  private func scheduleSnoozedNotification(
    alarmId: Int,
    runtimeConfig: AutoAlarmRuntimeConfig,
    nextTriggerAtMillis: Int64,
    remainingCount: Int?,
    completion: @escaping (Bool) -> Void
  ) {
    let date = Date(timeIntervalSince1970: TimeInterval(nextTriggerAtMillis) / 1000.0)

    let calendar = Calendar.current
    var components = calendar.dateComponents(
      [.year, .month, .day, .hour, .minute, .second],
      from: date
    )
    components.timeZone = .current

    let content = UNMutableNotificationContent()
    content.title = autoAlarmNotificationTitle
    content.body = autoAlarmNotificationBody
    content.sound = UNNotificationSound(named: UNNotificationSoundName(rawValue: autoAlarmNotificationSoundName))
    content.categoryIdentifier = autoAlarmNotificationCategoryId
    content.threadIdentifier = autoAlarmNotificationCategoryId
    content.interruptionLevel = .timeSensitive
    content.userInfo = notificationUserInfo(
      alarmId: alarmId,
      runtimeConfig: runtimeConfig,
      remainingCount: remainingCount
    )

    let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
    let request = UNNotificationRequest(
      identifier: notificationIdentifier(for: alarmId),
      content: content,
      trigger: trigger
    )

    let center = UNUserNotificationCenter.current()
    let snoozedNotificationIdentifier = notificationIdentifier(for: alarmId)
    center.removePendingNotificationRequests(withIdentifiers: [snoozedNotificationIdentifier])
    center.removeDeliveredNotifications(withIdentifiers: [snoozedNotificationIdentifier])
    center.add(request) { error in
      completion(error == nil)
    }
  }

  private func notificationUserInfo(
    alarmId: Int,
    runtimeConfig: AutoAlarmRuntimeConfig,
    remainingCount: Int?
  ) -> [AnyHashable: Any] {
    [
      autoAlarmNotificationUserInfoAlarmIdKey: alarmId,
      autoAlarmNotificationUserInfoSnoozeEnabledKey: runtimeConfig.isSnoozeEnabled,
      autoAlarmNotificationUserInfoSnoozeIntervalMinutesKey: runtimeConfig.snoozeIntervalMinutes,
      autoAlarmNotificationUserInfoSnoozeRepeatCountKey: runtimeConfig.snoozeRepeatCount,
      autoAlarmNotificationUserInfoSnoozeRemainingCountKey: remainingCount ?? -1,
    ]
  }

  private func notificationIdentifier(for alarmId: Int) -> String {
    "offnal.auto-alarm.\(alarmId)"
  }

  private func loadRuntimeConfig(for alarmId: Int) -> AutoAlarmRuntimeConfig? {
    guard
      let databaseURL = databaseURL()
    else {
      return nil
    }

    var database: OpaquePointer?
    let openResult = databaseURL.path.withCString {
      sqlite3_open_v2($0, &database, SQLITE_OPEN_READWRITE, nil)
    }
    guard openResult == SQLITE_OK, let database else {
      if database != nil {
        sqlite3_close(database)
      }
      return nil
    }

    defer {
      sqlite3_close(database)
    }

    let querySQL = "SELECT isSnoozeEnabled, snoozeIntervalMinutes, snoozeRepeatCount FROM auto_alarms WHERE id = ? LIMIT 1;"
    var statement: OpaquePointer?
    guard sqlite3_prepare_v2(database, querySQL, -1, &statement, nil) == SQLITE_OK, let statement else {
      return nil
    }

    defer {
      sqlite3_finalize(statement)
    }

    sqlite3_bind_int(statement, 1, Int32(alarmId))

    guard sqlite3_step(statement) == SQLITE_ROW else {
      return nil
    }

    return AutoAlarmRuntimeConfig(
      isSnoozeEnabled: sqlite3_column_int(statement, 0) == 1,
      snoozeIntervalMinutes: Int(sqlite3_column_int(statement, 1)),
      snoozeRepeatCount: Int(sqlite3_column_int(statement, 2))
    )
  }

  private func updateAutoAlarmEnabledState(alarmIdentifier: String, isEnabled: Bool) {
    guard let alarmId = alarmId(from: alarmIdentifier) else {
      return
    }

    updateAutoAlarmEnabledState(alarmId: alarmId, isEnabled: isEnabled)
  }

  @discardableResult
  private func updateAutoAlarmEnabledState(alarmId: Int, isEnabled: Bool) -> Bool {
    guard let databaseURL = databaseURL() else {
      return false
    }

    var database: OpaquePointer?
    let openResult = databaseURL.path.withCString {
      sqlite3_open_v2($0, &database, SQLITE_OPEN_READWRITE, nil)
    }
    guard openResult == SQLITE_OK, let database else {
      if database != nil {
        sqlite3_close(database)
      }
      return false
    }

    defer {
      sqlite3_close(database)
    }

    let updateSQL = "UPDATE auto_alarms SET isEnabled = ? WHERE id = ?;"
    var statement: OpaquePointer?
    guard sqlite3_prepare_v2(database, updateSQL, -1, &statement, nil) == SQLITE_OK, let statement else {
      return false
    }

    defer {
      sqlite3_finalize(statement)
    }

    sqlite3_bind_int(statement, 1, isEnabled ? 1 : 0)
    sqlite3_bind_int(statement, 2, Int32(alarmId))

    return sqlite3_step(statement) == SQLITE_DONE
  }

  @discardableResult
  private func updateAutoAlarmNextTriggerAtMillis(alarmId: Int, nextTriggerAtMillis: Int64) -> Bool {
    guard let databaseURL = databaseURL() else {
      return false
    }

    var database: OpaquePointer?
    let openResult = databaseURL.path.withCString {
      sqlite3_open_v2($0, &database, SQLITE_OPEN_READWRITE, nil)
    }
    guard openResult == SQLITE_OK, let database else {
      if database != nil {
        sqlite3_close(database)
      }
      return false
    }

    defer {
      sqlite3_close(database)
    }

    let updateSQL = "UPDATE auto_alarms SET nextTriggerAtMillis = ? WHERE id = ?;"
    var statement: OpaquePointer?
    guard sqlite3_prepare_v2(database, updateSQL, -1, &statement, nil) == SQLITE_OK, let statement else {
      return false
    }

    defer {
      sqlite3_finalize(statement)
    }

    sqlite3_bind_int64(statement, 1, nextTriggerAtMillis)
    sqlite3_bind_int(statement, 2, Int32(alarmId))

    return sqlite3_step(statement) == SQLITE_DONE
  }

  private func databaseURL() -> URL? {
    FileManager.default.urls(
      for: .documentDirectory,
      in: .userDomainMask
    ).first?.appendingPathComponent(autoAlarmDatabaseName)
  }

  private func installAutoAlarmSoundIfNeeded() {
    let fileManager = FileManager.default
    guard
      let sourceURL = Bundle.main.url(forResource: "auto_alarm", withExtension: "caf"),
      let libraryURL = fileManager.urls(for: .libraryDirectory, in: .userDomainMask).first
    else {
      return
    }

    let soundsDirectoryURL = libraryURL.appendingPathComponent(autoAlarmNotificationSoundDirectoryName, isDirectory: true)
    if !fileManager.fileExists(atPath: soundsDirectoryURL.path) {
      do {
        try fileManager.createDirectory(
          at: soundsDirectoryURL,
          withIntermediateDirectories: true,
          attributes: nil
        )
      } catch {
        return
      }
    }

    let destinationURL = soundsDirectoryURL.appendingPathComponent(autoAlarmNotificationSoundName)
    if fileManager.fileExists(atPath: destinationURL.path) {
      return
    }

    do {
      try fileManager.copyItem(at: sourceURL, to: destinationURL)
    } catch {
      return
    }
  }
}
