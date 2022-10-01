using UnityEngine;

[CreateAssetMenu(menuName = "Note Instrument")]
public class NoteInstrument : Instrument {
    public AudioClip[] notes;

    public override InstrumentNote GetInstrumentNote(int noteIndex) {
        return new InstrumentNote() {
            clip = notes[noteIndex],
            pitch = 1
        };
    }
}
