using System;
using System.Collections.Generic;
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
}

[Serializable]
public struct Note {
    public double start;
    public double end;
}
