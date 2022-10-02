using System;
using System.Collections;
using UnityEngine;
public class LoadingScreen : MonoBehaviour {
    public CanvasGroup mainGroup;

    public void Show(float fadeTime, IEnumerator onHitOpaque) {
        gameObject.SetActive(true);
        this.EnsureCoroutineStopped(ref showRoutine);
        showRoutine = StartCoroutine(CO_Show(fadeTime, onHitOpaque));
    }

    private const string LOADING_SCREEN_PATH = "LoadingScreen";
    public static LoadingScreen instance;
    public static void LoadScene(float fadeTime, IEnumerator onHitOpaque) {
        if (instance == null) {
            instance = Instantiate(Resources.Load<LoadingScreen>(LOADING_SCREEN_PATH));
            DontDestroyOnLoad(instance);
        }
        instance.Show(fadeTime, onHitOpaque);
    }

    private Coroutine showRoutine = null;
    private IEnumerator CO_Show(float fadeTime, IEnumerator onHitOpaque) {
        yield return this.CreateAnimationRoutine(fadeTime, (float progress) => {
            mainGroup.alpha = progress;
        });
        yield return null;
        yield return StartCoroutine(onHitOpaque);
        yield return null;
        yield return this.CreateAnimationRoutine(fadeTime, (float progress) => {
            mainGroup.alpha = 1 - progress;
        });
        mainGroup.alpha = 0;
        gameObject.SetActive(false);
        showRoutine = null;
    }
}
