using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class MenuManager : MonoBehaviour{
    private const string PLAYER_NAME_KEY = "player_name";
    public static string PlayerName {
        get {
            return PlayerPrefs.GetString(PLAYER_NAME_KEY);
        } set {
            PlayerPrefs.SetString(PLAYER_NAME_KEY, value);
        }
    }

    public Button playButton;
    public BandmatePreviewUI bandmatePreviewUI;
    public Button refreshNameButton;
    public TMP_Text nameText;

    public Button upvoteButton;
    public Button downvoteButton;
    public GameObject feedbackText;
    private bool canVote = false;

    private void Awake() {
        if(string.IsNullOrWhiteSpace(PlayerName)) {
            RefreshName();
        } else {
            nameText.text = PlayerName;
        }
        playButton.onClick.AddListener(Play);
        AudioManager.Instance.StartCrowdMurmur(1.0f);
        refreshNameButton.onClick.AddListener(RefreshName);

        upvoteButton.onClick.AddListener(Upvote);
        downvoteButton.onClick.AddListener(Downvote);

        if (!canVote) {
            upvoteButton.gameObject.SetActive(false);
            downvoteButton.gameObject.SetActive(false);
        }
    }

    private void Play() {
        LoadingScreen.ShowTransition(LoadBandMate());
        AudioManager.Instance.PlaySuccessSound(1.0f);
    }

    IEnumerator LoadBandMate() {
        yield return MusicNetworking.Instance.GetRandomPart("major", (InstrumentTrack part) => {
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
        AudioManager.Instance.PlayApplauseSound(0.3f);
        // MusicNetworking.Instance.UpvoteSong(song);
        SetCanVote(false);
    }

    private void Downvote() {
        if (!canVote) return;
        AudioManager.Instance.PlayBooSound(0.5f);
        // MusicNetworking.Instance.DownvoteSong(song);
        SetCanVote(false);
    }

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
        upvoteButton.gameObject.SetActive(false);
        downvoteButton.gameObject.SetActive(false);

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

        upvoteButton.gameObject.SetActive(true);
        downvoteButton.gameObject.SetActive(true);
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
