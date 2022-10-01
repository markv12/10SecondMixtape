using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;

[Serializable]
public struct InstrumentTrack {
    public string instrumentId;
    public List<List<Note>> notes;

    public static InstrumentTrack CreateFromJson(string json) {
        return JsonConvert.DeserializeObject<InstrumentTrack>(json);
    }

    public const string TEST_TRACK = @"{
    instrumentId: 'Drumset1',
    notes: [
    [
        { 'start' : 0 },
        { 'start' : 1 },
        { 'start' : 2 },
        { 'start' : 3 },
    ],
    [
        { 'start' : 0.5 },
        { 'start' : 1.5 },
        { 'start' : 2.5 },
        { 'start' : 3.5 },
    ],
    [
        { 'start' : 0.25 },
        { 'start' : 1.25 },
        { 'start' : 2.25 },
        { 'start' : 3.25 },
    ],
]
}";
}

[Serializable]
public struct Note {
    public double start;
    public double end;
}
