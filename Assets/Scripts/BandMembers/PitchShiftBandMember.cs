using UnityEngine;

[CreateAssetMenu(menuName = "Pitch Shift Band Member")]
public class PitchShiftBandMember : BandMember {
    public AudioClip note;

    public override InstrumentNote GetInstrumentNote(int noteIndex) {
        return new InstrumentNote() {
            clip = note,
            pitch = Mathf.Pow(1.059463f, noteIndex + 1)
        };
    }
}
