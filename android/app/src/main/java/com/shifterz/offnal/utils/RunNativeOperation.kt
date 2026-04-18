package com.shifterz.offnal.utils

import com.facebook.react.bridge.Promise
import com.shifterz.offnal.exceptions.AutoAlarmOperationException

internal inline fun runNativeOperation(promise: Promise, block:() -> Unit) {
    try {
        block()
        promise.resolve(null)
    } catch (exception: AutoAlarmOperationException) {
        promise.reject(exception.code, exception.message, exception)
    } catch (exception: IllegalArgumentException) {
        promise.reject(
            "invalid_arguments",
            exception.message ?: "Invalid arguments for auto alarm operation.",
            exception
        )
    } catch (exception: Throwable) {
        promise.reject(
            "unexpected_error",
            exception.message ?: "Unexpected error while processing auto alarm operation.",
            exception
        )
    }
}