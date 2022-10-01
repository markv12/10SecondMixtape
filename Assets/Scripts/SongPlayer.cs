using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongPlayer : MonoBehaviour {
    public AudioSourcePool audioSourcePool;

    private IEnumerator Start() {
        yield return new WaitForSeconds(0.666f);
        PlayTrack();
    }

    private const double SECONDS_PER_BEAT = 0.625;
    private void PlayTrack() {
        MusicNetworking.Instance.GetRandomSong((Song song) => {
            double startTime = AudioSettings.dspTime;
            for (int i = 0; i < song.parts.Length; i++) {
                InstrumentTrack mainTrack = song.parts[i];
                Instrument instrument = InstrumentMasterList.Instance.GetInstrumentForId(mainTrack.instrument);
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
        audioSource.SetScheduledStartTime(startTime + noteEndTime);
    }
}
