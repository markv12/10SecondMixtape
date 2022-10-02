using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class MenuManager : MonoBehaviour{
    public string name;

    public Button playButton;
    public BandmatePreviewUI bandmatePreviewUI;
    public Button refreshNameButton;
    public TMP_Text nameText;

    private void Awake() {
        RefreshName();
        playButton.onClick.AddListener(Play);
        AudioManager.Instance.StartCrowdMurmur(1.0f);
        refreshNameButton.onClick.AddListener(RefreshName);
    }

    private void Play() {
        LoadingScreen.LoadScene(0.333f, LoadBandMate());
        AudioManager.Instance.PlaySuccessSound(1.0f);
    }

    IEnumerator LoadBandMate() {
        yield return MusicNetworking.Instance.GetRandomPart((InstrumentTrack part) => {
            bandmatePreviewUI.SetupNewBandmatePairing(part);
        });
    }

    private void RefreshName() {
        name = NameGenerator.GeneratePersonName();
        nameText.text = name;
    }
}
