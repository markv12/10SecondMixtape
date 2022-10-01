using UnityEngine;

public abstract class Instrument : ScriptableObject {
    public string id;

    public abstract InstrumentNote GetInstrumentNote(int noteIndex);
}
