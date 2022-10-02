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

    private void Awake() {
        if(string.IsNullOrWhiteSpace(PlayerName)) {
            RefreshName();
        } else {
            nameText.text = PlayerName;
        }
        playButton.onClick.AddListener(Play);
        AudioManager.Instance.StartCrowdMurmur(1.0f);
        refreshNameButton.onClick.AddListener(RefreshName);
    }

    private void Play() {
        LoadingScreen.LoadScene(LoadBandMate());
        AudioManager.Instance.PlaySuccessSound(1.0f);
    }

    IEnumerator LoadBandMate() {
        yield return MusicNetworking.Instance.GetRandomPart((InstrumentTrack part) => {
            bandmatePreviewUI.SetupNewBandmatePairing(part);
        });
    }

    private void RefreshName() {
        PlayerName = NameGenerator.GeneratePersonName();
        nameText.text = PlayerName;
    }
}
