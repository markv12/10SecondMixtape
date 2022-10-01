using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongVisualizer : MonoBehaviour {
    public RectTransform visualizerRect;
    public NoteLine noteLinePrefab;
    public NoteSquare noteSquarePrefab;

    private List<NoteLine> noteLines;
    public void ShowPart(InstrumentTrack track, float songLength) {
        int lineCount = GetLineCount(track);

        noteLines = new List<NoteLine>(new NoteLine[lineCount]);

        float rectWidth = visualizerRect.sizeDelta.x;
        float rectHeight = visualizerRect.sizeDelta.y;
        float lineHeight = rectHeight / lineCount;
        for (int i = 0; i < lineCount; i++) {
            NoteLine newLine = Instantiate(noteLinePrefab, visualizerRect);
            newLine.rectT.sizeDelta = new Vector2(rectWidth, lineHeight);
            newLine.rectT.anchoredPosition = new Vector2(0, lineHeight * i);
            noteLines[i] = newLine;
        }
        for (int i = 0; i < lineCount; i++) {
            List<Note> noteList = track.notes[i];
            NoteLine noteLine = noteLines[i];
            for (int j = 0; j < noteList.Count; j++) {
                Note note = noteList[j];
                NoteSquare newSquare = Instantiate(noteSquarePrefab, noteLine.rectT);
                float startX = BeatToX(note.start, songLength, rectWidth);
                float width = BeatToX((note.end - note.start), songLength, rectWidth);
                newSquare.rectT.anchoredPosition = new Vector2(startX, 0);
                newSquare.rectT.sizeDelta = new Vector2(width, noteLine.rectT.sizeDelta.y);
            }
        }
    }

    private static float BeatToX(double beat, float songLength, float rectWidth) {
        return (float)((beat * SongPlayer.SECONDS_PER_BEAT * rectWidth) / songLength);
    }

    public int GetLineCount(InstrumentTrack track) {
        int result = 0;
        for (int i = 0; i < track.notes.Count; i++) {
            if(track.notes[i].Count > 0) {
                result = i;
            }
        }
        return result;
    }
}
