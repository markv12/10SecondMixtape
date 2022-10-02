using UnityEngine;

public abstract class BandMember : ScriptableObject {
    public string id;
    public string instrumentDisplayName;
    public Color color;
    public Sprite mainSprite;
    public Sprite cassetteSprite;
    public abstract InstrumentNote GetInstrumentNote(int noteIndex);
}
