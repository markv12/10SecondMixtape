using System.Collections;
using TMPro;
using UnityEngine;

public class BandmatePreviewUI : MonoBehaviour {

    public TMP_Text bandNameLabel;

    public BandMemberCard yourCard;
    public BandMemberCard otherMemberCard;

    public RecordUI recordUI;

    public void SetupNewBandmatePairing(InstrumentTrack part) {
        BandMember otherMember = BandMemberMasterList.Instance.GetBandMemberForId(part.instrument);
        BandMember yourMember = BandMemberMasterList.Instance.GetBandMemberOfDifferentType(otherMember.instrumentType);

        yourCard.ShowMember(yourMember, NameGenerator.GeneratePersonName());
        otherMemberCard.ShowMember(otherMember, part.name);

        bandNameLabel.text = NameGenerator.GenerateBandName();

        WaitThenGoToRecord();
    }

    private void WaitThenGoToRecord() {
        gameObject.SetActive(true);
        StartCoroutine(WaitRoutine());

        IEnumerator WaitRoutine() {
            yield return new WaitForSeconds(5.5f);
            recordUI.Startup();
            yield return new WaitForSeconds(3);
            gameObject.SetActive(false);
        }
    }
}
