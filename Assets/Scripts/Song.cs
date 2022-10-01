using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;

[Serializable]
public struct Song {
    public string name;
    public InstrumentTrack[] parts;

    public static Song CreateFromJson(string json) {
        return JsonConvert.DeserializeObject<Song>(json);
    }
    public static Song[] CreateListFromJson(string json) {
        return JsonConvert.DeserializeObject<Song[]>(json);
    }
}

[Serializable]
public struct InstrumentTrack {
    public string name;
    public string instrument;
    public List<List<Note>> notes;

    public const string TEST_TRACK = @"{
    instrument: 'Drumset1',
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
