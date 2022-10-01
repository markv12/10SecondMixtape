using Newtonsoft.Json.Utilities;
using System.Collections.Generic;
using UnityEngine;

public class AotTypeEnforcer : MonoBehaviour {
    public void Awake() {
        AotHelper.EnsureList<Song>();
        AotHelper.EnsureList<InstrumentTrack>();
        AotHelper.EnsureList<Note>();
        AotHelper.EnsureList<List<Note>>();
    }
}
