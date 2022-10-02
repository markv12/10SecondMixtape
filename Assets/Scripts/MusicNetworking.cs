using Newtonsoft.Json;
using System;
using UnityEngine;

public class MusicNetworking : Singleton<MusicNetworking> {
    public void GetRandomSong(Action<Song> onComplete) {
        StartCoroutine(NetUtility.Get("songs/some/1", (string json) => {
            onComplete?.Invoke(Song.CreateListFromJson(json)[0]);
        }));
    }

    public Coroutine GetRandomPart(Action<InstrumentTrack> onComplete) {
        return StartCoroutine(NetUtility.Get("parts/some/1", (string json) => {
            onComplete?.Invoke(InstrumentTrack.CreateListFromJson(json)[0]);
        }));
    }

    public void UploadSong(Song song) {
        string json = JsonConvert.SerializeObject(song);
        StartCoroutine(NetUtility.PostJson("songs/new", json, (bool a, string b) => { }));
    }
}
