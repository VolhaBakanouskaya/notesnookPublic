import React from "react";
import { Flex, Text, Button as RebassButton } from "rebass";
import * as Icon from "../icons";
import Modal from "react-modal";
import { useTheme } from "emotion-theming";

function Dialog(props) {
  const theme = useTheme();
  return (
    <Modal
      isOpen={props.isOpen || false}
      onRequestClose={props.onClose}
      shouldCloseOnEsc
      shouldReturnFocusAfterClose
      shouldFocusAfterRender
      onAfterOpen={(e) => {
        if (!props.onClose) return;
        // we need this work around because ReactModal content spreads over the overlay
        const child = e.contentEl.firstElementChild;
        e.contentEl.onmousedown = function (e) {
          if (!e.screenX && !e.screenY) return;
          if (
            e.x < child.offsetLeft ||
            e.x > child.offsetLeft + child.clientWidth ||
            e.y < child.offsetTop ||
            e.y > child.offsetTop + child.clientHeight
          ) {
            props.onClose();
          }
        };
        if (props.onOpen) props.onOpen();
      }}
      style={{
        content: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          backgroundColor: undefined,
          padding: 0,
          overflowY: "hidden",
          zIndex: 0,
        },
        overlay: {
          zIndex: 999,
          background: theme.colors.overlay,
        },
      }}
    >
      <Flex
        p={props.padding || 30}
        flexDirection="column"
        width={["100%", "90%", props.width || "33%"]}
        maxHeight={["100%", "80%", "70%"]}
        height={["100%", "auto", "auto"]}
        bg="background"
        alignSelf={"center"}
        m={props.margin || [0, 2, 2]}
        overflowY={props.scrollable ? "auto" : "hidden"}
        sx={{
          position: "relative",
          overflow: "hidden",
          boxShadow: "4px 5px 18px 2px #00000038",
          borderRadius: "default",
        }}
      >
        {props.showClose && (
          <Icon.Close
            sx={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              right: 30,
              mt: 38,
              zIndex: 999,
            }}
            size={26}
            onClick={props.onClose}
          />
        )}
        <Flex
          flexDirection="column"
          pb={props.headerPaddingBottom || 2}
          //sx={{ borderBottom: "1px solid", borderColor: "border" }}
        >
          {/* {props.icon && (
            <props.icon size={props.iconSize || 38} color="primary" />
          )} */}
          <Text variant="heading" textAlign="left" color="text">
            {props.title}
          </Text>
          {props.description && (
            <Text variant="body" textAlign="left" color="fontTertiary" mt={1}>
              {props.description}
            </Text>
          )}
        </Flex>
        {props.children}

        {(props.positiveButton || props.negativeButton) && (
          <Flex
            sx={{ justifyContent: props.buttonsAlignment || "flex-end" }}
            mt={3}
          >
            {props.positiveButton && (
              <RebassButton
                {...props.positiveButton.props}
                variant="primary"
                data-test-id="dialog-yes"
                sx={{ opacity: props.positiveButton.disabled ? 0.7 : 1 }}
                mx={1}
                autoFocus={props.positiveButton.autoFocus}
                disabled={props.positiveButton.disabled || false}
                onClick={
                  !props.positiveButton.disabled
                    ? props.positiveButton.onClick
                    : undefined
                }
              >
                {props.positiveButton.loading ? (
                  <Icon.Loading rotate={true} color="static" />
                ) : (
                  props.positiveButton.text || "OK"
                )}
              </RebassButton>
            )}
            {props.negativeButton && (
              <RebassButton
                variant="secondary"
                data-test-id="dialog-no"
                onClick={props.negativeButton.onClick}
              >
                {props.negativeButton.text || "Cancel"}
              </RebassButton>
            )}
          </Flex>
        )}
        {props.footer}
      </Flex>
    </Modal>
  );
}

export default Dialog;