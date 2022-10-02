//using System.Collections.Generic;
//using UnityEngine;
//using UnityEngine.UI;

//public class GameManager : MonoBehaviour {
//    public Button recordButton;
//    public Button uploadButton;
//    public Button playButton;
//    public Button stopButton;

//    public SongVisualizer songVisualizer;

//    private void Awake() {
//        recordButton.onClick.AddListener(StartRecording);
//        uploadButton.onClick.AddListener(UploadSong);
//        playButton.onClick.AddListener(PlayTrack);
//        stopButton.onClick.AddListener(StopTracks);

//        uploadButton.gameObject.SetActive(false);

//        _ = DspTimeEstimator.Instance;
//    }

//    private void PlayTrack() {
//        MusicNetworking.Instance.GetRandomSong((Song song) => {
//            songPlayer.PlaySong(song, STANDARD_WAIT, true);
//            songVisualizer.ShowPart(song.parts[0], STANDARD_WAIT, song.length);
//        });
//    }

//    private void StopTracks() {
//        songPlayer.StopSong();
//        metronomePlayer.StopSong();
//        CurrentSong = songRecorder.StopRecording();
//        if(CurrentSong != null) {
//            songPlayer.PlaySong(CurrentSong, STANDARD_WAIT,  true);
//        }
//    }

//    private Song currentSong;
//    private Song CurrentSong {
//        get {
//            return currentSong;
//        }
//        set {
//            currentSong = value;
//            uploadButton.gameObject.SetActive(currentSong != null);
//        }
//    }
//    private void UploadSong() {
//        songPlayer.StopSong();
//        if (CurrentSong != null) {
//            MusicNetworking.Instance.UploadSong(CurrentSong);
//            CurrentSong = null;
//        }
//    }
//}
