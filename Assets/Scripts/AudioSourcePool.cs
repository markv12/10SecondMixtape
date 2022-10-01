using System.Collections.Generic;
using UnityEngine;

public class AudioSourcePool : MonoBehaviour {
    public Transform parentT;

    private readonly List<AudioSource> freeAudioSources = new List<AudioSource>();

    public AudioSource GetAudioSource(InstrumentNote note) {
        AudioSource result;
        if(freeAudioSources.Count > 0) {
            result = freeAudioSources[freeAudioSources.Count - 1];
            freeAudioSources.RemoveAt(freeAudioSources.Count - 1);
        } else {
            result = CreateAudioSource();
        }
        result.clip = note.clip;
        result.pitch = note.pitch;
        result.volume = 1;
        return result;
    }

    public void DisposeAudioSource(AudioSource audioSource) {
        audioSource.Stop();
        freeAudioSources.Add(audioSource);
    }

    private AudioSource CreateAudioSource() {
        GameObject newObject = new GameObject("AudioSource");
        newObject.transform.parent = parentT;
        AudioSource newAudioSource = newObject.AddComponent<AudioSource>();
        newAudioSource.playOnAwake = false;
        newAudioSource.loop = false;
        return newAudioSource;
    }
}
