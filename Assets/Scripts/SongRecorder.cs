using System.Collections;
using UnityEngine;
using UnityEngine.InputSystem;

public class SongRecorder : MonoBehaviour {

    public AudioSourcePool audioSourcePool;

    private bool isRecording = false;

    private Song currentSong;
    private Instrument currentInstrument;
    private float startTime;
    public void StartRecording(string instrumentId) {
        startTime = Time.time;
        currentInstrument = InstrumentMasterList.Instance.GetInstrumentForId(instrumentId);
        currentSong = new Song() {
            name = "Test Song",
            length = 10,
            parts = new InstrumentTrack[] {
                new InstrumentTrack() {
                    name = "Test Person",
                    instrument = instrumentId,
                    notes = Note.NoteTwoDArray(18)
                }
            }
        };
        isRecording = true;
    }

    public Song StopRecording() {
        isRecording = false;
        Song result = currentSong;
        currentSong = null;
        return result;
    }

    private void Update() {
        if (isRecording) {
            for (int i = 0; i < keyboard.Length; i++) {
                InstrumentKey key = keyboard[i];
                if (InputUtility.GetKeyDown(key.key)) {
                    AudioSource audioSource = audioSourcePool.GetAudioSource(currentInstrument.GetInstrumentNote(key.noteIndex));
                    audioSource.Play();
                    Note newNote = new Note() {
                        start = Quantize((Time.time - startTime) % currentSong.length)
                    };
                    currentSong.parts[0].notes[key.noteIndex].Add(newNote);
                    key.currentNote = newNote;
                    key.currentSource = audioSource;
                } else if (InputUtility.GetKeyUp(key.key)) {
                    if (key.currentNote != null) {
                        double end = Quantize((Time.time - startTime) % currentSong.length);
                        double extension = (key.currentNote.start == end) ? 0.25 : 0;
                        end += extension;
                        if(key.currentSource != null) {
                            FadeNote(key.currentSource, extension);
                            key.currentSource = null;
                        }
                        key.currentNote.end = end;
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
                yield return new WaitForSecondsRealtime((float)initialWait);
            }
            float startVolume = audioSource.volume;
            this.CreateAnimationRoutine(SongPlayer.FADE_TIME, (float progress) => {
                audioSource.volume = Mathf.Lerp(startVolume, 0, progress);
            }, () => {
                audioSourcePool.DisposeAudioSource(audioSource);
            });
        }
    }

    private static readonly int[] MajorScaleDegrees = new int[] {
        0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24
    };
    private static readonly int[] MinorScaleDegrees = new int[] {
        0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24
    };
    private static int[] ScaleDegreesToUse = MinorScaleDegrees;

    private static readonly InstrumentKey[] keyboard = new InstrumentKey[]{
        new InstrumentKey() {
            key = Key.A,
            noteIndex = ScaleDegreesToUse[0],
        },
        new InstrumentKey() {
            key = Key.S,
            noteIndex = ScaleDegreesToUse[1],
        },
        new InstrumentKey() {
            key = Key.D,
            noteIndex = ScaleDegreesToUse[2],
        },
        new InstrumentKey() {
            key = Key.F,
            noteIndex = ScaleDegreesToUse[3],
        },
        new InstrumentKey() {
            key = Key.G,
            noteIndex = ScaleDegreesToUse[4],
        },
        new InstrumentKey() {
            key = Key.H,
            noteIndex = ScaleDegreesToUse[5],
        },
        new InstrumentKey() {
            key = Key.J,
            noteIndex = ScaleDegreesToUse[6],
        },
        new InstrumentKey() {
            key = Key.K,
            noteIndex = ScaleDegreesToUse[7],
        },
        new InstrumentKey() {
            key = Key.L,
            noteIndex = ScaleDegreesToUse[8],
        },
        new InstrumentKey() {
            key = Key.Semicolon,
            noteIndex = ScaleDegreesToUse[9],
        },
        new InstrumentKey() {
            key = Key.Quote,
            noteIndex = ScaleDegreesToUse[10],
        },
    };

    private class InstrumentKey {
        public Key key;
        public int noteIndex;
        public Note currentNote;
        public AudioSource currentSource;
    }

    public double Quantize(double value) {
        double beat = value / SongPlayer.SECONDS_PER_BEAT;
        return System.Math.Round(beat*4.0)/4.0;
    }
}
