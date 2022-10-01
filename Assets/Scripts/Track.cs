using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public struct Track {
    public string instrumentId;
    public Note[] notes;
}

[Serializable]
public struct Note {
    public int note;
    public double start;
    public double end;
}
