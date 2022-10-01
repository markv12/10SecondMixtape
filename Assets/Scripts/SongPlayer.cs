using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SongPlayer : MonoBehaviour {
    public Button playButton;
    public Button stopButton;
    public AudioSourcePool audioSourcePool;

    private void Awake() {
        playButton.onClick.AddListener(PlayTrack);
        stopButton.onClick.AddListener(StopTrack);
    }

    private readonly List<QueuedNote> noteQueue = new List<QueuedNote>();
    private void Update() {
        for (int i = 0; i < noteQueue.Count; i++) {
            QueuedNote note = noteQueue[i];
            if((note.dspStartTime - AudioSettings.dspTime) < 0.5f) {
                PlayNote(note);
                noteQueue.RemoveAt(i);
                i--;
            }
        }
    }

    private readonly List<AudioSource> activeSources = new List<AudioSource>();
    private const float FADE_TIME = 0.25f;
    private void PlayNote(QueuedNote note) {
        AudioSource audioSource = audioSourcePool.GetAudioSource(note.instrumentNote.clip);
        activeSources.Add(audioSource);
        audioSource.pitch = note.instrumentNote.pitch;
        audioSource.PlayScheduled(note.dspStartTime);
        StartCoroutine(EndRoutine());

        IEnumerator EndRoutine() {
            if(note.endTime > 0) {
                yield return new WaitForSecondsRealtime(note.endTime - Time.time);
                float startVolume = audioSource.volume;
                this.CreateAnimationRoutine(FADE_TIME, (float progress) => {
                    audioSource.volume = Mathf.Lerp(startVolume, 0, progress);
                }, () => {
                    Dispose(audioSource);
                });
            } else {
                float waitTime = (float)(note.dspStartTime - AudioSettings.dspTime) + audioSource.clip.length + FADE_TIME;
                yield return new WaitForSecondsRealtime(waitTime);
                Dispose(audioSource);
            }
        }
    }

    private void Dispose(AudioSource audioSource) {
        activeSources.Remove(audioSource);
        audioSourcePool.DisposeAudioSource(audioSource);
    }

    private const double SECONDS_PER_BEAT = 0.625;
    private void PlayTrack() {
        MusicNetworking.Instance.GetRandomSong((Song song) => {
            double dspStartOffset = AudioSettings.dspTime + 0.5;
            float startOffset = Time.time + 0.5f;
            PlaySoundAtOffset(song, dspStartOffset, startOffset);
            PlaySoundAtOffset(song, dspStartOffset+5, startOffset+5);
        });
    }

    private void StopTrack() {
        noteQueue.Clear();
        for (int i = 0; i < activeSources.Count; i++) {
            activeSources[i].Stop();
        }
    }

    private void PlaySoundAtOffset(Song song, double dspStartOffset, float startOffset) {
        InstrumentMasterList iml = InstrumentMasterList.Instance;
        for (int i = 0; i < song.parts.Length; i++) {
            InstrumentTrack mainTrack = song.parts[i];
            Instrument instrument = iml.GetInstrumentForId(mainTrack.instrument);
            for (int j = 0; j < mainTrack.notes.Count; j++) {
                List<Note> noteList = mainTrack.notes[j];
                for (int k = 0; k < noteList.Count; k++) {
                    Note note = noteList[k];
                    double startTime = note.start * SECONDS_PER_BEAT;
                    double endTime = note.end * SECONDS_PER_BEAT;
                    InstrumentNote instrumentNote = instrument.GetInstrumentNote(j);
                    QueueNote(dspStartOffset, startOffset, startTime, endTime, instrumentNote);
                }
            }
        }
    }

    private struct QueuedNote {
        public double dspStartTime;
        public float endTime;
        public InstrumentNote instrumentNote;
    }

    private void QueueNote(double dspStartOffset, float startOffset, double startTime, double _endTime, InstrumentNote _instrumentNote) {
        double endTime = (_endTime > 0) ? (startOffset + _endTime + FADE_TIME) : 0;
        noteQueue.Add(new QueuedNote() {
            dspStartTime = dspStartOffset + startTime,
            endTime = (float)endTime,
            instrumentNote = _instrumentNote
        });
    }
}
