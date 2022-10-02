using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BandPickUI : MonoBehaviour {
    public Button cancelButton;
    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;
    public TMP_Text bandNameLabel;
    public CassetteButton[] cassetteButtons;

    private void Awake() {
        cancelButton.onClick.AddListener(Cancel);
    }

    private void Cancel() {
        LoadingScreen.ShowTransition(CancelRoutine());

        IEnumerator CancelRoutine() {
            yield return null;
            gameObject.SetActive(false);
        }
    }

    public void ShowSessionData(SessionData sessionData) {
        yourCard.ShowMember(sessionData.yourMember, sessionData.yourName);
        otherMemberCard.ShowMember(sessionData.otherMember, sessionData.otherName);
        bandNameLabel.text = sessionData.bandName;
    }

    public void LoadParts() {
        MusicNetworking.Instance.Get9Parts("Major", (InstrumentTrack[] tracks) => {
            for (int i = 0; i < cassetteButtons.Length; i++) {
                CassetteButton cassetteButton = cassetteButtons[i];
                if(i < tracks.Length) {
                    cassetteButton.ShowTrack(tracks[i]);
                    cassetteButton.gameObject.SetActive(true);
                } else {
                    cassetteButton.gameObject.SetActive(false);
                }
            }
        });
    }
}
