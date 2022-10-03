using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ConcertPlayer : MonoBehaviour {
    public ConcertMember[] concertMembers;
    public SongPlayer songPlayer;

    public void PlaySong(Song song) {
        SetupConcertMembers(song);
        songPlayer.PlaySong(song, 0.5, true);

    }

    private void SetupConcertMembers(Song song) {
        BandMemberMasterList bmml = BandMemberMasterList.Instance;
        for (int i = 0; i < concertMembers.Length; i++) {
            ConcertMember member = concertMembers[i];
            if (i < song.parts.Length) {
                InstrumentTrack part = song.parts[i];
                member.mainSprite.sprite = bmml.GetBandMemberForId(part.instrument).mainSprite;
                member.gameObject.SetActive(true);
            } else {
                member.gameObject.SetActive(false);
            }
        }
    }
}
