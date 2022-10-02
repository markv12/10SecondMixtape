using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class InterstitialUIAnimator : MonoBehaviour {
    public Transform topPanel;
    public Transform leftPanel;
    public Transform rightPanel;
    public Transform plusSign;
    public Transform bottomText;

    public void RunAnimation() {
        topPanel.gameObject.SetActive(false);
        leftPanel.gameObject.SetActive(false);
        rightPanel.gameObject.SetActive(false);
        plusSign.gameObject.SetActive(false);
        bottomText.gameObject.SetActive(false);
        StartCoroutine(MoveRoutine());
    }

    IEnumerator MoveRoutine() {
        yield return new WaitForSeconds(0.5f);

        Vector3 currentLeftPanelPosition = leftPanel.transform.position;
        Vector3 startLeftPanelPosition = new Vector3(
            currentLeftPanelPosition.x - 1200,
            currentLeftPanelPosition.y,
            currentLeftPanelPosition.z
        );
        leftPanel.transform.position = startLeftPanelPosition;
        leftPanel.gameObject.SetActive(true);
        this.CreateAnimationRoutine(.6f, (float progress) => {
            leftPanel.position = Vector3.Lerp(
                startLeftPanelPosition,
                currentLeftPanelPosition,
                Easing.easeOutBounce(0, 1, progress)
            );
        });

        yield return new WaitForSeconds(0.8f);

        Vector3 currentPlusSignScale = plusSign.transform.localScale;
        Vector3 startPlusSignScale = new Vector3(
            currentPlusSignScale.x * 0.1f,
            currentPlusSignScale.y * 0.1f,
            currentPlusSignScale.z
        );
        plusSign.transform.localScale = startPlusSignScale;
        plusSign.gameObject.SetActive(true);
        this.CreateAnimationRoutine(.5f, (float progress) => {
            plusSign.localScale = Vector3.Lerp(
                startPlusSignScale,
                currentPlusSignScale,
                Easing.easeOutBack(0, 1, progress)
            );
        });

        yield return new WaitForSeconds(0.8f);

        Vector3 currentRightPanelPosition = rightPanel.transform.position;
        Vector3 startRightPanelPosition = new Vector3(
            currentRightPanelPosition.x + 1200,
            currentRightPanelPosition.y,
            currentRightPanelPosition.z
        );
        rightPanel.transform.position = startRightPanelPosition;
        rightPanel.gameObject.SetActive(true);
        this.CreateAnimationRoutine(.6f, (float progress) => {
            rightPanel.position = Vector3.Lerp(
                startRightPanelPosition,
                currentRightPanelPosition,
                Easing.easeOutBounce(0, 1, progress)
            );
        });


        yield return new WaitForSeconds(1.5f);

        Vector3 currentTopPanelPosition = topPanel.transform.position;
        Vector3 startTopPanelPosition = new Vector3(
            currentTopPanelPosition.x,
            currentTopPanelPosition.y + 300,
            currentTopPanelPosition.z
        );
        topPanel.transform.position = startTopPanelPosition;
        topPanel.gameObject.SetActive(true);
        this.CreateAnimationRoutine(.8f, (float progress) => {
            topPanel.position = Vector3.Lerp(
                startTopPanelPosition,
                currentTopPanelPosition,
                Easing.easeOutBounce(0, 1, progress)
            );
        });

        yield return new WaitForSeconds(1f);

        Vector3 currentBottomTextScale = bottomText.transform.localScale;
        Vector3 startBottomTextScale = new Vector3(
            currentBottomTextScale.x * 0.1f,
            currentBottomTextScale.y * 0.1f,
            currentBottomTextScale.z
        );
        bottomText.transform.localScale = startBottomTextScale;
        bottomText.gameObject.SetActive(true);
        this.CreateAnimationRoutine(.5f, (float progress) => {
            bottomText.localScale = Vector3.Lerp(
                startBottomTextScale,
                currentBottomTextScale,
                Easing.easeOutBack(0, 1, progress)
            );
        });
    }
}
