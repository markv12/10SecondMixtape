using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using UnityEngine;

public class MusicNetworking : Singleton<MusicNetworking> {
    private readonly List<Song> randomSongs = new List<Song>();
    private int randomSongIndex = 0;
    public void GetRandomSong(Action<Song> onComplete) {
        if(randomSongIndex < randomSongs.Count) {
            Song result = randomSongs[randomSongIndex];
            randomSongIndex++;
            onComplete?.Invoke(result);
            if(randomSongs.Count - randomSongIndex < 4) {
                LoadMoreRandomSongs((Song[] newSongs) => {
                    randomSongs.AddRange(newSongs);
                });
            }
        } else {
            LoadMoreRandomSongs((Song[] newSongs) => {
                randomSongs.AddRange(newSongs);
                onComplete?.Invoke(randomSongs[randomSongIndex]);
                randomSongIndex++;
            });
        }
    }

    private void LoadMoreRandomSongs(Action<Song[]> onComplete) {
        StartCoroutine(NetUtility.Get("songs/some/9", (string json) => {
            onComplete?.Invoke(Song.CreateListFromJson(json));
        }));
    }

    public void GetSongByIdFragment(string idFragment, Action<Song> onComplete) {
        StartCoroutine(NetUtility.Get("songs/byIdFragment/" + idFragment, (string json) => {
            onComplete?.Invoke(Song.CreateListFromJson(json)[0]);
        }));
    }

    public Coroutine GetRandomPart(string scaleType, Action<InstrumentTrack> onComplete) {
        return StartCoroutine(NetUtility.Get("parts/some/1/" + scaleType, (string json) => {
            onComplete?.Invoke(InstrumentTrack.CreateListFromJson(json)[0]);
        }));
    }

    public Coroutine Get9Parts(string scaleType, Action<InstrumentTrack[]> onComplete) {
        return StartCoroutine(NetUtility.Get("parts/some/9/" + scaleType, (string json) => {
            onComplete?.Invoke(InstrumentTrack.CreateListFromJson(json));
        }));
    }

    public void UploadSong(Song song) {
        string json = JsonConvert.SerializeObject(song);
        StartCoroutine(NetUtility.PostJson("songs/new", json, (bool success, string newSongId) => { 
            if (!success) {
              return;
            }
            Debug.Log("Uploaded song with id: " + newSongId);
            // todo show first 8 characters of song ID to user so they could feasibly save it
            // and use it to load the song later
            // or maybe save it in a list of their songs in playprefs?
        }));
    }

    public void UploadTrack(InstrumentTrack track) {
        string json = JsonConvert.SerializeObject(track);
        StartCoroutine(NetUtility.PostJson("parts/new", json, (bool success, string newSongId) => { }));
    }

    public void UpvoteSong(Song song) {
        StartCoroutine(NetUtility.Get("songs/upvote/" + song.id , (string json) => { }));
    }

    public void DownvoteSong(Song song) {
        StartCoroutine(NetUtility.Get("songs/downvote/" + song.id , (string json) => { }));
    }

    public void MarkPartAsChosen(InstrumentTrack part) {
        StartCoroutine(NetUtility.Get("parts/chosen/" + part.id, (string json) => { }));
    }
}
