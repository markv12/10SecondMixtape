using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class WiggleOnMouseHover : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public float intensity = 1.0f;
    public float speed = 1.0f;

    private Button button;
    private Vector3 originalPosition;
    private Vector3 originalScale;
    private Vector3 originalRotation;

    bool isHovering = false;

    void Start()
    {
        button = GetComponent<Button>();
        originalPosition = transform.localPosition;
        originalScale = transform.localScale;
        originalRotation = transform.localEulerAngles;
    }

    void Update() 
    {
        if (isHovering) {
            //move the sprite up then down in a cos motion
            // transform.position = new Vector3(
            //     transform.position.x + Mathf.Cos(Time.time * 10.0f * speed) * intensity, 
            //     transform.position.y, 
            //     transform.position.z
            // );
            
            transform.localScale = new Vector3(
                    originalScale.x + .15f * intensity,
                    originalScale.y + .15f * intensity,
                    originalScale.z
                );
            bool state1 = Mathf.Cos(Time.time * 10.0f * speed) > 0;
            if (state1) {
                transform.localEulerAngles = new Vector3(
                    originalRotation.x, 
                    originalRotation.y, 
                    originalRotation.z + 3 * intensity
                );
            }
            else {
                transform.localEulerAngles = new Vector3(
                    originalRotation.x, 
                    originalRotation.y, 
                    originalRotation.z - 3 * intensity
                );
            }
            
        }
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        isHovering = true;
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        isHovering = false;
        transform.localPosition = originalPosition;
        transform.localScale = originalScale;
        transform.localEulerAngles = originalRotation;
    }
}
