using System;
using System.Collections.Generic;
using Newtonsoft.Json;

[Serializable]
public class Song {
    public string name;
    public InstrumentTrack[] parts;
    public float length = 10;
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
public class Note {
    public double start;
    public double end;

    public static List<List<Note>> NoteTwoDArray(int size) {
        List<List<Note>> result = new List<List<Note>>(size);
        for (int i = 0; i < size; i++) {
            result.Add(new List<Note>());
        }
        return result;
    }
}
