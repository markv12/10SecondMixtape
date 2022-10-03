using System.Collections;
using UnityEngine;

public class CharacterSpriteDancer : MonoBehaviour
{
    // get the sprite renderer
    private SpriteRenderer spriteRenderer;
    public ParticleSystem mainParticles;

    private Vector3 originalScale;
    private int currentRoutines = 0;

    private float jamSpeed = 0.1f;
    private float intensity = 0.02f;

    void Awake()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
        originalScale = transform.localScale;
        mainParticles.Stop();
    }

    public void SetParticleColor(Color color) {
        mainParticles.startColor = color;
    }

    // method to bounce the sprite up and down
    private Coroutine rockRoutine;
    public void Bounce()
    {
        mainParticles.Emit(1);
        this.EnsureCoroutineStopped(ref rockRoutine);
        transform.localScale = originalScale;

        if (gameObject.activeSelf) {
            rockRoutine = StartCoroutine(RockRoutine());
        }
    }

    // coroutine to bounce the sprite up and down smoothly
    private IEnumerator RockRoutine()
    {
        Vector3 targetScale = new Vector3(originalScale.x, originalScale.y - intensity, originalScale.z);
        yield return this.CreateAnimationRoutine(jamSpeed/2.0f, (float progress) => {
            transform.localScale = Vector3.Lerp(
                originalScale,
                targetScale,
                Easing.easeInOutSine(0, 1, progress)
            );
        });
        yield return this.CreateAnimationRoutine(jamSpeed/2.0f, (float progress) => {
            transform.localScale = Vector3.Lerp(
                targetScale,
                originalScale,
                Easing.easeInOutSine(0, 1, progress)
            );
        });
    }
}
