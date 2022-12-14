using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class SongRecorder : MonoBehaviour {
    public AudioSourcePool audioSourcePool;

    public bool IsRecording { get; private set; }

    public InstrumentTrack currentTrack;
    private BandMember currentBandMember;
    private float startTime;
    private Action<Note, int, Color> onNoteAdded;
    public void StartRecording(BandMember bandMember, string yourName, double startOffset, Action<Note, int, Color> _onNoteAdded) {
        startTime = Time.time + (float)startOffset;
        currentBandMember = bandMember;
        currentTrack = new InstrumentTrack() {
            name = yourName,
            instrument = bandMember.id,
            notes = Note.NoteTwoDArray(18)
        };
        onNoteAdded = _onNoteAdded;
        IsRecording = true;
    }

    public void StopRecording() {
        IsRecording = false;
    }

    public const double SMALLEST_NOTE_LENGTH = 0.125;
    public const double NOTE_QUANTIZE_MULTIPLE = 1.0 / SMALLEST_NOTE_LENGTH;
    public const float TIME_ADJUST = -0.02f;
    private void Update() {
        if (IsRecording && Time.time > startTime) {
            for (int i = 0; i < pitchedKeyboard.Length; i++) {
                InstrumentKey key = pitchedKeyboard[i];
                if (InputUtility.GetKeyDown(key.key) && currentBandMember.HasNoteIndex(key.noteIndex)) {
                    InstrumentNote note = currentBandMember.GetInstrumentNote(key.noteIndex);
                    AudioSource audioSource = audioSourcePool.GetAudioSource(note);
                    audioSource.Play();
                    float timeOffset = (Time.time - startTime) + TIME_ADJUST;
                    Note newNote = new Note() {
                        start = Quantize(timeOffset % 10f)
                    };
                    currentTrack.notes[key.noteIndex].Add(newNote);
                    key.currentNote = newNote;
                    key.currentSource = audioSource;
                } else if (InputUtility.GetKeyUp(key.key) && currentBandMember.HasNoteIndex(key.noteIndex)) {
                    if (key.currentNote != null) {
                        double end = Quantize((Time.time - startTime) % 10f);
                        double extension = (key.currentNote.start == end) ? SMALLEST_NOTE_LENGTH : 0;
                        end += extension;
                        if(key.currentSource != null) {
                            FadeNote(key.currentSource, extension);
                            key.currentSource = null;
                        }
                        key.currentNote.end = end;
                        if(key.currentNote.start > key.currentNote.end) {
                            double oldEnd = key.currentNote.end;
                            key.currentNote.end = 16;
                            Note startNote = new Note() {
                                start = 0,
                                end = oldEnd
                            };
                            currentTrack.notes[key.noteIndex].Add(startNote);
                            onNoteAdded?.Invoke(startNote, key.noteIndex, currentBandMember.noteColor);
                        }
                        onNoteAdded?.Invoke(key.currentNote, key.noteIndex, currentBandMember.noteColor);
                        key.currentNote = null;
                    }
                }
            }
        }
    }

    private void FadeNote(AudioSource audioSource, double initialWait) {
        StartCoroutine(FadeRoutine());

        IEnumerator FadeRoutine() {
            if(initialWait > 0) {
                yield return new WaitForSeconds((float)initialWait);
            }
            float startVolume = audioSource.volume;
            this.CreateAnimationRoutine(SongPlayer.FADE_TIME, (float progress) => {
                audioSource.volume = Mathf.Lerp(startVolume, 0, progress);
            }, () => {
                audioSourcePool.DisposeAudioSource(audioSource);
            });
        }
    }

    public void Clear() {
        if (currentTrack != null) {
            for (int i = 0; i < currentTrack.notes.Count; i++) {
                currentTrack.notes[i].Clear();
            }
        }
    }

    private static readonly int[] MajorScaleDegrees = new int[] {
        0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24
    };
    private static readonly int[] MinorScaleDegrees = new int[] {
        0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23, 24
    };
    public static int[] ScaleDegreesToUse = MajorScaleDegrees;

    private static readonly InstrumentKey[] pitchedKeyboard = new InstrumentKey[]{
        new InstrumentKey() {
            key = Key.A,
            noteIndex = 0,
        },
        new InstrumentKey() {
            key = Key.S,
            noteIndex = 1,
        },
        new InstrumentKey() {
            key = Key.D,
            noteIndex = 2,
        },
        new InstrumentKey() {
            key = Key.F,
            noteIndex = 3,
        },
        new InstrumentKey() {
            key = Key.G,
            noteIndex = 4,
        },
        new InstrumentKey() {
            key = Key.H,
            noteIndex = 5,
        },
        new InstrumentKey() {
            key = Key.J,
            noteIndex = 6,
        },
        new InstrumentKey() {
            key = Key.K,
            noteIndex = 7,
        },
        new InstrumentKey() {
            key = Key.L,
            noteIndex = 8,
        },
        new InstrumentKey() {
            key = Key.Semicolon,
            noteIndex = 9,
        },
        new InstrumentKey() {
            key = Key.Quote,
            noteIndex = 10,
        },
    };

    public void DeleteNote(Note note) {
        if (currentTrack != null) {
            for (int i = 0; i < currentTrack.notes.Count; i++) {
                currentTrack.notes[i].Remove(note);
            }
        }
    }

    private const string KEY_LETTERS = "ASDFGHJKL;'";
    public static string KeyStringForLine(int lineIndex) {
        return KEY_LETTERS[lineIndex].ToString();
    }

    private class InstrumentKey {
        public Key key;
        public int noteIndex;
        public Note currentNote;
        public AudioSource currentSource;
    }

    public double Quantize(double value) {
        double beat = value / SongPlayer.SECONDS_PER_BEAT;
        return Math.Round(beat * NOTE_QUANTIZE_MULTIPLE) / NOTE_QUANTIZE_MULTIPLE;
    }
}
