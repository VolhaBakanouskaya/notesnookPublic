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

import React from "react";
import { View } from "react-native";
import { useMessageStore } from "../../stores/use-message-store";
import { useThemeStore } from "../../stores/use-theme-store";
import { COLORS_NOTE } from "../../utils/color-scheme";
import { hexToRGBA } from "../../utils/color-scheme/utils";

export const DefaultPlaceholder = ({ color }: { color: string }) => {
  const colors = useThemeStore((state) => state.colors);
  const message = useMessageStore((state) => state.message);
  const annoucements = useMessageStore((state) => state.announcements);
  const hasAnnoucements = annoucements.length > 0;
  const shadeColor = color
    ? hexToRGBA(
        COLORS_NOTE[color?.toLowerCase() as keyof typeof COLORS_NOTE],
        0.15
      )
    : colors.shade;

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 12
      }}
    >
      {hasAnnoucements ? (
        <View
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            marginBottom: 20,
            backgroundColor: colors.nav,
            padding: 12
          }}
        >
          <View
            style={{
              width: 150,
              height: 20,
              backgroundColor: colors.transGray,
              borderRadius: 5,
              marginBottom: 10
            }}
          />
          <View
            style={{
              width: 250,
              height: 14,
              backgroundColor: colors.transGray,
              borderRadius: 5
            }}
          />

          <View
            style={{
              width: 60,
              height: 15,
              backgroundColor: shadeColor,
              borderRadius: 3,
              marginTop: 10
            }}
          />
        </View>
      ) : null}

      {message ? (
        <View
          style={{
            width: "100%",
            height: 60,
            borderRadius: 10,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: shadeColor,
              borderRadius: 100,
              marginRight: 10
            }}
          />
          <View>
            <View
              style={{
                width: 150,
                height: 12,
                backgroundColor: colors.nav,
                borderRadius: 5,
                marginBottom: 10
              }}
            />
            <View
              style={{
                width: 250,
                height: 16,
                backgroundColor: colors.nav,
                borderRadius: 5
              }}
            />
          </View>
        </View>
      ) : null}

      <View
        style={{
          width: "100%",
          height: 30,
          backgroundColor: colors.nav,
          borderRadius: 10,
          marginBottom: 20,
          padding: 5,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: 60,
            height: 15,
            backgroundColor: shadeColor,
            borderRadius: 3
          }}
        />

        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: colors.transGray,
              borderRadius: 100,
              marginRight: 10
            }}
          />
          <View
            style={{
              width: 60,
              height: 15,
              backgroundColor: colors.transGray,
              borderRadius: 3
            }}
          />
        </View>
      </View>

      <View
        style={{
          width: 200,
          height: 16,
          backgroundColor: colors.nav,
          borderRadius: 5
        }}
      />
      <View
        style={{
          width: "85%",
          height: 13,
          backgroundColor: colors.nav,
          borderRadius: 5,
          marginTop: 10
        }}
      />

      <View
        style={{
          flexDirection: "row",
          marginTop: 10
        }}
      >
        <View
          style={{
            width: 50,
            height: 10,
            backgroundColor: colors.nav,
            borderRadius: 5
          }}
        />
        <View
          style={{
            width: 60,
            height: 10,
            backgroundColor: colors.nav,
            borderRadius: 5,
            marginLeft: 10
          }}
        />
      </View>
    </View>
  );
};
