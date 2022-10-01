using UnityEngine;
using UnityEngine.InputSystem;

public class SongRecorder : MonoBehaviour {

    private bool isRecording = false;

    private Song currentSong;
    private float startTime;
    public void StartRecording() {
        startTime = Time.time;
        currentSong = new Song() {
            length = 10,
            parts = new InstrumentTrack[] {
                new InstrumentTrack() {
                    instrument = "RockBass",
                    notes = Note.NoteTwoDArray(14)
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
                    Note newNote = new Note() {
                        start = Quantize((Time.time - startTime) % currentSong.length)
                    };
                    currentSong.parts[0].notes[key.noteIndex].Add(newNote);
                    key.currentNote = newNote;
                } else if (InputUtility.GetKeyUp(key.key)) {
                    if (key.currentNote != null) {
                        double end = Quantize((Time.time - startTime) % currentSong.length);
                        if(key.currentNote.start == end) {
                            end += 0.125;
                        }
                        key.currentNote.end = end;
                        key.currentNote = null;
                    }
                }
            }
        }
    }

    private static readonly InstrumentKey[] keyboard = new InstrumentKey[]{
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

    private class InstrumentKey {
        public Key key;
        public int noteIndex;
        public Note currentNote;
    }

    public double Quantize(double value) {
        double beat = value / SongPlayer.SECONDS_PER_BEAT;
        return System.Math.Round(beat*8.0)/8.0;
    }
}
