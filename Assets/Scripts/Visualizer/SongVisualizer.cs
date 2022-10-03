using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SongVisualizer : MonoBehaviour {
    public RectTransform visualizerRect;
    public RectTransform playheadRect;
    public NoteLine noteLinePrefab;
    public NoteSquare noteSquarePrefab;

    private float rectWidth;
    private float rectHeight;
    private Vector2 playheadStartPos; 
    private Vector2 playheadEndPos;
    private void Awake() {
        rectWidth = visualizerRect.sizeDelta.x;
        rectHeight = visualizerRect.sizeDelta.y;
        playheadStartPos = playheadRect.anchoredPosition.SetX(0);
        playheadEndPos = playheadRect.anchoredPosition.SetX(rectWidth);
    }

    //public void ShowPart(InstrumentTrack track, double startWait, float songLength) {
    //    int lineCount = GetLastLineIndex(track) + 1;
    //    noteLines = new List<NoteLine>(new NoteLine[lineCount]);

    //    float lineHeight = rectHeight / lineCount;
    //    for (int i = 0; i < lineCount; i++) {
    //        NoteLine newLine = Instantiate(noteLinePrefab, visualizerRect);
    //        newLine.rectT.sizeDelta = new Vector2(rectWidth, lineHeight);
    //        newLine.rectT.anchoredPosition = new Vector2(0, lineHeight * i);
    //        newLine.keyText.text = SongRecorder.KeyStringForLine(i);
    //        noteLines[i] = newLine;

    //        List<Note> noteList = track.notes[i];
    //        for (int j = 0; j < noteList.Count; j++) {
    //            Note note = noteList[j];
    //            AddNoteSquare(note, songLength, rectWidth, newLine);
    //        }
    //    }
    //    MovePlayhead(songLength, startWait);
    //}

    private List<NoteLine> noteLines;
    private readonly List<NoteSquare> noteSquares = new List<NoteSquare>();
    private void AddNoteSquare(Note note, float songLength, float rectWidth, Color color, NoteLine newLine, Action deleteAction) {
        NoteSquare newSquare = Instantiate(noteSquarePrefab, newLine.rectT);

        double end = note.end == 0 ? note.start + SongRecorder.SMALLEST_NOTE_LENGTH : note.end;
        float startX = BeatToX(note.start, songLength, rectWidth);
        float width = BeatToX((end - note.start), songLength, rectWidth);
        newSquare.rectT.anchoredPosition = new Vector2(startX, 0);
        newSquare.rectT.sizeDelta = new Vector2(width, newLine.rectT.sizeDelta.y);
        newSquare.mainImage.color = color;
        newSquare.deleteAction = () => {
            noteSquares.Remove(newSquare);
            deleteAction?.Invoke();
        };
        noteSquares.Add(newSquare);
    }

    public void AddNoteSquare(Note note, int lineIndex, Color color, Action deleteAction) {
        AddNoteSquare(note, 10f, visualizerRect.sizeDelta.x, color, noteLines[lineIndex], deleteAction);
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
        MovePlayhead(songLength, startWait);
    }

    public void ClearNoteSquares() {
        for (int i = 0; i < noteSquares.Count; i++) {
            Destroy(noteSquares[i].gameObject);
        }
        noteSquares.Clear();
    }

    public void ClearLinesAndStop() {
        if(noteLines != null) {
            for (int i = 0; i < noteLines.Count; i++) {
                Destroy(noteLines[i].gameObject);
            }
            noteLines.Clear();
        }
        this.EnsureCoroutineStopped(ref playheadRoutine);
        playheadRect.anchoredPosition = playheadStartPos;
    }

    private Coroutine playheadRoutine;
    private void MovePlayhead(float duration, double startWait) {
        playheadRoutine = StartCoroutine(MoveRoutine());

        IEnumerator MoveRoutine() {
            yield return new WaitForSeconds((float)startWait);
            playheadRect.SetAsLastSibling();

            float startTime = Time.time;
            while (true) {
                float timeSinceStart = Time.time - startTime;
                float progress = (timeSinceStart / duration) % 1;
                playheadRect.anchoredPosition = Vector2.Lerp(playheadStartPos, playheadEndPos, progress);
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
}
