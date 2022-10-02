using System;
using System.Collections.Generic;
using Newtonsoft.Json;

[Serializable]
public class Song {
    public string name;
    public string id;
    public InstrumentTrack[] parts;
    public float length = 10;
    public static Song CreateFromJson(string json) {
        return JsonConvert.DeserializeObject<Song>(json);
    }
    public static Song[] CreateListFromJson(string json) {
        return JsonConvert.DeserializeObject<Song[]>(json);
    }

    public static Song CreateFromPart(InstrumentTrack part) {
        return new Song() {
            length = 10,
            parts = new InstrumentTrack[] { part },
        };
    }

    public static readonly Song METRONOME_SONG = new Song() {
        length = 10f,
        parts = new InstrumentTrack[] {
            new InstrumentTrack {
                instrument = "Metronome",
                notes = new List<List<Note>>() {
                    new List<Note>(){
                        new Note() {
                            start = 0
                        },
                         new Note() {
                            start = 1
                        },
                        new Note() {
                            start = 2
                        },
                         new Note() {
                            start = 3
                        },
                        new Note() {
                            start = 4
                        },
                         new Note() {
                            start = 5
                        },
                        new Note() {
                            start = 6
                        },
                         new Note() {
                            start = 7
                        },
                        new Note() {
                            start = 8
                        },
                         new Note() {
                            start = 9
                        },
                        new Note() {
                            start = 10
                        },
                         new Note() {
                            start = 11
                        },
                        new Note() {
                            start = 12
                        },
                         new Note() {
                            start = 13
                        },
                        new Note() {
                            start = 14
                        },
                         new Note() {
                            start = 15
                        },
                    }
                }
            }
        }
    };
}

[Serializable]
public class InstrumentTrack {
    public string name;
    public string id;
    public string instrument;
    public List<List<Note>> notes;

    public static InstrumentTrack[] CreateListFromJson(string json) {
        return JsonConvert.DeserializeObject<InstrumentTrack[]>(json);
    }
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
