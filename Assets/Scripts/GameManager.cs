using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour {
    public Button recordButton;
    public Button playButton;
    public Button stopButton;
    public SongRecorder songRecorder;
    public SongPlayer songPlayer;
    public SongPlayer metronomePlayer;

    private void Awake() {
        recordButton.onClick.AddListener(StartRecording);
        playButton.onClick.AddListener(PlayTrack);
        stopButton.onClick.AddListener(StopTracks);
    }

    private void PlayTrack() {
        MusicNetworking.Instance.GetRandomSong((Song song) => {
            songPlayer.PlaySong(song, true);
        });
    }

    private void StopTracks() {
        songPlayer.StopSong();
        metronomePlayer.StopSong();
        Song song = songRecorder.StopRecording();
        if(song != null) {
            Debug.Log(JsonConvert.SerializeObject(song));
            songPlayer.PlaySong(song, true);
        }
    }

    private void StartRecording() {
        metronomePlayer.PlaySong(metronomeSong, true);
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
