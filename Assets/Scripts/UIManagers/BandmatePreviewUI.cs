using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BandmatePreviewUI : MonoBehaviour {

    public TMP_Text bandNameLabel;

    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;

    public void SetupNewBandmatePairing(InstrumentTrack part) {
        BandMember otherMember = BandMemberMasterList.Instance.GetBandMemberForId(part.instrument);
        BandMember yourMember = BandMemberMasterList.Instance.GetBandMemberOfDifferentType(otherMember.instrumentType);

        yourCard.ShowMember(yourMember, NameGenerator.GeneratePersonName());
        otherMemberCard.ShowMember(otherMember, part.name);

        bandNameLabel.text = NameGenerator.GenerateBandName();
    }
}
