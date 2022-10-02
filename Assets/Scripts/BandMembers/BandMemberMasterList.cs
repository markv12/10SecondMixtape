using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(menuName = "Band Member Master List")]
public class BandMemberMasterList : ScriptableObject {

    private static BandMemberMasterList instance;
    public static BandMemberMasterList Instance {
        get {
            if(instance == null) {
                instance = Resources.Load<BandMemberMasterList>("BandMemberMasterList");
                instance.Initialize();
            }
            return instance;
        }
    }

    public BandMember[] bandMembers;
    public BandMember metronome;
    private readonly Dictionary<string, BandMember> bandMemberMap = new Dictionary<string, BandMember>();
    private void Initialize() {
        for (int i = 0; i < bandMembers.Length; i++) {
            BandMember instrument = bandMembers[i];
            bandMemberMap[instrument.id] = instrument;
        }
        bandMemberMap[metronome.id] = metronome;
    }

    public BandMember GetBandMemberForId(string id) {
        return bandMemberMap[id];
    }

    public BandMember GetBandMemberOfDifferentType(BandMember.InstrumentType instrumentType) {
        BandMember result = bandMembers[0];
        for (int i = 0; i < 6; i++) {
            BandMember candidate = bandMembers[Random.Range(0, bandMembers.Length)];
            if(candidate.instrumentType != instrumentType) {
                result = candidate;
                break;
            }
        }
        return result;
    }
}
