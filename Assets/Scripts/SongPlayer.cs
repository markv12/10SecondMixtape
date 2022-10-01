using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SongPlayer : MonoBehaviour {
    public Button playButton;
    public AudioSourcePool audioSourcePool;

    private void Awake() {
        playButton.onClick.AddListener(PlayTrack);
    }

    private const double SECONDS_PER_BEAT = 0.625;
    private void PlayTrack() {
        InstrumentMasterList iml = InstrumentMasterList.Instance;
        MusicNetworking.Instance.GetRandomSong((Song song) => {
            double startTime = AudioSettings.dspTime + 1;
            for (int i = 0; i < song.parts.Length; i++) {
                InstrumentTrack mainTrack = song.parts[i];
                Instrument instrument = iml.GetInstrumentForId(mainTrack.instrument);
                for (int j = 0; j < mainTrack.notes.Count; j++) {
                    List<Note> noteList = mainTrack.notes[j];
                    for (int k = 0; k < noteList.Count; k++) {
                        Note note = noteList[k];
                        double noteStartTime = note.start * SECONDS_PER_BEAT;
                        double noteEndTime = note.end * SECONDS_PER_BEAT;
                        InstrumentNote instrumentNote = instrument.GetInstrumentNote(j);
                        PlayNote(startTime, noteStartTime, noteEndTime, instrumentNote);
                    }
                }
            }
        });
    }

    private void PlayNote(double startTime, double noteStartTime, double noteEndTime, InstrumentNote instrumentNote) {
        AudioSource audioSource = audioSourcePool.GetAudioSource(instrumentNote.clip);
        audioSource.pitch = instrumentNote.pitch;
        audioSource.PlayScheduled(startTime + noteStartTime);
        if (noteEndTime > 0) {
            audioSource.SetScheduledEndTime(startTime + noteEndTime);
        }
    }
}
