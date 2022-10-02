using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BandmatePreviewUI : MonoBehaviour {

    public Image yourMemberImage;
    public TMP_Text yourPlayerNameText; 
    public TMP_Text yourInstrumentLabel; 

    public Image otherMemberImage;
    public TMP_Text otherPlayerNameText;
    public TMP_Text otherPlayerInstrumentLabel;

    public void SetupNewBandmatePairing(InstrumentTrack part) {
        BandMember otherMember = BandMemberMasterList.Instance.GetBandMemberForId(part.instrument);
        BandMember yourMember = BandMemberMasterList.Instance.GetBandMemberOfDifferentType(otherMember.instrumentType);

        yourMemberImage.sprite = yourMember.mainSprite;
        yourPlayerNameText.text = "Derp";
        yourInstrumentLabel.text = yourMember.instrumentDisplayName;

        otherMemberImage.sprite = otherMember.mainSprite;
        otherPlayerNameText.text = part.name;
        otherPlayerInstrumentLabel.text = otherMember.instrumentDisplayName;
    }
}
