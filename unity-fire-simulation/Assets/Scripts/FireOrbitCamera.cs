// SI-assisted: generated with Codex; pending human review.
using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace FireSimulation
{
    [RequireComponent(typeof(Camera))]
    public sealed class FireOrbitCamera : MonoBehaviour
    {
        public Vector3 focus = new Vector3(0, .65f, 0);
        public float distance = 4;
        public float yaw = -18, pitch = 18;
        public float minimumDistance = .8f, maximumDistance = 12;
        Vector3 initialFocus;
        float initialDistance, initialYaw, initialPitch;

        void Awake()
        {
            initialFocus = focus; initialDistance = distance; initialYaw = yaw; initialPitch = pitch;
            PositionCamera();
        }

        void LateUpdate()
        {
            Vector2 delta = Vector2.zero, pointer = Vector2.zero;
            float scroll = 0;
            bool orbit = false, pan = false, reset = false;
#if ENABLE_INPUT_SYSTEM
            var mouse = Mouse.current;
            if (mouse != null)
            {
                delta = mouse.delta.ReadValue(); pointer = mouse.position.ReadValue();
                scroll = mouse.scroll.ReadValue().y;
                orbit = mouse.rightButton.isPressed; pan = mouse.middleButton.isPressed;
            }
            reset = Keyboard.current != null && Keyboard.current.fKey.wasPressedThisFrame;
#elif ENABLE_LEGACY_INPUT_MANAGER
            delta = new Vector2(Input.GetAxis("Mouse X"), Input.GetAxis("Mouse Y")) * 10;
            pointer = Input.mousePosition; scroll = Input.mouseScrollDelta.y;
            orbit = Input.GetMouseButton(1); pan = Input.GetMouseButton(2); reset = Input.GetKeyDown(KeyCode.F);
#endif
            // Reserve the left telemetry panel for scrolling and selection.
            if (pointer.x > Mathf.Min(360, Screen.width * .32f) || !TelemetryVisible())
            {
                if (orbit) { yaw += delta.x * .22f; pitch = Mathf.Clamp(pitch - delta.y * .22f, -15, 85); }
                if (pan) focus += (-transform.right * delta.x - transform.up * delta.y) * distance * .0012f;
                distance = Mathf.Clamp(distance * Mathf.Exp(-scroll * .12f), minimumDistance, maximumDistance);
            }
            if (reset) { focus = initialFocus; distance = initialDistance; yaw = initialYaw; pitch = initialPitch; }
            PositionCamera();
        }

        bool TelemetryVisible()
        {
            if (controller == null) controller = FindFirstObjectByType<FireSimulationController>();
            return controller != null && controller.showTelemetry;
        }
        FireSimulationController controller;

        void PositionCamera()
        {
            var rotation = Quaternion.Euler(pitch, yaw, 0);
            transform.SetPositionAndRotation(focus + rotation * Vector3.back * distance, rotation);
        }
    }
}
