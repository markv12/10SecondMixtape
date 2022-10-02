using UnityEngine;

public abstract class BandMember : ScriptableObject {
    public string id;
    public string instrumentDisplayName;
    public Color color;
    public Sprite mainSprite;
    public Sprite cassetteSprite;
    public abstract InstrumentNote GetInstrumentNote(int noteIndex);
    public abstract int NoteCount { get; }
    public enum InstrumentType {
        Lead,
        Bass,
        Drums
    }
    public InstrumentType instrumentType;
}
