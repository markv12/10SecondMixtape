using UnityEngine;

[CreateAssetMenu(menuName = "Pitch Shift Band Member")]
public class PitchShiftBandMember : BandMember {
    public AudioClip note;

    public override InstrumentNote GetInstrumentNote(int noteIndex) {
        int notePower = SongRecorder.MajorScaleDegrees[noteIndex] + 1;
        return new InstrumentNote() {
            clip = note,
            pitch = Mathf.Pow(1.059463f, notePower)
        };
    }
    public override int NoteCount => 11;
    public override bool IsPitched => true;
}
