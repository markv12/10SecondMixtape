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

        yourCard.ShowMember(yourMember, NameGenerator.GeneratePersonName());
        otherMemberCard.ShowMember(otherMember, part.name);

        bandNameLabel.text = NameGenerator.GenerateBandName();

        WaitThenGoToRecord(part);
    }

    private void WaitThenGoToRecord(InstrumentTrack part) {
        gameObject.SetActive(true);
        StartCoroutine(WaitRoutine());

        IEnumerator WaitRoutine() {
            yield return new WaitForSeconds(7f);
            recordUI.Startup(part);
            yield return new WaitForSeconds(3);
            gameObject.SetActive(false);
        }
    }
}
