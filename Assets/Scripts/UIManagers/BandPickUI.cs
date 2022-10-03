using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BandPickUI : MonoBehaviour {
    public Button cancelButton;
    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;
    public CassetteButton[] cassetteButtons;
    public YourCassetteButton yourCassetteButton;
    public SongPlayer songPlayer;

    private void Awake() {
        cancelButton.onClick.AddListener(Cancel);
        StartCoroutine(SoundSchedule());

        for (int i = 0; i < cassetteButtons.Length; i++) {
            CassetteButton cassetteButton = cassetteButtons[i];
            cassetteButton.playPart = PlayPart;
            cassetteButton.stopPart = songPlayer.StopSong;
        }
        yourCassetteButton.playSong = PlaySong;
        yourCassetteButton.stopSong = songPlayer.StopSong;
    }

    private void PlayPart(InstrumentTrack part) {
        songPlayer.StopSong();
        songPlayer.PlayPart(part, 0.333, true);
    }

    private void PlaySong(Song song) {
        songPlayer.StopSong();
        songPlayer.PlaySong(song, 0.333, true);
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
    }

    public void SetYourSong(Song newSong) {
        yourCassetteButton.ShowSong(newSong);
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
