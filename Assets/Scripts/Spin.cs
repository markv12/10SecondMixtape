using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Spin : MonoBehaviour
{
    public float speed = 1.0f;

    void Start()
    {
        
    }

    void Update()
    {
        float delta = Time.deltaTime;
        transform.Rotate(0, 0, delta * 100 * speed);
    }
}
