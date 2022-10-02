using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CrowdAnimator : MonoBehaviour
{

    private Vector3 initialPosition = new Vector3(0, 0, 0);
    private bool isAnimating = false;

    // Start is called before the first frame update
    void Start()
    {
        initialPosition = transform.position;
    }

    void Update()
    {
      // once every ~10 seconds, randomly, move the crowd
      if (Random.Range(0, 100) < 1) {
        RunAnimation();
      }
    }

    public void RunAnimation() {
        StartCoroutine(MoveRoutine());
    }

    // bounce up and down once
    IEnumerator MoveRoutine() {
      if (isAnimating) {
        yield break;
      }
      isAnimating = true;

      if (Random.Range(0, 15) == 0) {
          Vector3 targetPosition = new Vector3(transform.position.x + Random.Range(-100, 100), transform.position.y, transform.position.z);
          yield return this.CreateAnimationRoutine(2.0f, (float progress) => {
              transform.position = Vector3.Lerp(
                initialPosition,
                  targetPosition,
                  Easing.easeInOutSine(0, 1, progress)
              );
          });
          yield return new WaitForSeconds(Random.Range(0.0f, 3.0f));
          yield return this.CreateAnimationRoutine(2.0f, (float progress) => {
              transform.position = Vector3.Lerp(
                  targetPosition,
                  initialPosition,
                  Easing.easeInOutSine(0, 1, progress)
              );
          });
      }
      else {
          Vector3 targetPosition = new Vector3(transform.position.x, transform.position.y + 40, transform.position.z);
          yield return this.CreateAnimationRoutine(.2f, (float progress) => {
              transform.position = Vector3.Lerp(
                initialPosition,
                  targetPosition,
                  Easing.easeOutSine(0, 1, progress)
              );
          });
          yield return this.CreateAnimationRoutine(.3f, (float progress) => {
              transform.position = Vector3.Lerp(
                  targetPosition,
                  initialPosition,
                  Easing.easeInSine(0, 1, progress)
              );
          });
      }
      transform.position = initialPosition;
      isAnimating = false;

    }
}
