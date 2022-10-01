using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongPlayer : MonoBehaviour {
    public Track mainTrack;
    public AudioSourcePool audioSourcePool;
    public AudioClip clip;

    private IEnumerator Start() {
        yield return new WaitForSeconds(0.666f);
        PlayTrack();
    }

    private void PlayTrack() {
        Instrument instrument = InstrumentMasterList.Instance.GetInstrumentForId(mainTrack.instrumentId);
        double startTime = AudioSettings.dspTime;
        for (int i = 0; i < mainTrack.notes.Length; i++) {
            Note note = mainTrack.notes[i];
            double timeFromStart = note.start * 0.625;
            InstrumentNote instrumentNote = instrument.GetInstrumentNote(note.note);
            PlayNote(startTime + timeFromStart, instrumentNote);
        }
    }

    private void PlayNote(double playTime, InstrumentNote instrumentNote) {
        AudioSource audioSource = audioSourcePool.GetAudioSource(instrumentNote.clip);
        audioSource.pitch = instrumentNote.pitch;
        audioSource.PlayScheduled(playTime);
    }
}
