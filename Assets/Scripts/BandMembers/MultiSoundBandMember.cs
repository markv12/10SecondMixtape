using UnityEngine;

[CreateAssetMenu(menuName = "Multi Sound Band Member")]
public class MultiSoundBandMember : BandMember {
    public AudioClip[] notes;

    public override InstrumentNote GetInstrumentNote(int noteIndex) {
        if (noteIndex >= notes.Length) {
            noteIndex = notes.Length - 1;
        }
        return new InstrumentNote() {
            clip = notes[noteIndex],
            pitch = 1
        };
    }
    public override int NoteCount => notes.Length;
    public override bool IsPitched => false;
}
