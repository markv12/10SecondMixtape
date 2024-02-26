using UnityEngine;

[CreateAssetMenu(menuName = "Pitch Shift Band Member")]
public class PitchShiftBandMember : BandMember {
    public AudioClip note;

    public override InstrumentNote GetInstrumentNote(int noteScaleIndex) {
        noteScaleIndex = Mathf.Min(noteScaleIndex, SongRecorder.ScaleDegreesToUse.Length - 1);
        int noteHalfSteps = SongRecorder.ScaleDegreesToUse[noteScaleIndex] + 1;
        return new InstrumentNote() {
            clip = note,
            volume = volume,
            pitch = HalfStepToPitchEqualTemperament(noteHalfSteps)
        };
    }

    private float HalfStepToPitchEqualTemperament(int halfSteps) {
        return Mathf.Pow(1.059463f, halfSteps);
    }

    private static readonly float[] intervals = new float[] { 1f, 1.06667f, 1.125f, 1.2f, 1.25f, 1.33333333f, 1.40625f, 1.5f, 1.6f, 1.66666667f, 1.8f, 1.875f };
    private float HalfStepToPitchJustIntonation(int halfSteps) {
        int octave = Mathf.CeilToInt(((float)halfSteps + 1) / (float)intervals.Length);
        halfSteps %= intervals.Length;
        return intervals[halfSteps] * octave;
    }

    public override int NoteCount => 11;
    public override bool IsPitched => true;
}
