using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongVisualizer : MonoBehaviour {
    public RectTransform visualizerRect;
    public RectTransform playheadRect;
    public NoteLine noteLinePrefab;
    public NoteSquare noteSquarePrefab;

    private List<NoteLine> noteLines;
    public void ShowPart(InstrumentTrack track, float songLength) {
        int lineCount = GetLastLineIndex(track) + 1;
        noteLines = new List<NoteLine>(new NoteLine[lineCount]);

        float rectWidth = visualizerRect.sizeDelta.x;
        float rectHeight = visualizerRect.sizeDelta.y;
        float lineHeight = rectHeight / lineCount;
        for (int i = 0; i < lineCount; i++) {
            NoteLine newLine = Instantiate(noteLinePrefab, visualizerRect);
            newLine.rectT.sizeDelta = new Vector2(rectWidth, lineHeight);
            newLine.rectT.anchoredPosition = new Vector2(0, lineHeight * i);
            noteLines[i] = newLine;

            List<Note> noteList = track.notes[i];
            for (int j = 0; j < noteList.Count; j++) {
                Note note = noteList[j];
                NoteSquare newSquare = Instantiate(noteSquarePrefab, newLine.rectT);

                double end = note.end == 0 ? note.start + SongRecorder.SMALLEST_NOTE_LENGTH : note.end;
                float startX = BeatToX(note.start, songLength, rectWidth);
                float width = BeatToX((end - note.start), songLength, rectWidth);
                newSquare.rectT.anchoredPosition = new Vector2(startX, 0);
                newSquare.rectT.sizeDelta = new Vector2(width, newLine.rectT.sizeDelta.y);
            }
        }
        MovePlayhead(0, rectWidth, songLength);
    }

    private void MovePlayhead(float startX, float endX, float duration) {
        StartCoroutine(MoveRoutine());

        IEnumerator MoveRoutine() {
            yield return new WaitForSecondsRealtime(0.005f);
            playheadRect.SetAsLastSibling();
            Vector2 startPos = playheadRect.anchoredPosition.SetX(startX);
            Vector2 endPos = playheadRect.anchoredPosition.SetX(endX);
            this.CreateAnimationRoutine(duration, (float progress) => {
                playheadRect.anchoredPosition = Vector2.Lerp(startPos, endPos, progress);
            });
        }
    }

    private static float BeatToX(double beat, float songLength, float rectWidth) {
        return (float)((beat * SongPlayer.SECONDS_PER_BEAT * rectWidth) / songLength);
    }

    public int GetLastLineIndex(InstrumentTrack track) {
        int result = 0;
        for (int i = 0; i < track.notes.Count; i++) {
            if(track.notes[i].Count > 0) {
                result = i;
            }
        }
        return result;
    }
}
