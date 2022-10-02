using UnityEngine;
using UnityEngine.UI;

public class RecordUI : MonoBehaviour {
    public Button doneButton;
    public Button clearButton;

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
}
