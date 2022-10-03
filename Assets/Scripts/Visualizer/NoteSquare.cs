using System;
using UnityEngine;
using UnityEngine.UI;

public class NoteSquare : MonoBehaviour {
    public RectTransform rectT;
    public Image mainImage;
    public Button mainButton;
    public Action deleteAction;

    private void Awake() {
        mainButton.onClick.AddListener(DeleteNote);
    }

    private void DeleteNote() {
        deleteAction?.Invoke();
        Destroy(gameObject);
    }
}
