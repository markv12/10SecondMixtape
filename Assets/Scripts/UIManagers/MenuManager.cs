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
    public Button nextBandButton;
    public RectTransform nextBandButtonT;
    public Transform feedbackTextT;
    public TMP_Text feedbackSubtitleText;
    private bool canVote = false;

    private bool canStart = true;

    [Header("Final Concert Fields")]
    public GameObject finalConcertCanvas;
    public Button endConcertButton;

    private void Awake() {

        if (string.IsNullOrWhiteSpace(PlayerName)) {
            RefreshName();
        } else {
            nameText.text = PlayerName;
        }
        playButton.onClick.AddListener(StartGame);
        refreshNameButton.onClick.AddListener(RefreshName);

        upvoteButton.onClick.AddListener(Upvote);
        downvoteButton.onClick.AddListener(Downvote);
        nextBandButton.onClick.AddListener(NextBand);

        if (!canVote) {
            feedbackUI.anchoredPosition = FEEDBACK_OFFSCREEN_POS;
        }

        Enable();

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
        WaitThenLoadNewBand(3);
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
        if (canStart) {
            canStart = false;
            LoadingScreen.ShowTransition(LoadBandMate());
            AudioManager.Instance.PlaySuccessSound(1.0f);

            //IEnumerator Hider() {
            //    yield return new WaitForSeconds(1.0f);
            //    gameObject.SetActive(false);
            //}
        }
    }

    IEnumerator LoadBandMate() {
        SetCanVote(false);
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
        SetFeedbackSubtitle(true);
        SetCanVote(false);
        SetNextBandButtonVisible(true);
    }

    private void Downvote() {
        if (!canVote) return;
        AudioManager.Instance.PlayBooSound(0.9f);
        MusicNetworking.Instance.DownvoteSong(currentSong);
        SetFeedbackSubtitle(false);
        SetCanVote(false);
        StartCoroutine(WaitThenStop());
        WaitThenLoadNewBand(5.5f);
    }

    private void NextBand() {
        if (!AnimatingNextButton) {
            AudioManager.Instance.PlayApplauseSound(0.4f);
            StartCoroutine(WaitThenStop());
            WaitThenLoadNewBand(4);
            SetNextBandButtonVisible(false);
        }
    }

    private IEnumerator WaitThenStop() {
        yield return new WaitForSeconds(1);
        concertPlayer.StopSong();
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

    private static readonly Vector2 FEEDBACK_OFFSCREEN_POS = new Vector2(300, -690);
    private static readonly Vector2 FEEDBACK_ONSCREEN_POS = new Vector2(300, -415);
    private IEnumerator HideVoteButtons() {
        yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            upvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                Vector3.one,
                Vector3.zero,
                Easing.easeInQuad(0, 1, progress)
            );
            downvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                Vector3.one,
                Vector3.zero,
                Easing.easeInQuad(0, 1, progress)
            );
        });
        feedbackUI.anchoredPosition = FEEDBACK_OFFSCREEN_POS;

        feedbackTextT.gameObject.SetActive(true);
        yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            feedbackTextT.localScale = Vector3.Lerp(
                Vector3.zero,
                Vector3.one,
                Easing.easeOutQuad(0, 1, progress)
            );
        });
        yield return new WaitForSeconds(3.0f);
        yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            feedbackTextT.localScale = Vector3.Lerp(
                Vector3.one,
                Vector3.zero,
                Easing.easeInQuad(0, 1, progress)
            );
        });
        feedbackTextT.gameObject.SetActive(false);
    }

    private IEnumerator ShowVoteButtons() {
        feedbackUI.anchoredPosition = FEEDBACK_ONSCREEN_POS;
         yield return this.CreateAnimationRoutine(.6f, (float progress) => {
            upvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                Vector3.zero,
                Vector3.one,
                Easing.easeOutQuad(0, 1, progress)
            );
            downvoteButton.gameObject.transform.localScale = Vector3.Lerp(
                Vector3.zero,
                Vector3.one,
                Easing.easeOutQuad(0, 1, progress)
            );
        });
    }

    private static readonly Vector2 NEXT_BAND_OFFSCREEN_POS = new Vector2(0, -690);
    private static readonly Vector2 NEXT_BAND_ONSCREEN_POS = new Vector2(0, -410);
    Coroutine nextButtonRoutine = null;
    private void SetNextBandButtonVisible(bool visible) {
        this.EnsureCoroutineStopped(ref nextButtonRoutine);
        if (visible) {
            nextBandButtonT.anchoredPosition = NEXT_BAND_ONSCREEN_POS;
        }

        Vector3 startScale = visible ? Vector3.zero : Vector3.one;
        Vector3 endScale = visible ? Vector3.one : Vector3.zero;
        nextButtonRoutine = this.CreateAnimationRoutine(0.6f, (float progress) => {
            nextBandButtonT.localScale = Vector3.Lerp(startScale, endScale, progress);
        }, () => {
            if (!visible) {
                nextBandButtonT.anchoredPosition = NEXT_BAND_OFFSCREEN_POS;
            }
            nextButtonRoutine = null;
        });
    }
    private bool AnimatingNextButton => nextButtonRoutine != null;

    private const string UPVOTE_TEXT = @"They'll play more
often for everyone.";
    private const string DOWNVOTE_TEXT = @"They'll play less
often for everyone.";
    private void SetFeedbackSubtitle(bool upvote) {
        feedbackSubtitleText.text = upvote ? UPVOTE_TEXT : DOWNVOTE_TEXT;
    }
}
