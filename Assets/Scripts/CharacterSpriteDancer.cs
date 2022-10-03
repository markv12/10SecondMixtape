using System.Collections;
using UnityEngine;

public class CharacterSpriteDancer : MonoBehaviour
{
    // get the sprite renderer
    private SpriteRenderer spriteRenderer;
    public ParticleSystem mainParticles;
    // get the original position
    private Vector3 originalPosition;
    private Vector3 originalScale;
    private Vector3 originalRotation;
    private GameObject transformParent;
    private int currentRoutines = 0;

    private float jamDirection;
    private float jamSpeed;

    void Awake()
    {
        jamDirection = Random.Range(-1.0f, 1.0f);
        jamSpeed = Random.Range(.2f, .6f);
        spriteRenderer = GetComponent<SpriteRenderer>();
        // get particle system on child
        originalPosition = transform.position;
        originalScale = transform.localScale;
        originalRotation = transform.eulerAngles;


        // add a new void parent transform on the character
        transformParent = new GameObject(transform.name + "CharacterParent");

        if (transform.parent) {
            transformParent.transform.parent = transform.parent.transform;
        }
        // set y to bottom of character
        transformParent.transform.position = new Vector3(transform.position.x, transform.position.y - spriteRenderer.bounds.size.y / 2, transform.position.z);
        transformParent.transform.rotation = transform.rotation;
        transformParent.transform.localScale = transform.localScale;
        transform.parent = transformParent.transform;
    }

    // method to bounce the sprite up and down
    public void Bounce()
    {
        StartCoroutine(RockRoutine());
    }

    // coroutine to bounce the sprite up and down smoothly
    private IEnumerator RockRoutine(
    )
    {
        currentRoutines++;
        mainParticles.Emit(1);
        float intensity = .05f;
        // move the sprite up then down in a cos motion
        for (float t = 0; t < jamSpeed; t += Time.deltaTime)
        {
            transformParent.transform.rotation = Quaternion.Euler(
              originalRotation.x,
              originalRotation.y,
              originalRotation.z - jamDirection * Mathf.Cos((t/jamSpeed) * Mathf.PI - Mathf.PI / 2) * intensity * 30
            );

            transformParent.transform.localScale = new Vector3(
              originalScale.x,
              Mathf.Max(
                  originalScale.y - 1 * Mathf.Cos((t / jamSpeed) * Mathf.PI - Mathf.PI / 2) * intensity, 
                  originalScale.y - 1 * Mathf.Cos(.5f * Mathf.PI - Mathf.PI / 2) * intensity
              ),
              originalScale.z
            );

            yield return null;
        }

        currentRoutines--;
        if (currentRoutines == 0)
        {
            // reset the sprite to the original position
            transformParent.transform.rotation = Quaternion.Euler(originalRotation);
            transformParent.transform.localScale = originalScale;
            jamDirection = Random.Range(-1.0f, 1.0f);
            jamSpeed = Random.Range(.2f, .6f);
        }
    }
}
