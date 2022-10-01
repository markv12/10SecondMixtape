using UnityEngine;

public class DspTimeEstimator : Singleton<DspTimeEstimator> {
    private double prevDspTime = 0;
    private double estimatedDspTime = 0;
    public double DspTime => estimatedDspTime < AudioSettings.dspTime ? estimatedDspTime : AudioSettings.dspTime;

    void Update() {
        if(prevDspTime == AudioSettings.dspTime) {
            estimatedDspTime += Time.unscaledDeltaTime;
        } else {
            estimatedDspTime = AudioSettings.dspTime;
            prevDspTime = AudioSettings.dspTime;
        }
    }
}
