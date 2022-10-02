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
    private readonly Dictionary<string, BandMember> bandMemberMap = new Dictionary<string, BandMember>();
    private void Initialize() {
        for (int i = 0; i < bandMembers.Length; i++) {
            BandMember instrument = bandMembers[i];
            bandMemberMap[instrument.id] = instrument;
        }
    }

    public BandMember GetBandMemberForId(string id) {
        return bandMemberMap[id];
    }
}
