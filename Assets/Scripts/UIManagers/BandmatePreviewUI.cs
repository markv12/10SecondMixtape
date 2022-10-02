using System.Collections;
using TMPro;
using UnityEngine;

public class BandmatePreviewUI : MonoBehaviour {

    public TMP_Text bandNameLabel;

    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;

    public RecordUI recordUI;

    void Awake() {
        IEnumerator SoundCoroutine() {
            yield return new WaitForSeconds(1.5f);
            AudioManager.Instance.PlayTimpaniSound(1.0f);
        }
        StartCoroutine(SoundCoroutine());
    }
    public void SetupNewBandmatePairing(InstrumentTrack part) {
        BandMember otherMember = BandMemberMasterList.Instance.GetBandMemberForId(part.instrument);
        BandMember yourMember = BandMemberMasterList.Instance.GetBandMemberOfDifferentType(otherMember.instrumentType);

        string yourName = NameGenerator.GeneratePersonName();
        yourCard.ShowMember(yourMember, yourName);
        otherMemberCard.ShowMember(otherMember, part.name);

        string bandName = NameGenerator.GenerateBandName();
        bandNameLabel.text = bandName;

        SessionData sessionData = new SessionData() {
            otherPart = part,
            yourMember = yourMember,
            otherMember = otherMember,
            yourName = yourName,
            otherName = part.name,
            bandName = bandName,
        };

        WaitThenGoToRecord(sessionData);
    }

    private void WaitThenGoToRecord(SessionData sessionData) {
        gameObject.SetActive(true);
        StartCoroutine(WaitRoutine());

        IEnumerator WaitRoutine() {
            yield return new WaitForSeconds(7f);
            recordUI.Startup(sessionData);
            yield return new WaitForSeconds(3);
            gameObject.SetActive(false);
        }
    }
}
