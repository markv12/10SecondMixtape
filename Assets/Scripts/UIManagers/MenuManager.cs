using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class MenuManager : MonoBehaviour{
    public Button playButton;
    public BandmatePreviewUI bandmatePreviewUI;

    private void Awake() {
        playButton.onClick.AddListener(Play);
    }

    private void Play() {
        LoadingScreen.LoadScene(0.333f, LoadBandMate());
    }

    IEnumerator LoadBandMate() {
        yield return MusicNetworking.Instance.GetRandomPart((InstrumentTrack part) => {
            bandmatePreviewUI.SetupNewBandmatePairing(part);
        });
    }
}
