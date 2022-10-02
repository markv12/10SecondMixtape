using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimateVogue : MonoBehaviour
{

    public float speed = .15f;
    public float intensity = 1.0f;
    private Vector3 initialRotation;
    private float offset = 0.0f;

    void Start()
    {
        initialRotation = transform.eulerAngles;
        offset = Random.Range(0.0f, 100.0f);
    }
   
    // Update is called once per frame
    void Update()
    {
        float delta = Time.deltaTime;
        transform.eulerAngles = new Vector3(
            initialRotation.x,
            initialRotation.y,
            initialRotation.z + Mathf.Cos(offset + Time.time * 10.0f * speed) * intensity
        );
        
    }
}
