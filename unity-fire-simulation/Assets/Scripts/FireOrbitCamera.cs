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
        public bool keepInsideCabin = true;
        public Vector3 cabinMinimum = new Vector3(-3.1f, .05f, -5.05f);
        public Vector3 cabinMaximum = new Vector3(3.1f, 3.15f, 2.4f);
        Vector3 initialFocus;
        float initialDistance, initialYaw, initialPitch;

        void Awake()
        {
            initialFocus = focus; initialDistance = distance; initialYaw = yaw; initialPitch = pitch;
            GetComponent<Camera>().nearClipPlane = .05f;
            PositionCamera();
        }

        void LateUpdate()
        {
            Vector2 delta = Vector2.zero;
            float scroll = 0;
            bool orbit = false, pan = false, reset = false;
#if ENABLE_INPUT_SYSTEM
            var mouse = Mouse.current;
            if (mouse != null)
            {
                delta = mouse.delta.ReadValue();
                scroll = mouse.scroll.ReadValue().y;
                orbit = mouse.leftButton.isPressed; pan = mouse.middleButton.isPressed;
            }
            reset = Keyboard.current != null && Keyboard.current.fKey.wasPressedThisFrame;
#elif ENABLE_LEGACY_INPUT_MANAGER
            delta = new Vector2(Input.GetAxis("Mouse X"), Input.GetAxis("Mouse Y")) * 10;
            scroll = Input.mouseScrollDelta.y;
            orbit = Input.GetMouseButton(1); pan = Input.GetMouseButton(2); reset = Input.GetKeyDown(KeyCode.F);
#endif
            if (orbit) { yaw += delta.x * .22f; pitch = Mathf.Clamp(pitch - delta.y * .22f, -15, 85); }
            if (pan) focus += (-transform.right * delta.x - transform.up * delta.y) * distance * .0012f;
            distance = Mathf.Clamp(distance * Mathf.Exp(-scroll * .12f), minimumDistance, maximumDistance);
            if (reset) { focus = initialFocus; distance = initialDistance; yaw = initialYaw; pitch = initialPitch; }
            PositionCamera();
        }

        void PositionCamera()
        {
            var rotation = Quaternion.Euler(pitch, yaw, 0);
            Vector3 direction = rotation * Vector3.back;
            float allowed = distance;
            if (keepInsideCabin)
            {
                focus = ClampFocus(focus, cabinMinimum, cabinMaximum);
                allowed = LimitDistance(focus, direction, distance, cabinMinimum, cabinMaximum);
            }
            transform.SetPositionAndRotation(focus + direction * allowed, rotation);
        }

        public static Vector3 ClampFocus(Vector3 value, Vector3 minimum, Vector3 maximum)
        {
            const float margin = .25f;
            return new Vector3(Mathf.Clamp(value.x, minimum.x + margin, maximum.x - margin),
                Mathf.Clamp(value.y, minimum.y + margin, maximum.y - margin),
                Mathf.Clamp(value.z, minimum.z + margin, maximum.z - margin));
        }

        public static float LimitDistance(Vector3 origin, Vector3 direction, float requested, Vector3 minimum, Vector3 maximum)
        {
            float allowed = Mathf.Max(0, requested);
            for (int axis = 0; axis < 3; axis++)
            {
                if (Mathf.Abs(direction[axis]) < .00001f) continue;
                float boundary = direction[axis] > 0 ? maximum[axis] : minimum[axis];
                allowed = Mathf.Min(allowed, Mathf.Max(0, (boundary - origin[axis]) / direction[axis]));
            }
            return allowed;
        }
    }
}
