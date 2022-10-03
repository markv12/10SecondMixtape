using System.Collections;
using UnityEngine;

public class ConcertPlayer : MonoBehaviour {
    public ConcertMember[] concertMembers;
    public SongPlayer songPlayer;

    private void Awake() {
        songPlayer.onPlayNote = WaitThenBounce;
    }

    private void WaitThenBounce(int partIndex, double startTime) {
        if (partIndex < concertMembers.Length) {
            StartCoroutine(WaitRoutine());
        }

        IEnumerator WaitRoutine() {
            while (Time.time < startTime) {
                yield return null;
            }
            concertMembers[partIndex].dancer.Bounce();
        }
    }

    public void PlaySong(Song song) {
        SetupConcertMembers(song);
        AnimateConcertMembers(true);
        songPlayer.PlaySong(song, 2, true);
        AudioManager.Instance.PlayApplauseSound(0.25f);
    }

    public void StopSong() {
        songPlayer.StopSong();
        AnimateConcertMembers(false);
    }

    private void SetupConcertMembers(Song song) {
        BandMemberMasterList bmml = BandMemberMasterList.Instance;
        for (int i = 0; i < concertMembers.Length; i++) {
            ConcertMember member = concertMembers[i];
            if (i < song.parts.Length) {
                InstrumentTrack part = song.parts[i];
                member.SetOnScreen(false, false);
                member.mainSprite.sprite = bmml.GetBandMemberForId(part.instrument).mainSprite;
                member.gameObject.SetActive(true);
                member.dancer.SetParticleColor(bmml.GetBandMemberForId(part.instrument).noteColor);
            } else {
                member.gameObject.SetActive(false);
            }
        }
    }

    private void AnimateConcertMembers(bool onScreen) {
        for (int i = 0; i < concertMembers.Length; i++) {
            concertMembers[i].SetOnScreen(onScreen, true);
        }
    }
}
