using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(menuName = "InstrumentMasterList")]
public class InstrumentMasterList : ScriptableObject {

    private static InstrumentMasterList instance;
    public static InstrumentMasterList Instance {
        get {
            if(instance == null) {
                instance = Resources.Load<InstrumentMasterList>("InstrumentMasterList");
                instance.Initialize();
            }
            return instance;
        }
    }

    public Instrument[] instruments;
    private Dictionary<string, Instrument> instrumentMap = new Dictionary<string, Instrument>();
    private void Initialize() {
        for (int i = 0; i < instruments.Length; i++) {
            Instrument instrument = instruments[i];
            instrumentMap[instrument.id] = instrument;
        }
    }

    public Instrument GetInstrumentForId(string id) {
        return instrumentMap[id];
    }
}
