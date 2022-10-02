using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class MenuManager : MonoBehaviour{
    public Button playButton;
    public BandmatePreviewUI bandmatePreviewUI;

    private void Awake() {
        playButton.onClick.AddListener(Play);
        AudioManager.Instance.StartCrowdMurmur(1.0f);
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
}
