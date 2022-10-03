using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;

public class MenuManager : MonoBehaviour{
    private const string PLAYER_NAME_KEY = "player_name";
    public static string PlayerName {
        get {
            return PlayerPrefs.GetString(PLAYER_NAME_KEY);
        } set {
            PlayerPrefs.SetString(PLAYER_NAME_KEY, value);
        }
    }

    public Transform mainCameraT;
    public Transform startMenuCameraT;
    public Transform yourBandCameraT;
    public ConcertPlayer concertPlayer;

    [Header("Start Menu Fields")]
    public GameObject startMenuUI;
    public Button playButton;
    public BandmatePreviewUI bandmatePreviewUI;
    public Button refreshNameButton;
    public TMP_Text nameText;
    public TMP_Text bandNameText;
    public TMP_Text finalBandNameText;

    public RectTransform feedbackUI;
    public Button upvoteButton;
    public Button downvoteButton;
    public GameObject feedbackText;
    private bool canVote = false;

    private bool canStart = true;

    [Header("Final Concert Fields")]
    public GameObject finalConcertCanvas;
    public Button endConcertButton;

    private void Awake() {
        Enable();

        if (string.IsNullOrWhiteSpace(PlayerName)) {
            RefreshName();
        } else {
            nameText.text = PlayerName;
        }
        playButton.onClick.AddListener(StartGame);
        refreshNameButton.onClick.AddListener(RefreshName);

        upvoteButton.onClick.AddListener(Upvote);
        downvoteButton.onClick.AddListener(Downvote);

        if (!canVote) {
            feedbackUI.anchoredPosition = FEEDBACK_OFFSCREEN_POS;
        }

        WaitThenLoadNewBand(3);

        endConcertButton.onClick.AddListener(EndConcert);
    }

    private Song currentSong;
    private void PlaySongAfterFrames(Song song) {
        currentSong = song;
        StartCoroutine(WaitRoutine());

        IEnumerator WaitRoutine() {
            yield return null;
            yield return null;
            yield return null;
            yield return null;
            if (canStart) {
                concertPlayer.PlaySong(song);
                bandNameText.text = song.name;
                SetCanVote(true);
            }
        }
    }

    public void Enable() {
        AudioManager.Instance.StopCrowdMurmur();
        AudioManager.Instance.StartCrowdMurmur(1.0f);
        canStart = true;
    }

    public void GoToFinalConcert(Song yourSong) {
        SetFinalConcertMode(true);
        concertPlayer.PlaySong(yourSong);
        finalBandNameText.text = yourSong.name;
        AudioManager.Instance.StartCrowdMurmur(1.0f);
        AudioManager.Instance.PlayApplauseSound(0.5f);
    }

    private void EndConcert() {
        AudioManager.Instance.PlayApplauseSound(0.5f);
        LoadingScreen.ShowTransition(EndRoutine());

        IEnumerator EndRoutine() {
            yield return null;
            SetFinalConcertMode(false);
            concertPlayer.StopSong();
            WaitThenLoadNewBand(3);
            canStart = true;
        }
    }

    private void SetFinalConcertMode(bool finalConcertMode) {
        startMenuUI.SetActive(!finalConcertMode);
        finalConcertCanvas.SetActive(finalConcertMode);
        Transform cameraT = finalConcertMode ? yourBandCameraT : startMenuCameraT;
        mainCameraT.SetPositionAndRotation(cameraT.position, cameraT.rotation);
    }

    private void StartGame() {
        if (!canStart) return;
        canStart = false;
        LoadingScreen.ShowTransition(LoadBandMate());
        AudioManager.Instance.PlaySuccessSound(1.0f);

        IEnumerator Hider() {
            yield return new WaitForSeconds(1.0f);
            gameObject.SetActive(false);
        }
    }

    IEnumerator LoadBandMate() {
        yield return MusicNetworking.Instance.GetRandomPart("major", (InstrumentTrack part) => {
            concertPlayer.StopSong();
            bandmatePreviewUI.SetupNewBandmatePairing(part);
        });
    }

    private void RefreshName() {
        PlayerName = NameGenerator.GeneratePersonName();
        nameText.text = PlayerName;
    }

    public void SetCanVote(bool toSet) {
        canVote = toSet;
        if (canVote) {
            StartCoroutine(ShowVoteButtons());
        }
        else {
            StartCoroutine(HideVoteButtons());
        }
    }

    private void Upvote() {
        if (!canVote) return;
        AudioManager.Instance.PlayApplauseSound(0.4f);
        MusicNetworking.Instance.UpvoteSong(currentSong);
        SetCanVote(false);
        WaitThenLoadNewBand(5);
    }

    private void Downvote() {
        if (!canVote) return;
        AudioManager.Instance.PlayBooSound(0.9f);
        MusicNetworking.Instance.DownvoteSong(currentSong);
        SetCanVote(false);
        concertPlayer.StopSong();
        WaitThenLoadNewBand(5);
    }

    private void WaitThenLoadNewBand(float waitTime) {
        StartCoroutine(WaitRoutine());

        IEnumerator WaitRoutine() {
            yield return new WaitForSeconds(waitTime);
            MusicNetworking.Instance.GetRandomSong((Song song) => {
                PlaySongAfterFrames(song);
            });
        }
    }

    private static readonly Vector2 FEEDBACK_OFFSCREEN_POS = new Vector2(160, -690);
    private static readonly Vector2 FEEDBACK_ONSCREEN_POS = new Vector2(160, -415);
    private IEnumerator HideVoteButtons() {
        yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            upvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                new Vector3(1, 1, 1),
                new Vector3(0, 0, 0),
                Easing.easeInQuad(0, 1, progress)
            );
            downvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                new Vector3(1, 1, 1),
                new Vector3(0, 0, 0),
                Easing.easeInQuad(0, 1, progress)
            );
        });
        feedbackUI.anchoredPosition = FEEDBACK_OFFSCREEN_POS;

        feedbackText.SetActive(true);
        yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            feedbackText.transform.localScale = Vector3.Lerp(
                new Vector3(0, 0, 0),
                new Vector3(1, 1, 1),
                Easing.easeOutQuad(0, 1, progress)
            );
        });
        yield return new WaitForSeconds(3.0f);
        yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            feedbackText.transform.localScale = Vector3.Lerp(
                new Vector3(1, 1, 1),
                new Vector3(0, 0, 0),
                Easing.easeInQuad(0, 1, progress)
            );
        });
        feedbackText.SetActive(false);
    }

    private IEnumerator ShowVoteButtons() {
        feedbackUI.anchoredPosition = FEEDBACK_ONSCREEN_POS;
         yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            upvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                new Vector3(0, 0, 0),
                new Vector3(1, 1, 1),
                Easing.easeOutQuad(0, 1, progress)
            );
            downvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                new Vector3(0, 0, 0),
                new Vector3(1, 1, 1),
                Easing.easeOutQuad(0, 1, progress)
            );
        });
    }
}
