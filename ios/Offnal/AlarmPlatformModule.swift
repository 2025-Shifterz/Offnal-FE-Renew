import Foundation
import React
import UserNotifications
import CryptoKit

#if canImport(AlarmKit)
import AlarmKit
import SwiftUI
#endif

@objc(AlarmPlatformModule)
final class AlarmPlatformModule: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(getCapabilities:rejecter:)
  func getCapabilities(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      var payload: [String: Any] = [
        "alarmKitAvailable": false,
        "alarmKitAuthorizationStatus": "unsupported",
        "notificationAuthorizationStatus": self.stringValue(for: settings.authorizationStatus),
      ]

      #if canImport(AlarmKit)
      if #available(iOS 26.0, *) {
        payload["alarmKitAvailable"] = true
        payload["alarmKitAuthorizationStatus"] = self.stringValue(for: AlarmManager.shared.authorizationState)
      }
      #endif

      resolve(payload)
    }
  }

  @objc(scheduleAlarmItem:resolver:rejecter:)
  func scheduleAlarmItem(
    _ item: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    #if canImport(AlarmKit)
    if #available(iOS 26.0, *) {
      Task {
        do {
          try await self.scheduleAlarmKitItem(item)
          resolve(nil)
        } catch {
          reject(self.errorCode(for: error), error.localizedDescription, error)
        }
      }
      return
    }
    #endif

    reject("alarmkit_unavailable", "AlarmKit is unavailable on this iOS version.", nil)
  }

  @objc(cancelAlarm:resolver:rejecter:)
  func cancelAlarm(
    _ alarmId: NSNumber,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    #if canImport(AlarmKit)
    if #available(iOS 26.0, *) {
      do {
        try AlarmManager.shared.cancel(id: alarmUUID(for: alarmId.intValue))
        resolve(nil)
      } catch {
        reject(self.errorCode(for: error), error.localizedDescription, error)
      }
      return
    }
    #endif

    resolve(nil)
  }

  @objc(syncAlarmItems:resolver:rejecter:)
  func syncAlarmItems(
    _ items: [NSDictionary],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    #if canImport(AlarmKit)
    if #available(iOS 26.0, *) {
      Task {
        do {
          for item in items {
            let isEnabled =
              (item["isEnabled"] as? Bool) ??
              (item["isEnabled"] as? NSNumber)?.boolValue
            guard let isEnabled else {
              continue
            }
            guard let alarmId = item["alarmId"] as? NSNumber else {
              continue
            }

            if isEnabled {
              try await self.scheduleAlarmKitItem(item)
            } else {
              try AlarmManager.shared.cancel(id: alarmUUID(for: alarmId.intValue))
            }
          }

          resolve(nil)
        } catch {
          reject(self.errorCode(for: error), error.localizedDescription, error)
        }
      }
      return
    }
    #endif

    resolve(nil)
  }

  #if canImport(AlarmKit)
  @available(iOS 26.0, *)
  private struct OffnalAlarmMetadata: AlarmMetadata {
    let alarmId: Int
  }

  @available(iOS 26.0, *)
  private func scheduleAlarmKitItem(_ item: NSDictionary) async throws {
    guard
      let alarmId = item["alarmId"] as? NSNumber,
      let nextTriggerAtMillis = item["nextTriggerAtMillis"] as? NSNumber
    else {
      throw NSError(
        domain: "com.shifterz.offnal.AlarmPlatformModule",
        code: 2001,
        userInfo: [NSLocalizedDescriptionKey: "Invalid AlarmKit payload."]
      )
    }

    let triggerDate = Date(timeIntervalSince1970: nextTriggerAtMillis.doubleValue / 1000.0)
    guard triggerDate.timeIntervalSinceNow > 0 else {
      throw NSError(
        domain: "com.shifterz.offnal.AlarmPlatformModule",
        code: 2002,
        userInfo: [NSLocalizedDescriptionKey: "AlarmKit trigger must be a future date."]
      )
    }

    let authorizationState = try await ensureAlarmKitAuthorization()
    guard authorizationState == .authorized else {
      throw NSError(
        domain: "com.shifterz.offnal.AlarmPlatformModule",
        code: 2003,
        userInfo: [NSLocalizedDescriptionKey: "AlarmKit authorization is required."]
      )
    }

    let secondaryButton = AlarmButton(
      text: "다시 울리기",
      textColor: .white,
      systemImageName: "bell.badge"
    )
    let alert: AlarmPresentation.Alert

    if #available(iOS 26.1, *) {
      alert = AlarmPresentation.Alert(
        title: "알람",
        secondaryButton: secondaryButton,
        secondaryButtonBehavior: .countdown
      )
    } else {
      let stopButton = AlarmButton(
        text: "알람 끄기",
        textColor: .white,
        systemImageName: "xmark"
      )
      alert = AlarmPresentation.Alert(
        title: "알람",
        stopButton: stopButton,
        secondaryButton: secondaryButton,
        secondaryButtonBehavior: .countdown
      )
    }

    let attributes = AlarmAttributes(
      presentation: AlarmPresentation(alert: alert),
      metadata: OffnalAlarmMetadata(alarmId: alarmId.intValue),
      tintColor: .red
    )
    let configuration = AlarmManager.AlarmConfiguration.alarm(
      schedule: .fixed(triggerDate),
      attributes: attributes,
      sound: .default
    )

    _ = try await AlarmManager.shared.schedule(
      id: alarmUUID(for: alarmId.intValue),
      configuration: configuration
    )
  }

  @available(iOS 26.0, *)
  private func ensureAlarmKitAuthorization() async throws -> AlarmManager.AuthorizationState {
    let currentState = AlarmManager.shared.authorizationState
    if currentState != .notDetermined {
      return currentState
    }

    return try await AlarmManager.shared.requestAuthorization()
  }
  #endif

  private func stringValue(for status: UNAuthorizationStatus) -> String {
    switch status {
    case .authorized:
      return "authorized"
    case .denied:
      return "denied"
    case .notDetermined:
      return "notDetermined"
    case .provisional:
      return "provisional"
    case .ephemeral:
      return "ephemeral"
    @unknown default:
      return "unsupported"
    }
  }

  #if canImport(AlarmKit)
  @available(iOS 26.0, *)
  private func stringValue(for status: AlarmManager.AuthorizationState) -> String {
    switch status {
    case .authorized:
      return "authorized"
    case .denied:
      return "denied"
    case .notDetermined:
      return "notDetermined"
    @unknown default:
      return "unsupported"
    }
  }
  #endif

  private func alarmUUID(for alarmId: Int) -> UUID {
    let digest = SHA256.hash(data: Data("offnal.auto-alarm.\(alarmId)".utf8))
    let bytes = Array(digest.prefix(16))
    let uuid = uuid_t(
      bytes[0], bytes[1], bytes[2], bytes[3],
      bytes[4], bytes[5], bytes[6], bytes[7],
      bytes[8], bytes[9], bytes[10], bytes[11],
      bytes[12], bytes[13], bytes[14], bytes[15]
    )

    return UUID(uuid: uuid)
  }

  private func errorCode(for error: Error) -> String {
    let nsError = error as NSError

    switch nsError.code {
    case 2001:
      return "invalid_alarm_payload"
    case 2002:
      return "invalid_trigger_at_millis"
    case 2003:
      return "alarmkit_authorization_required"
    default:
      return "alarmkit_failed"
    }
  }
}
