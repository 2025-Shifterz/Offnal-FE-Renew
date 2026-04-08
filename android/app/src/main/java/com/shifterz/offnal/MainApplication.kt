package com.shifterz.offnal

import android.app.Application
import android.content.pm.PackageManager
import android.os.Build
import android.util.Base64
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import java.security.MessageDigest

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    if (BuildConfig.DEBUG) {
      logKakaoConfig()
      logKeyHashes()
    }
  }

  private fun logKakaoConfig() {
    val kakaoAppKey = runCatching { getString(R.string.kakao_app_key) }.getOrNull().orEmpty()

    Log.d("KakaoConfig", "packageName=$packageName")
    Log.d("KakaoConfig", "applicationId=${BuildConfig.APPLICATION_ID}")
    Log.d("KakaoConfig", "buildType=${BuildConfig.BUILD_TYPE}")
    Log.d("KakaoConfig", "flavor=${BuildConfig.FLAVOR}")
    Log.d("KakaoConfig", "kakao_app_key=$kakaoAppKey")
    Log.d("KakaoConfig", "kakaoScheme=${if (kakaoAppKey.isNotEmpty()) "kakao$kakaoAppKey" else "kakao"}")
  }

  private fun logKeyHashes() {
    try {
      val packageInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        packageManager.getPackageInfo(
          packageName,
          PackageManager.GET_SIGNING_CERTIFICATES,
        )
      } else {
        @Suppress("DEPRECATION")
        packageManager.getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
      }

      val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        packageInfo.signingInfo?.apkContentsSigners ?: emptyArray()
      } else {
        @Suppress("DEPRECATION")
        packageInfo.signatures ?: emptyArray()
      }

      if (signatures.isEmpty()) {
        Log.w("KakaoConfig", "No signing certificates found")
        return
      }

      signatures.forEachIndexed { index, signature ->
        val md = MessageDigest.getInstance("SHA")
        md.update(signature.toByteArray())
        val keyHash = Base64.encodeToString(md.digest(), Base64.NO_WRAP)
        Log.d("KakaoConfig", "keyHash[$index]=$keyHash")
      }
    } catch (error: Exception) {
      Log.e("KakaoConfig", "Failed to calculate key hash", error)
    }
  }
}
