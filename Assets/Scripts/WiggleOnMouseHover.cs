using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class WiggleOnMouseHover : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public float intensity = .005f;
    public float speed = 0.3f;

    private Button button;
    private Vector3 originalPosition;
    private Vector3 originalScale;
    private Vector3 originalRotation;

    bool isHovering = false;

    void Start()
    {
        button = GetComponent<Button>();
        originalPosition = transform.position;
        originalScale = transform.localScale;
        originalRotation = transform.eulerAngles;
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
            // transform.eulerAngles = new Vector3(
            //     transform.eulerAngles.x, 
            //     transform.eulerAngles.y, 
            //     transform.eulerAngles.z + Mathf.Cos(Time.time * 10.0f * speed) * intensity
            // );
            transform.localScale = new Vector3(
                transform.localScale.x + Mathf.Cos(Time.time * 10.0f * speed) * .05f * intensity, 
                transform.localScale.y + Mathf.Cos(Time.time * 10.0f * speed) * .05f * intensity, 
                transform.localScale.z
            );
        }
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        isHovering = true;
        transform.localScale = new Vector3(
            transform.localScale.x + intensity * 2.0f, 
            transform.localScale.y + intensity * 2.0f, 
            transform.localScale.z
        );

    }

    public void OnPointerExit(PointerEventData eventData)
    {
        isHovering = false;
        transform.position = originalPosition;
        transform.localScale = originalScale;
        transform.eulerAngles = originalRotation;
    }
}
