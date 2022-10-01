using UnityEngine;
using UnityEngine.InputSystem;

public static class InputUtility {
    public static float GetHorizontal() {
        float result = 0;
        Keyboard kb = Keyboard.current;
        if (kb.aKey.isPressed || kb.leftArrowKey.isPressed) {
            result -= 1;
        }
        if(kb.dKey.isPressed || kb.rightArrowKey.isPressed) {
            result += 1;
        }
        return result;
    }

    public static float GetVertical() {
        float result = 0;
        Keyboard kb = Keyboard.current;
        if (kb.sKey.isPressed || kb.downArrowKey.isPressed) {
            result -= 1;
        }
        if (kb.wKey.isPressed || kb.upArrowKey.isPressed) {
            result += 1;
        }
        return result;
    }

    public static bool GetKeyDown(Key key) {
        return Keyboard.current[key].wasPressedThisFrame;
    }

    public static bool GetKeyUp(Key key) {
        return Keyboard.current[key].wasReleasedThisFrame;
    }

    public static bool GetKey(Key key) {
        return Keyboard.current[key].isPressed;
    }

    public static float MouseScrollDelta => Mouse.current.scroll.ReadValue().y;

    public static bool LeftMouseButtonDown => Mouse.current.leftButton.wasPressedThisFrame;
    public static bool LeftMouseButtonUp => Mouse.current.leftButton.wasReleasedThisFrame;
    public static Vector2 MousePosition => Mouse.current.position.ReadValue();
}
