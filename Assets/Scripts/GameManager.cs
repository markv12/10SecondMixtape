using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour {
    public Button recordButton;
    public Button playButton;
    public Button stopButton;
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
    }

    private void StartRecording() {
        metronomePlayer.PlaySong(metronomeSong, true);
    }

    private static Song metronomeSong = new Song() {
        length = 0.625f,
        parts = new InstrumentTrack[] {
            new InstrumentTrack {
                instrument = "Drumset1",
                notes = new List<List<Note>>() {
                    new List<Note>(){
                        new Note() {
                            start = 0
                        }
                    }
                }
            }
        }
    };
}
