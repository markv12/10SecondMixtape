using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BandPickUI : MonoBehaviour {
    public Button cancelButton;
    public Button getMoreTapesButton;
    public Button doneButton;
    public MenuManager menuManager;

    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;
    public CassetteButton[] cassetteButtons;
    public YourCassetteButton yourCassetteButton;
    public SongPlayer songPlayer;

    private Song yourSong;
    private List<InstrumentTrack> selectedTracks = new List<InstrumentTrack>();

    private void Awake() {
        cancelButton.onClick.AddListener(Cancel);
        getMoreTapesButton.onClick.AddListener(LoadParts);
        doneButton.onClick.AddListener(Done);
        StartCoroutine(SoundSchedule());

        for (int i = 0; i < cassetteButtons.Length; i++) {
            CassetteButton cassetteButton = cassetteButtons[i];
            cassetteButton.playPart = PlayPart;
            cassetteButton.stopPart = songPlayer.StopSong;
            cassetteButton.setPartSelected = SetPartSelected;
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

    private void SetPartSelected(InstrumentTrack part, bool selected) {
        if (selected) {
            selectedTracks.Add(part);
        } else {
            selectedTracks.Remove(part);
        }
    }

    private IEnumerator SoundSchedule() {
        yield return new WaitForSeconds(0.5f);
        AudioManager.Instance.PlayTapeScatterSound(1.0f);
    }

    private void Done() {
        LoadingScreen.ShowTransition(DoneRoutine());

        IEnumerator DoneRoutine() {
            yield return null;
            for (int i = 0; i < selectedTracks.Count; i++) {
                InstrumentTrack track = selectedTracks[i];
                MusicNetworking.Instance.MarkPartAsChosen(track);
                yourSong.AddPart(track);
                yield return null;
            }
            MusicNetworking.Instance.UploadSong(yourSong);
            yield return null;
            MusicNetworking.Instance.UploadTrack(yourSong.parts[0]);
            yield return null;
            gameObject.SetActive(false);
            menuManager.GoToYourBandMode(yourSong);
        }
    }

    private void Cancel() {
        LoadingScreen.ShowTransition(CancelRoutine());
        menuManager.Enable();

        IEnumerator CancelRoutine() {
            yield return null;
            gameObject.SetActive(false);
        }
    }

    public void ShowSessionData(SessionData sessionData) {
        yourCard.ShowMember(sessionData.yourMember, sessionData.yourName);
        otherMemberCard.ShowMember(sessionData.otherMember, sessionData.otherName);
    }

    public void SetYourSong(Song newSong) {
        yourSong = newSong;
        yourCassetteButton.ShowSong(yourSong);
    }

    public void LoadParts() {
        selectedTracks.Clear();
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
