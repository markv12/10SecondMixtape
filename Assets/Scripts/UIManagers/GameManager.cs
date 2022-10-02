using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour {
    public Button recordButton;
    public Button uploadButton;
    public Button playButton;
    public Button stopButton;
    public SongRecorder songRecorder;
    public SongPlayer songPlayer;
    public SongPlayer metronomePlayer;
    public SongVisualizer songVisualizer;

    private void Awake() {
        recordButton.onClick.AddListener(StartRecording);
        uploadButton.onClick.AddListener(UploadSong);
        playButton.onClick.AddListener(PlayTrack);
        stopButton.onClick.AddListener(StopTracks);

        uploadButton.gameObject.SetActive(false);

        _ = DspTimeEstimator.Instance;
    }

    private const double STANDARD_WAIT = 0.5;
    private void PlayTrack() {
        MusicNetworking.Instance.GetRandomSong((Song song) => {
            songPlayer.PlaySong(song, STANDARD_WAIT, true);
            songVisualizer.ShowPart(song.parts[0], STANDARD_WAIT, song.length);
        });
    }

    private void StopTracks() {
        songPlayer.StopSong();
        metronomePlayer.StopSong();
        CurrentSong = songRecorder.StopRecording();
        if(CurrentSong != null) {
            songPlayer.PlaySong(CurrentSong, STANDARD_WAIT,  true);
        }
    }

    private Song currentSong;
    private Song CurrentSong {
        get {
            return currentSong;
        }
        set {
            currentSong = value;
            uploadButton.gameObject.SetActive(currentSong != null);
        }
    }
    private void UploadSong() {
        songPlayer.StopSong();
        if (CurrentSong != null) {
            MusicNetworking.Instance.UploadSong(CurrentSong);
            CurrentSong = null;
        }
    }

    private void StartRecording() {
        uploadButton.gameObject.SetActive(false);
        metronomePlayer.PlaySong(metronomeSong, STANDARD_WAIT, true);
        songRecorder.StartRecording("RockBass");
    }

    private static Song metronomeSong = new Song() {
        length = 2.5f,
        parts = new InstrumentTrack[] {
            new InstrumentTrack {
                instrument = "Drumset1",
                notes = new List<List<Note>>() {
                    new List<Note>(){
                        new Note() {
                            start = 0
                        },
                         new Note() {
                            start = 1
                        },
                        new Note() {
                            start = 2
                        },
                         new Note() {
                            start = 3
                        }
                    }
                }
            }
        }
    };
}
