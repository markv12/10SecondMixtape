using System;
using UnityEngine;
using UnityEngine.UI;

public class RecordUI : MonoBehaviour {
    public RectTransform rectT;
    public Vector2 offScreenPos;
    public Vector2 onScreenPos;

    public Button doneButton;
    public Button clearButton;
    public SongVisualizer songVisualizer;

    private void Awake() {
        doneButton.onClick.AddListener(Done);
        clearButton.onClick.AddListener(Clear);
    }

    private void Done() {
        AudioManager.Instance.PlayPlasticClickSound(1);
    }

    private void Clear() {
        AudioManager.Instance.PlayPlasticClickSound(1);
    }

    public void Startup() {
        rectT.anchoredPosition = offScreenPos;

        gameObject.SetActive(true);
        this.CreateAnimationRoutine(1f, (float progress) => {
            float easedProgress = Easing.easeOutSine(0, 1, progress);
            rectT.anchoredPosition = Vector2.Lerp(offScreenPos, onScreenPos, easedProgress);
        });
    }
}
