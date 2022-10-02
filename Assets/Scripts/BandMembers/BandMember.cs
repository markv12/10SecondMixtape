using UnityEngine;

public abstract class BandMember : ScriptableObject {
    public string id;
    public string instrumentDisplayName;
    public Color color;
    public Sprite mainSprite;
    public Sprite cassetteSprite;
    public bool cassetteTextWhite;
    public abstract InstrumentNote GetInstrumentNote(int noteIndex);
    public enum InstrumentType {
        Lead,
        Bass,
        Drums
    }
    public InstrumentType instrumentType;
}
