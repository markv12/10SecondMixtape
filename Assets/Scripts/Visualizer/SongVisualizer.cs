using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongVisualizer : MonoBehaviour {
    public RectTransform visualizerRect;
    public RectTransform playheadRect;
    public NoteLine noteLinePrefab;
    public NoteSquare noteSquarePrefab;

    private List<NoteLine> noteLines;
    private readonly List<NoteSquare> noteSquares = new List<NoteSquare>();
    public void ShowPart(InstrumentTrack track, double startWait, float songLength) {
        int lineCount = GetLastLineIndex(track) + 1;
        noteLines = new List<NoteLine>(new NoteLine[lineCount]);

        float rectWidth = visualizerRect.sizeDelta.x;
        float rectHeight = visualizerRect.sizeDelta.y;
        float lineHeight = rectHeight / lineCount;
        for (int i = 0; i < lineCount; i++) {
            NoteLine newLine = Instantiate(noteLinePrefab, visualizerRect);
            newLine.rectT.sizeDelta = new Vector2(rectWidth, lineHeight);
            newLine.rectT.anchoredPosition = new Vector2(0, lineHeight * i);
            newLine.keyText.text = SongRecorder.KeyStringForLine(i);
            noteLines[i] = newLine;

            List<Note> noteList = track.notes[i];
            for (int j = 0; j < noteList.Count; j++) {
                Note note = noteList[j];
                AddNoteSquare(note, songLength, rectWidth, newLine);
            }
        }
        MovePlayhead(0, rectWidth, songLength, startWait);
    }

    private void AddNoteSquare(Note note, float songLength, float rectWidth, NoteLine newLine) {
        NoteSquare newSquare = Instantiate(noteSquarePrefab, newLine.rectT);

        double end = note.end == 0 ? note.start + SongRecorder.SMALLEST_NOTE_LENGTH : note.end;
        float startX = BeatToX(note.start, songLength, rectWidth);
        float width = BeatToX((end - note.start), songLength, rectWidth);
        newSquare.rectT.anchoredPosition = new Vector2(startX, 0);
        newSquare.rectT.sizeDelta = new Vector2(width, newLine.rectT.sizeDelta.y);
        noteSquares.Add(newSquare);
    }

    private void AddNoteSquare(Note note, int lineIndex,  float songLength) {
        AddNoteSquare(note, songLength, visualizerRect.sizeDelta.x, noteLines[lineIndex]);
    }

    public void ShowInstrument(BandMember bandMember, double startWait, float songLength) {
        int lineCount = bandMember.NoteCount;
        noteLines = new List<NoteLine>(new NoteLine[lineCount]);

        float rectWidth = visualizerRect.sizeDelta.x;
        float rectHeight = visualizerRect.sizeDelta.y;
        float lineHeight = rectHeight / lineCount;
        for (int i = 0; i < lineCount; i++) {
            NoteLine newLine = Instantiate(noteLinePrefab, visualizerRect);
            newLine.rectT.sizeDelta = new Vector2(rectWidth, lineHeight);
            newLine.rectT.anchoredPosition = new Vector2(0, lineHeight * i);
            newLine.keyText.text = SongRecorder.KeyStringForLine(i);
            noteLines[i] = newLine;
        }
        MovePlayhead(0, rectWidth, songLength, startWait);
    }

    public void ClearNoteSquares() {
        for (int i = 0; i < noteSquares.Count; i++) {
            Destroy(noteSquares[i].gameObject);
        }
        noteSquares.Clear();
    }

    public void ClearLines() {
        if(noteLines != null) {
            for (int i = 0; i < noteLines.Count; i++) {
                Destroy(noteLines[i].gameObject);
            }
            noteLines.Clear();
        }
    }

    private void MovePlayhead(float startX, float endX, float duration, double startWait) {
        StartCoroutine(MoveRoutine());

        IEnumerator MoveRoutine() {
            yield return new WaitForSeconds((float)startWait);
            playheadRect.SetAsLastSibling();
            Vector2 startPos = playheadRect.anchoredPosition.SetX(startX);
            Vector2 endPos = playheadRect.anchoredPosition.SetX(endX);
            float startTime = Time.time;
            while (true) {
                float timeSinceStart = Time.time - startTime;
                float progress = (timeSinceStart / 10f) % 1;
                playheadRect.anchoredPosition = Vector2.Lerp(startPos, endPos, progress);
                yield return null;
            }
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

    public void AddNote(Note note, int noteIndex) {
        AddNoteSquare(note, noteIndex, 10);
    }
}
