using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BandPickUI : MonoBehaviour {
    public Button cancelButton;
    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;
    public TMP_Text bandNameLabel;
    public CassetteButton[] cassetteButtons;
    public SongPlayer songPlayer;

    private void Awake() {
        cancelButton.onClick.AddListener(Cancel);
        StartCoroutine(SoundSchedule());

        for (int i = 0; i < cassetteButtons.Length; i++) {
            cassetteButtons[i].playPart = (InstrumentTrack part) => {
                songPlayer.StopSong();
                songPlayer.PlayPart(part, 0.5, true);
            };
        }
    }
    private IEnumerator SoundSchedule() {
        yield return new WaitForSeconds(0.5f);
        AudioManager.Instance.PlayTapeScatterSound(1.0f);
    }

    private void Cancel() {
        LoadingScreen.ShowTransition(CancelRoutine());

        IEnumerator CancelRoutine() {
            yield return null;
            AudioManager.Instance.StartCrowdMurmur(1);
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
