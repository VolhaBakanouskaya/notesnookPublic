/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { db } from "../../common/database";
import { DDS } from "../../services/device-detection";
import { ToastEvent } from "../../services/event-manager";
import { clearMessage, setEmailVerifyMessage } from "../../services/message";
import PremiumService from "../../services/premium";
import { useThemeStore } from "../../stores/use-theme-store";
import { useUserStore } from "../../stores/use-user-store";
import { openLinkInBrowser } from "../../utils/functions";
import { SIZE } from "../../utils/size";
import { sleep } from "../../utils/time";
import { Button } from "../ui/button";
import Input from "../ui/input";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";
import { hideAuth } from "./common";
import { useSettingStore } from "../../stores/use-setting-store";

export const Signup = ({ changeMode, trial }) => {
  const colors = useThemeStore((state) => state.colors);
  const email = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const password = useRef();
  const confirmPasswordInputRef = useRef();
  const confirmPassword = useRef();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const setLastSynced = useUserStore((state) => state.setLastSynced);
  const deviceMode = useSettingStore((state) => state.deviceMode);

  const validateInfo = () => {
    if (!password.current || !email.current || !confirmPassword.current) {
      ToastEvent.show({
        heading: "All fields required",
        message: "Fill all the fields and try again",
        type: "error",
        context: "local"
      });

      return false;
    }

    return true;
  };

  const signup = async () => {
    if (!validateInfo() || error) return;
    setLoading(true);
    try {
      await db.user.signup(email.current.toLowerCase(), password.current);
      let user = await db.user.getUser();
      setUser(user);
      setLastSynced(await db.lastSynced());
      clearMessage();
      setEmailVerifyMessage();
      hideAuth();
      await sleep(300);
      if (trial) {
        PremiumService.sheet(null, null, true);
      } else {
        PremiumService.showVerifyEmailDialog();
      }
    } catch (e) {
      setLoading(false);
      ToastEvent.show({
        heading: "Signup failed",
        message: e.message,
        type: "error",
        context: "local"
      });
    }
  };

  return (
    <>
      <View
        style={{
          borderRadius: DDS.isTab ? 5 : 0,
          backgroundColor: colors.bg,
          zIndex: 10,
          width: "100%",
          alignSelf: "center",
          height: "100%",
          minHeight: "100%"
        }}
      >
        <View
          style={{
            flexGrow: 1,
            justifyContent: "flex-end",
            paddingHorizontal: 20,
            backgroundColor: colors.nav,
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            alignSelf: deviceMode !== "mobile" ? "center" : undefined,
            borderWidth: deviceMode !== "mobile" ? 1 : null,
            borderColor: deviceMode !== "mobile" ? colors.border : null,
            borderRadius: deviceMode !== "mobile" ? 20 : null,
            marginTop: deviceMode !== "mobile" ? 50 : null,
            width: deviceMode === "mobile" ? null : "50%"
          }}
        >
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: 100,
                height: 5,
                backgroundColor: colors.accent,
                borderRadius: 2,
                marginRight: 7
              }}
            />

            <View
              style={{
                width: 20,
                height: 5,
                backgroundColor: colors.nav,
                borderRadius: 2
              }}
            />
          </View>
          <Heading
            extraBold
            style={{
              marginBottom: 25,
              marginTop: 10
            }}
            size={SIZE.xxl}
          >
            Create your {"\n"}account
          </Heading>
        </View>

        <View
          style={{
            width: DDS.isTab ? "50%" : "100%",
            paddingHorizontal: 20,
            backgroundColor: colors.bg,
            alignSelf: "center",
            flexGrow: 0.5
          }}
        >
          <Input
            fwdRef={emailInputRef}
            onChangeText={(value) => {
              email.current = value;
            }}
            testID="input.email"
            onErrorCheck={(e) => setError(e)}
            returnKeyLabel="Next"
            returnKeyType="next"
            autoComplete="email"
            validationType="email"
            autoCorrect={false}
            autoCapitalize="none"
            errorMessage="Email is invalid"
            placeholder="Email"
            onSubmit={() => {
              passwordInputRef.current?.focus();
            }}
          />

          <Input
            fwdRef={passwordInputRef}
            onChangeText={(value) => {
              password.current = value;
            }}
            testID="input.password"
            onErrorCheck={(e) => setError(e)}
            returnKeyLabel="Next"
            returnKeyType="next"
            secureTextEntry
            autoComplete="password"
            autoCapitalize="none"
            validationType="password"
            autoCorrect={false}
            placeholder="Password"
            onSubmit={() => {
              confirmPasswordInputRef.current?.focus();
            }}
          />

          <Input
            fwdRef={confirmPasswordInputRef}
            onChangeText={(value) => {
              confirmPassword.current = value;
            }}
            testID="input.confirmPassword"
            onErrorCheck={(e) => setError(e)}
            returnKeyLabel="Signup"
            returnKeyType="done"
            secureTextEntry
            autoComplete="password"
            autoCapitalize="none"
            autoCorrect={false}
            validationType="confirmPassword"
            customValidator={() => password.current}
            placeholder="Confirm password"
            marginBottom={12}
            onSubmit={signup}
          />

          <Paragraph
            style={{
              marginBottom: 25
            }}
            size={SIZE.xs}
            color={colors.icon}
          >
            By signing up, you agree to our{" "}
            <Paragraph
              size={SIZE.xs}
              onPress={() => {
                openLinkInBrowser("https://notesnook.com/tos", colors);
              }}
              style={{
                textDecorationLine: "underline"
              }}
              color={colors.accent}
            >
              Terms of Service{" "}
            </Paragraph>
            and{" "}
            <Paragraph
              size={SIZE.xs}
              onPress={() => {
                openLinkInBrowser("https://notesnook.com/privacy", colors);
              }}
              style={{
                textDecorationLine: "underline"
              }}
              color={colors.accent}
            >
              Privacy Policy.
            </Paragraph>{" "}
            You also agree to recieve marketing emails from us which you can
            opt-out of from app settings.
          </Paragraph>

          <Button
            title={!loading ? "Continue" : null}
            type="accent"
            loading={loading}
            onPress={signup}
            fontSize={SIZE.md}
            style={{
              marginRight: 12,
              width: 250,
              borderRadius: 100
            }}
          />

          <TouchableOpacity
            onPress={() => {
              if (loading) return;
              changeMode(0);
            }}
            activeOpacity={0.8}
            style={{
              alignSelf: "center",
              marginTop: 12,
              paddingVertical: 12
            }}
          >
            <Paragraph size={SIZE.xs + 1} color={colors.icon}>
              Already have an account?{" "}
              <Paragraph size={SIZE.xs + 1} style={{ color: colors.accent }}>
                Login
              </Paragraph>
            </Paragraph>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
