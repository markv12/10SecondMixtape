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

    public void PlaySuccessSound(float intensity) {
        PlaySFX(success, 0.5f * intensity);
    }

    public void PlayPlasticClickSound(float intensity) {
        PlaySFX(plasticClick, 1.0f * intensity);
    }

    public void PlayApplauseSound(float intensity) {
        PlaySFX(applause, 0.8f * intensity);
    }

    public void StartCrowdMurmur(float intensity) {
        PlaySFX(crowdMurmur, 1.0f * intensity, 1, true);
    }
    public void StopCrowdMurmur() {
        StopSFX(crowdMurmur);
    }

    public void PlaySFX(AudioClip clip, float volume, float pitch = 1, bool loop = false) {
        AudioSource source = GetNextAudioSource();
        source.volume = volume;
        source.pitch = pitch;
        source.loop = loop;
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

    private AudioSource GetNextAudioSource() {
        AudioSource result = audioSources[audioSourceIndex];
        audioSourceIndex = (audioSourceIndex + 1) % audioSources.Length;
        return result;
    }
}
