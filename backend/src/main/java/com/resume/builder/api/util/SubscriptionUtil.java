package com.resume.builder.api.util;

import com.resume.builder.api.entity.User;
import com.resume.builder.api.enums.SubscriptionPlan;

public class SubscriptionUtil {

    public static boolean isPremium(User user) {
        return user.getSubscriptionPlan() == SubscriptionPlan.PREMIUM;
    }

    public static boolean isBasic(User user) {
        return user.getSubscriptionPlan() == SubscriptionPlan.BASIC;
    }
}
