using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongPlayer : MonoBehaviour {
    public AudioSourcePool audioSourcePool;

    private IEnumerator Start() {
        yield return new WaitForSeconds(0.666f);
        PlayTrack();
    }

    private void PlayTrack() {
        InstrumentTrack mainTrack = InstrumentTrack.CreateFromJson(InstrumentTrack.TEST_TRACK);
        Instrument instrument = InstrumentMasterList.Instance.GetInstrumentForId(mainTrack.instrumentId);
        double startTime = AudioSettings.dspTime;
        for (int i = 0; i < mainTrack.notes.Count; i++) {
            List<Note> noteList = mainTrack.notes[i];
            for (int j = 0; j < noteList.Count; j++) {
                Note note = noteList[j];
                double timeFromStart = note.start * 0.625;
                InstrumentNote instrumentNote = instrument.GetInstrumentNote(i);
                PlayNote(startTime + timeFromStart, instrumentNote);
            }
        }
    }

    private void PlayNote(double playTime, InstrumentNote instrumentNote) {
        AudioSource audioSource = audioSourcePool.GetAudioSource(instrumentNote.clip);
        audioSource.pitch = instrumentNote.pitch;
        audioSource.PlayScheduled(playTime);
    }
}
