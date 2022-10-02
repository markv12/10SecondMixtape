using UnityEngine;

[CreateAssetMenu(menuName = "Multi Sound Band Member")]
public class MultiSoundBandMember : BandMember {
    public AudioClip[] notes;

    public override InstrumentNote GetInstrumentNote(int noteIndex) {
        return new InstrumentNote() {
            clip = notes[noteIndex],
            pitch = 1
        };
    }
}
