using UnityEngine;

public abstract class BandMember : ScriptableObject {
    public string id;
    public string instrumentDisplayName;
    public Color color;
    public Color noteColor;
    public Sprite mainSprite;
    public Sprite cassetteSprite;
    public bool cassetteTextWhite;
    [Range(0f, 1f)]
    public float volume = 1;
    public abstract InstrumentNote GetInstrumentNote(int noteIndex);
    public abstract int NoteCount { get; }
    public abstract bool IsPitched { get; }
    public bool HasNoteIndex(int noteIndex) {
        return noteIndex < NoteCount;
    } 
    public enum InstrumentType {
        Lead,
        Bass,
        Drums
    }
    public InstrumentType instrumentType;
}
