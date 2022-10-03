using System;
using System.Collections;
using UnityEngine;
public class LoadingScreen : MonoBehaviour {
    public CanvasGroup mainGroup;

    private const string LOADING_SCREEN_PATH = "LoadingScreen";
    private static LoadingScreen instance;
    public static void ShowTransition(IEnumerator onHitOpaque) {
        if (instance == null) {
            instance = Instantiate(Resources.Load<LoadingScreen>(LOADING_SCREEN_PATH));
            DontDestroyOnLoad(instance);
        }
        instance.Show(onHitOpaque);
    }

    public void Show(IEnumerator onHitOpaque) {
        gameObject.SetActive(true);
        this.EnsureCoroutineStopped(ref showRoutine);
        showRoutine = StartCoroutine(CO_Show(onHitOpaque));
    }

    private Coroutine showRoutine = null;
    private const float FADE_TIME = 0.6f;
    private IEnumerator CO_Show(IEnumerator onHitOpaque) {
        yield return this.CreateAnimationRoutine(FADE_TIME, (float progress) => {
            mainGroup.alpha = progress;
        });
        yield return null;
        yield return null;
        yield return StartCoroutine(onHitOpaque);
        yield return null;
        yield return null;
        yield return this.CreateAnimationRoutine(FADE_TIME, (float progress) => {
            mainGroup.alpha = 1 - progress;
        });
        mainGroup.alpha = 0;
        gameObject.SetActive(false);
        showRoutine = null;
    }
}
