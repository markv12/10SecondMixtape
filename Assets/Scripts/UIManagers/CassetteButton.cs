using System;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class CassetteButton : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler {
    public Image cassetteImage;
    public TMP_Text nameText;
    public TMP_Text instrumentText;
    private InstrumentTrack part;
    public GameObject selectedImage;
    public Action<InstrumentTrack> playPart;
    public Action stopPart;

    public void ShowTrack(InstrumentTrack instrumentTrack) {
        part = instrumentTrack;
        BandMember bandMember = BandMemberMasterList.Instance.GetBandMemberForId(instrumentTrack.instrument);
        cassetteImage.sprite = bandMember.cassetteSprite;
        nameText.text = instrumentTrack.name;
        instrumentText.text = bandMember.instrumentDisplayName;
        selectedImage.SetActive(false);

        nameText.color = bandMember.cassetteTextWhite ? Color.white : Color.black;
        instrumentText.color = bandMember.cassetteTextWhite ? Color.white : Color.black;
    }

    public void OnPointerEnter(PointerEventData eventData) {
        if(part != null) {
            playPart?.Invoke(part);
        }
    }

    public void OnPointerExit(PointerEventData eventData) {
        stopPart?.Invoke();
    }
}
