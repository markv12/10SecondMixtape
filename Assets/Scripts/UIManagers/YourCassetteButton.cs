using System;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;

public class YourCassetteButton : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler {
    public TMP_Text nameText;
    private Song song;
    public Action<Song> playSong;
    public Action stopSong;

    public void ShowSong(Song _song) {
        song = _song;
        nameText.text = _song.name;
    }

    public void OnPointerEnter(PointerEventData eventData) {
        if (song != null) {
            playSong?.Invoke(song);
        }
    }

    public void OnPointerExit(PointerEventData eventData) {
        stopSong?.Invoke();
    }
}
