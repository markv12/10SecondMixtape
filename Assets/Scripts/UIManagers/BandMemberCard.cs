using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BandMemberCard : MonoBehaviour {
    public Image bgImage;
    public Image memberImage;
    public TMP_Text playerNameText;
    public TMP_Text instrumentLabel;

    public void ShowMember(BandMember bandMember, string playerName) {
        bgImage.color = bandMember.color;
        memberImage.sprite = bandMember.mainSprite;
        playerNameText.text = playerName;
        instrumentLabel.text = bandMember.instrumentDisplayName;
    }
}
