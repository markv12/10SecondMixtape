using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(menuName = "Instrument")]
public class Instrument : ScriptableObject {
    public string id;
    public AudioClip[] notes;

    public InstrumentNote GetInstrumentNote(int noteIndex) {
        return new InstrumentNote() {
            clip = notes[noteIndex],
            pitch = 1
        };
    }
}
