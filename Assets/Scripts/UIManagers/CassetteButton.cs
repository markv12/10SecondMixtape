using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CassetteButton : MonoBehaviour {
    public Image cassetteImage;
    public InstrumentTrack part;
    public Image selectedImage;

    public void ShowTrack(InstrumentTrack instrumentTrack) {
        part = instrumentTrack;
        BandMember bandMember = BandMemberMasterList.Instance.GetBandMemberForId(instrumentTrack.instrument);
        cassetteImage.sprite = bandMember.cassetteSprite;
        selectedImage.enabled = false;
    }
}
