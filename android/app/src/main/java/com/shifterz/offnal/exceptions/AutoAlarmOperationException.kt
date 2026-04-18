package com.shifterz.offnal.exceptions

class AutoAlarmOperationException(
    val code: String,
    override val message: String
) : RuntimeException(message)
