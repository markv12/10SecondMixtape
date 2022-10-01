using System.Collections.Generic;
using UnityEngine;

public class AudioSourcePool : MonoBehaviour {
    public Transform parentT;

    private readonly List<AudioSource> audioSources = new List<AudioSource>();

    public AudioSource GetAudioSource(AudioClip clip) {
        for (int i = 0; i < audioSources.Count; i++) {
            AudioSource audioSource = audioSources[i];
            if (!audioSource.isPlaying) {
                return audioSource;
            }
        }
        AudioSource newAudioSource = CreateAudioSource();
        audioSources.Add(newAudioSource);
        newAudioSource.clip = clip;
        return newAudioSource;
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
