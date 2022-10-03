using UnityEngine;

public class ConcertMember : MonoBehaviour {
    public Transform mainT;
    public SpriteRenderer mainSprite;
    public CharacterSpriteDancer dancer;
    public Vector3 onScreenPos;
    public Vector3 offScreenPos;

    Coroutine animRoutine;
    public void SetOnScreen(bool onScreen, bool animate) {
        animate = animate && gameObject.activeInHierarchy;
        this.EnsureCoroutineStopped(ref animRoutine);
        Vector3 startPos = mainT.localPosition;
        Vector3 endPos = onScreen ? onScreenPos : offScreenPos;
        if (animate) {
            animRoutine = this.CreateAnimationRoutine(0.9f, (float progress) => {
                mainT.localPosition = Vector3.Lerp(startPos, endPos, Easing.easeInOutSine(0, 1, progress));
            });
        } else {
            mainT.localPosition = endPos;
        }
    }
}
