using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class BandPickUI : MonoBehaviour {
    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;
    public TMP_Text bandNameLabel;
    public void ShowSessionData(SessionData sessionData) {
        yourCard.ShowMember(sessionData.yourMember, sessionData.yourName);
        otherMemberCard.ShowMember(sessionData.otherMember, sessionData.otherName);
        bandNameLabel.text = sessionData.bandName;
    }
}
