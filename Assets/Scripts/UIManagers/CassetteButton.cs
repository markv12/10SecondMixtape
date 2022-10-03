using System;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class CassetteButton : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler {
    public Button mainButton;
    public Image cassetteImage;
    public TMP_Text nameText;
    public TMP_Text instrumentText;
    private InstrumentTrack part;
    public Action<InstrumentTrack> playPart;
    public Action stopPart;
    public Action<InstrumentTrack, bool> setPartSelected;

    public GameObject selectedImage;
    public GameObject selectedImage2;
    private bool selected = false;
    private bool Selected {
        get {
            return selected;
        }
        set {
            selected = value;
            selectedImage.SetActive(selected);
            selectedImage2.SetActive(selected);
            setPartSelected?.Invoke(part, selected);
        }
    }

    private void Awake() {
        mainButton.onClick.AddListener(() => {
            AudioManager.Instance.PlayPlasticClickSound(1f);
            Selected = !Selected;
        });
    }

    public void ShowTrack(InstrumentTrack instrumentTrack) {
        part = instrumentTrack;
        BandMember bandMember = BandMemberMasterList.Instance.GetBandMemberForId(instrumentTrack.instrument);
        cassetteImage.sprite = bandMember.cassetteSprite;
        nameText.text = instrumentTrack.name;
        instrumentText.text = bandMember.instrumentDisplayName;
        selectedImage.SetActive(false);
        selectedImage2.SetActive(false);

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
