using UnityEngine;

public class AudioManager : MonoBehaviour {
    private const string AUDIO_MANAGER_PATH = "AudioManager";
    private static AudioManager instance;
    public static AudioManager Instance {
        get {
            if (instance == null) {
                GameObject audioManagerObject = (GameObject)Resources.Load(AUDIO_MANAGER_PATH);
                GameObject instantiated = Instantiate(audioManagerObject);
                DontDestroyOnLoad(instantiated);
                instance = instantiated.GetComponent<AudioManager>();
            }
            return instance;
        }
    }

    [Header("Sound Effects")]
    public AudioSource[] audioSources;

    private int audioSourceIndex = 0;

    public AudioClip success;
    public AudioClip plasticClick;
    public AudioClip crowdMurmur;
    public AudioClip applause;
    public AudioClip timpani;
    public AudioClip touch;
    public AudioClip swish;

    public void PlaySuccessSound(float intensity) {
        PlaySFX(success, 0.2f * intensity);
    }

    public void PlayPlasticClickSound(float intensity) {
        PlaySFX(plasticClick, 1.0f * intensity);
    }

    public void PlayApplauseSound(float intensity) {
        PlaySFX(applause, 0.7f * intensity);
    }

    public void PlayTimpaniSound(float intensity) {
        PlaySFX(timpani, 0.8f * intensity);
    }

    public void PlayTouchSound(float intensity) {
        PlaySFX(touch, 0.4f * intensity);
    }

    public void PlaySwishSound(float intensity) {
        PlaySFX(swish, 0.4f * intensity);
    }

    public void StartCrowdMurmur(float intensity) {
        PlaySFX(crowdMurmur, 0.15f * intensity, 1, true);
    }
    public void StopCrowdMurmur() {
        FadeOutSFX(crowdMurmur);
    }

    public void PlaySFX(AudioClip clip, float volume, float pitch = 1, bool loop = false) {
        AudioSource source = GetNextAudioSource();
        source.volume = volume;
        source.pitch = pitch;
        source.loop = loop;
        source.clip = clip;
        if (loop)
            source.Play();
        else
            source.PlayOneShot(clip);
    }

    public void StopSFX(AudioClip clip) {
        foreach (AudioSource source in audioSources) {
            if (source.clip == clip) {
                source.loop = false;
                source.Stop();
            }
        }
    }

    public void FadeOutSFX(AudioClip clip) {
        foreach (AudioSource source in audioSources) {
            if (source.clip == clip) {
                float startVolume = source.volume;
                this.CreateAnimationRoutine(0.75f, (float progress) => {
                    source.volume = Mathf.Lerp(startVolume, 0, progress);
                }, () => {
                    source.loop = false;
                    source.Stop();
                });
            }
        }
    }

    private AudioSource GetNextAudioSource() {
        AudioSource result = audioSources[audioSourceIndex];
        while (result.isPlaying) {
            audioSourceIndex = (audioSourceIndex + 1) % audioSources.Length;
            result = audioSources[audioSourceIndex];
        }
        audioSourceIndex = (audioSourceIndex + 1) % audioSources.Length;
        return result;
    }
}
