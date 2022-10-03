using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class CassetteButton : MonoBehaviour {
    public Image cassetteImage;
    public TMP_Text nameText;
    public TMP_Text instrumentText;
    private InstrumentTrack part;
    public GameObject selectedImage;

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
}
